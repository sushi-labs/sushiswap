;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3030],
  {
    31988: (t) => {
      t.exports = {
        separator: 'separator-EI7Qsb2Q',
        scrollable: 'scrollable-EI7Qsb2Q',
      }
    },
    29638: (t, i, e) => {
      e.r(i), e.d(i, { ConfirmInputsDialogRenderer: () => S })
      var r = e(962),
        n = e(50959),
        o = e(11542),
        s = e(50182),
        p = e(59064),
        u = e(86656),
        c = e(39828),
        a = e(57898),
        h = e(49483),
        l = e(31988)
      function d(t) {
        const {
            title: i,
            confirmInputs: r,
            inputsProperty: d,
            studyMetaInfo: S,
            model: y,
            confirmInputsType: D,
            onCancel: f,
            onSubmit: m,
            onClose: T,
            onStudyInputChange: I,
          } = t,
          [_, k] = (0, n.useState)(!0),
          g = (0, n.useMemo)(() => {
            const t = new a.Delegate()
            return {
              isInputsStudy: !0,
              symbolsResolved: () => t,
              resolvedSymbolInfoBySymbol: () => null,
              tempProperties: d,
            }
          }, []),
          z = (0, n.useRef)(null),
          [b, v] = (0, n.useState)(C())
        return (
          (0, n.useEffect)(() => {
            if (!h.CheckMobile.any() && _ && 'symbol' === D && z.current) {
              const t = z.current.querySelector('input')
              t && t.focus()
            }
          }, [_]),
          n.createElement(s.AdaptiveConfirmDialog, {
            dataName: 'confirm-inputs-dialog',
            title: i,
            isOpened: _,
            onSubmit: () => {
              m(d.state().inputs), w()
            },
            onCancel: f,
            onClickOutside: w,
            onClose: w,
            render: () =>
              n.createElement(
                n.Fragment,
                null,
                n.createElement('div', { className: l.separator }),
                n.createElement(
                  u.TouchScrollContainer,
                  { className: l.scrollable, onScroll: E },
                  n.createElement(c.InputsTabContent, {
                    reference: z,
                    property: d,
                    studyMetaInfo: S,
                    model: y,
                    study: g,
                    inputs: r,
                    onStudyInputChange: M,
                  }),
                ),
              ),
            defaultActionOnClose: 'none',
            submitButtonText: o.t(null, void 0, e(73226)),
            submitButtonDisabled: b,
            submitOnEnterKey: !1,
          })
        )
        function E() {
          p.globalCloseDelegate.fire()
        }
        function w() {
          k(!1), T()
        }
        function C() {
          const { inputs: t } = d.state()
          for (const i of r)
            if ('symbol' === i.type && !i.optional && '' === t[i.id]) return !0
          return !1
        }
        function M(t, i) {
          null == I || I(t, i), v(C())
        }
      }
      class S {
        constructor(t, i, e, n, o, s, p, u, c) {
          ;(this._container = document.createElement('div')),
            (this._handleClose = () => {
              r.unmountComponentAtNode(this._container), this._onClose()
            }),
            (this._title = t),
            (this._confirmInputs = i),
            (this._model = s),
            (this._confirmInputsType = n),
            (this._studyMetaInfo = o),
            (this._onSubmit = p),
            (this._onClose = u),
            (this._onStudyInputChange = c),
            (this._inputsProperty = e)
        }
        show() {
          r.render(
            n.createElement(d, {
              title: this._title,
              confirmInputs: this._confirmInputs,
              inputsProperty: this._inputsProperty,
              studyMetaInfo: this._studyMetaInfo,
              model: this._model,
              confirmInputsType: this._confirmInputsType,
              onSubmit: this._onSubmit,
              onCancel: () => {},
              onClose: this._handleClose,
              onStudyInputChange: this._onStudyInputChange,
            }),
            this._container,
          )
        }
      }
    },
    73339: (t, i, e) => {
      e.r(i), e.d(i, { selectInputValuesOnChart: () => u })
      var r = e(50151),
        n = e(33013),
        o = e(11542),
        s = e(64420),
        p = e(88348)
      n.colorsPalette['color-cold-gray-500']
      async function u(t, i, n, u, c) {
        let a
        const h = (0, s.getInputGroups)(i)
        t.model().model()
        for await (const t of h)
          await l(t).catch((t) => {
            throw new Error(t)
          })
        return { customSourceId: void 0, destPane: a }
        async function l(t) {
          if ((0, s.isGroup)(t))
            if ((0, s.isInputInlines)(t)) {
              const i = ((t) => {
                if (2 !== t.length || t[0].type === t[1].type) return null
                return 'price' === t[0].type
                  ? { price: t[0], time: t[1] }
                  : { price: t[1], time: t[0] }
              })(t.children)
              if (i) {
                const { time: r, price: n } = i,
                  s = r.inline
                    ? o.t(
                        null,
                        {
                          replace: {
                            inputInline: r.inline,
                            studyShortDescription: u,
                          },
                        },
                        e(59877),
                      )
                    : o.t(
                        null,
                        { replace: { studyShortDescription: u } },
                        e(80481),
                      ),
                  p = y(t.id)
                await S(t, 'all', null != p ? p : s, r.id, n.id)
              } else for await (const i of t.children) await d(i)
            } else for await (const i of t.children) await l(i)
          else await d(t)
        }
        async function d(t) {
          const i = 'time' === t.type,
            r = i ? 'time' : 'price',
            n = (() => {
              if (t.inline) {
                const i = y(t.inline)
                if (i) return i
              }
              if (t.tooltip) return t.tooltip
              const r = t.name
                  ? o.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: u,
                        },
                      },
                      e(18571),
                    )
                  : o.t(
                      null,
                      { replace: { studyShortDescription: u } },
                      e(42917),
                    ),
                n = t.name
                  ? o.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: u,
                        },
                      },
                      e(58552),
                    )
                  : o.t(
                      null,
                      { replace: { studyShortDescription: u } },
                      e(6083),
                    )
              return i ? r : n
            })(),
            s = i ? t.id : void 0,
            p = i ? void 0 : t.id
          await S(t, r, n, s, p)
        }
        async function S(i, e, o, s, u) {
          const c = await t.requestSelectPoint(
            {
              pointType: e,
              pane: a,
              lineColor: void 0,
              selectPointMode: p.SelectPointMode.Study,
            },
            o,
          )
          void 0 === a && (a = c.pane)
          const h = n.childs().inputs
          h &&
            (s &&
              (0, r.ensureDefined)(h.child(s)).setValue(
                1e3 * (c.point.time || 0),
              ),
            u && (0, r.ensureDefined)(h.child(u)).setValue(c.point.price))
        }
        function y(t) {
          let i
          return (
            c
              .filter((i) => i.inline === t)
              .forEach((t) => {
                t.tooltip && (i = t.tooltip)
              }),
            i
          )
        }
      }
    },
    73226: (t) => {
      t.exports = {
        ar: ['تطبيق'],
        ca_ES: ['Aplicar'],
        cs: ['Použít'],
        de: ['Anwenden'],
        el: ['Εφαρμογή'],
        en: 'Apply',
        es: ['Aplicar'],
        fa: ['اعمال'],
        fr: ['Appliquer'],
        he_IL: ['החל'],
        hu_HU: ['Alkalmaz'],
        id_ID: ['Terapkan'],
        it: ['Applica'],
        ja: ['適用'],
        ko: ['적용'],
        ms_MY: ['Gunakan'],
        nl_NL: ['Toepassen'],
        pl: ['Zastosuj'],
        pt: ['Aplicar'],
        ro: 'Apply',
        ru: ['Применить'],
        sv: ['Verkställ'],
        th: ['บันทึก'],
        tr: ['Uygula'],
        vi: ['Áp dụng'],
        zh: ['应用'],
        zh_TW: ['套用'],
      }
    },
    59877: (t) => {
      t.exports = {
        ar: ['تعيين وقت وسعر {inputInline} لـ {studyShortDescription}'],
        ca_ES: [
          "Establiu l'hora i el preu de {inputInline} per a {studyShortDescription}",
        ],
        cs: 'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        de: [
          'Legen Sie die {inputInline} Zeit und den Preis für {studyShortDescription} fest',
        ],
        el: 'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        en: 'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        es: [
          'Establezca la hora y el precio de {inputInline} para {studyShortDescription}',
        ],
        fa: 'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        fr: [
          "Définissez l'heure et le prix de {inputInline} pour {studyShortDescription}.",
        ],
        he_IL: [
          'הגדר את הזמן והמחיר של {inputInline} עבור {studyShortDescription}',
        ],
        hu_HU:
          'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        id_ID: [
          'Menentukan waktu dan harga {inputInline} untuk {studyShortDescription}',
        ],
        it: [
          'Imposta valori di tempo e prezzo di {inputInline} nello script {studyShortDescription}',
        ],
        ja: ['{studyShortDescription}の{inputInline}に日時と価格を設定'],
        ko: ['{studyShortDescription}에 대한 {inputInline} 시간 및 가격 설정'],
        ms_MY: [
          'Tetapkan masa {inputInline} dan harga untuk {studyShortDescription}',
        ],
        nl_NL:
          'Set the "{inputInline}" time and price for "{studyShortDescription}"',
        pl: ['Ustaw czas i cenę „{inputInline}” dla „{studyShortDescription}”'],
        pt: [
          'Definir o preço e o tempo de "{inputInline}" para "{studyShortDescription}"',
        ],
        ro: [
          'Set the {inputInline} time and price for {studyShortDescription}',
        ],
        ru: [
          'Установить время и цену {inputInline} для {studyShortDescription}',
        ],
        sv: ['Ställ in {inputInline} tid och pris för {studyShortDescription}'],
        th: ['กำหนดเวลาและราคา {inputInline} สำหรับ {studyShortDescription}'],
        tr: ['Saat ve fiyatı ayarlama{inputInline} {studyShortDescription}'],
        vi: ['Đặt {inputInline} thời gian và giá cho {studyShortDescription}'],
        zh: ['为{studyShortDescription}设置{inputInline}时间和价格'],
        zh_TW: ['為{studyShortDescription}設定{inputInline}時間和價格'],
      }
    },
    18571: (t) => {
      t.exports = {
        ar: ['نعيين وقت {inputTitle} لـ {studyShortDescription}'],
        ca_ES: [
          "Establiu l'hora de {inputTitle} per a {studyShortDescription}",
        ],
        cs: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        de: [
          'Legen Sie die {inputTitle} Zeit für {studyShortDescription} fest',
        ],
        el: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        en: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        es: ['Establezca la hora de {inputTitle} para {studyShortDescription}'],
        fa: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        fr: ["Définissez {inputTitle} l'heure pour {studyShortDescription}"],
        he_IL: ['הגדר את הזמן {inputTitle} עבור {studyShortDescription}'],
        hu_HU: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        id_ID: ['Menentukan waktu {inputTitle} untuk {studyShortDescription}'],
        it: [
          'Imposta valore di tempo di {inputTitle} nello script {studyShortDescription}',
        ],
        ja: ['{studyShortDescription}の{inputTitle}に日時を設定'],
        ko: ['{studyShortDescription}에 대한 {inputTitle} 시간 설정'],
        ms_MY: [
          'Tetapkan masa {inputTitle} dan harga untuk {studyShortDescription}',
        ],
        nl_NL: 'Set the "{inputTitle}" time for "{studyShortDescription}"',
        pl: ['Ustaw czas i cenę „{inputTitle}” dla „{studyShortDescription}”'],
        pt: [
          'Definir o tempo de "{inputTitle}" para "{studyShortDescription}"',
        ],
        ro: ['Set the {inputTitle} time for {studyShortDescription}'],
        ru: ['Установить время {inputTitle} для {studyShortDescription}'],
        sv: ['Ställ in {inputTitle} pris för {studyShortDescription}'],
        th: ['กำหนดเวลา {inputTitle} สำหรับ {studyShortDescription}'],
        tr: [
          '"{studyShortDescription}" için "{inputTitle}" zamanını ayarlayın',
        ],
        vi: ['Đặt {inputTitle} thời gian cho {studyShortDescription}'],
        zh: ['为{studyShortDescription}设置{inputTitle}时间'],
        zh_TW: ['為{studyShortDescription}設定{inputTitle}時間'],
      }
    },
    58552: (t) => {
      t.exports = {
        ar: ['تعيين سعر {inputTitle} لـ {studyShortDescription}'],
        ca_ES: [
          'Establiu el preu de {inputTitle} per a {studyShortDescription}',
        ],
        cs: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        de: [
          'Legen Sie den {inputTitle} Preis für {studyShortDescription} fest',
        ],
        el: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        en: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        es: [
          'Establezca el precio de {inputTitle} para {studyShortDescription}',
        ],
        fa: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        fr: ['Définissez le {inputTitle}prix pour {studyShortDescription}'],
        he_IL: ['הגדר את המחיר {inputTitle} עבור {studyShortDescription}'],
        hu_HU: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        id_ID: ['Menentukan harga {inputTitle} untuk {studyShortDescription}'],
        it: [
          'Imposta valore di prezzo di {inputTitle} nello script {studyShortDescription}',
        ],
        ja: ['{studyShortDescription}の{inputTitle}に価格を設定'],
        ko: ['{studyShortDescription}에 대한 {inputTitle} 가격 설정'],
        ms_MY: ['Tetapkan harga {inputTitle} untuk {studyShortDescription}'],
        nl_NL: 'Set the "{inputTitle}" price for "{studyShortDescription}"',
        pl: ['Ustaw czas i cenę „{inputTitle} ” dla „{studyShortDescription}”'],
        pt: [
          'Definir o preço de "{inputTitle}" para "{studyShortDescription}"',
        ],
        ro: ['Set the {inputTitle} price for {studyShortDescription}'],
        ru: ['Установить цену {inputTitle} для {studyShortDescription}'],
        sv: ['Ställ in {inputTitle} pris för {studyShortDescription}'],
        th: ['กำหนดราคา {inputTitle} สำหรับ {studyShortDescription}'],
        tr: [
          '"{studyShortDescription}" için "{inputTitle}" fiyatını ayarlayın',
        ],
        vi: ['Đặt {inputTitle} giá cho {studyShortDescription}'],
        zh: ['为{studyShortDescription}设置{inputTitle}价格'],
        zh_TW: ['為{studyShortDescription}設定{inputTitle}價格'],
      }
    },
    80481: (t) => {
      t.exports = {
        ar: ['تعيين وقت وسعر "{studyShortDescription}"'],
        ca_ES: ['Establiu l\'hora i el preu per a "{studyShortDescription}"'],
        cs: 'Set the time and price for "{studyShortDescription}"',
        de: [
          'Legen Sie die Zeit und den Preis für "{studyShortDescription}" fest',
        ],
        el: 'Set the time and price for "{studyShortDescription}"',
        en: 'Set the time and price for "{studyShortDescription}"',
        es: ['Establezca la hora y el precio para "{studyShortDescription}"'],
        fa: 'Set the time and price for "{studyShortDescription}"',
        fr: ['Fixez l\'heure et le prix pour "{studyShortDescription}"'],
        he_IL: ['הגדר את הזמן והמחיר עבור "{studyShortDescription}"'],
        hu_HU: 'Set the time and price for "{studyShortDescription}"',
        id_ID: ['Menentukan waktu dan harga untuk "{studyShortDescription}"'],
        it: ['Imposta tempo e prezzo per "{studyShortDescription}"'],
        ja: ['{studyShortDescription}に日時と価格を設定'],
        ko: ['"{studyShortDescription}" 에 대한 타임과 프라이스를 셋하시오'],
        ms_MY: ['Tetapkan masa dan harga untuk "{studyShortDescription}"'],
        nl_NL: 'Set the time and price for "{studyShortDescription}"',
        pl: ['Ustaw czas i cenę dla „{studyShortDescription}”'],
        pt: ['Definir o tempo e preço para "{studyShortDescription}"'],
        ro: 'Set the time and price for "{studyShortDescription}"',
        ru: ['Задать время и цену для "{studyShortDescription}"'],
        sv: ['Ställ in tid och pris för "{studyShortDescription}"'],
        th: ['ตั้งเวลาและราคาสำหรับ "{studyShortDescription}"'],
        tr: ['"{studyShortDescription}" için saati ve fiyatı ayarlayın'],
        vi: ['Đặt thời gian và giá cho "{studyShortDescription}"'],
        zh: ['设置“{studyShortDescription}”的时间和价格'],
        zh_TW: ['設定“{studyShortDescription}”的時間和價格'],
      }
    },
    42917: (t) => {
      t.exports = {
        ar: ['نعيين وقت "{studyShortDescription}"'],
        ca_ES: ['Establiu l\'hora per a "{studyShortDescription}"'],
        cs: 'Set the time for "{studyShortDescription}"',
        de: ['Legen Sie die Zeit für "{studyShortDescription}" fest'],
        el: 'Set the time for "{studyShortDescription}"',
        en: 'Set the time for "{studyShortDescription}"',
        es: ['Establezca la hora para "{studyShortDescription}"'],
        fa: 'Set the time for "{studyShortDescription}"',
        fr: ['Fixez l\'heure pour "{studyShortDescription}"'],
        he_IL: ['הגדר את השעה עבור "{studyShortDescription}"'],
        hu_HU: 'Set the time for "{studyShortDescription}"',
        id_ID: ['Menentukan waktu untuk "{studyShortDescription}"'],
        it: ['Imposta tempo per "{studyShortDescription}"'],
        ja: ['{studyShortDescription}に日時を設定'],
        ko: ['"{studyShortDescription}" 에 대한 타임을 셋하시오'],
        ms_MY: ['Tetapkan masa untuk "{studyShortDescription}"'],
        nl_NL: 'Set the time for "{studyShortDescription}"',
        pl: ['Ustaw godzinę dla „{studyShortDescription}”'],
        pt: ['Definir o tempo para "{studyShortDescription}"'],
        ro: 'Set the time for "{studyShortDescription}"',
        ru: ['Задать время для "{studyShortDescription}"'],
        sv: ['Ställ in tid för "{studyShortDescription}"'],
        th: ['ตั้งเวลาสำหรับ "{studyShortDescription}"'],
        tr: ['"{studyShortDescription}" için zamanı ayarlayın'],
        vi: ['Đặt thời gian cho "{studyShortDescription}"'],
        zh: ['设置“{studyShortDescription}”的时间'],
        zh_TW: ['設定“{studyShortDescription}”的時間'],
      }
    },
    6083: (t) => {
      t.exports = {
        ar: ['تعيين سعر "{studyShortDescription}"'],
        ca_ES: ['Establiu el preu per a "{studyShortDescription}"'],
        cs: 'Set the price for "{studyShortDescription}"',
        de: ['Legen Sie den Preis für "{studyShortDescription}" fest'],
        el: 'Set the price for "{studyShortDescription}"',
        en: 'Set the price for "{studyShortDescription}"',
        es: ['Establezca el precio para "{studyShortDescription}"'],
        fa: 'Set the price for "{studyShortDescription}"',
        fr: ['Fixez le prix pour "{studyShortDescription}"'],
        he_IL: ['הגדר את המחיר עבור "{studyShortDescription}"'],
        hu_HU: 'Set the price for "{studyShortDescription}"',
        id_ID: ['Menentukan harga untuk "{studyShortDescription}"'],
        it: ['Imposta prezzo per "{studyShortDescription}"'],
        ja: ['{studyShortDescription}に価格を設定'],
        ko: ['"{studyShortDescription}" 에 대한 프라이스를 셋하시오'],
        ms_MY: ['Tetapkan harga untuk "{studyShortDescription}"'],
        nl_NL: 'Set the price for "{studyShortDescription}"',
        pl: ['Ustaw cenę dla „{studyShortDescription}”'],
        pt: ['Definir o preço para "{studyShortDescription}"'],
        ro: 'Set the price for "{studyShortDescription}"',
        ru: ['Задать цену для "{studyShortDescription}"'],
        sv: ['Ställ in pris för "{studyShortDescription}"'],
        th: ['กำหนดราคาสำหรับ "{studyShortDescription}"'],
        tr: ['"{studyShortDescription}" için tarih seti'],
        vi: ['Đặt giá cho "{studyShortDescription}"'],
        zh: ['设置“{studyShortDescription}”的价格'],
        zh_TW: ['設定“{studyShortDescription}”的價格'],
      }
    },
  },
])
