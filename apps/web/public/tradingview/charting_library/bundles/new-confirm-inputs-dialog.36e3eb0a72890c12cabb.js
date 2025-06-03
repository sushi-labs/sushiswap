;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3030],
  {
    259142: (t, e) => {
      var i, n, o
      ;(n = [e]),
        (i = (t) => {
          function e(t) {
            if (Array.isArray(t)) {
              for (var e = 0, i = Array(t.length); e < t.length; e++)
                i[e] = t[e]
              return i
            }
            return Array.from(t)
          }
          Object.defineProperty(t, '__esModule', { value: !0 })
          var i = !1
          if ('undefined' != typeof window) {
            var n = {
              get passive() {
                i = !0
              },
            }
            window.addEventListener('testPassive', null, n),
              window.removeEventListener('testPassive', null, n)
          }
          var o =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            r = [],
            s = !1,
            u = -1,
            p = void 0,
            c = void 0,
            l = (t) =>
              r.some(
                (e) =>
                  !(!e.options.allowTouchMove || !e.options.allowTouchMove(t)),
              ),
            a = (t) => {
              var e = t || window.event
              return (
                !!l(e.target) ||
                1 < e.touches.length ||
                (e.preventDefault && e.preventDefault(), !1)
              )
            },
            d = () => {
              setTimeout(() => {
                void 0 !== c &&
                  ((document.body.style.paddingRight = c), (c = void 0)),
                  void 0 !== p &&
                    ((document.body.style.overflow = p), (p = void 0))
              })
            }
          ;(t.disableBodyScroll = (t, n) => {
            if (o) {
              if (!t)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                )
              if (t && !r.some((e) => e.targetElement === t)) {
                var d = { targetElement: t, options: n || {} }
                ;(r = [].concat(e(r), [d])),
                  (t.ontouchstart = (t) => {
                    1 === t.targetTouches.length &&
                      (u = t.targetTouches[0].clientY)
                  }),
                  (t.ontouchmove = (e) => {
                    var i, n, o, r
                    1 === e.targetTouches.length &&
                      ((n = t),
                      (r = (i = e).targetTouches[0].clientY - u),
                      !l(i.target) &&
                        ((n && 0 === n.scrollTop && 0 < r) ||
                        ((o = n) &&
                          o.scrollHeight - o.scrollTop <= o.clientHeight &&
                          r < 0)
                          ? a(i)
                          : i.stopPropagation()))
                  }),
                  s ||
                    (document.addEventListener(
                      'touchmove',
                      a,
                      i ? { passive: !1 } : void 0,
                    ),
                    (s = !0))
              }
            } else {
              ;(S = n),
                setTimeout(() => {
                  if (void 0 === c) {
                    var t = !!S && !0 === S.reserveScrollBarGap,
                      e =
                        window.innerWidth - document.documentElement.clientWidth
                    t &&
                      0 < e &&
                      ((c = document.body.style.paddingRight),
                      (document.body.style.paddingRight = e + 'px'))
                  }
                  void 0 === p &&
                    ((p = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'))
                })
              var h = { targetElement: t, options: n || {} }
              r = [].concat(e(r), [h])
            }
            var S
          }),
            (t.clearAllBodyScrollLocks = () => {
              o
                ? (r.forEach((t) => {
                    ;(t.targetElement.ontouchstart = null),
                      (t.targetElement.ontouchmove = null)
                  }),
                  s &&
                    (document.removeEventListener(
                      'touchmove',
                      a,
                      i ? { passive: !1 } : void 0,
                    ),
                    (s = !1)),
                  (r = []),
                  (u = -1))
                : (d(), (r = []))
            }),
            (t.enableBodyScroll = (t) => {
              if (o) {
                if (!t)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                  )
                ;(t.ontouchstart = null),
                  (t.ontouchmove = null),
                  (r = r.filter((e) => e.targetElement !== t)),
                  s &&
                    0 === r.length &&
                    (document.removeEventListener(
                      'touchmove',
                      a,
                      i ? { passive: !1 } : void 0,
                    ),
                    (s = !1))
              } else
                1 === r.length && r[0].targetElement === t
                  ? (d(), (r = []))
                  : (r = r.filter((e) => e.targetElement !== t))
            })
        }),
        void 0 === (o = 'function' == typeof i ? i.apply(e, n) : i) ||
          (t.exports = o)
    },
    231988: (t) => {
      t.exports = {
        separator: 'separator-EI7Qsb2Q',
        scrollable: 'scrollable-EI7Qsb2Q',
      }
    },
    876207: (t, e, i) => {
      i.r(e), i.d(e, { ConfirmInputsDialogRenderer: () => S })
      var n = i(500962),
        o = i(50959),
        r = i(609838),
        s = i(976669),
        u = i(370981),
        p = i(742554),
        c = i(355217),
        l = i(466052),
        a = i(601227),
        d = i(231988)
      function h(t) {
        const {
            title: e,
            confirmInputs: n,
            inputsProperty: h,
            studyMetaInfo: S,
            model: y,
            confirmInputsType: f,
            onCancel: D,
            onSubmit: m,
            onClose: v,
            onStudyInputChange: T,
          } = t,
          [g, I] = (0, o.useState)(!0),
          _ = (0, o.useMemo)(() => {
            const t = new l.Delegate()
            return {
              isInputsStudy: !0,
              symbolsResolved: () => t,
              resolvedSymbolInfoBySymbol: () => null,
              tempProperties: h,
            }
          }, []),
          w = (0, o.useRef)(null),
          [b, E] = (0, o.useState)(C())
        return (
          (0, o.useEffect)(() => {
            if (!a.CheckMobile.any() && g && 'symbol' === f && w.current) {
              const t = w.current.querySelector('input')
              t && t.focus()
            }
          }, [g]),
          o.createElement(s.AdaptiveConfirmDialog, {
            dataName: 'confirm-inputs-dialog',
            title: e,
            isOpened: g,
            onSubmit: () => {
              m(h.state().inputs), z()
            },
            onCancel: D,
            onClickOutside: z,
            onClose: z,
            render: () =>
              o.createElement(
                o.Fragment,
                null,
                o.createElement('div', { className: d.separator }),
                o.createElement(
                  p.TouchScrollContainer,
                  { className: d.scrollable, onScroll: k },
                  o.createElement(c.InputsTabContent, {
                    reference: w,
                    property: h,
                    studyMetaInfo: S,
                    model: y,
                    study: _,
                    inputs: n,
                    onStudyInputChange: L,
                  }),
                ),
              ),
            defaultActionOnClose: 'none',
            submitButtonText: r.t(null, void 0, i(773226)),
            submitButtonDisabled: b,
            submitOnEnterKey: !1,
          })
        )
        function k() {
          u.globalCloseDelegate.fire()
        }
        function z() {
          I(!1), v()
        }
        function C() {
          const { inputs: t } = h.state()
          for (const e of n)
            if ('symbol' === e.type && !e.optional && '' === t[e.id]) return !0
          return !1
        }
        function L(t, e) {
          null == T || T(t, e), E(C())
        }
      }
      class S {
        constructor(t, e, i, o, r, s, u, p, c) {
          ;(this._container = document.createElement('div')),
            (this._handleClose = () => {
              n.unmountComponentAtNode(this._container), this._onClose()
            }),
            (this._title = t),
            (this._confirmInputs = e),
            (this._model = s),
            (this._confirmInputsType = o),
            (this._studyMetaInfo = r),
            (this._onSubmit = u),
            (this._onClose = p),
            (this._onStudyInputChange = c),
            (this._inputsProperty = i)
        }
        show() {
          n.render(
            o.createElement(h, {
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
    759393: (t, e, i) => {
      i.r(e), i.d(e, { selectInputValuesOnChart: () => p })
      var n = i(650151),
        o = i(149962),
        r = i(609838),
        s = i(756254),
        u = i(683471)
      o.colorsPalette['color-cold-gray-500']
      async function p(t, e, o, p, c) {
        let l
        const a = (0, s.getInputGroups)(e)
        t.model().model()
        for await (const t of a)
          await d(t).catch((t) => {
            throw new Error(t)
          })
        return { customSourceId: void 0, destPane: l }
        async function d(t) {
          if ((0, s.isGroup)(t))
            if ((0, s.isInputInlines)(t)) {
              const e = ((t) => {
                if (2 !== t.length || t[0].type === t[1].type) return null
                return 'price' === t[0].type
                  ? { price: t[0], time: t[1] }
                  : { price: t[1], time: t[0] }
              })(t.children)
              if (e) {
                const { time: n, price: o } = e,
                  s = n.inline
                    ? r.t(
                        null,
                        {
                          replace: {
                            inputInline: n.inline,
                            studyShortDescription: p,
                          },
                        },
                        i(359877),
                      )
                    : r.t(
                        null,
                        { replace: { studyShortDescription: p } },
                        i(580481),
                      ),
                  u = y(t.id)
                await S(t, 'all', null != u ? u : s, n.id, o.id)
              } else for await (const e of t.children) await h(e)
            } else for await (const e of t.children) await d(e)
          else await h(t)
        }
        async function h(t) {
          const e = 'time' === t.type,
            n = e ? 'time' : 'price',
            o = (() => {
              if (t.inline) {
                const e = y(t.inline)
                if (e) return e
              }
              if (t.tooltip) return t.tooltip
              const n = t.name
                  ? r.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: p,
                        },
                      },
                      i(718571),
                    )
                  : r.t(
                      null,
                      { replace: { studyShortDescription: p } },
                      i(742917),
                    ),
                o = t.name
                  ? r.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: p,
                        },
                      },
                      i(558552),
                    )
                  : r.t(
                      null,
                      { replace: { studyShortDescription: p } },
                      i(306083),
                    )
              return e ? n : o
            })(),
            s = e ? t.id : void 0,
            u = e ? void 0 : t.id
          await S(t, n, o, s, u)
        }
        async function S(e, i, r, s, p) {
          const c = await t.requestSelectPoint(
            {
              pointType: i,
              pane: l,
              lineColor: void 0,
              selectPointMode: u.SelectPointMode.Study,
            },
            r,
          )
          void 0 === l && (l = c.pane)
          const a = o.childs().inputs
          a &&
            (s &&
              (0, n.ensureDefined)(a.child(s)).setValue(
                1e3 * (c.point.time || 0),
              ),
            p && (0, n.ensureDefined)(a.child(p)).setValue(c.point.price))
        }
        function y(t) {
          let e
          return (
            c
              .filter((e) => e.inline === t)
              .forEach((t) => {
                t.tooltip && (e = t.tooltip)
              }),
            e
          )
        }
      }
    },
    773226: (t) => {
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
    359877: (t) => {
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
    718571: (t) => {
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
    558552: (t) => {
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
    580481: (t) => {
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
    742917: (t) => {
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
    306083: (t) => {
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
