;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5001],
  {
    796129: (i) => {
      i.exports = {
        scrollable: 'scrollable-LaEx6V_s',
        content: 'content-LaEx6V_s',
        input: 'input-LaEx6V_s',
        endSlot: 'endSlot-LaEx6V_s',
        message: 'message-LaEx6V_s',
        estimation: 'estimation-LaEx6V_s',
        label: 'label-LaEx6V_s',
      }
    },
    648017: (i, t, e) => {
      e.r(t), e.d(t, { PartiallyClosingDialog: () => c })
      var n = e(609838),
        o = e(50959),
        a = e(302946),
        s = e(960521),
        l = e(742554),
        m = e(370981),
        r = e(180185)
      var u = e(587125),
        p = e(941668),
        y = e(793361),
        d = e(796129)
      function c(i) {
        const {
            positionOrIndividualPosition: t,
            qtyFormatter: c,
            supportLots: h,
            qtyLabel: Q,
            qtyStep: f,
            uiQtyStep: v,
            minQty: g,
            message: _,
            onClose: k,
            dialogActionHandler: b,
            onOpen: z,
          } = i,
          x = (0, o.useMemo)(() => Math.abs(t.qty), [t.qty]),
          [L, S] = (0, o.useState)(!0),
          [q, E] = (0, o.useState)(!1),
          [T, I] = (0, o.useState)(x),
          [D, N] = (0, o.useState)(!1),
          [w, P] = (0, o.useState)(!1),
          [j, M] = (0, o.useState)(),
          C = (() => {
            const [i, t] = (0, o.useState)(!window.navigator.onLine),
              e = (i) => t('offline' === i.type)
            return (
              (0, o.useEffect)(
                () => (
                  window.addEventListener('online', e),
                  window.addEventListener('offline', e),
                  () => {
                    window.removeEventListener('online', e),
                      window.removeEventListener('offline', e)
                  }
                ),
              ),
              i
            )
          })(),
          W = !w && null !== T && T < x
        ;(0, o.useEffect)(() => {
          let i
          const t = new s.Big(x),
            o = null !== T ? new s.Big(T) : null,
            a = null == o ? void 0 : o.minus(g).mod(f)
          null === o
            ? (i = n.t(null, void 0, e(706035)))
            : o.gt(t)
              ? (i = n.t(null, void 0, e(28136)))
              : !o.eq(t) && o.lt(g)
                ? (i = n
                    .t(null, void 0, e(290371))
                    .replace('{minQty}', String(g)))
                : !o.eq(t) && t.minus(o).lt(g)
                  ? (i = n
                      .t(null, void 0, e(521644))
                      .replace('{minQty}', String(g)))
                  : o.eq(t) ||
                    (null == a ? void 0 : a.eq(0)) ||
                    (i = n
                      .t(null, void 0, e(757077))
                      .replace('{step}', String(f))),
            P(D || void 0 !== i),
            M(i)
        }, [D, T, x, f, g]),
          (0, o.useEffect)(() => {
            C && O()
          }, [C, O])
        const H = (0, o.useMemo)(
            () => (null !== T ? (0, y.splitThousands)(c.format(T), ' ') : ''),
            [T, c],
          ),
          U = (0, o.useMemo)(
            () =>
              null !== T
                ? (0, y.splitThousands)(
                    c.format(new s.Big(x).minus(T).toNumber()),
                    ' ',
                  )
                : '',
            [T, x, c],
          ),
          Y =
            q && null !== T && T < x
              ? n.t(null, void 0, e(630392))
              : n.t(null, void 0, e(424356))
        return o.createElement(p.CreateConfirmDialog, {
          isOpen: L,
          isOpened: L,
          submitButtonDisabled: q && w,
          render: () => {
            const i = (0, y.splitThousands)(c.format(x), ' '),
              s = n
                .t(
                  null,
                  {
                    context: 'close_position_total',
                    plural: 'of {positionQty} lots',
                    count: x,
                  },
                  e(588465),
                )
                .replace('{positionQty}', i),
              m = n
                .t(
                  null,
                  {
                    context: 'close_position_total',
                    plural: 'of {positionQty} units',
                    count: x,
                  },
                  e(185007),
                )
                .replace('{positionQty}', i),
              r = n
                .t(
                  null,
                  {
                    context: 'close_position_total',
                    plural: 'of {positionQty}',
                    count: x,
                  },
                  e(97366),
                )
                .replace('{positionQty}', `${i} ${Q}`)
            let p = m
            h && (p = s)
            Q && (p = r)
            return o.createElement(
              l.TouchScrollContainer,
              { className: d.scrollable, onScroll: K },
              o.createElement(
                'div',
                { className: d.content },
                o.createElement('div', { className: d.message }, _),
                o.createElement(a.Checkbox, {
                  name: 'partially-close-checkbox',
                  label: o.createElement(
                    'span',
                    { className: d.label },
                    n.t(null, void 0, e(381569)),
                  ),
                  checked: q,
                  onChange: R,
                  disabled: !1,
                  indeterminate: !1,
                  labelPositionReverse: !1,
                }),
                q &&
                  o.createElement(
                    'form',
                    { onSubmit: B },
                    o.createElement(u.NumberInput, {
                      error: w,
                      errorMessage: j,
                      errorHandler: V,
                      className: d.input,
                      value: T,
                      useFormatter: !0,
                      formatter: c,
                      forceShowControls: !0,
                      min: g,
                      step: f,
                      uiStep: v,
                      mode: 'float',
                      onValueChange: F,
                      onEmptyString: A,
                      endSlot: o.createElement(
                        'p',
                        { className: d.endSlot },
                        p,
                      ),
                    }),
                    W &&
                      o.createElement(
                        'div',
                        { className: d.estimation },
                        o.createElement(
                          'div',
                          null,
                          n
                            .t(null, void 0, e(17693))
                            .replace('{symbol}', t.symbol)
                            .replace('{quantity}', H),
                        ),
                        o.createElement(
                          'div',
                          null,
                          n
                            .t(null, void 0, e(381232))
                            .replace('{leavingQty}', U),
                        ),
                      ),
                  ),
              ),
            )
          },
          onClose: O,
          title: n.t(null, void 0, e(424356)),
          onSubmit: B,
          onCancel: () => {},
          onKeyDown: (i) => {
            27 === (0, r.hashFromEvent)(i) && O()
          },
          dataName: 'trading-partial-closing-dialog',
          backdrop: !0,
          submitOnEnterKey: !0,
          defaultActionOnClose: 'none',
          submitButtonText: Y,
          cancelButtonText: n.t(null, void 0, e(620036)),
          onOpen: z,
        })
        function R() {
          E((i) => !i)
        }
        function O() {
          S(!1), b({ status: !1 }), k()
        }
        function B() {
          b(
            q
              ? null === T || w
                ? { status: !1 }
                : { status: !0, qty: T }
              : { status: !0, qty: x },
          ),
            S(!1),
            k()
        }
        function F(i) {
          I(i)
        }
        function A() {
          I(null)
        }
        function V(i) {
          N(i)
        }
        function K() {
          m.globalCloseDelegate.fire()
        }
      }
    },
    941668: (i, t, e) => {
      e.d(t, { CreateConfirmDialog: () => s })
      var n = e(50959),
        o = e(973044)
      const a = n.lazy(async () => ({
          default: (
            await Promise.all([
              e.e(580),
              e.e(8194),
              e.e(4215),
              e.e(3610),
              e.e(3717),
              e.e(1282),
              e.e(7084),
              e.e(3566),
            ]).then(e.bind(e, 976669))
          ).AdaptiveConfirmDialog,
        })),
        s = (0, o.withDialogLazyLoad)(a)
    },
    476007: (i, t, e) => {
      e.d(t, { SplitThousandsFormatter: () => a })
      var n = e(793361),
        o = e(710263)
      class a {
        constructor(i = ' ') {
          this._divider = i
        }
        format(i) {
          const t = (0, n.splitThousands)(i, this._divider)
          return (0, o.isRtl)() ? (0, o.startWithLTR)(t) : t
        }
        parse(i) {
          const t = (0, o.stripLTRMarks)(i).split(this._divider).join(''),
            e = Number(t)
          return isNaN(e) || /e/i.test(t)
            ? { res: !1 }
            : { res: !0, value: e, suggest: this.format(e) }
        }
      }
    },
    97366: (i) => {
      i.exports = {
        ar: [
          'من ‎{positionQty}‎',
          'من ‎{positionQty}‎',
          'من ‎{positionQty}‎',
          'من ‎{positionQty}‎',
          'من ‎{positionQty}‎',
          'من ‎{positionQty}‎',
        ],
        ca_ES: 'of {positionQty}',
        cs: 'of {positionQty}',
        de: ['von {positionQty}', 'von {positionQty}'],
        el: 'of {positionQty}',
        en: 'of {positionQty}',
        es: ['de {positionQty}', 'de {positionQty}'],
        fa: 'of {positionQty}',
        fr: ['de {positionQty}', 'de {positionQty}'],
        he_IL: [
          'מתוך {positionQty}',
          'מתוך {positionQty}',
          'מתוך {positionQty}',
          'מתוך {positionQty}',
        ],
        hu_HU: 'of {positionQty}',
        id_ID: ['dari {positionQty}'],
        it: ['di {positionQty} ', 'di {positionQty}'],
        ja: ['{positionQty}のうちの'],
        ko: ['{positionQty} 개 중'],
        ms_MY: ['untuk {positionQty}'],
        nl_NL: 'of {positionQty}',
        pl: [
          'z {positionQty}',
          'z {positionQty}',
          'z {positionQty}',
          'z {positionQty}',
        ],
        pt: ['de {positionQty}', 'de {positionQty}'],
        ro: 'of {positionQty}',
        ru: [
          'из {positionQty}',
          'из {positionQty}',
          'из {positionQty}',
          'из {positionQty}',
        ],
        sv: 'of {positionQty}',
        th: 'of {positionQty}',
        tr: ['{positionQty} miktarın', '{positionQty} miktarın'],
        vi: ['trong số {positionQty}'],
        zh: ['{positionQty}的'],
        zh_TW: ['{positionQty}的'],
      }
    },
    185007: (i) => {
      i.exports = {
        ar: [
          'لـ {positionQty} وحدة',
          'لـ {positionQty} وحدة',
          'لـ {positionQty} وحدة',
          'لـ {positionQty} وحدات',
          'لـ {positionQty} وحدة',
          'لـ {positionQty} وحدة',
        ],
        ca_ES: ['de {positionQty} unitat', 'de {positionQty} unitats'],
        cs: 'of {positionQty} unit',
        de: ['von {positionQty} Einheit', 'von {positionQty} Einheiten'],
        el: 'of {positionQty} unit',
        en: 'of {positionQty} unit',
        es: ['de {positionQty} unidad', 'de {positionQty} unidades'],
        fa: ['of {positionQty} units'],
        fr: ['de {positionQty} unité', 'de {positionQty} unités'],
        he_IL: [
          'של יחידה {positionQty}',
          'של {positionQty} יחידות',
          'של {positionQty} יחידות',
          'של {positionQty} יחידות',
        ],
        hu_HU: ['of {positionQty} units'],
        id_ID: ['dari {positionQty} unit'],
        it: ['di {positionQty} unità', 'di {positionQty} unità'],
        ja: ['/ {positionQty}ユニット'],
        ko: ['of {positionQty} 유닛'],
        ms_MY: ['untuk unit {positionQty}'],
        nl_NL: 'of {positionQty} unit',
        pl: [
          'z {positionQty} jednostki',
          'z {positionQty} jednostek',
          'z {positionQty} jednostek',
          'z {positionQty} jednostek',
        ],
        pt: ['de {positionQty} unidade', 'de {positionQty} unidades'],
        ro: 'of {positionQty} unit',
        ru: [
          '{positionQty} единицы',
          '{positionQty} единиц',
          '{positionQty} единиц',
          '{positionQty} единиц',
        ],
        sv: ['av {positionQty} enhet', 'av {positionQty} enheter'],
        th: ['ของ {positionQty} หน่วย'],
        tr: ['{positionQty} birimden', '{positionQty} birimden'],
        vi: ['của đơn vị {positionQty}'],
        zh: ['的{positionQty}单位'],
        zh_TW: ['的{positionQty}單位'],
      }
    },
    588465: (i) => {
      i.exports = {
        ar: [
          'لـ {positionQty} عقد',
          'لـ {positionQty} عقد',
          'لـ {positionQty} عقد',
          'لـ {positionQty} عقود',
          'لـ {positionQty} عقداً',
          'لـ {positionQty} عقداً',
        ],
        ca_ES: ['de {positionQty} lot', 'de {positionQty} lots'],
        cs: 'of {positionQty} lot',
        de: ['von {positionQty} Lot', 'von {positionQty} Lots'],
        el: 'of {positionQty} lot',
        en: 'of {positionQty} lot',
        es: ['de {positionQty} lote', 'de {positionQty} lotes'],
        fa: ['of {positionQty} lots'],
        fr: ['de {positionQty} lot', 'de {positionQty} lots'],
        he_IL: [
          'של {positionQty} יחידה',
          'של {positionQty} יחידות',
          'של {positionQty} יחידות',
          'של {positionQty} יחידות',
        ],
        hu_HU: ['of {positionQty} lots'],
        id_ID: ['dari {positionQty} lot'],
        it: ['di {positionQty} lotto', 'di {positionQty} lotti'],
        ja: ['/ {positionQty}ロット'],
        ko: ['of {positionQty} 로트'],
        ms_MY: ['untuk lot {positionQty}'],
        nl_NL: 'of {positionQty} lot',
        pl: [
          'z {positionQty} lota',
          'z {positionQty} lotów',
          'z {positionQty} lotów',
          'z {positionQty} lotów',
        ],
        pt: ['de {positionQty} lot', 'de {positionQty} lots'],
        ro: 'of {positionQty} lot',
        ru: [
          '{positionQty} лота',
          '{positionQty} лотов',
          '{positionQty} лотов',
          '{positionQty} лотов',
        ],
        sv: ['av {positionQty} post', 'av {positionQty} poster'],
        th: ['ของ {positionQty} ล็อต'],
        tr: ['{positionQty} lottan', '{positionQty} lottan'],
        vi: ['của lô {positionQty}'],
        zh: ['的{positionQty}手数'],
        zh_TW: ['的{positionQty}手數'],
      }
    },
    756095: (i) => {
      i.exports = {
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
    146812: (i) => {
      i.exports = {
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
    381232: (i) => {
      i.exports = {
        ar: ['ترك مركز ‎{leavingQty}‎'],
        ca_ES: 'Leaving a position of {leavingQty}',
        cs: 'Leaving a position of {leavingQty}',
        de: ['Übrige Position von {leavingQty}'],
        el: 'Leaving a position of {leavingQty}',
        en: 'Leaving a position of {leavingQty}',
        es: ['Dejar una posición de {leavingQty}'],
        fa: 'Leaving a position of {leavingQty}',
        fr: ['Laisser une position de {leavingQty}'],
        he_IL: ['Leaving פוזיציה של {leavingQty}'],
        hu_HU: 'Leaving a position of {leavingQty}',
        id_ID: ['Meninggalkan posisi sebanyak {leavingQty}'],
        it: ['Posizione rimanente di {leavingQty}'],
        ja: ['残ポジション {leavingQty}'],
        ko: ['{leavingQty} 포지션을 남김'],
        ms_MY: ['Tinggalkan satu posisi {leavingQty}'],
        nl_NL: 'Leaving a position of {leavingQty}',
        pl: ['Zostawiając pozycję {leavingQty}'],
        pt: ['Deixando uma posição de {leavingQty}'],
        ro: 'Leaving a position of {leavingQty}',
        ru: ['Оставить позицию {leavingQty}'],
        sv: ['Lämnar en position med {leavingQty}'],
        th: ['ออกจากตำแหน่ง {leavingQty}'],
        tr: ['{leavingQty} pozisyonundan ayrılıyor'],
        vi: ['Rời bỏ vị thế của {leavingQty}'],
        zh: ['保留{leavingQty}手的仓位'],
        zh_TW: ['保留{leavingQty}手的倉位'],
      }
    },
    535563: (i) => {
      i.exports = {
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
    602607: (i) => {
      i.exports = {
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
    53669: (i) => {
      i.exports = {
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
    290371: (i) => {
      i.exports = {
        ar: ['القيمة المحددة أقل من الحد الأدنى للأداة الذي يعادل {minQty}'],
        ca_ES:
          'Specified value is less than the instrument minimum of {minQty}',
        cs: 'Specified value is less than the instrument minimum of {minQty}',
        de: [
          'Angegebener Wert ist kleiner als das Minimum des Instruments von {minQty}',
        ],
        el: 'Specified value is less than the instrument minimum of {minQty}',
        en: 'Specified value is less than the instrument minimum of {minQty}',
        es: [
          'El valor especificado es inferior al mínimo establecido para el instrumento que es de {minQty}',
        ],
        fa: 'Specified value is less than the instrument minimum of {minQty}',
        fr: [
          "La valeur spécifiée est inférieure au minimum de l'instrument {minQty}",
        ],
        he_IL: ['הערך שצוין קטן מהמינימום של המכשיר של {minQty}'],
        hu_HU:
          'Specified value is less than the instrument minimum of {minQty}',
        id_ID: [
          'Nilai yang ditentukan kurang dari kapasitas minimum instrumennya yaitu {minQty}',
        ],
        it: [
          'Il valore specificato è inferiore al minimo dello strumento ({minQty})',
        ],
        ja: ['指定された値が銘柄の最小値 ({minQty}) 未満です'],
        ko: ['지정한 값이 종목의 최소값인 {minQty} 보다 작습니다'],
        ms_MY: [
          'Nilai yang ditentukan adalah kurang daripada nilai minimum instrumen {minQty}',
        ],
        nl_NL:
          'Specified value is less than the instrument minimum of {minQty}',
        pl: [
          'Określona wartość jest mniejsza niż dozwolone minimum dla instrumentu wynoszące {minQty}',
        ],
        pt: [
          'O valor especificado é menor que o mínimo de {minQty} do instrumento.',
        ],
        ro: 'Specified value is less than the instrument minimum of {minQty}',
        ru: [
          'Указанное значение меньше допустимого минимума для инструмента {minQty}',
        ],
        sv: [
          'Det specificerade värdet är mindre än instrumentminimum för {minQty}',
        ],
        th: ['ค่าที่ระบุน้อยกว่าค่าต่ำสุดของเครื่องมือ {minQty}'],
        tr: [
          'Belirtilen değer, enstrümanın minimum {minQty} değerinden düşüktür',
        ],
        vi: [
          'Giá trị đã chỉ định nhỏ hơn giá trị tối thiểu của công cụ là {minQty}',
        ],
        zh: ['指定值小于商品最小值{minQty}'],
        zh_TW: ['指定值小於商品最小值{minQty}'],
      }
    },
    381569: (i) => {
      i.exports = {
        ar: ['إغلاق جزئي'],
        ca_ES: 'Partial close',
        cs: 'Partial close',
        de: ['Teil-Schliessung'],
        el: 'Partial close',
        en: 'Partial close',
        es: ['Cierre parcial'],
        fa: 'Partial close',
        fr: ['Fermeture partielle'],
        he_IL: ['סגירה חלקית'],
        hu_HU: 'Partial close',
        id_ID: ['Menutup sebagian'],
        it: ['Chiusura parziale'],
        ja: ['部分決済'],
        ko: ['일부 청산'],
        ms_MY: ['Tutup separa'],
        nl_NL: 'Partial close',
        pl: ['Częściowe zamknięcie'],
        pt: ['Fechamento parcial'],
        ro: 'Partial close',
        ru: ['Частичное закрытие'],
        sv: ['Delvis stängning'],
        th: ['ปิดบางส่วน'],
        tr: ['Kısmi kapanış'],
        vi: ['Đóng một phần'],
        zh: ['部分平仓'],
        zh_TW: ['部分平倉'],
      }
    },
    630392: (i) => {
      i.exports = {
        ar: ['مغلق جزئياً'],
        ca_ES: 'Partially close',
        cs: 'Partially close',
        de: ['Teilschliessung'],
        el: 'Partially close',
        en: 'Partially close',
        es: ['Parcialmente ejecutado'],
        fa: 'Partially close',
        fr: ['Fermer partiellement'],
        he_IL: ['סגירה חלקית'],
        hu_HU: 'Partially close',
        id_ID: ['Ditutup sebagian'],
        it: ['Chiudi parzialmente'],
        ja: ['部分決済'],
        ko: ['부분 클로즈'],
        ms_MY: ['Tutup sebahagian'],
        nl_NL: 'Partially close',
        pl: ['Zamknij częściowo'],
        pt: ['Fechamento parcial'],
        ro: 'Partially close',
        ru: ['Частично закрыть'],
        sv: ['Delvis stängd'],
        th: ['ปิดบางส่วน'],
        tr: ['Kısmen yakın'],
        vi: ['Đóng một phần'],
        zh: ['部分平仓'],
        zh_TW: ['部分平倉'],
      }
    },
    17693: (i) => {
      i.exports = {
        ar: ['إغلاق جزئي لـ {symbol} {quantity}'],
        ca_ES: 'Partially close {symbol} {quantity}',
        cs: 'Partially close {symbol} {quantity}',
        de: ['Teilschliessung {symbol} {quantity}'],
        el: 'Partially close {symbol} {quantity}',
        en: 'Partially close {symbol} {quantity}',
        es: ['Parcialmente cerrado {quantity} {symbol}'],
        fa: 'Partially close {symbol} {quantity}',
        fr: ['Fermer partiellement {quantity} {symbol}'],
        he_IL: ['סגור חלקית ‎{symbol}‎ {quantity}'],
        hu_HU: 'Partially close {symbol} {quantity}',
        id_ID: ['Menutup sebagian {symbol} {quantity}'],
        it: ['Chiusura parziale di {quantity}{symbol}'],
        ja: ['分割決済 {symbol} {quantity}'],
        ko: ['일부 청산 {symbol} {quantity}'],
        ms_MY: ['Tutup sebahagian {symbol} {quantity}'],
        nl_NL: 'Partially close {symbol} {quantity}',
        pl: ['Zamknij częściowo {symbol} {quantity}'],
        pt: ['Fechamento parcial {quantity} {symbol}'],
        ro: 'Partially close {symbol} {quantity}',
        ru: ['Частично закрыть позицию по {symbol}, {quantity}'],
        sv: ['Delvis stängd {symbol} {quantity}'],
        th: ['ปิดบางส่วน {quantity} {symbol}'],
        tr: ['{symbol} {quantity} kısmen kapat'],
        vi: ['Đóng một phần {symbol} {quantity}'],
        zh: ['部分平仓{symbol}{quantity}'],
        zh_TW: ['部分平倉{symbol}{quantity}'],
      }
    },
    521644: (i) => {
      i.exports = {
        ar: [
          'الكمية المتبقية من المركز أقل من الحد الأدنى للأداة الذي يعادل {minQty}',
        ],
        ca_ES:
          'Remaining quantity of position is less than the instrument minimum of {minQty}',
        cs: 'Remaining quantity of position is less than the instrument minimum of {minQty}',
        de: [
          'Verbleibende Positionsmenge ist kleiner als das Minimum des Instruments von {minQty}',
        ],
        el: 'Remaining quantity of position is less than the instrument minimum of {minQty}',
        en: 'Remaining quantity of position is less than the instrument minimum of {minQty}',
        es: [
          'La cantidad restante de la posición es inferior al mínimo establecido para el instrumento que es de {minQty}',
        ],
        fa: 'Remaining quantity of position is less than the instrument minimum of {minQty}',
        fr: [
          "La quantité restante de la position est inférieure au minimum de l'instrument {minQty}",
        ],
        he_IL: ['כמות הפוזיציה הנותרת קטנה מהמינימום של המכשיר של {minQty}'],
        hu_HU:
          'Remaining quantity of position is less than the instrument minimum of {minQty}',
        id_ID: [
          'Kuantitas posisi yang tersisa kurang dari kapasitas minimum instrumennya yaitu {minQty}',
        ],
        it: [
          'La dimensione residua della posizione è inferiore al minimo consentito per lo strumento ({minQty})',
        ],
        ja: ['ポジションの残数量が銘柄の最小値 ({minQty}) 未満です'],
        ko: ['남은 포지션 수량은 종목 최소값인 {minQty} 보다 작습니다'],
        ms_MY: [
          'Kuantiti posisi yang tinggal adalah kurang daripada minimum instrumen {minQty}',
        ],
        nl_NL:
          'Remaining quantity of position is less than the instrument minimum of {minQty}',
        pl: [
          'Pozostała wielkość pozycji jest mniejsza niż dozwolone minimum dla instrumentu wynoszące {minQty}',
        ],
        pt: [
          'A quantidade restante de posição é menor que o mínimo de {minQty} do instrumento.',
        ],
        ro: 'Remaining quantity of position is less than the instrument minimum of {minQty}',
        ru: [
          'Оставшееся количество меньше допустимого минимума для инструмента {minQty}',
        ],
        sv: [
          'Resterande kvantitet av denna position är mindre än instrumentets minimum av {minQty}.',
        ],
        th: ['จำนวนตำแหน่งคงเหลือน้อยกว่าขั้นต่ำของเครื่องมือ {minQty}'],
        tr: [
          'Kalan pozisyon miktarı, enstrümanın minimum {minQty} değerinden azdır',
        ],
        vi: [
          'Số lượng vị thế còn lại nhỏ hơn mức tối thiểu của công cụ là {minQty}',
        ],
        zh: ['剩余仓位数量小于商品最小值{minQty}'],
        zh_TW: ['剩餘倉位數量小於商品最小值{minQty}'],
      }
    },
    28136: (i) => {
      i.exports = {
        ar: ['يتجاوز المبلغ الذي تم إدخاله حجم الصفقة'],
        ca_ES: 'The amount entered exceeds the position size',
        cs: 'The amount entered exceeds the position size',
        de: ['Der eingegebene Betrag überschreitet die Positionsgröße'],
        el: 'The amount entered exceeds the position size',
        en: 'The amount entered exceeds the position size',
        es: ['La cantidad introducida supera el tamaño de la posición'],
        fa: 'The amount entered exceeds the position size',
        fr: ['Le montant saisi dépasse la taille de la position'],
        he_IL: ['הסכום שהוזן חורג מגודל הפוזיציה'],
        hu_HU: 'The amount entered exceeds the position size',
        id_ID: ['Jumlah yang dimasukkan melebihi ukuran posisi'],
        it: ["L'importo inserito supera la dimensione della posizione"],
        ja: ['入力数値がポジションサイズを超えています'],
        ko: ['입력한 금액이 포지션 크기를 초과합니다.'],
        ms_MY: ['Jumlah dimasukkan melebihi saiz posisi'],
        nl_NL: 'The amount entered exceeds the position size',
        pl: ['Wprowadzona kwota przekracza rozmiar pozycji'],
        pt: ['O valor inserido excede o tamanho da posição'],
        ro: 'The amount entered exceeds the position size',
        ru: ['Введённая сумма превышает размер позиции'],
        sv: ['Det inmatade beloppet överstiger positionens storlek'],
        th: 'The amount entered exceeds the position size',
        tr: ['Girilen miktar pozisyon boyutunu aşıyor'],
        vi: ['Số tiền nhập vào vượt quá kích cỡ vị thế'],
        zh: ['输入的金额超过仓位大小'],
        zh_TW: ['輸入的金額超過部位大小'],
      }
    },
    757077: (i) => {
      i.exports = {
        ar: ['القيمة المحددة ليست من مضاعفات ‎{step}‎'],
        ca_ES: 'The specified value is not a multiple of {step}',
        cs: 'The specified value is not a multiple of {step}',
        de: ['Der angegebene Wert ist kein Vielfaches von {step}'],
        el: 'The specified value is not a multiple of {step}',
        en: 'The specified value is not a multiple of {step}',
        es: ['El valor especificado no es un múltiplo de {step}'],
        fa: 'The specified value is not a multiple of {step}',
        fr: ["La valeur spécifiée n'est pas un multiple de {step}"],
        he_IL: ['הערך שצוין אינו מכפיל של {step}'],
        hu_HU: 'The specified value is not a multiple of {step}',
        id_ID: ['Nilai yang ditentukan bukan kelipatan dari {step}'],
        it: ['Il valore specificato non è un multiplo di {step}'],
        ja: ['指定された値が {step} の倍数ではありません。'],
        ko: ['지정한 값은 {step}의 배수가 아닙니다.'],
        ms_MY: ['Nilai yang ditentukan adalah bukan {step} berganda'],
        nl_NL: 'The specified value is not a multiple of {step}',
        pl: ['Podana wartość nie jest wielokrotnością {step}'],
        pt: ['O valor especificado não é um múltiplo de {step}'],
        ro: 'The specified value is not a multiple of {step}',
        ru: ['Указанное значение не кратно {step}'],
        sv: ['Det angivna värdet är inte en multipel av {step}'],
        th: ['ค่าที่ระบุไม่ใช่ผลคูณของ {step}'],
        tr: ['Belirtilen değer {step} ile çarpılabilen değil'],
        vi: ['Giá trị được chỉ định không phải là bội số của {step}'],
        zh: ['指定的值不是{step}的倍数'],
        zh_TW: ['指定的值不是{step}的倍數'],
      }
    },
  },
])
