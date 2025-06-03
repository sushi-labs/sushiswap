;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1026],
  {
    605011: (e, a, t) => {
      t.r(a), t.d(a, { activeSymbolListNavigator: () => c })
      var n = t(254773),
        o = t(336349),
        s = t(376202),
        i = t(601373),
        r = t(688401),
        l = t(706474)
      function* c(e) {
        const a = (0, n.eventChannel)((e) => {
          const a = (a, t) => {
              a.defaultPrevented ||
                (null ===
                  a.target.closest('[data-allow-watchlist-navigation]') &&
                  a.target !== document.body) ||
                e(t)
            },
            t = s.createGroup({ desc: 'Active Symbol List Navigation' })
          return (
            t.add({
              desc: 'Select previous symbol',
              hotkey: 38,
              handler: (e) => a(e, 'previous'),
            }),
            t.add({
              desc: 'Select previous symbol',
              hotkey: s.Modifiers.Shift + 32,
              handler: (e) => a(e, 'previous'),
            }),
            t.add({
              desc: 'Select next symbol',
              hotkey: 32,
              handler: (e) => a(e, 'next'),
            }),
            t.add({
              desc: 'Select next symbol',
              hotkey: 40,
              handler: (e) => a(e, 'next'),
            }),
            () => t.destroy()
          )
        })
        try {
          for (;;) {
            const t = yield (0, o.take)(a),
              n = (0, i.getGlobalActiveSymbolList)(yield (0, o.select)())
            if (null === n) continue
            const s = n.symbols
            if (0 === s.length) continue
            const c = r.linking.proSymbol.value(),
              u = r.linking.symbolNamesList.value()
            let m = (0, l.getSymbolFromList)(c, s)
            !m &&
              u &&
              u.forEach((e) => {
                m = (0, l.getSymbolFromList)(e, s)
              })
            const d = s.indexOf(m || '')
            switch (t) {
              case 'previous': {
                const a =
                  -1 === d ? s.length - 1 : (d + s.length - 1) % s.length
                if ((0, l.isValidSeparatorItem)(s[a])) {
                  const t = (0, l.findNextAvailableSymbol)(a, s, 'previous')
                  t && r.linking.setSymbolAndLogInitiator(t, e)
                  break
                }
                r.linking.setSymbolAndLogInitiator(s[a], e)
                break
              }
              case 'next': {
                const a = -1 === d ? 0 : (d + s.length + 1) % s.length
                if ((0, l.isValidSeparatorItem)(s[a])) {
                  const t = (0, l.findNextAvailableSymbol)(a, s, 'next')
                  t && r.linking.setSymbolAndLogInitiator(t, e)
                  break
                }
                r.linking.setSymbolAndLogInitiator(s[a], e)
                break
              }
            }
          }
        } finally {
          a.close()
        }
      }
    },
    2595: (e, a, t) => {
      t.r(a), t.d(a, { configureStore: () => b })
      var n = t(64482),
        o = t(254773),
        s = t(691622),
        i = t(316230),
        r = t(244e3),
        l = t(70644)
      function c(e, a, t, n) {
        return {
          id: e,
          tickerType: a,
          columns: t,
          options: n,
          selectedSymbols: [],
          sorting: null,
          highlightedSymbols: null,
          listId: null,
          isLoading: !1,
          symbolsBeforeSorting: null,
          sortingListId: null,
          scrollToId: null,
        }
      }
      function u(e, a) {
        if (e.length !== a.length) return !1
        const t = [...e].sort(),
          n = [...a].sort()
        return (0, i.default)(t, n)
      }
      function m(e, a) {
        return {
          ...e,
          [a]: {
            ...e[a],
            sorting: null,
            symbolsBeforeSorting: null,
            sortingListId: null,
          },
        }
      }
      var d = t(706474)
      const h = (0, s.combineReducers)({
        positions: (e = {}, a) => {
          switch (a.type) {
            case l.UPDATE_POSITIONS: {
              const { symbol: t, position: n } = a
              return (0, d.isEqualRecords)(e[t], n) ? e : { ...e, [t]: n }
            }
            case l.UPDATE_BULK_POSITIONS: {
              const { map: t } = a,
                n = { ...e }
              let o = !1
              for (const [a, s] of Object.entries(t))
                (0, d.isEqualRecords)(e[a], s) || ((o = !0), (n[a] = s))
              return o ? n : e
            }
            default:
              return e
          }
        },
        customLists: r.reducer,
        hotLists: (e, a) => null,
        markedLists: (e, a) => null,
        widgets: (e = {}, a) => {
          if (
            r.setup.match(a) ||
            r.insert.match(a) ||
            r.exclude.match(a) ||
            r.exact.match(a) ||
            r.replace.match(a)
          ) {
            let t = e
            for (const n of Object.values(e)) {
              const { listId: o, sortingListId: s, symbolsBeforeSorting: i } = n
              if (null !== o) {
                if (o === s && r.setup.match(a)) {
                  const e = a.payload.lists.find((e) => e.id === s)
                  if (void 0 !== e && null !== i && u(e.symbols, i)) continue
                }
                t = m(e, n.id)
              }
            }
            return t
          }
          return ((e = {}, a) => {
            var t
            switch (a.type) {
              case l.INIT_WIDGET: {
                const { id: t, tickerType: n, columns: o, options: s } = a
                return { ...e, [t]: c(t, n, o, s) }
              }
              case l.UPDATE_WIDGET: {
                const { widgetId: n, widget: o } = a,
                  s = { ...e, [n]: { ...e[n], ...o } },
                  i = e[n].tickerType,
                  r = o.tickerType,
                  l =
                    'short_name' ===
                    (null === (t = e[n].sorting) || void 0 === t
                      ? void 0
                      : t.column)
                return void 0 !== r && i !== r && l ? m(s, n) : s
              }
              case l.UPDATE_WIDGET_OPTIONS: {
                const { widgetId: t, options: n } = a
                return {
                  ...e,
                  [t]: { ...e[t], options: { ...e[t].options, ...n } },
                }
              }
              default:
                return e
            }
          })(e, a)
        },
        isAuthenticated: () => !1,
        activeSymbolList: (e = null, a) =>
          a.type === l.UPDATE_ACTIVE_LIST ? a.id : e,
        collapsedSeparators: () => ({}),
      })
      function b() {
        const e = (0, o.default)()
        return {
          store: (0, n.configureStore)({
            reducer: h,
            middleware: (a) =>
              [...a(), ...y(), e, null, null].filter((e) => null !== e),
          }),
          runner: e,
        }
      }
      function y() {
        return []
      }
    },
    215078: (e, a, t) => {
      function n(e) {
        return (a) => e + '__' + a
      }
      t.d(a, { createActionTypeFactory: () => n })
    },
    279984: (e) => {
      e.exports = {
        ar: ['إنشاء قائمة جديدة'],
        ca_ES: ['Crear nova llista'],
        cs: 'Create New List',
        de: ['Neue Liste erstellen'],
        el: 'Create New List',
        en: 'Create New List',
        es: ['Crear nueva lista'],
        fa: 'Create New List',
        fr: ['Créer une Nouvelle Liste'],
        he_IL: ['צור רשימה חדשה'],
        hu_HU: ['Új Lista Létrehozása'],
        id_ID: ['Buat Daftar Baru'],
        it: ['Crea nuova lista'],
        ja: ['新規リスト作成'],
        ko: ['새 리스트 만들기'],
        ms_MY: ['Cipta Senarai Baru'],
        nl_NL: 'Create New List',
        pl: ['Utwórz nową liste'],
        pt: ['Criar nova lista'],
        ro: 'Create New List',
        ru: ['Создать новый список'],
        sv: ['Skapa ny lista'],
        th: ['สร้างรายการใหม่'],
        tr: ['Yeni Liste Oluştur'],
        vi: ['Tạo Danh sách Mới'],
        zh: ['创建新的列表'],
        zh_TW: ['建立新清單'],
      }
    },
    482751: (e) => {
      e.exports = {
        ar: ['خطأ'],
        ca_ES: 'Error',
        cs: ['Chyba'],
        de: ['Fehler'],
        el: 'Error',
        en: 'Error',
        es: 'Error',
        fa: ['خطا'],
        fr: ['Erreur'],
        he_IL: ['שגיאה'],
        hu_HU: ['Hiba'],
        id_ID: ['Kesalahan'],
        it: ['Errore'],
        ja: ['エラー'],
        ko: ['에러'],
        ms_MY: ['Ralat'],
        nl_NL: ['Fout'],
        pl: ['Błąd'],
        pt: ['Erro'],
        ro: 'Error',
        ru: ['Ошибка'],
        sv: ['Fel'],
        th: ['ผิดพลาด'],
        tr: ['Hata'],
        vi: ['Lỗi'],
        zh: ['错误'],
        zh_TW: ['錯誤'],
      }
    },
    799217: (e) => {
      e.exports = {
        ar: ['حفظ القائمة كـ...'],
        ca_ES: ['Desa llista com a'],
        cs: 'Save List As',
        de: ['Liste speichern als'],
        el: 'Save List As',
        en: 'Save List As',
        es: ['Guardar lista como'],
        fa: 'Save List As',
        fr: ['Sauvegarder la Liste Sous'],
        he_IL: ['שמור רשימה בשם'],
        hu_HU: ['Lista Mentése Mint'],
        id_ID: ['Simpan Daftar Sebagai'],
        it: ['Salva lista come'],
        ja: ['名前を付けてリストを保存'],
        ko: ['리스트 다른 이름으로 저장'],
        ms_MY: ['Simpan Senarai Sebagai'],
        nl_NL: 'Save List As',
        pl: ['Zapisz Listę jako'],
        pt: ['Salvar lista como'],
        ro: 'Save List As',
        ru: ['Сохранить список как'],
        sv: ['Spara lista som'],
        th: ['บันทึกรายการเป็น'],
        tr: ['Listeyi Yeni Adla Sakla'],
        vi: ['Lưu Danh sách dưới dạng'],
        zh: ['保存列表为'],
        zh_TW: ['儲存列表為...'],
      }
    },
    83796: (e) => {
      e.exports = {
        ar: ['اسم قائمة الرموز'],
        ca_ES: ['Nom de la llista de símbols'],
        cs: 'Symbol list name',
        de: ['Name der Symbolliste'],
        el: 'Symbol list name',
        en: 'Symbol list name',
        es: ['Nombre de la lista de símbolos'],
        fa: 'Symbol list name',
        fr: ['Liste de noms des symboles'],
        he_IL: ['שם רשימת הסימולים'],
        hu_HU: ['Szimbólum lista neve'],
        id_ID: ['Nama daftar simbol'],
        it: ['Nome lista simboli'],
        ja: ['シンボルリスト名'],
        ko: ['심볼 리스트 이름'],
        ms_MY: ['Nama senarai simbol'],
        nl_NL: 'Symbol list name',
        pl: ['Nazwa listy symboli'],
        pt: ['Nome na listagem de símbolos'],
        ro: 'Symbol list name',
        ru: ['Имя списка инструментов'],
        sv: ['Symbolers namnlista'],
        th: ['ชื่อรายการสัญลักษณ์'],
        tr: ['Sembol listesin adı'],
        vi: ['Danh sách tên Mã giao dịch'],
        zh: ['商品列表名称'],
        zh_TW: ['商品列表名稱'],
      }
    },
    847746: (e) => {
      e.exports = {
        ar: ['لا يمكن إضافة المزيد إلى قائمة المراقبة.'],
        ca_ES: ['La llista de seguiment està completa!'],
        cs: "Watchlist cannot take anymore, Cap'n",
        de: ['Die Watchlist kann keine weiteren Einträge mehr aufnehmen'],
        el: "Watchlist cannot take anymore, Cap'n",
        en: "Watchlist cannot take anymore, Cap'n",
        es: ['¡La lista de seguimiento está completa!'],
        fa: "Watchlist cannot take anymore, Cap'n",
        fr: ["La liste de surveillance n'en peut plus !"],
        he_IL: ['רשימת הצפייה לא יכולה לקחת יותר, קפטן'],
        hu_HU: "Watchlist cannot take anymore, Cap'n",
        id_ID: ['Daftar pantau sudah penuh Kapten!'],
        it: ['La watchlist non regge nuovi strumenti'],
        ja: ['ウォッチリストはもう限界です'],
        ko: ['왓치리스트가 꽉 찼습니다, 캡틴'],
        ms_MY: ['Senarai amatan tidak dapat ditambah lagi, Kapten'],
        nl_NL: "Watchlist cannot take anymore, Cap'n",
        pl: ['Lista obserwowanych jest pełna Kapitanie'],
        pt: ["A lista de observação não suporta mais, Cap'n"],
        ro: "Watchlist cannot take anymore, Cap'n",
        ru: ['В список котировок больше уже не помещается'],
        sv: ['De kan inte ta mer, Kapten'],
        th: ['รายการเฝ้าระวังไม่สามารถรับเพิ่มได้อีกแล้วนะคุณ'],
        tr: ['Watchlist daha fazla dayanamaz, Kaptan'],
        vi: ["Danh sách theo dõi không thể sử dụng được nữa, Cap'n"],
        zh: ['报告船长，自选表已满'],
        zh_TW: ['報告船長，觀察清單已滿'],
      }
    },
    33115: (e) => {
      e.exports = {
        ar: ['حدث خطأ في قائمة المراقبة'],
        ca_ES: ['Error en la llista de seguiment'],
        cs: 'Watchlist error',
        de: ['Watchlist Error'],
        el: 'Watchlist error',
        en: 'Watchlist error',
        es: ['Error en la lista de seguimiento'],
        fa: 'Watchlist error',
        fr: ['Erreur dans la liste de surveillance'],
        he_IL: ['שגיאת רשימת מעקב'],
        hu_HU: 'Watchlist error',
        id_ID: ['Daftar pantau error'],
        it: ['Errore watchlist'],
        ja: ['ウォッチリストエラー'],
        ko: ['왓치리스트 에러'],
        ms_MY: ['Kesilapan Senarai Amatan'],
        nl_NL: 'Watchlist error',
        pl: ['Błąd listy obserwowanych'],
        pt: ['Erro na Lista de Observação'],
        ro: 'Watchlist error',
        ru: ['Ошибка списка котировок'],
        sv: ['Bevakningslista fel'],
        th: ['รายการเฝ้าระวังผิดพลาด'],
        tr: ['Watchlist hatası'],
        vi: ['Lỗi danh sách theo dõi'],
        zh: ['自选表错误'],
        zh_TW: ['觀察清單錯誤'],
      }
    },
    66596: (e) => {
      e.exports = {
        ar: [
          'المعذرة، لا يمكنك إضافة أكثر من {number} رموز وفواصل إلى قائمة المراقبة.',
        ],
        ca_ES: [
          'Vaja, no podeu afegir més de {number} símbols i separadors a una llista de seguiment: som enginyers, però no fem miracles.',
        ],
        cs: "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        de: [
          'Whoa, Sie können doch nicht einfach so {number} Symbole und Trennzeichen in eine Watchlist einfügen – wir sind Ingenieure und keine Wundertäter.',
        ],
        el: "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        en: "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        es: [
          'Vaya, no puede añadir más de {number} símbolos y separadores a una lista de seguimiento: somos ingenieros, pero no obramos milagros.',
        ],
        fa: "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        fr: [
          'Oh la, vous ne pouvez pas ajouter plus de {number} symboles et séparateurs à une liste de surveillance - nous sommes des ingénieurs, pas des magiciens.',
        ],
        he_IL: [
          'אתה לא יכול להוסיף יותר מ- {number} סימולים ומפרידים לרשימת המעקב - אנחנו מהנדסים לא מחוללי ניסים.',
        ],
        hu_HU:
          "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        id_ID: [
          'Woww woww, anda tidak dapat menabahkan {number} simbol dan separator kedalam daftar pantau - kami adalah teknisi, bukan pembuat keajaiban.',
        ],
        it: [
          'Wow, non puoi pretendere di aggiungere più di {number} elementi tra separatori e simboli su una singola watchlist – siamo programmatori, non maghi.',
        ],
        ja: [
          'お待ちください、{number}以上のシンボルとセパレーターをウォッチリストに追加する事はできません – 私たちは奇跡を起こす人ではなくエンジニアです。',
        ],
        ko: [
          '왓치리스트에 {number} 이 넘는 심볼 및 세퍼레이터를 넣을 수 없습니다  – 우리는 미라클 워커가 아니라 엔지니어입니다.',
        ],
        ms_MY: [
          'Woh, anda tidak dapat menambah lagi {number} simbol-simbol dan pemisah-pemisah ke senarai amatan – kami adalah jurutera dan bukannya pekerja ajaib.',
        ],
        nl_NL:
          "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        pl: [
          'Niestety do listy obserwowanych nie możesz dodać więcej niż {number} symboli i separatorów — jesteśmy programistami, a nie magikami.',
        ],
        pt: [
          'Epa, você não pode ir adicionando símbolos {number} e separadores a uma lista de observação - somos engenheiros, mas não fazemos milagres.',
        ],
        ro: "Whoa there, you can't go adding over {number} symbols and separators to a watchlist – we're engineers not miracle workers.",
        ru: [
          'Вы не можете добавлять более {number} символов и разделителей в список котировок.',
        ],
        sv: [
          'Du kan inte lägga till över {number} symboler och separatorer till en bevakningslista – vi är ingenjörer och inga mirakelarbetare.',
        ],
        th: [
          'โว้ว คุณไม่สามารถทำการเพิ่มมากกว่า {number} สัญลักษณ์และตัวแบ่งในรายการเฝ้าระวังได้ – เราคือวิศวกร ไม่ใช่พระเจ้า',
        ],
        tr: [
          "Vay canına, bir wathclist'e {number} simgeden fazla sembol ve ayırıcı ekleyemezsiniz – biz mühendisiz, mucize işçisi değil.",
        ],
        vi: [
          'Rất tiếc, bạn không thể thêm quá {number} mã giao dịch và dấu phân cách vào danh sách theo dõi - chúng tôi là kỹ sư không phải công nhân thần kỳ.',
        ],
        zh: [
          '哇哦，您不能将超过{number}个商品和分隔符添加到自选表中 — 我们是工程师，而非魔术师。',
        ],
        zh_TW: [
          '哇，您不能將超過{number}個商品和分隔符增加到觀察清單中 – 我們是工程師不是魔術師。',
        ],
      }
    },
    222045: (e) => {
      e.exports = {
        ar: [
          'هل تريد حقًا حذف الرمز ‎{count}‎ المحدد؟',
          'هل تريد حقًا حذف الرمز ‎{count}‎ المحدد؟',
          'هل تريد حقًا حذف الرمز ‎{count}‎ المحدد؟',
          'هل تريد حقًا حذف الرموز ‎{count}‎ المحددة؟',
          'هل تريد حقًا حذف الرموز ‎{count}‎ المحددة؟',
          'هل تريد حقًا حذف الرموز ‎{count}‎ المحددة؟',
        ],
        ca_ES: [
          'Realment voleu eliminar {count} símbol seleccionat?',
          'Realment voleu eliminar {count} símbols seleccionats?',
        ],
        cs: 'Do you really want to delete {count} selected symbol?',
        de: [
          'Möchten Sie wirklich das ausgewählte Symbol {count} löschen?',
          'Möchten Sie wirklich das ausgewählte Symbole {count} löschen?',
        ],
        el: 'Do you really want to delete {count} selected symbol?',
        en: 'Do you really want to delete {count} selected symbol?',
        es: [
          '¿Realmente desea eliminar {count} símbolo seleccionado?',
          '¿Realmente desea eliminar {count} símbolos seleccionados?',
        ],
        fa: ['Do you really want to delete {count} selected symbols?'],
        fr: [
          'Voulez-vous vraiment supprimer {count} symbole sélectionné?',
          'Voulez-vous vraiment supprimer {count} symboles sélectionnés?',
        ],
        he_IL: [
          'האם אתה באמת רוצה למחוק {count} סימול נבחר?',
          'האם אתה באמת רוצה למחוק {count} סימולים נבחרים?',
          'האם אתה באמת רוצה למחוק {count} סימולים נבחרים?',
          'האם אתה באמת רוצה למחוק {count} סימולים נבחרים?',
        ],
        hu_HU: ['Do you really want to delete {count} selected symbols?'],
        id_ID: [
          'Apakah anda benar-benar ingin menghapus {count} simbol yang dipilih ?',
        ],
        it: [
          'Vuoi davvero eliminare {count} simbolo selezionato?',
          'Vuoi davvero eliminare i {count} simboli selezionati?',
        ],
        ja: ['本当に選択した{count}個のシンボルを削除しますか？'],
        ko: ['선택한 종목 {count}개를 정말로 삭제하시겠습니까?'],
        ms_MY: [
          'Adakah anda pasti untuk memadamkan {count} simbol yang dipilih?',
        ],
        nl_NL: 'Do you really want to delete {count} selected symbol?',
        pl: [
          'Czy na pewno chcesz usunąć {count} wybrany symbol?',
          'Czy na pewno chcesz usunąć {count} wybrane symbole?',
          'Czy na pewno chcesz usunąć {count} wybranych symboli?',
          'Czy na pewno chcesz usunąć {count} wybranych symboli?',
        ],
        pt: [
          'Você realmente quer deletar o {count} símbolo selecionado?',
          'Você realmente quer deletar os {count} símbolos selecionados?',
        ],
        ro: 'Do you really want to delete {count} selected symbol?',
        ru: [
          'Вы действительно хотите удалить {count} выбранный инструмент?',
          'Вы действительно хотите удалить {count} выбранных инструмента?',
          'Вы действительно хотите удалить {count} выбранных инструментов?',
          'Вы действительно хотите удалить {count} выбранных инструментов?',
        ],
        sv: [
          'Vill du verkligen radera {count} symbol?',
          'Vill du verkligen radera {count} symboler?',
        ],
        th: ['คุณต้องการลบ {count} สัญลักษณ์ที่เลือกจริง ๆ หรือไม่?'],
        tr: [
          'Seçilen {count} sembolü gerçekten silmek istiyor musunuz?',
          'Seçilen {count} sembolü gerçekten silmek istiyor musunuz?',
        ],
        vi: ['Bạn có thực sự muốn xóa {count} mã đã chọn?'],
        zh: ['您真的要删除{count}个选定的商品吗？'],
        zh_TW: ['您真的要刪除{count}個選定的商品嗎？'],
      }
    },
  },
])
