;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8751],
  {
    106315: (e) => {
      e.exports = {
        dialog: 'dialog-YZ_qHmON',
        dialogBody: 'dialogBody-YZ_qHmON',
      }
    },
    608987: (e) => {
      e.exports = {
        positionInfo: 'positionInfo-oWbWR7tt',
        title: 'title-oWbWR7tt',
      }
    },
    583014: (e) => {
      e.exports = { positionPanel: 'positionPanel-vffbLvO_' }
    },
    398327: (e) => {
      e.exports = {
        positionWidget: 'positionWidget-mbUCea4m',
        separator: 'separator-mbUCea4m',
        brackets: 'brackets-mbUCea4m',
        customFieldsWrapper: 'customFieldsWrapper-mbUCea4m',
        infoWrapper: 'infoWrapper-mbUCea4m',
        warning: 'warning-mbUCea4m',
        button: 'button-mbUCea4m',
      }
    },
    904925: (e, t, n) => {
      n.d(t, { PopupMenuDisclosureView: () => m })
      var i = n(50959),
        o = n(624216),
        a = n(650151)
      const r = { x: 0, y: 0 }
      function s(e, t, n) {
        return (0, i.useCallback)(
          () =>
            ((e, t, { x: n = r.x, y: i = r.y } = r) => {
              const o = (0, a.ensureNotNull)(e).getBoundingClientRect(),
                s = {
                  x: o.left + n,
                  y: o.top + o.height + i,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                }
              return t && (s.overrideWidth = o.width), s
            })(e.current, t, n),
          [e, t],
        )
      }
      var l = n(586240)
      const d = Number.parseInt(l['size-header-height'])
      function m(e) {
        const {
            button: t,
            popupChildren: n,
            buttonRef: a,
            listboxId: r,
            listboxClassName: l,
            listboxTabIndex: m,
            matchButtonAndListboxWidths: u,
            isOpened: c,
            scrollWrapReference: p,
            listboxReference: h,
            onClose: f,
            onOpen: v,
            onListboxFocus: g,
            onListboxBlur: b,
            onListboxKeyDown: k,
            listboxAria: _,
            repositionOnScroll: x = !0,
            closeOnHeaderOverlap: C = !1,
            popupPositionCorrection: y = { x: 0, y: 0 },
            popupPosition: P,
          } = e,
          E = s(a, u, y),
          T = C ? d : 0
        return i.createElement(
          i.Fragment,
          null,
          t,
          i.createElement(
            o.PopupMenu,
            {
              ..._,
              id: r,
              className: l,
              tabIndex: m,
              isOpened: c,
              position: P || E,
              repositionOnScroll: x,
              onClose: f,
              onOpen: v,
              doNotCloseOn: a.current,
              reference: h,
              scrollWrapReference: p,
              onFocus: g,
              onBlur: b,
              onKeyDown: k,
              closeOnScrollOutsideOffset: T,
            },
            n,
          ),
        )
      }
    },
    953517: (e, t, n) => {
      n.d(t, {
        useKeyboardActionHandler: () => i.useKeyboardActionHandler,
        useKeyboardClose: () => i.useKeyboardClose,
        useKeyboardEventHandler: () => i.useKeyboardEventHandler,
        useKeyboardOpen: () => i.useKeyboardOpen,
        useKeyboardToggle: () => i.useKeyboardToggle,
      })
      var i = n(865968)
    },
    382799: (e, t, n) => {
      n.r(t),
        n.d(t, {
          closePositionDialog: () => O,
          mountPositionPanel: () => W,
          showPositionDialog: () => R,
          unmountPositionPanel: () => L,
        })
      var i = n(50959),
        o = n(500962),
        a = n(930894),
        r = n(40766),
        s = n(930052),
        l = n(601227),
        d = n(180185),
        m = n(918460),
        u = n(6835),
        c = n(650151),
        p = n(901317),
        h = n(795820),
        f = n(788865),
        v = n(447538),
        g = n(363111),
        b = n(661851),
        k = n(564245),
        _ = n(608987)
      function x(e) {
        const { model: t } = e,
          n = (0, b.useObservable)(t.infoTableData$, { rows: [] })
        return i.createElement(
          'div',
          { className: _.positionInfo },
          i.createElement('div', { className: _.title }, t.title()),
          i.createElement(k.InfoTable, {
            rows: n.rows,
            header: n.header,
            disabled: !1,
            rightAlignedValues: !0,
          }),
        )
      }
      var C = n(40176),
        y = n(895318),
        P = n(398327)
      const E = (0, u.getLogger)('Trading.OrderPanel')
      function T(e) {
        const { model: t, settings: n, focus: o } = e,
          a = (0, i.useRef)(null),
          [r] = (0, p.useWatchedValue)(t.status),
          [s] = (0, p.useWatchedValue)(t.warning)
        ;(0, i.useEffect)(() => {
          null !== a.current && void 0 === o && a.current.focus()
        }, [])
        const u = (0, i.useCallback)(
            (e) => {
              const n = (0, d.hashFromEvent)(e)
              ;(13 !== n && n !== d.hashShiftPlusEnter) ||
                t.disabled.value() ||
                (l.CheckMobile.any()
                  ? document.activeElement instanceof HTMLElement
                    ? document.activeElement.blur()
                    : E.logWarn(
                        'Failed to deselect: active element is not HTMLElement',
                      )
                  : t.doneButtonClick())
            },
            [t],
          ),
          b = t.customFieldsModel.getCustomFieldsModels(),
          k = ((e) =>
            e.mode.value() === g.OrderEditorDisplayMode.Panel &&
            null !== e.positionInfoModel &&
            e.positionInfoModel.getOrderInfoTableRowsCount() > 0)(t)
        return i.createElement(
          y.OrderTicketSettingsProvider,
          { settings: n },
          i.createElement(
            'div',
            { className: P.positionWidget, onKeyDown: u, tabIndex: -1, ref: a },
            t.mode.value() === g.OrderEditorDisplayMode.Popup &&
              i.createElement(h.HeaderContainer, { ...t.headerStateValue }),
            i.createElement(
              'div',
              { className: P.brackets },
              i.createElement(f.BracketControlGroup, { model: t, focus: o }),
            ),
            b.length > 0 &&
              i.createElement(
                'div',
                { className: P.customFieldsWrapper },
                i.createElement('div', { className: P.separator }),
                i.createElement(C.CustomFields, {
                  customFieldModels: b,
                  orderPanelStatus: r,
                }),
              ),
            s &&
              i.createElement(m.Informer, {
                className: P.warning,
                content: s,
                informerIntent: 'default',
              }),
            void 0 !== t.buttonModel &&
              i.createElement(
                'div',
                { className: P.button },
                i.createElement(v.PlaceAndModifyButton, {
                  model: t,
                  buttonModel: t.buttonModel,
                }),
              ),
            k &&
              i.createElement(
                'div',
                { className: P.infoWrapper },
                i.createElement('div', { className: P.separator }),
                i.createElement(x, {
                  'data-name': 'position-info',
                  model: (0, c.ensureNotNull)(t.positionInfoModel),
                }),
              ),
          ),
        )
      }
      var S = n(996038),
        I = n(274837),
        N = n(106315)
      const M = i.memo((e) => {
        const {
          model: t,
          isOpened: n,
          settings: o,
          focus: l,
          onOpen: d,
          onClose: m,
        } = e
        return (
          (0, I.useCommonDialogHandlers)({
            isOpened: n,
            onOpen: d,
            onClose: m,
          }),
          i.createElement(
            s.MatchMedia,
            { rule: S.DialogBreakpoints.TabletSmall },
            (e) =>
              i.createElement(
                r.PopupDialog,
                {
                  className: N.dialog,
                  isOpened: n,
                  onKeyDown: u,
                  width: 414,
                  fullscreen: e,
                },
                i.createElement(
                  a.Body,
                  { className: N.dialogBody },
                  i.createElement(T, {
                    settings: o,
                    model: t,
                    key: t.id,
                    focus: l,
                  }),
                ),
              ),
          )
        )
        function u(e) {
          27 === e.keyCode &&
            (null == t || t.onDoneButtonClicked.resolve(!1), null == m || m())
        }
      })
      var D = n(583014)
      class w extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._onKeyDown = (e) => {
              27 === e.keyCode && this.props.onCancel && this.props.onCancel()
            })
        }
        render() {
          return i.createElement(
            'div',
            {
              'data-name': 'position-panel',
              className: D.positionPanel,
              onKeyDown: this._onKeyDown,
            },
            i.createElement(T, {
              settings: this.props.settings,
              model: this.props.model,
              focus: this.props.focus,
              key: this.props.model.id,
            }),
          )
        }
      }
      let z = null
      function R(e) {
        const { viewModel: t, settings: n, focus: a, onClose: r, onOpen: s } = e
        O(r)
        const l = {
          model: t,
          settings: n,
          isOpened: !0,
          focus: a,
          onOpen: s,
          onClose: () => {
            O(r),
              void 0 !== l.onClose &&
                (t.headerModel.pinButtonClicked().unsubscribe(null, l.onClose),
                t.headerModel.closeButtonClicked().unsubscribe(null, l.onClose))
          },
        }
        !((e) => {
          ;(z = document.createElement('div')),
            document.body.appendChild(z),
            o.render(
              i.createElement(
                g.Context.Provider,
                {
                  value: {
                    mode: e.model.mode.value(),
                    supportTrailingStop: Boolean(e.model.supportTrailingStop()),
                  },
                },
                i.createElement(M, { ...e }),
              ),
              z,
            )
        })(l),
          void 0 !== l.onClose &&
            (t.headerModel.pinButtonClicked().subscribe(null, l.onClose),
            t.headerModel.closeButtonClicked().subscribe(null, l.onClose))
      }
      function O(e) {
        z && (o.unmountComponentAtNode(z), (z = null), null == e || e())
      }
      function W(e, t, n, a) {
        L(n)
        const r = {
          model: e,
          settings: t,
          focus: a,
          onClose: () => {
            L(n),
              r.model.headerModel
                .pinButtonClicked()
                .unsubscribe(null, r.onClose),
              r.model.headerModel
                .closeButtonClicked()
                .unsubscribe(null, r.onClose)
          },
          onCancel: () => {
            r.model.headerModel && r.model.headerModel.back()
          },
        }
        r.model.headerModel.pinButtonClicked().subscribe(null, r.onClose),
          r.model.headerModel.closeButtonClicked().subscribe(null, r.onClose),
          ((e, t) => {
            const n = i.createElement(
              g.Context.Provider,
              {
                value: {
                  mode: e.model.mode.value(),
                  supportTrailingStop: Boolean(e.model.supportTrailingStop()),
                },
              },
              i.createElement(w, { ...e }),
            )
            o.render(n, t)
          })(r, n)
      }
      function L(e) {
        o.unmountComponentAtNode(e)
      }
    },
    782806: (e) => {
      e.exports = {
        ar: ['تغيير نوع أمر وقف الخسارة'],
        ca_ES: 'Change stop order type',
        cs: 'Change stop order type',
        de: ['Ändert Stop-Order Typ'],
        el: 'Change stop order type',
        en: 'Change stop order type',
        es: [
          'Cambiar el tipo de órdenes con punto máximo de pérdida (stop loss)',
        ],
        fa: 'Change stop order type',
        fr: ['Changer le type de stop order'],
        he_IL: ['שנה את סוג פקודת הסטופ'],
        hu_HU: 'Change stop order type',
        id_ID: ['Ubah tipe order stop'],
        it: ['Cambia tipo di ordine stop'],
        ja: ['ストップ注文の種類を変更'],
        ko: ['스탑 오더 타입 바꾸기'],
        ms_MY: ['Tukar jenis pesanan hentian'],
        nl_NL: 'Change stop order type',
        pl: ['Zmień typ zlecenia stop'],
        pt: ['Mudar tipo da Ordem Stop'],
        ro: 'Change stop order type',
        ru: ['Изменить тип стоп-заявки'],
        sv: ['Ändra typ av limiterad order'],
        th: ['เปลี่ยนประเภทของ Stop Order'],
        tr: ['Durdurma emri tipini değiştir'],
        vi: ['Thay đổi loại lệnh stop'],
        zh: ['更改止损订单类型'],
        zh_TW: ['更改停損單類型'],
      }
    },
    756095: (e) => {
      e.exports = {
        ar: ['تخفيض'],
        ca_ES: ['Redueix'],
        cs: 'Decrease',
        de: ['Verringern'],
        el: 'Decrease',
        en: 'Decrease',
        es: ['Reducir'],
        fa: 'Decrease',
        fr: ['Diminuer'],
        he_IL: ['לְהַקְטִין'],
        hu_HU: 'Decrease',
        id_ID: ['Menurun'],
        it: ['Diminuisci'],
        ja: ['減少'],
        ko: ['줄이기'],
        ms_MY: ['Pengurangan'],
        nl_NL: 'Decrease',
        pl: ['Pomniejsz'],
        pt: ['Diminuir'],
        ro: 'Decrease',
        ru: ['Уменьшить'],
        sv: ['Minska'],
        th: ['ลดลง'],
        tr: ['Azalt'],
        vi: ['Giảm'],
        zh: ['减少'],
        zh_TW: ['減少'],
      }
    },
    146812: (e) => {
      e.exports = {
        ar: ['زيادة'],
        ca_ES: ['Augment'],
        cs: 'Increase',
        de: ['Erhöhen'],
        el: 'Increase',
        en: 'Increase',
        es: ['Aumento'],
        fa: 'Increase',
        fr: ['Augmenter'],
        he_IL: ['גידול'],
        hu_HU: 'Increase',
        id_ID: ['Meningkatkan'],
        it: ['Aumenta'],
        ja: ['増加'],
        ko: ['늘어남'],
        ms_MY: ['Pertambahan'],
        nl_NL: 'Increase',
        pl: ['Zwiększ'],
        pt: ['Aumentar'],
        ro: 'Increase',
        ru: ['Увеличить'],
        sv: ['Öka'],
        th: ['เพิ่มขึ้น'],
        tr: ['Yükseliş'],
        vi: ['Tăng'],
        zh: ['增加'],
        zh_TW: ['增加'],
      }
    },
    535563: (e) => {
      e.exports = {
        ar: ['تنسيق الرقم غير صالح.'],
        ca_ES: ['El format del número no és correcte'],
        cs: 'Number format is invalid.',
        de: ['Ungültiges Zahlenformat'],
        el: 'Number format is invalid.',
        en: 'Number format is invalid.',
        es: ['El formato del número no es correcto.'],
        fa: 'Number format is invalid.',
        fr: ["Le format du numéro n'est pas valide."],
        he_IL: ['פורמט המספר אינו חוקי.'],
        hu_HU: 'Number format is invalid.',
        id_ID: ['Format angka tidak valid.'],
        it: ['Il formato del numero non è valido.'],
        ja: ['数字形式が有効なものではありません。'],
        ko: ['넘버 포맷이 잘못 되었습니다.'],
        ms_MY: ['Format nombor tidak sah.'],
        nl_NL: 'Number format is invalid.',
        pl: ['Błędny format numeru.'],
        pt: ['O formato numérico é inválido.'],
        ro: 'Number format is invalid.',
        ru: ['Неверный формат числа.'],
        sv: ['Nummerformatet är felaktigt.'],
        th: ['รูปแบบตัวเลขไม่ถูกต้อง'],
        tr: ['Numara formatı geçersiz'],
        vi: ['Định dạng số không hợp lệ.'],
        zh: ['号码格式无效。'],
        zh_TW: ['號碼格式無效。'],
      }
    },
    880280: (e) => {
      e.exports = {
        ar: ['اختيار القيمة'],
        ca_ES: 'Select value',
        cs: 'Select value',
        de: ['Wert auswählen'],
        el: 'Select value',
        en: 'Select value',
        es: ['Seleccionar el valor'],
        fa: 'Select value',
        fr: ['Choisir la valeur'],
        he_IL: ['בחר ערך'],
        hu_HU: 'Select value',
        id_ID: ['Memilih nilai'],
        it: ['Selezione valore'],
        ja: ['値を選択'],
        ko: ['값을 고르시오'],
        ms_MY: ['Pilih nilai'],
        nl_NL: 'Select value',
        pl: ['Wybierz wartość'],
        pt: ['Selecionar valor'],
        ro: 'Select value',
        ru: ['Выберите значение'],
        sv: ['Välj värde'],
        th: ['เลือกค่า'],
        tr: ['Değeri seç'],
        vi: ['Chọn giá trị'],
        zh: ['选择值'],
        zh_TW: ['選擇值'],
      }
    },
    602607: (e) => {
      e.exports = {
        ar: ['القيمة المحددة أكبر من الحد الأقصى للأداة والتي تبلغ ‎{max}.'],
        ca_ES: [
          "El valor especificat és més gran que el màxim de l'instrument: {max}",
        ],
        cs: 'Specified value is more than the instrument maximum of {max}.',
        de: [
          'Der angegebene Wert ist größer als das Instrumentenmaximum von {max}.',
        ],
        el: 'Specified value is more than the instrument maximum of {max}.',
        en: 'Specified value is more than the instrument maximum of {max}.',
        es: [
          'El valor especificado es mayor al máximo del instrumento: {max}.',
        ],
        fa: 'Specified value is more than the instrument maximum of {max}.',
        fr: [
          "La valeur spécifiée est supérieure au maximum de {max} de l'instrument.",
        ],
        he_IL: ['הערך שצוין הוא יותר מהמקסימום של המכשיר {max}.'],
        hu_HU: 'Specified value is more than the instrument maximum of {max}.',
        id_ID: [
          'Nilai yang ditentukan lebih dari maksimum instrumen yaitu {max}.',
        ],
        it: [
          'Il valore specificato è superiore al massimo dello strumento: {max}.',
        ],
        ja: ['指定された値が銘柄の最大値 {max} を超えています。'],
        ko: ['지정값이 인스트루먼트 맥시멈인 {max} 보다 큽니다.'],
        ms_MY: [
          'Nilai yang ditentukan adalah lebih daripada instrumen maksimum {max}.',
        ],
        nl_NL: 'Specified value is more than the instrument maximum of {max}.',
        pl: ['Podana wartość nie jest wielokrotnością {max}.'],
        pt: ['O valor especificado é maior que o instrumento máximo de {max}.'],
        ro: 'Specified value is more than the instrument maximum of {max}.',
        ru: ['Указанное значение больше допустимого максимума для {max}.'],
        sv: ['Det angivna värdet är större än instrumentets minimum av {max}.'],
        th: ['ค่าที่ระบุมากกว่าค่าสูงสุดของเครื่องมือ {max}'],
        tr: [
          'Belirtilen değer, enstrümanın en fazla değerinden daha fazladır {max}.',
        ],
        vi: [
          'Giá trị đã chỉ định lớn hơn giá trị tối đa của công cụ là {max}.',
        ],
        zh: ['指定值大于商品最大值{max}。'],
        zh_TW: ['指定值大於商品最大值{max}。'],
      }
    },
    53669: (e) => {
      e.exports = {
        ar: ['القيمة المحددة أقل من الحد الأدنى للأداة والتي تبلغ {min}.'],
        ca_ES: [
          "El valor especificat és més petit que el mínim de l'instrument: {min}",
        ],
        cs: 'Specified value is less than the instrument minimum of {min}.',
        de: [
          'Der angegebene Wert ist kleiner als das Instrumentenminimum von {min}.',
        ],
        el: 'Specified value is less than the instrument minimum of {min}.',
        en: 'Specified value is less than the instrument minimum of {min}.',
        es: ['El valor especificado es menor al mínimo del instrumento: {min}'],
        fa: 'Specified value is less than the instrument minimum of {min}.',
        fr: [
          "La valeur spécifiée est inférieure au minimum de {min} de l'instrument.",
        ],
        he_IL: ['הערך שצוין הוא פחות מהמינימום של המכשיר {min}.'],
        hu_HU: 'Specified value is less than the instrument minimum of {min}.',
        id_ID: [
          'Nilai yang ditentukan kurang dari minimum instrumen yaitu {min}.',
        ],
        it: [
          'Il valore specificato è inferiore al minimo dello strumento: {min}.',
        ],
        ja: ['指定された値が銘柄の最小値 {min} 未満です。'],
        ko: ['지정값이 인스트루먼트 미니멈인 {min} 보다 작습니다.'],
        ms_MY: [
          'Nilai yang ditentukan adalah kurang daripada instrumen minimum {min}.',
        ],
        nl_NL: 'Specified value is less than the instrument minimum of {min}.',
        pl: [
          'Podana wartość jest mniejsza niż minimum instrumentu wynoszące {min}.',
        ],
        pt: ['O valor especificado é maior que o instrumento máximo de {min}.'],
        ro: 'Specified value is less than the instrument minimum of {min}.',
        ru: ['Указанное значение меньше допустимого минимума для {min}.'],
        sv: ['Det angivna värdet är mindre än instrumentets minimum av {min}.'],
        th: ['ค่าที่ระบุน้อยกว่าค่าต่ำสุดของเครื่องมือ {min}'],
        tr: ['Belirtilen değer enstrümanın minimum değerinden küçük {min}.'],
        vi: [
          'Giá trị đã chỉ định nhỏ hơn giá trị tối thiểu của công cụ là {min}.',
        ],
        zh: ['指定值小于商品最小值{min}。'],
        zh_TW: ['指定值小於商品最小值{min}。'],
      }
    },
    778621: (e) => {
      e.exports = {
        ar: ['نقاط'],
        ca_ES: 'Pips',
        cs: 'Pips',
        de: 'Pips',
        el: 'Pips',
        en: 'Pips',
        es: 'Pips',
        fa: 'Pips',
        fr: 'Pips',
        he_IL: ['פיפס'],
        hu_HU: ['Pipek'],
        id_ID: ['Pip'],
        it: ['Pip/Tick'],
        ja: 'Pips',
        ko: ['핍스'],
        ms_MY: ['Pip'],
        nl_NL: 'Pips',
        pl: ['Pipsy'],
        pt: 'Pips',
        ro: 'Pips',
        ru: ['Пипсы'],
        sv: 'Pips',
        th: ['ปิ๊ป'],
        tr: ['Pip'],
        vi: 'Pips',
        zh: ['点数'],
        zh_TW: ['點數'],
      }
    },
    852997: (e) => {
      e.exports = {
        ar: ['نسبة الربح والخسارة من رصيد الحساب'],
        ca_ES: 'Profit & loss as a percentage of the account balance',
        cs: 'Profit & loss as a percentage of the account balance',
        de: ['Gewinn und Verlust als Prozentsatz des Kontosaldos'],
        el: 'Profit & loss as a percentage of the account balance',
        en: 'Profit & loss as a percentage of the account balance',
        es: ['Pérdidas y ganancias como porcentaje del saldo de la cuenta'],
        fa: 'Profit & loss as a percentage of the account balance',
        fr: ['Profits et pertes en pourcentage du solde du compte'],
        he_IL: ['רווח והפסד כאחוז מיתרת החשבון'],
        hu_HU: 'Profit & loss as a percentage of the account balance',
        id_ID: ['Keuntungan & kerugian dalam persentase dari saldo akun'],
        it: ['Profitto e perdita in percentuale rispetto al saldo del conto'],
        ja: ['口座残高の損益割合'],
        ko: ['어카운트 밸런스에 대한 프라핏 & 로스 퍼센티지'],
        ms_MY: ['Untung & rugi sebagai satu peratusan di dalam baki akaun'],
        nl_NL: 'Profit & loss as a percentage of the account balance',
        pl: ['Zysk i strata jako procent salda konta'],
        pt: ['Lucros & prejuízos como uma porcentagem do saldo da conta'],
        ro: 'Profit & loss as a percentage of the account balance',
        ru: ['Прибыль и убыток как процент от баланса счёта'],
        sv: ['Vinst och förlust i procent av kontosaldot'],
        th: ['กำไร & ขาดทุนเป็นเปอร์เซ็นต์ของยอดเงินในบัญชี'],
        tr: ['Hesap bakiyesinin yüzdesi olarak kar & zarar'],
        vi: ['Lãi & lỗ theo tỷ lệ phần trăm của số dư tài khoản'],
        zh: ['损益占账户余额的百分比'],
        zh_TW: ['盈利&虧損佔帳戶餘額的百分比'],
      }
    },
    214078: (e) => {
      e.exports = {
        ar: ['المخاطرة/العائد'],
        ca_ES: 'Risk/Reward',
        cs: 'Risk/Reward',
        de: ['Chance/Risiko'],
        el: 'Risk/Reward',
        en: 'Risk/Reward',
        es: ['Riesgo/Beneficio'],
        fa: 'Risk/Reward',
        fr: ['Risque/Récompense'],
        he_IL: ['סיכון/סיכוי'],
        hu_HU: ['Kockázat/Nyereség'],
        id_ID: ['Risiko/Perolehan'],
        it: ['Rischio/Rendimento'],
        ja: ['リスク・リワード'],
        ko: ['위험/보상'],
        ms_MY: ['Risiko/Ganjaran'],
        nl_NL: 'Risk/Reward',
        pl: ['Ryzyko/Zysk'],
        pt: ['Risco/Retorno'],
        ro: 'Risk/Reward',
        ru: ['Риск/Прибыль'],
        sv: ['Risk/reward'],
        th: ['ความเสี่ยง/ผลตอบแทน'],
        tr: ['Risk/Ödül'],
        vi: ['Rủi ro/Phần thưởng'],
        zh: ['风险/报酬'],
        zh_TW: ['風險/報酬'],
      }
    },
    693251: (e) => {
      e.exports = {
        ar: ['{fieldTitle} (مطلوب)'],
        ca_ES: '{fieldTitle} (required)',
        cs: '{fieldTitle} (required)',
        de: ['{fieldTitle} (notwendig)'],
        el: '{fieldTitle} (required)',
        en: '{fieldTitle} (required)',
        es: ['{fieldTitle} (obligatorio)'],
        fa: '{fieldTitle} (required)',
        fr: ['{fieldTitle} (requis)'],
        he_IL: ['{fieldTitle} (חובה)'],
        hu_HU: '{fieldTitle} (required)',
        id_ID: ['{fieldTitle} (yang dibutuhkan)'],
        it: ['{fieldTitle} (richiesto)'],
        ja: ['{fieldTitle} (必須)'],
        ko: ['{fieldTitle} (필수)'],
        ms_MY: ['{fieldTitle} (diperlukan)'],
        nl_NL: '{fieldTitle} (required)',
        pl: ['{fieldTitle} (wymagane)'],
        pt: ['{fieldTitle} (obrigatório)'],
        ro: '{fieldTitle} (required)',
        ru: ['{fieldTitle} (обязательное поле)'],
        sv: ['{fieldTitle} (krävs)'],
        th: ['{fieldTitle} (จำเป็น)'],
        tr: ['{fieldTitle} (gerekli)'],
        vi: ['{fieldTitle} (bắt buộc)'],
        zh: ['{fieldTitle}（必填）'],
        zh_TW: ['{fieldTitle}（必填）'],
      }
    },
  },
])
