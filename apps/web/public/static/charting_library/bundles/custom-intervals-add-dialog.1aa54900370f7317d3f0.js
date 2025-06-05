;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4013],
  {
    23428: (e) => {
      e.exports = {
        button: 'button-PYEOTd6i',
        disabled: 'disabled-PYEOTd6i',
        hidden: 'hidden-PYEOTd6i',
        icon: 'icon-PYEOTd6i',
        dropped: 'dropped-PYEOTd6i',
      }
    },
    66986: (e) => {
      e.exports = {
        button: 'button-tFul0OhX',
        'button-children': 'button-children-tFul0OhX',
        hiddenArrow: 'hiddenArrow-tFul0OhX',
        invisibleFocusHandler: 'invisibleFocusHandler-tFul0OhX',
      }
    },
    60673: (e) => {
      e.exports = { placeholder: 'placeholder-V6ceS6BN' }
    },
    86332: (e, t, n) => {
      n.d(t, { ControlGroupContext: () => l })
      const l = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    36104: (e, t, n) => {
      n.d(t, { useControlDisclosure: () => o })
      var l = n(7953)
      function o(e) {
        const { intent: t, highlight: n, ...o } = e,
          { isFocused: a, ...i } = (0, l.useDisclosure)(o)
        return {
          ...i,
          isFocused: a,
          highlight: null != n ? n : a,
          intent: null != t ? t : a ? 'primary' : 'default',
        }
      }
    },
    34094: (e, t, n) => {
      n.d(t, { getTextForTooltip: () => i })
      var l = n(50959)
      const o = (e) => (0, l.isValidElement)(e) && Boolean(e.props.children),
        a = (e) =>
          null == e || 'boolean' == typeof e || '{}' === JSON.stringify(e)
            ? ''
            : e.toString() + ' ',
        i = (e) =>
          Array.isArray(e) || (0, l.isValidElement)(e)
            ? l.Children.toArray(e)
                .reduce((e, t) => {
                  let n = ''
                  return (
                    (n =
                      (0, l.isValidElement)(t) && o(t)
                        ? i(t.props.children)
                        : (0, l.isValidElement)(t) && !o(t)
                          ? ''
                          : a(t)),
                    e.concat(n)
                  )
                }, '')
                .trim()
            : a(e)
    },
    59054: (e, t, n) => {
      n.d(t, { ControlDisclosureView: () => b })
      var l = n(50959),
        o = n(97754),
        a = n.n(o),
        i = n(38528),
        r = n(67029),
        s = n(78274),
        d = n(4523),
        u = n(9745),
        c = n(2948),
        m = n(23428)
      function p(e) {
        const { isDropped: t } = e
        return l.createElement(u.Icon, {
          className: a()(m.icon, t && m.dropped),
          icon: c,
        })
      }
      function h(e) {
        const { className: t, disabled: n, isDropped: o } = e
        return l.createElement(
          'span',
          { className: a()(m.button, n && m.disabled, t) },
          l.createElement(p, { isDropped: o }),
        )
      }
      var v = n(66986)
      const b = l.forwardRef((e, t) => {
        const {
            listboxId: n,
            className: o,
            listboxClassName: u,
            listboxTabIndex: c,
            hideArrowButton: m,
            matchButtonAndListboxWidths: p,
            popupPosition: b,
            disabled: f,
            isOpened: g,
            scrollWrapReference: C,
            repositionOnScroll: x,
            closeOnHeaderOverlap: I,
            listboxReference: T,
            size: y = 'small',
            onClose: k,
            onOpen: O,
            onListboxFocus: E,
            onListboxBlur: A,
            onListboxKeyDown: w,
            buttonChildren: _,
            children: N,
            caretClassName: S,
            listboxAria: L,
            ...D
          } = e,
          z = (0, l.useRef)(null),
          M =
            !m &&
            l.createElement(
              s.EndSlot,
              null,
              l.createElement(h, { isDropped: g, disabled: f, className: S }),
            )
        return l.createElement(d.PopupMenuDisclosureView, {
          buttonRef: z,
          listboxId: n,
          listboxClassName: u,
          listboxTabIndex: c,
          isOpened: g,
          onClose: k,
          onOpen: O,
          listboxReference: T,
          scrollWrapReference: C,
          onListboxFocus: E,
          onListboxBlur: A,
          onListboxKeyDown: w,
          listboxAria: L,
          matchButtonAndListboxWidths: p,
          popupPosition: b,
          button: l.createElement(r.ControlSkeleton, {
            ...D,
            'data-role': 'listbox',
            disabled: f,
            className: a()(v.button, o),
            size: y,
            ref: (0, i.useMergedRefs)([z, t]),
            middleSlot: l.createElement(
              s.MiddleSlot,
              null,
              l.createElement(
                'span',
                { className: a()(v['button-children'], m && v.hiddenArrow) },
                _,
              ),
            ),
            endSlot: M,
          }),
          popupChildren: N,
          repositionOnScroll: x,
          closeOnHeaderOverlap: I,
        })
      })
      b.displayName = 'ControlDisclosureView'
    },
    90405: (e, t, n) => {
      n.d(t, { Select: () => x })
      var l = n(50959),
        o = n(43010),
        a = n(22064),
        i = n(38528),
        r = n(16921),
        s = n(16396),
        d = n(12481),
        u = n(43370)
      var c = n(36762),
        m = n(26597),
        p = n(59054),
        h = n(36104),
        v = n(38223),
        b = n(60673)
      function f(e) {
        return !e.readonly
      }
      function g(e, t) {
        var n
        return null !== (n = null == t ? void 0 : t.id) && void 0 !== n
          ? n
          : (0, a.createDomId)(e, 'item', null == t ? void 0 : t.value)
      }
      function C(e) {
        var t, n
        const { selectedItem: o, placeholder: a } = e
        if (!o) return l.createElement('span', { className: b.placeholder }, a)
        const i =
          null !==
            (n =
              null !== (t = o.selectedContent) && void 0 !== t
                ? t
                : o.content) && void 0 !== n
            ? n
            : o.value
        return l.createElement('span', null, i)
      }
      const x = l.forwardRef((e, t) => {
        const {
          id: n,
          menuClassName: b,
          menuItemClassName: x,
          tabIndex: I,
          disabled: T,
          highlight: y,
          intent: k,
          hideArrowButton: O,
          placeholder: E,
          addPlaceholderToItems: A = !1,
          value: w,
          'aria-labelledby': _,
          onFocus: N,
          onBlur: S,
          onClick: L,
          onChange: D,
          onKeyDown: z,
          repositionOnScroll: M = !0,
          openMenuOnEnter: F = !0,
          'aria-describedby': R,
          'aria-invalid': B,
          ...K
        } = e
        let { items: W } = e
        if (E && A) {
          W = [
            {
              value: void 0,
              content: E,
              id: (0, a.createDomId)(n, 'placeholder'),
            },
            ...W,
          ]
        }
        const {
            listboxId: P,
            isOpened: H,
            isFocused: U,
            buttonTabIndex: V,
            listboxTabIndex: j,
            highlight: Y,
            intent: G,
            open: X,
            onOpen: Z,
            close: J,
            toggle: $,
            buttonFocusBindings: q,
            onButtonClick: Q,
            buttonRef: ee,
            listboxRef: te,
            buttonAria: ne,
          } = (0, h.useControlDisclosure)({
            id: n,
            disabled: T,
            buttonTabIndex: I,
            intent: k,
            highlight: y,
            onFocus: N,
            onBlur: S,
            onClick: L,
          }),
          le = W.filter(f),
          oe = le.find((e) => e.value === w),
          [ae, ie] = l.useState(
            E && A ? le[0].value : null == oe ? void 0 : oe.value,
          ),
          [re, se, de] = (0, r.useKeepActiveItemIntoView)({ activeItem: oe })
        ;(0, o.useIsomorphicLayoutEffect)(
          () => ie(null == oe ? void 0 : oe.value),
          [w],
        )
        const ue = (0, a.joinDomIds)(_, n),
          ce = ue.length > 0 ? ue : void 0,
          me = (0, l.useMemo)(
            () => ({
              role: 'listbox',
              'aria-labelledby': _,
              'aria-activedescendant': g(n, oe),
            }),
            [_, oe],
          ),
          pe = (0, l.useCallback)((e) => e.value === ae, [ae]),
          he = (0, l.useCallback)(() => (J(), D && D(ae)), [J, D, ae]),
          ve = (0, c.useItemsKeyboardNavigation)(
            'vertical',
            v.isRtl,
            le,
            pe,
            (e) => {
              ie(e.value)
            },
            !1,
            { next: [40], previous: [38] },
          ),
          be = (0, m.useKeyboardToggle)($, H || F),
          fe = (0, m.useKeyboardToggle)(he),
          ge = (0, m.useKeyboardClose)(H, ke),
          Ce = (0, m.useKeyboardOpen)(H, X),
          xe = (0, m.useKeyboardEventHandler)([be, ge, Ce]),
          Ie = (0, m.useKeyboardEventHandler)([ve, fe, ge]),
          Te = ((e) => {
            const t = (0, l.useRef)(''),
              n = (0, l.useMemo)(
                () =>
                  (0, d.default)(() => {
                    t.current = ''
                  }, 500),
                [],
              ),
              o = (0, l.useMemo)(() => (0, u.default)(e, 200), [e])
            return (0, l.useCallback)(
              (e) => {
                e.key.length > 0 &&
                  e.key.length < 3 &&
                  ((t.current += e.key), o(t.current, e), n())
              },
              [n, o],
            )
          })((t, n) => {
            const l = ((e, t, n) =>
              e.find((e) => {
                var l
                const o = t.toLowerCase()
                return (
                  !e.readonly &&
                  (n
                    ? n(e).toLowerCase().startsWith(o)
                    : !e.readonly &&
                      (('string' == typeof e.content &&
                        e.content.toLowerCase().startsWith(o)) ||
                        ('string' == typeof e.textContent &&
                          e.textContent.toLowerCase().startsWith(o)) ||
                        String(null !== (l = e.value) && void 0 !== l ? l : '')
                          .toLowerCase()
                          .startsWith(o)))
                )
              }))(le, t, e.getSearchKey)
            void 0 !== l && D && (n.stopPropagation(), H || X(), D(l.value))
          })
        return l.createElement(
          p.ControlDisclosureView,
          {
            ...K,
            ...ne,
            ...q,
            id: n,
            role: 'button',
            tabIndex: V,
            'aria-owns': ne['aria-controls'],
            'aria-haspopup': 'listbox',
            'aria-labelledby': ce,
            disabled: T,
            hideArrowButton: O,
            isFocused: U,
            isOpened: H,
            highlight: Y,
            intent: G,
            ref: (0, i.useMergedRefs)([ee, t]),
            onClick: Q,
            onOpen: () => {
              de(oe, { duration: 0 }), Z()
            },
            onClose: ke,
            onKeyDown: (e) => {
              xe(e), z && z(e)
              e.defaultPrevented || Te(e)
            },
            listboxId: P,
            listboxTabIndex: j,
            listboxClassName: b,
            listboxAria: me,
            'aria-describedby': R,
            'aria-invalid': B,
            listboxReference: te,
            scrollWrapReference: re,
            onListboxKeyDown: (e) => {
              Ie(e), e.defaultPrevented || Te(e)
            },
            buttonChildren: l.createElement(C, {
              selectedItem: null != oe ? oe : null,
              placeholder: E,
            }),
            repositionOnScroll: M,
          },
          W.map((e, t) => {
            var o
            if (e.readonly)
              return l.createElement(
                l.Fragment,
                { key: `readonly_item_${t}` },
                e.content,
              )
            const a = g(n, e)
            return l.createElement(s.PopupMenuItem, {
              key: a,
              id: a,
              className: x,
              role: 'option',
              'aria-selected': w === e.value,
              isActive: ae === e.value,
              label: null !== (o = e.content) && void 0 !== o ? o : e.value,
              onClick: ye,
              onClickArg: e.value,
              isDisabled: e.disabled,
              reference: (t) => se(e, t),
            })
          }),
        )
        function ye(e) {
          D && (D(e), ie(e))
        }
        function ke() {
          ie(null == oe ? void 0 : oe.value), J()
        }
      })
      x.displayName = 'Select'
    },
    89872: (e) => {
      e.exports = {
        scrollable: 'scrollable-uT4IUFMG',
        content: 'content-uT4IUFMG',
        row: 'row-uT4IUFMG',
        title: 'title-uT4IUFMG',
        control: 'control-uT4IUFMG',
      }
    },
    44762: (e, t, n) => {
      n.r(t), n.d(t, { ToolWidgetIntervalsAddDialog: () => p })
      var l = n(50959),
        o = n(11542),
        a = n(50182),
        i = n(90405),
        r = n(31261),
        s = n(59064),
        d = n(86656),
        u = n(65817),
        c = n(89872)
      const m = u.INTERVALS.map((e) => ({ value: e.name, content: e.label }))
      function p(e) {
        const { onAdd: t, onClose: p, onUnmount: h } = e,
          [v, b] = (0, l.useState)(u.INTERVALS[0].name),
          [f, g] = (0, l.useState)('1')
        return (
          (0, l.useEffect)(
            () => () => {
              h && h()
            },
            [],
          ),
          l.createElement(a.AdaptiveConfirmDialog, {
            dataName: 'add-custom-interval-dialog',
            title: o.t(null, void 0, n(92746)),
            isOpened: !0,
            onSubmit: () => {
              t(f, v), p()
            },
            onCancel: p,
            onClickOutside: p,
            onClose: p,
            render: () =>
              l.createElement(
                d.TouchScrollContainer,
                { className: c.scrollable, onScroll: x },
                l.createElement(
                  'div',
                  { className: c.content },
                  l.createElement(
                    'div',
                    { className: c.row },
                    l.createElement(
                      'div',
                      { className: c.title },
                      o.t(null, void 0, n(58416)),
                    ),
                    l.createElement(i.Select, {
                      id: 'metric-items',
                      className: c.control,
                      value: v,
                      items: m,
                      onChange: I,
                    }),
                  ),
                  l.createElement(
                    'div',
                    { className: c.row },
                    l.createElement(
                      'div',
                      { className: c.title },
                      o.t(null, void 0, n(69466)),
                    ),
                    l.createElement(r.InputControl, {
                      className: c.control,
                      inputMode: 'numeric',
                      maxLength: 6,
                      value: f,
                      onChange: C,
                    }),
                  ),
                ),
              ),
            defaultActionOnClose: 'none',
            submitButtonText: o.t(null, void 0, n(54777)),
            submitOnEnterKey: !1,
            fullScreen: !0,
          })
        )
        function C(e) {
          const { value: t } = e.currentTarget
          ;/^[0-9]*$/.test(t) && g(t)
        }
        function x() {
          s.globalCloseDelegate.fire()
        }
        function I(e) {
          b(e)
        }
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>'
    },
    86240: (e) => {
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      )
    },
    20036: (e) => {
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
    80395: (e) => {
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
    92746: (e) => {
      e.exports = {
        ar: ['إضافة فترة زمنية مخصصة'],
        ca_ES: ['Afegeix interval de temps personalitzat'],
        cs: 'Add custom time interval',
        de: ['Individuelles Zeit Interval hinzufügen'],
        el: 'Add custom time interval',
        en: 'Add custom time interval',
        es: ['Añadir intervalo de tiempo personalizado'],
        fa: 'Add custom time interval',
        fr: ['Ajouter un intervalle de temps personnalisé'],
        he_IL: ['הוסף אינטרוול זמן מותאם אישית'],
        hu_HU: 'Add custom time interval',
        id_ID: ['Tambahkan interval waktu khusus'],
        it: ['Aggiungi timeframe personalizzato'],
        ja: ['カスタム時間足を追加'],
        ko: ['커스텀 타임 인터벌 넣기'],
        ms_MY: ['Tambah selang masa tersuai'],
        nl_NL: 'Add custom time interval',
        pl: ['Dodaj niestandardowy przedział czasowy'],
        pt: ['Adicionar um tempo gráfico personalizado'],
        ro: 'Add custom time interval',
        ru: ['Добавить свой временной интервал'],
        sv: ['Lägg till anpassat tidsintervall'],
        th: ['เพิ่มช่วงเวลาแบบกำหนดเอง'],
        tr: ['Özel zaman aralığı ekle'],
        vi: ['Thêm khoảng thời gian tùy chỉnh'],
        zh: ['添加自定义事件周期'],
        zh_TW: ['增加自訂時間周期'],
      }
    },
    69466: (e) => {
      e.exports = {
        ar: ['الفاصل الزمني'],
        ca_ES: 'Interval',
        cs: 'Interval',
        de: ['Intervall'],
        el: 'Interval',
        en: 'Interval',
        es: ['Intervalo'],
        fa: ['بازه زمانی'],
        fr: ['Intervalle'],
        he_IL: ['אינטרוול'],
        hu_HU: ['Időköz'],
        id_ID: 'Interval',
        it: ['Timeframe'],
        ja: ['時間足'],
        ko: ['인터벌'],
        ms_MY: ['Selang Masa'],
        nl_NL: 'Interval',
        pl: ['Interwał'],
        pt: ['Tempo Gráfico'],
        ro: 'Interval',
        ru: ['Интервал'],
        sv: ['Intervall'],
        th: ['ช่วงเวลา'],
        tr: ['Aralık'],
        vi: ['Khoảng thời gian'],
        zh: ['周期'],
        zh_TW: ['週期'],
      }
    },
    68988: (e) => {
      e.exports = {
        ar: ['موافق'],
        ca_ES: ['Acceptar'],
        cs: 'Ok',
        de: 'Ok',
        el: 'Ok',
        en: 'Ok',
        es: ['Aceptar'],
        fa: 'Ok',
        fr: ["D'accord"],
        he_IL: ['אוקיי'],
        hu_HU: ['Oké'],
        id_ID: 'Ok',
        it: 'Ok',
        ja: ['OK'],
        ko: ['확인'],
        ms_MY: 'Ok',
        nl_NL: 'Ok',
        pl: 'Ok',
        pt: 'Ok',
        ro: 'Ok',
        ru: ['Ок'],
        sv: ['OK'],
        th: ['ตกลง'],
        tr: ['Tamam'],
        vi: 'Ok',
        zh: ['确认'],
        zh_TW: ['確認'],
      }
    },
    58416: (e) => {
      e.exports = {
        ar: ['نوع'],
        ca_ES: ['Tipus'],
        cs: ['Typ'],
        de: ['Typ'],
        el: ['Τύπος'],
        en: 'Type',
        es: ['Tipo'],
        fa: ['نوع'],
        fr: 'Type',
        he_IL: ['סוג'],
        hu_HU: ['Típus'],
        id_ID: ['Tipe'],
        it: ['Tipo'],
        ja: ['タイプ'],
        ko: ['타입'],
        ms_MY: ['Jenis'],
        nl_NL: 'Type',
        pl: ['Typ'],
        pt: ['Tipo'],
        ro: 'Type',
        ru: ['Тип'],
        sv: ['Typ'],
        th: ['ประเภท'],
        tr: ['Tip'],
        vi: ['Loại'],
        zh: ['类型'],
        zh_TW: ['種類'],
      }
    },
  },
])
