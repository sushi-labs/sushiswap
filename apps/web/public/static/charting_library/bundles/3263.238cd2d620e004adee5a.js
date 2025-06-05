;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3263],
  {
    25398: (n) => {
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
    48729: (n) => {
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
    12228: (n) => {
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
    28355: (n) => {
      n.exports = {
        title: 'title-QPktCwTY',
        tabs: 'tabs-QPktCwTY',
        empty: 'empty-QPktCwTY',
        image: 'image-QPktCwTY',
        spinner: 'spinner-QPktCwTY',
        contentList: 'contentList-QPktCwTY',
      }
    },
    64530: (n, o, e) => {
      e.d(o, { DialogContentItem: () => m })
      var s = e(50959),
        t = e(97754),
        a = e.n(t),
        i = e(49483),
        l = e(36189),
        r = e(96040)
      function u(n) {
        const { url: o, ...e } = n
        return o
          ? s.createElement('a', { ...e, href: o })
          : s.createElement('div', { ...e })
      }
      var d = e(12228)
      function m(n) {
        const {
          title: o,
          subtitle: e,
          removeBtnLabel: t,
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
        return s.createElement(
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
            s.createElement(l.FavoriteButton, {
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
          s.createElement(
            'div',
            { className: a()(d.itemInfo, !v && d.itemInfoWithPadding) },
            s.createElement(
              'div',
              {
                className: a()(d.title, y && !w && d.active, h && d.mobile),
                'data-name': 'list-item-title',
              },
              o,
            ),
            s.createElement(
              'div',
              {
                className: a()(d.details, y && !w && d.active, h && d.mobile),
              },
              e,
            ),
          ),
          s.createElement(r.RemoveButton, {
            className: d.removeButton,
            isActive: y && !w,
            onClick: c.bind(null, b),
            'data-name': 'list-item-remove-button',
            title: t,
          }),
        )
      }
      function c(n, o) {
        o.defaultPrevented || (o.preventDefault(), n(o))
      }
    },
    23263: (n, o, e) => {
      e.d(o, { ManageDrawings: () => Y })
      var s = e(50959),
        t = e(43370),
        a = (e(50151), e(9745)),
        i = e(11542),
        l = e(36298),
        r = e(97145),
        u = e(59224),
        d = e(92249),
        m = e(64530),
        c = e(1722),
        g = e(63932),
        b = e(97754),
        y = e.n(b)
      var w = e(90186),
        C = e(27011),
        h = e(25398),
        v = e.n(h)
      function p(n) {
        const {
          className: o,
          color: e,
          variant: s,
          size: t,
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
            reference: o,
            children: e,
            iconOnly: t,
            startIcon: i,
            endIcon: l,
            ...r
          } = n,
          u = ((n, o) => {
            const {
                className: e,
                color: s = 'brand',
                variant: t = 'primary',
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
              } = o,
              w = ((n, o) => !!o && 'black' === n)(s, c)
            return b(
              e,
              n['round-button'],
              w ? n[`color-inverted${s}`] : n[`color-${s}`],
              n[`variant-${t}`],
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
        return s.createElement(
          'button',
          { ...p(r), className: u, ref: o },
          i &&
            s.createElement(a.Icon, {
              className: y()(v().icon, v().startIcon),
              icon: i,
            }),
          !(0, C.isIconOnly)(e, t) &&
            s.createElement('span', { className: v().content }, e),
          l &&
            s.createElement(a.Icon, {
              className: y()(v().icon, v().endIcon),
              icon: l,
            }),
        )
      }
      e(21593)
      function k(n, o) {
        const { align: e = 'start', size: s = 'xsmall' } = o
        return b(n['round-tabs'], n[`align-${e}`], n[`size-${s}`])
      }
      function z(n, o) {
        const { variant: e = 'primary', isChecked: s } = o
        return b(n.tab, n[`tab-${e}`], s && n.checked)
      }
      var S = e(48729),
        _ = e.n(S)
      const N = s.forwardRef((n, o) => {
        const {
          tabs: e,
          size: t = 'xsmall',
          variant: a = 'primary',
          theme: i = _(),
        } = n
        return s.createElement(
          'div',
          { className: k(i, n), ref: o },
          e.map((n) => {
            const { isChecked: o, ...e } = n
            return s.createElement(f, {
              ...e,
              className: z(i, { ...e, variant: a, isChecked: o }),
              size: t,
              variant: a,
            })
          }),
        )
      })
      N.displayName = 'RoundTabsButtons'
      i.t(null, void 0, e(87871)),
        i.t(null, void 0, e(10538)),
        i.t(null, void 0, e(74860))
      var j = e(29540),
        D = e(28355)
      const I = (0, u.getLogger)('Chart.ManageDrawings'),
        E = new Map()
      function L(n) {
        let o = E.get(n)
        return void 0 === o && ((o = new r.WatchedValue([])), E.set(n, o)), o
      }
      const x = new l.TranslatedString(
          'remove all line tools for {symbol}',
          i.t(null, void 0, e(23481)),
        ),
        F = (n) =>
          i
            .t(null, { plural: '{drawingsCount} drawings', count: n }, e(88143))
            .format({ drawingsCount: n.toString() }),
        T = i.t(null, void 0, e(85128)),
        M = i.t(null, void 0, e(18570))
      function B(n) {
        const [o, e] = s.useState(null),
          [a, i] = s.useState(null),
          [l, r] = s.useState(null),
          [u, m] = (s.useRef(null), s.useState([]))
        return (
          s.useEffect(() => {
            let o
            const s = () => {
              o && i(o.mainSeries().proSymbol())
            }
            return (
              n.withModel(null, () => {
                ;(o = n.model()),
                  e(o),
                  s(),
                  o.mainSeries().symbolResolved().subscribe(null, s)
              }),
              () => {
                null == o ||
                  o.mainSeries().symbolResolved().unsubscribe(null, s),
                  e(null)
              }
            )
          }, [n]),
          s.useEffect(() => {
            if (null !== o) {
              const n = {},
                e = (0, t.default)(w, 250, { leading: !1 })
              return (
                w(),
                o.model().dataSourceCollectionChanged().subscribe(n, e),
                () => {
                  o.model().dataSourceCollectionChanged().unsubscribe(n, e)
                }
              )
            }
          }, [o]),
          s.useEffect(() => {
            if (null !== o) {
              const n = L(o.model().id()).spawn()
              return (
                m([...n.value()]),
                n.subscribe(() => m([...n.value()])),
                () => (null == n ? void 0 : n.destroy())
              )
            }
          }, [o]),
          s.useMemo(
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
        async function g(n, e) {
          if (o && l) {
            const s = l[e].get(n)
            if (s) {
              const e = Array.from(s)
                .map((n) => o.model().dataSourceForId(n))
                .filter(c.notNull)
              e.length > 0 && o.removeSources(e, !1, x.format({ symbol: n }))
              const t = L(o.model().id())
              t.setValue([...t.value(), n])
              try {
                await w()
              } catch (n) {
                I.logError(`Error removing line tools: ${n}`)
              }
              t.setValue(t.value().filter((o) => o !== n))
            }
          }
        }
        function b(e) {
          n.setSymbol(e), null !== o && i(e)
        }
        async function y(n) {
          const o = ((n) => {
            const o = [new Map(), new Map(), new Map()]
            {
              const e = o[0]
              n.forEach((n) => {
                var o
                if ((0, d.isLineTool)(n) && n.showInObjectTree()) {
                  const s = null !== (o = n.symbol()) && void 0 !== o ? o : '',
                    t = e.get(s) || new Set()
                  t.add(n.id()), e.set(s, t)
                }
              })
            }
            return o
          })(n)
          return (
            (await (async () => [new Map(), new Map(), new Map()])()).forEach(
              (n, e) => {
                const s = o[e]
                n.forEach((n, o) => {
                  const e = s.get(o) || new Set()
                  n.forEach((n) => e.add(n)), s.set(o, e)
                })
              },
            ),
            o
          )
        }
        async function w() {
          null !== o && r(await y(o.dataSources()))
        }
      }
      function Y(n) {
        const { isMobile: o, chartWidget: t, onClose: l, onInitialized: r } = n,
          {
            currentSymbol: u,
            symbolDrawingsMaps: d,
            removeSymbolDrawings: c,
            changeSymbol: b,
            hiddenSymbols: y,
          } = B(t),
          [w, C] = s.useState(0),
          [h, v, p] = s.useMemo(() => {
            var n
            if (null !== u && null !== d) {
              const o = []
              let e = 0,
                s = w
              if (null === s)
                for (
                  s = 2;
                  s > 0 &&
                  !(
                    ((null === (n = d[s].get(u)) || void 0 === n
                      ? void 0
                      : n.size) || 0) > 0
                  );
                )
                  s--
              return (
                d[s].forEach((n, s) => {
                  y.includes(s) ||
                    (o.push({
                      symbol: s,
                      drawingsCount: n.size,
                      onRemove: () =>
                        ((n) => {
                          c(n, p)
                        })(s),
                      onClick: () =>
                        ((n) => {
                          '' !== n && (b(n), null == l || l())
                        })(s),
                    }),
                    (e += n.size))
                }),
                o.sort((n, o) =>
                  n.drawingsCount === o.drawingsCount
                    ? n.symbol.localeCompare(o.symbol)
                    : n.drawingsCount > o.drawingsCount
                      ? -1
                      : 1,
                ),
                [o, e, s]
              )
            }
            return [[], 0, 0]
          }, [u, w, d, y])
        return (
          s.useEffect(() => {
            null !== d && (null == r || r())
          }, [d]),
          s.createElement(
            s.Fragment,
            null,
            h.length > 0 &&
              s.createElement(
                'div',
                { className: D.title },
                `${((f = d ? d[p].size : 0), i.t(null, { plural: '{symbolsCount} symbols', context: 'symbols_and_drawings_count', count: f }, e(52908)).format({ symbolsCount: f.toString() }))} ${((n) => i.t(null, { plural: 'with {drawingsCount} drawings', context: 'symbols_and_drawings_count', count: n }, e(42743)).format({ drawingsCount: n.toString() }))(v)}`,
              ),
            0 === h.length
              ? null === d
                ? s.createElement(g.Spinner, { className: D.spinner })
                : s.createElement(
                    'div',
                    { className: D.empty },
                    s.createElement(a.Icon, { className: D.image, icon: j }),
                    s.createElement('span', null, M),
                  )
              : h.map(
                  ({ symbol: n, drawingsCount: e, onRemove: t, onClick: a }) =>
                    s.createElement(m.DialogContentItem, {
                      key: n,
                      title: n,
                      subtitle: F(e),
                      removeBtnLabel: T,
                      isActive: n === u,
                      isMobile: o,
                      onClick: a,
                      onClickRemove: t,
                      showFavorite: !1,
                    }),
                ),
          )
        )
        var f
      }
    },
    29540: (n) => {
      n.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
    },
    74860: (n) => {
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
    18570: (n) => {
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
    87871: (n) => {
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
    10538: (n) => {
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
    85128: (n) => {
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
    23481: (n) => {
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
    42743: (n) => {
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
    88143: (n) => {
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
    52908: (n) => {
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
