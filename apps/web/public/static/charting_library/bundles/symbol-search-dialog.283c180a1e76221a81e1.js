;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1754],
  {
    897646: (e) => {
      e.exports = {
        dialog: 'dialog-LfNchNNG',
        tabletDialog: 'tabletDialog-LfNchNNG',
        desktopDialog: 'desktopDialog-LfNchNNG',
      }
    },
    186928: (e) => {
      e.exports = {
        button: 'button-w6lVe_oI',
        hovered: 'hovered-w6lVe_oI',
        disabled: 'disabled-w6lVe_oI',
      }
    },
    912015: (e, t, o) => {
      o.d(t, { isPlatformMobile: () => r })
      var i = o(69111)
      o(156963), o(601227)
      function r() {
        return (
          !(0, i.isOnMobileAppPage)('any') &&
          (window.matchMedia('(min-width: 602px) and (min-height: 445px)')
            .matches,
          !1)
        )
      }
    },
    723698: (e, t, o) => {
      o.r(t),
        o.d(t, {
          Components: () => w,
          showDefaultSearchDialog: () => C,
          showSymbolSearchItemsDialog: () => n.showSymbolSearchItemsDialog,
        })
      var i = o(688401),
        r = o(972535),
        a = o(248166),
        s = o(265831),
        n = o(558323),
        l = o(650802),
        c = o(50959),
        d = o(650151),
        h = o(56871),
        m = o(113060),
        u = o(944080),
        p = o(497754),
        S = o.n(p),
        _ = o(609838),
        f = o(800296),
        b = o(581384),
        g = o(398120),
        y = o(177042),
        v = o(339339)
      function k(e) {
        const {
            isSelected: t,
            existInWatchlist: i,
            findInWatchlist: r,
            addToWatchlist: a,
            removeFromWatchlist: s,
          } = e,
          { selectedAction: n } = (0, d.ensureNotNull)(
            (0, c.useContext)(m.SymbolSearchWatchlistContext),
          )
        return c.createElement(
          c.Fragment,
          null,
          i
            ? c.createElement(
                c.Fragment,
                null,
                c.createElement(f.ListItemButton, {
                  className: S()(
                    v.action,
                    v.removeAction,
                    t && 2 === n && v.selected,
                    'apply-common-tooltip',
                  ),
                  onClick: s,
                  icon: b,
                  title: _.t(null, void 0, o(366702)),
                }),
                c.createElement(f.ListItemButton, {
                  className: S()(
                    v.action,
                    v.targetAction,
                    t && 1 === n && v.selected,
                    'apply-common-tooltip',
                  ),
                  onClick: r,
                  icon: y,
                  title: _.t(null, void 0, o(708682)),
                }),
              )
            : c.createElement(f.ListItemButton, {
                className: S()(
                  v.action,
                  v.addAction,
                  t && 0 === n && v.selected,
                  'apply-common-tooltip',
                ),
                onClick: a,
                icon: g,
                title: _.t(null, void 0, o(445976)),
              }),
        )
      }
      var I = o(180185),
        x = o(32133),
        W = o(979359),
        D = o(190266)
      var T = o(533408),
        L = o(892932),
        N = o(897646)
      ;(0, o(912015).isPlatformMobile)()
      function C(e) {
        new l.WatchedValue({})
        const t = (0, s.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: o,
            showSpreadActions: r,
            source: c,
            onSearchComplete: d,
            trackResultsOptions: h,
            ...m
          } = e,
          u = {
            ...m,
            showSpreadActions: null != r ? r : (0, a.canShowSpreadActions)(),
            onSymbolFiltersParamsChange: void 0,
            onSearchComplete: (e, o) => {
              null == o || o.symbolType
              t(e[0].symbol, e[0].result).then((e) => {
                i.linking.setSymbolAndLogInitiator(e.symbol, 'symbol search'),
                  null == d || d(e.symbol)
              })
            },
            onEmptyResults: void 0,
          }
        ;(0, n.showSymbolSearchItemsDialog)({ ...u, defaultValue: o })
      }
      const w = {
        SymbolSearchWatchlistDialogContentItem: (e) => {
          const {
              addToWatchlist: t,
              removeFromWatchlist: o,
              findInWatchlist: i,
              existInWatchlist: a,
              isSelected: s,
              fullSymbolName: n,
              ...l
            } = e,
            {
              onClose: p,
              searchRef: S,
              searchSpreads: _,
            } = (0, d.ensureNotNull)(
              (0, c.useContext)(u.SymbolSearchItemsDialogContext),
            ),
            {
              setSelectedAction: f,
              isSpreadOrMultipleMode: b,
              addAfter: g,
              clearTargetSymbol: y,
              highlighted: v,
              highlight: T,
            } = (0, d.ensureNotNull)(
              (0, c.useContext)(m.SymbolSearchWatchlistContext),
            ),
            L = b(_, S)
          return (
            (0, c.useLayoutEffect)(() => {
              s && f(void 0 !== a ? (a ? 2 : 0) : null)
            }, [s, a]),
            c.createElement(h.SymbolSearchDialogContentItem, {
              ...l,
              fullSymbolName: n,
              onClick: L
                ? e.onClick
                : (i) => {
                    if (void 0 === n) return
                    if (void 0 === a)
                      return void (0, d.ensureDefined)(e.onClick)(i)
                    a
                      ? (o(W.WATCHLIST_WIDGET_ID, n),
                        C('watchlist remove click', i),
                        g === n && y())
                      : ((0, D.runOrSignInWithPromo)(
                          'watchList',
                          { source: 'add symbol to watchlist' },
                          () => {
                            t(W.WATCHLIST_WIDGET_ID, [n], g), e.id && T(e.id)
                          },
                        ),
                        C('watchlist add click', i))
                    N(i)
                  },
              isHighlighted: v === e.id,
              isSelected: s,
              actions:
                void 0 === a || L
                  ? void 0
                  : c.createElement(k, {
                      isSelected: s,
                      existInWatchlist: a,
                      addToWatchlist: (o) => {
                        if ((o.stopPropagation(), void 0 === n)) return
                        ;(0, D.runOrSignInWithPromo)(
                          'watchList',
                          { source: 'add symbol to watchlist' },
                          () => {
                            t(W.WATCHLIST_WIDGET_ID, [n], g), e.id && T(e.id)
                          },
                        ),
                          N(o),
                          C('watchlist add button', o)
                      },
                      removeFromWatchlist: (e) => {
                        if ((e.stopPropagation(), void 0 === n)) return
                        o(W.WATCHLIST_WIDGET_ID, n),
                          N(e),
                          C('watchlist remove button', e),
                          g === n && y()
                      },
                      findInWatchlist: (e) => {
                        if ((e.stopPropagation(), void 0 === n)) return
                        i(W.WATCHLIST_WIDGET_ID, n),
                          p(),
                          C('watchlist goto button')
                      },
                    }),
            })
          )
          function N(e) {
            var t
            e && (0, I.modifiersFromEvent)(e) === I.Modifiers.Shift
              ? p()
              : r.mobiletouch ||
                null === (t = S.current) ||
                void 0 === t ||
                t.select()
          }
          function C(e, t) {
            let o = e
            t &&
              (0, I.modifiersFromEvent)(t) === I.Modifiers.Shift &&
              (o += ' shift'),
              (0, x.trackEvent)('GUI', 'SS', o)
          }
        },
        SymbolSearchWatchlistDialog: (e) => {
          const {
              addToWatchlist: t,
              removeFromWatchlist: o,
              findInWatchlist: i,
              ...r
            } = e,
            {
              feedItems: a,
              searchRef: s,
              searchSpreads: n,
              selectedIndex: l,
              onSubmit: h,
              setSelectedIndex: p,
              onClose: _,
              isMobile: f,
              isTablet: b,
              mode: g,
              setMode: y,
              symbolSearchState: v,
            } = (0, d.ensureNotNull)(
              (0, c.useContext)(u.SymbolSearchItemsDialogContext),
            ),
            {
              selectedAction: k,
              setSelectedAction: x,
              isSpreadOrMultipleMode: C,
              addAfter: w,
              clearTargetSymbol: z,
              highlight: A,
            } = (0, d.ensureNotNull)(
              (0, c.useContext)(m.SymbolSearchWatchlistContext),
            ),
            M = a[l],
            E = 'exchange' === g
          return c.createElement(T.AdaptivePopupDialog, {
            ...r,
            className: S()(
              N.dialog,
              !f && (b ? N.tabletDialog : N.desktopDialog),
            ),
            dataName: 'watchlist-symbol-search-dialog',
            onKeyDown: (e) => {
              var t
              const o = (0, I.hashFromEvent)(e)
              switch (o) {
                case 13:
                  return C(n, s)
                    ? void h(!0)
                    : (M ? H(!1) : h(!1),
                      void (
                        null === (t = s.current) ||
                        void 0 === t ||
                        t.select()
                      ))
                case 13 + I.Modifiers.Shift:
                  return C(n, s) ? void h(!0) : void (M ? H(!0) : h(!0))
                case 27:
                  return (
                    e.preventDefault(), E ? void y('symbolSearch') : void _()
                  )
              }
              switch ((0, L.mapKeyCodeToDirection)(o)) {
                case 'blockPrev':
                  if ((e.preventDefault(), 0 === l || 'good' !== v)) return
                  if (-1 === l) return void p(0)
                  p(l - 1)
                  break
                case 'blockNext':
                  if ((e.preventDefault(), l === a.length - 1 || 'good' !== v))
                    return
                  p(l + 1)
                  break
                case 'inlinePrev':
                  if (!M) return
                  1 === k && (e.preventDefault(), x(2))
                  break
                case 'inlineNext':
                  if (!M) return
                  2 === k && (e.preventDefault(), x(1))
              }
            },
            backdrop: !0,
            draggable: !1,
          })
          function H(e) {
            if (!M || void 0 === M.fullSymbolName) return
            const { fullSymbolName: r } = M
            switch (k) {
              case 0:
                ;(0, D.runOrSignInWithPromo)(
                  'watchList',
                  { source: 'add symbol to watchlist' },
                  () => {
                    t(W.WATCHLIST_WIDGET_ID, [r], w), M.id && A(M.id)
                  },
                )
                break
              case 1:
                return i(W.WATCHLIST_WIDGET_ID, r), void _()
              case 2:
                o(W.WATCHLIST_WIDGET_ID, r), w === r && z()
            }
            e && _()
          }
        },
      }
    },
    558323: (e, t, o) => {
      o.d(t, { showSymbolSearchItemsDialog: () => l })
      var i = o(50959),
        r = o(500962),
        a = o(753327),
        s = o(63192),
        n = o(121087)
      function l(e) {
        const {
          initialMode: t = 'symbolSearch',
          autofocus: o = !0,
          defaultValue: l,
          showSpreadActions: c,
          selectSearchOnInit: d,
          onSearchComplete: h,
          dialogTitle: m,
          placeholder: u,
          fullscreen: p,
          initialScreen: S,
          wrapper: _,
          dialog: f,
          contentItem: b,
          onClose: g,
          onOpen: y,
          footer: v,
          symbolTypes: k,
          searchInput: I,
          emptyState: x,
          hideMarkedListFlag: W,
          dialogWidth: D = 'auto',
          manager: T,
          shouldReturnFocus: L,
          onSymbolFiltersParamsChange: N,
          onEmptyResults: C,
        } = e
        if (
          s.dialogsOpenerManager.isOpened('SymbolSearch') ||
          s.dialogsOpenerManager.isOpened('ChangeIntervalDialog')
        )
          return
        const w = document.createElement('div'),
          z = i.createElement(
            a.SlotContext.Provider,
            { value: null != T ? T : null },
            i.createElement(n.SymbolSearchItemsDialog, {
              onClose: A,
              initialMode: t,
              defaultValue: l,
              showSpreadActions: c,
              hideMarkedListFlag: W,
              selectSearchOnInit: d,
              onSearchComplete: h,
              dialogTitle: m,
              placeholder: u,
              fullscreen: p,
              initialScreen: S,
              wrapper: _,
              dialog: f,
              contentItem: b,
              footer: v,
              symbolTypes: k,
              searchInput: I,
              emptyState: x,
              autofocus: o,
              dialogWidth: D,
              shouldReturnFocus: L,
              onSymbolFiltersParamsChange: N,
              onEmptyResults: C,
            }),
          )
        function A() {
          r.unmountComponentAtNode(w),
            s.dialogsOpenerManager.setAsClosed('SymbolSearch'),
            g && g()
        }
        return (
          r.render(z, w),
          s.dialogsOpenerManager.setAsOpened('SymbolSearch'),
          y && y(),
          { close: A }
        )
      }
    },
    113060: (e, t, o) => {
      o.d(t, { SymbolSearchWatchlistContext: () => i })
      const i = o(50959).createContext(null)
    },
    63192: (e, t, o) => {
      o.d(t, { DialogsOpenerManager: () => i, dialogsOpenerManager: () => r })
      class i {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, t) {
          this._storage.set(e, t)
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
      const r = new i()
    },
    190266: (e, t, o) => {
      o.d(t, { runOrSignIn: () => i, runOrSignInWithPromo: () => r })
      function i(e, t) {
        e()
      }
      function r(e, t, o) {
        o()
      }
    },
    800296: (e, t, o) => {
      o.d(t, { ListItemButton: () => l })
      var i = o(50959),
        r = o(497754),
        a = o.n(r),
        s = o(72571),
        n = o(186928)
      function l(e) {
        const { className: t, disabled: o, ...r } = e
        return i.createElement(s.Icon, {
          className: a()(n.button, o && n.disabled, t),
          ...r,
        })
      }
    },
    753327: (e, t, o) => {
      o.d(t, { Slot: () => i.Slot, SlotContext: () => i.SlotContext })
      var i = o(682925)
    },
    602948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    581384: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-width="1.2" d="M8 8l13 13m0-13L8 21"/></svg>'
    },
    398120: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13.9 14.1V22h1.2v-7.9H23v-1.2h-7.9V5h-1.2v7.9H6v1.2h7.9z"/></svg>'
    },
    177042: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14 9.5a.5.5 0 0 0 1 0V7.02A6.5 6.5 0 0 1 20.98 13H18.5a.5.5 0 0 0 0 1h2.48A6.5 6.5 0 0 1 15 19.98V17.5a.5.5 0 0 0-1 0v2.48A6.5 6.5 0 0 1 8.02 14h2.48a.5.5 0 0 0 0-1H8.02A6.5 6.5 0 0 1 14 7.02V9.5zm1-3.48V4.5a.5.5 0 0 0-1 0v1.52A7.5 7.5 0 0 0 7.02 13H5.5a.5.5 0 0 0 0 1h1.52A7.5 7.5 0 0 0 14 20.98v1.52a.5.5 0 0 0 1 0v-1.52A7.5 7.5 0 0 0 21.98 14h1.52a.5.5 0 0 0 0-1h-1.52A7.5 7.5 0 0 0 15 6.02z"/></svg>'
    },
    716936: (e) => {
      e.exports = {
        ar: ['عودة'],
        ca_ES: ['Enrere'],
        cs: 'Back',
        de: ['Zurück'],
        el: 'Back',
        en: 'Back',
        es: ['Atrás'],
        fa: 'Back',
        fr: ['Retour'],
        he_IL: ['חזור'],
        hu_HU: 'Back',
        id_ID: ['Kembali'],
        it: ['Indietro'],
        ja: ['戻る'],
        ko: ['뒤로'],
        ms_MY: ['Kembali'],
        nl_NL: 'Back',
        pl: ['Cofnij'],
        pt: ['Voltar'],
        ro: 'Back',
        ru: ['Назад'],
        sv: ['Tillbaka'],
        th: ['กลับไป'],
        tr: ['Geri'],
        vi: ['Quay lại'],
        zh: ['返回'],
        zh_TW: ['返回'],
      }
    },
    709898: (e) => {
      e.exports = {
        ar: ['حق'],
        ca_ES: ['Right (dret de subscripció)'],
        cs: 'Right',
        de: ['Rechter'],
        el: 'Right',
        en: 'Right',
        es: ['Right (derecho de suscripción)'],
        fa: 'Right',
        fr: ['De droite'],
        he_IL: ['זכות Right'],
        hu_HU: 'Right',
        id_ID: ['Kanan'],
        it: ['Diritto'],
        ja: ['ストックオプション'],
        ko: ['라이트'],
        ms_MY: ['Benar'],
        nl_NL: 'Right',
        pl: ['Prawo do udostępniania'],
        pt: ['Direita'],
        ro: 'Right',
        ru: ['Право на акцию'],
        sv: ['Höger'],
        th: ['สิทธิ'],
        tr: ['Sağ'],
        vi: ['Phải'],
        zh: ['认股权'],
        zh_TW: ['認股權'],
      }
    },
    620036: (e) => {
      e.exports = {
        ar: ['إلغاء'],
        ca_ES: ['Cancel·la'],
        cs: ['Zrušit'],
        de: ['Abbrechen'],
        el: ['Άκυρο'],
        en: 'Cancel',
        es: ['Cancelar'],
        fa: ['لغو'],
        fr: ['Annuler'],
        he_IL: ['ביטול'],
        hu_HU: ['Törlés'],
        id_ID: ['Batal'],
        it: ['Annulla'],
        ja: ['キャンセル'],
        ko: ['취소'],
        ms_MY: ['Batal'],
        nl_NL: ['Annuleren'],
        pl: ['Anuluj'],
        pt: ['Cancelar'],
        ro: 'Cancel',
        ru: ['Отмена'],
        sv: ['Avbryt'],
        th: ['ยกเลิก'],
        tr: ['İptal'],
        vi: ['Hủy bỏ'],
        zh: ['取消'],
        zh_TW: ['取消'],
      }
    },
    680395: (e) => {
      e.exports = {
        ar: ['إغلاق القائمة'],
        ca_ES: 'Close menu',
        cs: 'Close menu',
        de: ['Menü schließen'],
        el: 'Close menu',
        en: 'Close menu',
        es: ['Cerrar menú'],
        fa: 'Close menu',
        fr: ['Fermer le menu'],
        he_IL: ['סגור תפריט'],
        hu_HU: 'Close menu',
        id_ID: ['Pilih menu'],
        it: ['Chiudere menù'],
        ja: ['メニューを閉じる'],
        ko: ['메뉴 닫기'],
        ms_MY: ['Tutup menu'],
        nl_NL: 'Close menu',
        pl: ['Zamknij menu'],
        pt: ['Fechar menu'],
        ro: 'Close menu',
        ru: ['Закрыть меню'],
        sv: ['Stäng menyn'],
        th: ['ปิดเมนู'],
        tr: ['Menüyü kapat'],
        vi: ['Đóng menu'],
        zh: ['关闭菜单'],
        zh_TW: ['關閉選單'],
      }
    },
    445976: (e) => {
      e.exports = {
        ar: ['أضف إلى قائمة المراقبة'],
        ca_ES: ['Afegeix a la llista de seguiment'],
        cs: 'Add to Watchlist',
        de: ['Zur Watchlist hinzufügen'],
        el: 'Add to Watchlist',
        en: 'Add to Watchlist',
        es: ['Añadir a la lista de seguimiento'],
        fa: 'Add to Watchlist',
        fr: ['Ajouter à la liste de surveillance'],
        he_IL: ['הוסף רשימת מעקב'],
        hu_HU: 'Add to Watchlist',
        id_ID: ['Tambah ke Daftar Pantau'],
        it: ['Aggiungi alla watchlist'],
        ja: ['ウォッチリストに追加'],
        ko: ['왓치리스트에 넣기'],
        ms_MY: ['Tambah ke Senarai Amatan'],
        nl_NL: 'Add to Watchlist',
        pl: ['Dodaj do listy obserwowanych'],
        pt: ['Adicionar à lista'],
        ro: 'Add to Watchlist',
        ru: ['Добавить в Список котировок'],
        sv: ['Lägg till i Bevakningslista'],
        th: ['เพิ่มไปในรายการเฝ้าระวัง'],
        tr: ["Watchlist'e ekle"],
        vi: ['Thêm vào danh sách theo dõi'],
        zh: ['添加到自选表'],
        zh_TW: ['增加到觀察清單'],
      }
    },
    64498: (e) => {
      e.exports = {
        ar: ['كل المصادر'],
        ca_ES: ['Totes les fonts'],
        cs: 'All sources',
        de: ['Alle Quellen'],
        el: 'All sources',
        en: 'All sources',
        es: ['Todas las fuentes'],
        fa: 'All sources',
        fr: ['Toutes les sources'],
        he_IL: ['כל המקורות'],
        hu_HU: 'All sources',
        id_ID: ['Seluruh sumber'],
        it: ['Tutte le fonti'],
        ja: ['すべての提供元'],
        ko: ['모든 자료'],
        ms_MY: ['Kesemua sumber'],
        nl_NL: 'All sources',
        pl: ['Wszystkie źródła'],
        pt: ['Todas as fontes'],
        ro: 'All sources',
        ru: ['Все источники'],
        sv: ['Samtliga källor'],
        th: ['แหล่งที่มาทั้งหมด'],
        tr: ['Tüm kaynaklar'],
        vi: ['Tất cả các nguồn'],
        zh: ['全部来源'],
        zh_TW: ['全部來源'],
      }
    },
    879852: (e) => {
      e.exports = {
        ar: ['سند'],
        ca_ES: ['Bo'],
        cs: 'Bond',
        de: ['Anleihe'],
        el: 'Bond',
        en: 'Bond',
        es: ['Bono'],
        fa: 'Bond',
        fr: ['Obligation'],
        he_IL: ['אגרת חוב'],
        hu_HU: 'Bond',
        id_ID: ['Surat hutang'],
        it: ['Obbligazione'],
        ja: ['債券'],
        ko: ['채권'],
        ms_MY: ['Bon'],
        nl_NL: 'Bond',
        pl: ['Obligacja'],
        pt: ['Título'],
        ro: 'Bond',
        ru: ['Облигации'],
        sv: ['Obligation'],
        th: ['พันธบัตร'],
        tr: ['Tahvil'],
        vi: ['Trái phiếu'],
        zh: ['债券'],
        zh_TW: ['債券'],
      }
    },
    708682: (e) => {
      e.exports = {
        ar: ['انتقل إلى الرمز'],
        ca_ES: ['Ves al símbol'],
        cs: 'Go to symbol',
        de: ['Gehe zu Symbol'],
        el: 'Go to symbol',
        en: 'Go to symbol',
        es: ['Ir al símbolo'],
        fa: 'Go to symbol',
        fr: ['Aller au symbole'],
        he_IL: ['עבור לסימול'],
        hu_HU: 'Go to symbol',
        id_ID: ['Menuju simbol'],
        it: ['Vai al simbolo'],
        ja: ['シンボルに移動'],
        ko: ['심볼로 가기'],
        ms_MY: ['Pergi ke simbol'],
        nl_NL: 'Go to symbol',
        pl: ['Przejdź do symbolu'],
        pt: ['Vá para o símbolo'],
        ro: 'Go to symbol',
        ru: ['Перейти к символу'],
        sv: ['Gå till symbolen'],
        th: ['ไปที่สัญลักษณ์'],
        tr: ['Sembole git'],
        vi: ['Tới mã giao dịch'],
        zh: ['前往商品'],
        zh_TW: ['前往商品'],
      }
    },
    629601: (e) => {
      e.exports = {
        ar: ['الوصف'],
        ca_ES: ['Descripció'],
        cs: ['Popis'],
        de: ['Beschreibung'],
        el: 'Description',
        en: 'Description',
        es: ['Descripción'],
        fa: ['شرح'],
        fr: 'Description',
        he_IL: ['תיאור'],
        hu_HU: ['Leírás'],
        id_ID: ['Deskripsi'],
        it: ['Descrizione'],
        ja: ['詳細'],
        ko: ['설명'],
        ms_MY: ['Huraian'],
        nl_NL: ['Beschrijving'],
        pl: ['Opis'],
        pt: ['Descrição'],
        ro: 'Description',
        ru: ['Описание'],
        sv: ['Beskrivning'],
        th: ['คำอธิบาย'],
        tr: ['Açıklama'],
        vi: ['Mô tả'],
        zh: ['描述'],
        zh_TW: ['描述'],
      }
    },
    929673: (e) => {
      e.exports = {
        ar: ['لا توجد أسواق تطابق المعايير التي عينتها'],
        ca_ES: [
          'No hi ha mercats de valors que coincideixin amb els vostres criteris.',
        ],
        cs: 'No exchanges match your criteria',
        de: ['Keine Börsen entsprechen Ihren Kriterien'],
        el: 'No exchanges match your criteria',
        en: 'No exchanges match your criteria',
        es: ['No hay mercados de valores que coincidan con sus criterios.'],
        fa: 'No exchanges match your criteria',
        fr: ['Aucun échange ne correspond à vos critères'],
        he_IL: ['אין בורסות התואמות את הקריטריונים שלך'],
        hu_HU: 'No exchanges match your criteria',
        id_ID: ['Tidak ada bursa yang sesuai dengan kriteria anda'],
        it: ['Nessuna borsa corrisponde ai tuoi criteri'],
        ja: ['条件に合致する取引所はありません'],
        ko: ['조건에 맞는 익스체인지가 없음'],
        ms_MY: ['Tiada bursa saham yang memenuhi kriteria anda.'],
        nl_NL: 'No exchanges match your criteria',
        pl: ['Brak giełd spełniających Twoje kryteria'],
        pt: ['Nenhuma exchange corresponde ao seu critério'],
        ro: 'No exchanges match your criteria',
        ru: ['Нет подходящих бирж'],
        sv: ['Inga börser matchar dina kriterier'],
        th: ['ไม่มีตลาดแลกเปลี่ยนใดๆ ตรงตามเงื่อนไขของคุณ'],
        tr: ['Kriterlerinize uygun borsa yok'],
        vi: ['Không có sàn giao dịch nào khớp với yêu cầu của bạn'],
        zh: ['没有交易所符合您的条件'],
        zh_TW: ['沒有交易所符合您的條件'],
      }
    },
    641379: (e) => {
      e.exports = {
        ar: ['لا توجد رموز تطابق معاييرك'],
        ca_ES: ['Cap símbol coincideix amb els vostres criteris'],
        cs: 'No symbols match your criteria',
        de: ['Für Ihre Kriterien gibt es keine übereinstimmenden Symbole'],
        el: 'No symbols match your criteria',
        en: 'No symbols match your criteria',
        es: ['Ningún símbolo coincide con sus criterios'],
        fa: 'No symbols match your criteria',
        fr: ['Aucun symbole ne correspond à vos critères'],
        he_IL: ['אין סימולים תואמים את הקריטריונים שלך'],
        hu_HU: 'No symbols match your criteria',
        id_ID: ['Tidak ada Simbol yang sesuai dengan kriteria anda'],
        it: ['Nessun simbolo corrisponde ai criteri'],
        ja: ['条件に合致するシンボルはありません'],
        ko: ['조건에 맞는 심볼이 없음'],
        ms_MY: ['Tiada Simbol yang menepati kriteria anda'],
        nl_NL: 'No symbols match your criteria',
        pl: ['Brak symboli spełniających Twoje kryteria'],
        pt: ['Nenhum símbolo compatível com seu critério'],
        ro: 'No symbols match your criteria',
        ru: ['Нет подходящих символов'],
        sv: ['Inga symboler matchar dina kriterier'],
        th: ['ไม่มีสัญลักษณ์ที่ตรงกับการค้นหาของคุณ'],
        tr: ['Kriterlerinize uygun sembol yok'],
        vi: ['Không có mã giao dịch nào khớp với tiêu chí của bạn'],
        zh: ['没有代码符合您的条件'],
        zh_TW: ['沒有商品符合您的條件'],
      }
    },
    719724: (e) => {
      e.exports = {
        ar: ['مصادر'],
        ca_ES: ['Fonts'],
        cs: 'Sources',
        de: ['Quellen'],
        el: 'Sources',
        en: 'Sources',
        es: ['Fuentes'],
        fa: 'Sources',
        fr: 'Sources',
        he_IL: ['מקורות'],
        hu_HU: 'Sources',
        id_ID: ['Sumber'],
        it: ['Fonti'],
        ja: ['情報源'],
        ko: ['자료'],
        ms_MY: ['Sumber-sumber'],
        nl_NL: 'Sources',
        pl: ['Źródła'],
        pt: ['Fontes'],
        ro: 'Sources',
        ru: ['Источники'],
        sv: ['Källor'],
        th: ['แหล่งที่มา'],
        tr: ['Kaynak'],
        vi: ['Nguồn'],
        zh: ['来源'],
        zh_TW: ['來源'],
      }
    },
    252298: (e) => {
      e.exports = {
        ar: ['بحث'],
        ca_ES: ['Cercar'],
        cs: ['Hledat'],
        de: ['Suche'],
        el: ['Αναζήτησή'],
        en: 'Search',
        es: ['Buscar'],
        fa: ['جستجو'],
        fr: ['Chercher'],
        he_IL: ['חפש'],
        hu_HU: ['Keresés'],
        id_ID: ['Cari'],
        it: ['Cerca'],
        ja: ['検索'],
        ko: ['찾기'],
        ms_MY: ['Cari'],
        nl_NL: ['Zoeken'],
        pl: ['Szukaj'],
        pt: ['Pesquisar'],
        ro: 'Search',
        ru: ['Поиск'],
        sv: ['Sök'],
        th: ['ค้นหา'],
        tr: ['Ara'],
        vi: ['Tìm kiếm'],
        zh: ['搜索'],
        zh_TW: ['搜尋'],
      }
    },
    313269: (e) => {
      e.exports = {
        ar: ['اختر مصدراً'],
        ca_ES: ['Selecciona font'],
        cs: 'Select source',
        de: ['Quelle wählen'],
        el: 'Select source',
        en: 'Select source',
        es: ['Seleccionar fuente'],
        fa: 'Select source',
        fr: ['Sélectionner la source'],
        he_IL: ['בחר מקור'],
        hu_HU: 'Select source',
        id_ID: ['Pilih sumber'],
        it: ['Seleziona fonte'],
        ja: ['情報源を選択'],
        ko: ['자료 선택'],
        ms_MY: ['Pilih sumber'],
        nl_NL: 'Select source',
        pl: ['Wybierz źródło'],
        pt: ['Selecionar fonte'],
        ro: 'Select source',
        ru: ['Выбрать источник'],
        sv: ['Välj källa'],
        th: ['เลือกแหล่งที่มา'],
        tr: ['Kaynak seç'],
        vi: ['Chọn nguồn'],
        zh: ['选择来源'],
        zh_TW: ['選擇來源'],
      }
    },
    589053: (e) => {
      e.exports = {
        ar: ['رمز'],
        ca_ES: ['Símbol'],
        cs: 'Symbol',
        de: 'Symbol',
        el: ['Σύμβολο'],
        en: 'Symbol',
        es: ['Símbolo'],
        fa: ['نماد'],
        fr: ['Symbole'],
        he_IL: ['סימול'],
        hu_HU: ['Szimbólum'],
        id_ID: ['Simbol'],
        it: ['Simbolo'],
        ja: ['シンボル'],
        ko: ['심볼'],
        ms_MY: ['Simbol'],
        nl_NL: ['Symbool'],
        pl: 'Symbol',
        pt: ['Símbolo'],
        ro: 'Symbol',
        ru: ['Инструмент'],
        sv: 'Symbol',
        th: ['สัญลักษณ์'],
        tr: ['Sembol'],
        vi: ['Mã'],
        zh: ['商品代码'],
        zh_TW: ['商品代碼'],
      }
    },
    948490: (e) => {
      e.exports = {
        ar: ['الرمز والوصف'],
        ca_ES: ['Símbol i descripció'],
        cs: 'Symbol & description',
        de: ['Symbol & Beschreibung'],
        el: 'Symbol & description',
        en: 'Symbol & description',
        es: ['Símbolo y descripción'],
        fa: 'Symbol & description',
        fr: ['Symbole & description'],
        he_IL: ['סימול ותיאור'],
        hu_HU: 'Symbol & description',
        id_ID: ['Simbol & deskripsi'],
        it: ['Simbolo e descrizione'],
        ja: ['シンボル & 詳細'],
        ko: ['심볼 & 설명'],
        ms_MY: ['Simbol & penjelasan'],
        nl_NL: 'Symbol & description',
        pl: ['Symbol i opis'],
        pt: ['Símbolo & descrição'],
        ro: 'Symbol & description',
        ru: ['Инструмент и описание'],
        sv: ['Symbol & beskrivning'],
        th: ['สัญลักษณ์และคำอธิบาย'],
        tr: ['Sembol ve açıklama'],
        vi: ['Mã giao dịch & mô tả'],
        zh: ['商品和描述'],
        zh_TW: ['商品&描述'],
      }
    },
    882719: (e) => {
      e.exports = {
        ar: ['بحث عن الرموز'],
        ca_ES: ['Cerca de símbols'],
        cs: 'Symbol Search',
        de: ['Symbol Suche'],
        el: 'Symbol Search',
        en: 'Symbol Search',
        es: ['Búsqueda de símbolos'],
        fa: 'Symbol Search',
        fr: ['Recherche de symbole'],
        he_IL: ['חיפוש סימולים'],
        hu_HU: 'Symbol Search',
        id_ID: ['Pencarian Simbol'],
        it: ['Ricerca simbolo'],
        ja: ['シンボル検索'],
        ko: ['심볼 찾기'],
        ms_MY: ['Cari simbol'],
        nl_NL: 'Symbol Search',
        pl: ['Wyszukiwanie symboli'],
        pt: ['Pesquisa de Símbolo'],
        ro: 'Symbol Search',
        ru: ['Поиск инструментов'],
        sv: ['Symbolsök'],
        th: ['ค้นหาตัวย่อ'],
        tr: ['Sembol Arama'],
        vi: ['Tìm kiếm Mã giao dịch'],
        zh: ['商品代码搜索'],
        zh_TW: ['商品搜尋'],
      }
    },
    366702: (e) => {
      e.exports = {
        ar: ['حذف من قائمة المراقبة'],
        ca_ES: ['Elimina de la llista de seguiment'],
        cs: 'Remove from Watchlist',
        de: ['Von Watchlist entfernen'],
        el: 'Remove from Watchlist',
        en: 'Remove from Watchlist',
        es: ['Eliminar de la lista de seguimiento'],
        fa: 'Remove from Watchlist',
        fr: ['Supprimer de la liste de surveillance'],
        he_IL: ['הסר מרשימת המעקב'],
        hu_HU: 'Remove from Watchlist',
        id_ID: ['Hilangkan dari Daftar Pantau'],
        it: ['Rimuovi da watchlist'],
        ja: ['ウォッチリストから削除'],
        ko: ['왓치리스트에서 없애기'],
        ms_MY: ['Buang dari Senarai Amatan'],
        nl_NL: 'Remove from Watchlist',
        pl: ['Usuń z Listy Obserwowanych'],
        pt: ['Remover da lista de observação'],
        ro: 'Remove from Watchlist',
        ru: ['Удалить из списка котировок'],
        sv: ['Ta bort från Bevakningslista'],
        th: ['ลบออกจากรายการเฝ้าระวัง'],
        tr: ["Watchlist'ten Kaldır"],
        vi: ['Loại bỏ khỏi Danh sách theo dõi'],
        zh: ['從觀察清單中刪除'],
        zh_TW: ['從觀察清單中移除'],
      }
    },
    812629: (e) => {
      e.exports = {
        ar: ['السلع'],
        ca_ES: 'commodity',
        cs: 'commodity',
        de: ['Rohstoff'],
        el: 'commodity',
        en: 'commodity',
        es: ['materia prima'],
        fa: 'commodity',
        fr: ['produit de base'],
        he_IL: ['סחורה'],
        hu_HU: 'commodity',
        id_ID: ['komiditas'],
        it: ['materia prima'],
        ja: ['コモディティ'],
        ko: ['상품'],
        ms_MY: ['komoditi'],
        nl_NL: 'commodity',
        pl: ['towar'],
        pt: 'commodity',
        ro: 'commodity',
        ru: ['товары'],
        sv: ['Råvaror'],
        th: ['คอมมอดิตี้'],
        tr: ['Emtia'],
        vi: ['hàng hóa'],
        zh: ['商品'],
        zh_TW: ['商品'],
      }
    },
    487592: (e) => {
      e.exports = {
        ar: ['عقود الفروقات'],
        ca_ES: 'cfd',
        cs: 'cfd',
        de: 'cfd',
        el: 'cfd',
        en: 'cfd',
        es: 'cfd',
        fa: 'cfd',
        fr: 'cfd',
        he_IL: ['חוזה הפרשים cfd'],
        hu_HU: 'cfd',
        id_ID: 'cfd',
        it: 'cfd',
        ja: ['CFD'],
        ko: ['씨에프디'],
        ms_MY: 'cfd',
        nl_NL: 'cfd',
        pl: 'cfd',
        pt: 'cfd',
        ro: 'cfd',
        ru: 'cfd',
        sv: 'cfd',
        th: 'cfd',
        tr: 'cfd',
        vi: 'cfd',
        zh: ['差价合约'],
        zh_TW: 'cfd',
      }
    },
    308448: (e) => {
      e.exports = {
        ar: ['العملات الرقمية'],
        ca_ES: ['cripto'],
        cs: 'crypto',
        de: 'crypto',
        el: 'crypto',
        en: 'crypto',
        es: ['cripto'],
        fa: 'crypto',
        fr: 'crypto',
        he_IL: ['קריפטו'],
        hu_HU: ['kripto'],
        id_ID: 'crypto',
        it: ['cripto'],
        ja: ['暗号'],
        ko: ['크립토'],
        ms_MY: ['kripto'],
        nl_NL: 'crypto',
        pl: ['krypto'],
        pt: ['Cripto'],
        ro: 'crypto',
        ru: ['криптовалюты'],
        sv: ['krypto'],
        th: ['คริปโต'],
        tr: ['kripto'],
        vi: ['tiền điện tử'],
        zh: ['加密'],
        zh_TW: 'crypto',
      }
    },
    667245: (e) => {
      e.exports = {
        ar: ['إيصال إيداع'],
        ca_ES: 'dr',
        cs: 'dr',
        de: 'dr',
        el: 'dr',
        en: 'dr',
        es: 'dr',
        fa: 'dr',
        fr: 'dr',
        he_IL: 'dr',
        hu_HU: 'dr',
        id_ID: 'dr',
        it: 'dr',
        ja: ['預託証券'],
        ko: 'dr',
        ms_MY: 'dr',
        nl_NL: 'dr',
        pl: ['Potwierdzenie wpłaty'],
        pt: 'dr',
        ro: 'dr',
        ru: ['Депоз. расписки'],
        sv: 'dr',
        th: 'dr',
        tr: 'dr',
        vi: 'dr',
        zh: 'dr',
        zh_TW: 'dr',
      }
    },
    488720: (e) => {
      e.exports = {
        ar: ['اقتصاد'],
        ca_ES: ['economia'],
        cs: 'economy',
        de: ['Wirtschaft'],
        el: 'economy',
        en: 'economy',
        es: ['economía'],
        fa: 'economy',
        fr: ['économie'],
        he_IL: ['כַּלְכָּלָה'],
        hu_HU: 'economy',
        id_ID: ['ekonomi'],
        it: ['economia'],
        ja: ['経済指標'],
        ko: ['경제'],
        ms_MY: ['ekonomi'],
        nl_NL: 'economy',
        pl: ['gospodarka'],
        pt: ['economia'],
        ro: 'economy',
        ru: ['экономические данные'],
        sv: ['ekonomi'],
        th: ['เศรษฐกิจ'],
        tr: ['ekonomi'],
        vi: ['kinh tế'],
        zh: ['经济'],
        zh_TW: ['經濟'],
      }
    },
    739512: (e) => {
      e.exports = {
        ar: ['فوركس'],
        ca_ES: ['Forex'],
        cs: 'forex',
        de: ['Devisen'],
        el: 'forex',
        en: 'forex',
        es: ['Forex'],
        fa: 'forex',
        fr: ['Forex'],
        he_IL: ['מט"ח'],
        hu_HU: 'forex',
        id_ID: 'forex',
        it: 'forex',
        ja: ['FX'],
        ko: ['외환'],
        ms_MY: 'forex',
        nl_NL: 'forex',
        pl: 'forex',
        pt: 'forex',
        ro: 'forex',
        ru: ['форекс'],
        sv: ['valutor'],
        th: ['ฟอเร็กซ์'],
        tr: ['döviz'],
        vi: 'forex',
        zh: ['外汇'],
        zh_TW: ['外匯'],
      }
    },
    781859: (e) => {
      e.exports = {
        ar: ['العقود الآجلة'],
        ca_ES: ['futurs'],
        cs: 'futures',
        de: ['Futures'],
        el: 'futures',
        en: 'futures',
        es: ['futuros'],
        fa: 'futures',
        fr: 'futures',
        he_IL: ['חוזים עתידיים'],
        hu_HU: 'futures',
        id_ID: ['kontrak berjangka'],
        it: ['future'],
        ja: ['先物'],
        ko: ['퓨쳐스'],
        ms_MY: ['pasaran hadapan'],
        nl_NL: 'futures',
        pl: ['Kontrakty terminowe'],
        pt: ['futuros'],
        ro: 'futures',
        ru: ['фьючерсы'],
        sv: ['terminer'],
        th: ['ฟิวเจอร์ส'],
        tr: ['vadeli'],
        vi: ['hợp đồng tương lai'],
        zh: ['期货'],
        zh_TW: ['期貨'],
      }
    },
    612754: (e) => {
      e.exports = {
        ar: ['مؤشر'],
        ca_ES: ['índex'],
        cs: 'index',
        de: ['Index'],
        el: 'index',
        en: 'index',
        es: ['índice'],
        fa: 'index',
        fr: ['indice'],
        he_IL: ['מדד'],
        hu_HU: 'index',
        id_ID: ['indeks'],
        it: ['indice'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: 'index',
        pl: ['indeks'],
        pt: ['índice'],
        ro: 'index',
        ru: ['индексы'],
        sv: 'index',
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['chỉ số'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    138071: (e) => {
      e.exports = {
        ar: ['المؤشرات'],
        ca_ES: 'indices',
        cs: 'indices',
        de: ['Indizes'],
        el: 'indices',
        en: 'indices',
        es: ['índices'],
        fa: 'indices',
        fr: 'indices',
        he_IL: ['מדדים'],
        hu_HU: 'indices',
        id_ID: ['indeks'],
        it: ['Indici'],
        ja: ['指数'],
        ko: ['지수'],
        ms_MY: ['indeks'],
        nl_NL: ['indexen'],
        pl: ['indeksy'],
        pt: ['índices'],
        ro: 'indices',
        ru: ['индексы'],
        sv: ['index'],
        th: ['ดัชนี'],
        tr: ['endeks'],
        vi: ['các chỉ báo'],
        zh: ['指数'],
        zh_TW: ['指數'],
      }
    },
    636931: (e) => {
      e.exports = {
        ar: ['سهم'],
        ca_ES: ['accions'],
        cs: 'stock',
        de: ['Aktie'],
        el: 'stock',
        en: 'stock',
        es: ['acciones'],
        fa: 'stock',
        fr: 'stock',
        he_IL: ['מניה'],
        hu_HU: 'stock',
        id_ID: ['saham'],
        it: ['azione'],
        ja: ['株式'],
        ko: ['스탁'],
        ms_MY: ['saham'],
        nl_NL: 'stock',
        pl: ['akcja'],
        pt: ['ação'],
        ro: 'stock',
        ru: ['акция'],
        sv: ['aktier'],
        th: ['หุ้น'],
        tr: ['hisse'],
        vi: ['cổ phiếu'],
        zh: ['股票'],
        zh_TW: ['股票'],
      }
    },
  },
])
