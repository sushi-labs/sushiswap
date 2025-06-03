;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6112],
  {
    839391: (e) => {
      function a(e) {
        return 'function' == typeof e ? e() : e
      }
      function t() {
        var e = {}
        return (
          (e.promise = new Promise((a, t) => {
            ;(e.resolve = a), (e.reject = t)
          })),
          e
        )
      }
      e.exports = (e) => {
        var i =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = void 0,
          l = void 0,
          s = void 0,
          o = []
        return function () {
          var u = a(i),
            c = new Date().getTime(),
            d = !r || c - r > u
          r = c
          for (var p = arguments.length, v = Array(p), f = 0; f < p; f++)
            v[f] = arguments[f]
          if (d && n.leading)
            return n.accumulate
              ? Promise.resolve(e.call(this, [v])).then((e) => e[0])
              : Promise.resolve(e.call.apply(e, [this].concat(v)))
          if (
            (l ? clearTimeout(s) : (l = t()),
            o.push(v),
            (s = setTimeout(m.bind(this), u)),
            n.accumulate)
          ) {
            var g = o.length - 1
            return l.promise.then((e) => e[g])
          }
          return l.promise
        }
        function m() {
          var a = l
          clearTimeout(s),
            Promise.resolve(
              n.accumulate ? e.call(this, o) : e.apply(this, o[o.length - 1]),
            ).then(a.resolve, a.reject),
            (o = []),
            (l = null)
        }
      }
    },
    497724: (e) => {
      e.exports = {
        tag: 'tag-E35yqcCX',
        disabled: 'disabled-E35yqcCX',
        animated: 'animated-E35yqcCX',
      }
    },
    200730: (e) => {
      e.exports = {
        tags: 'tags-nNSIFYl1',
        tag: 'tag-nNSIFYl1',
        tagBuy: 'tagBuy-nNSIFYl1',
        tagSell: 'tagSell-nNSIFYl1',
      }
    },
    455161: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        scrollable: 'scrollable-NakQh3ob',
        content: 'content-NakQh3ob',
        title: 'title-NakQh3ob',
        label: 'label-NakQh3ob',
        buttonsWrapper: 'buttonsWrapper-NakQh3ob',
        button: 'button-NakQh3ob',
        previewMessage: 'previewMessage-NakQh3ob',
        warnings: 'warnings-NakQh3ob',
        leverageInput: 'leverageInput-NakQh3ob',
      }
    },
    941668: (e, a, t) => {
      t.d(a, { CreateConfirmDialog: () => l })
      var i = t(50959),
        n = t(973044)
      const r = i.lazy(async () => ({
          default: (
            await Promise.all([
              t.e(580),
              t.e(8194),
              t.e(4215),
              t.e(3610),
              t.e(3717),
              t.e(1282),
              t.e(7084),
              t.e(3566),
            ]).then(t.bind(t, 976669))
          ).AdaptiveConfirmDialog,
        })),
        l = (0, n.withDialogLazyLoad)(r)
    },
    958006: (e, a, t) => {
      t.r(a), t.d(a, { LeverageDialog: () => T })
      var i = t(609838),
        n = t(50959),
        r = t(960521),
        l = t.n(r),
        s = t(252130),
        o = t(839391),
        m = t.n(o),
        u = t(497754),
        c = t.n(u),
        d = t(742554),
        p = t(463039),
        v = t(587125),
        f = t(941668),
        g = t(497724),
        h = t.n(g)
      function x(e) {
        const { className: a, ...t } = e
        return n.createElement('span', {
          ...t,
          className: u(a, h().tag, h().disabled),
        })
      }
      var k = t(200730)
      const b = {
        1: i.t(null, void 0, t(398157)),
        2: i.t(null, { context: 'trading' }, t(634499)),
        3: i.t(null, { context: 'trading' }, t(201109)),
        4: i.t(null, void 0, t(900853)),
      }
      function S(e) {
        const { side: a, orderType: r, customFields: l } = e,
          s = [
            {
              text:
                1 === a
                  ? i.t(null, void 0, t(618156))
                  : i.t(null, void 0, t(392553)),
              className: 1 === a ? k.tagBuy : k.tagSell,
            },
            { text: b[r] },
          ]
        return (
          void 0 !== l &&
            Object.values(l)
              .filter((e) => 'string' == typeof e)
              .map((e) => s.push({ text: e })),
          n.createElement(
            'div',
            { className: k.tags },
            s.map((e) =>
              n.createElement(
                x,
                { key: e.text, className: c()(k.tag, e.className) },
                e.text,
              ),
            ),
          )
        )
      }
      var N = t(637401)
      function y(e, a) {
        return l()(e).div(a).round(0, l().roundDown).mul(a)
      }
      function _(e, a, t) {
        const i = y(e, 5)
        if (i.gt(0) && i.minus(a).mod(t).eq(0)) return i
      }
      function w(e, a, t) {
        const i = a.eq(t),
          n = i ? 0 : a
        return y(i ? e : e.minus(a), t).plus(n)
      }
      function M(e, a, t) {
        return e.plus(l()(t).mul(a))
      }
      function E(e) {
        if (e.min >= e.max) return []
        const a = new (l())(e.min),
          t = new (l())(e.max),
          i = new (l())(e.step),
          n = ((e, a) => (e.gt(1) || a.lt(1) ? e : l()(1)))(a, t),
          r = ((e, a, t) => {
            const i = a.minus(e).div(t)
            return i.gte(4) ? 3 : i.round(0, l().roundDown).minus(1).toNumber()
          })(a, t, i),
          s = ((e, a, t) => a.minus(e).div(t + 1))(a, t, r),
          o = [n.toNumber()]
        for (let e = 1; e <= r; e++) {
          const r = M(n, s, e)
          let l = _(r, a, i)
          if (
            ((void 0 === l || l.eq(o[e - 1])) && (l = w(r, a, i)),
            !l.eq(o[e - 1]))
          ) {
            if (l.gte(t)) break
            o.push(l.toNumber())
          }
        }
        return o.push(e.max), o
      }
      var C = t(455161)
      function T(e) {
        const {
            isOpen: a,
            onClose: l,
            leverage: o,
            title: u,
            symbol: g,
            displaySymbol: h,
            brokerName: x,
            min: k,
            max: b,
            step: y,
            side: _,
            orderType: w,
            infos: M,
            warnings: T,
            errors: L,
            customFields: D,
            onLeverageSet: z,
            onLeveragePreview: j,
            onSetLeverageValueInOrderWidget: B,
          } = e,
          O = (0, n.useCallback)(
            m()(
              (() => {
                let e
                return async (a) => {
                  let t
                  const i = (e = j(Z(a)))
                  try {
                    t = await i
                  } catch (e) {
                    t = { errors: [(0, N.getErrorMessage)(e)] }
                  }
                  e === i && $.current && V(t)
                }
              })(),
              300,
            ),
            [],
          ),
          [W, P] = (0, n.useState)(o),
          [q, Y] = (0, n.useState)(!1),
          [F, H] = (0, n.useState)(!1),
          [Q, U] = (0, n.useState)(),
          [A, X] = (0, n.useState)(),
          [G, V] = (0, n.useState)({ infos: M, warnings: T, errors: L }),
          $ = (0, s.useIsMounted)()
        ;(0, n.useEffect)(() => {
          let e
          const a = new r.Big(W).minus(k).mod(y)
          void 0 !== G.errors && G.errors.length > 0
            ? (e = G.errors.join('. '))
            : q
              ? (e = void 0)
              : a.eq(0) ||
                (e = i.t(null, { replace: { step: String(y) } }, t(757077))),
            H(I(G.errors) || q || void 0 !== e),
            U(e),
            X(void 0)
        }, [q, W, y, k, G]),
          (0, n.useEffect)(() => {
            O(W)
          }, [W, O]),
          (0, n.useEffect)(() => {
            P(o)
          }, [o])
        const K = (0, n.useMemo)(
            () =>
              u.charAt(0).toUpperCase() + u.substring(1).toLocaleLowerCase(),
            [u],
          ),
          R = (0, n.useMemo)(() => E({ min: k, max: b, step: y }), [b, k, y])
        return n.createElement(f.CreateConfirmDialog, {
          isOpen: a,
          isOpened: a,
          submitButtonDisabled: F,
          render: () => {
            var e, a
            return n.createElement(
              d.TouchScrollContainer,
              null,
              n.createElement(
                'div',
                { className: C.content },
                n.createElement('div', { className: C.title }, `${h}, ${x}`),
                n.createElement(S, { side: _, orderType: w, customFields: D }),
                n.createElement(
                  p.Label,
                  { htmlFor: 'leverageInput', className: C.label },
                  i.t(null, void 0, t(956220)),
                ),
                n.createElement(v.NumberInput, {
                  id: 'leverageInput',
                  value: W,
                  min: k,
                  max: b,
                  step: y,
                  roundByStep: !1,
                  error: F || Boolean(A),
                  errorMessage: Q || A,
                  boundariesErrorMessages: {
                    greaterThanMax: i.t(
                      null,
                      { replace: { max: String(b) } },
                      t(842652),
                    ),
                    lessThanMin: i.t(
                      null,
                      { replace: { min: String(k) } },
                      t(666992),
                    ),
                  },
                  errorHandler: ee,
                  onValueChange: J,
                  stretch: !0,
                  className: C.leverageInput,
                }),
                n.createElement(
                  'div',
                  { className: C.buttonsWrapper },
                  R.map((e) =>
                    n.createElement(
                      'button',
                      {
                        type: 'button',
                        className: C.button,
                        key: e,
                        onClick: () => {
                          J(e)
                        },
                      },
                      `x${e}`,
                    ),
                  ),
                ),
                I(G.infos) &&
                  n.createElement(
                    'div',
                    { className: C.previewMessage },
                    null === (e = G.infos) || void 0 === e
                      ? void 0
                      : e.join('. '),
                  ),
                I(G.warnings) &&
                  n.createElement(
                    'div',
                    { className: c()(C.previewMessage, C.warnings) },
                    null === (a = G.warnings) || void 0 === a
                      ? void 0
                      : a.join('. '),
                  ),
              ),
            )
          },
          title: K,
          dataName: 'trading-leverage-dialog',
          submitButtonText: i.t(null, void 0, t(692647)),
          cancelButtonText: i.t(null, void 0, t(620036)),
          onSubmit: async () => {
            try {
              await z(Z(W)), B(W), l()
            } catch (e) {
              X((0, N.getErrorMessage)(e))
            }
          },
          onCancel: () => {},
          onClose: l,
          defaultActionOnClose: 'cancel',
          onClickOutside: l,
        })
        function Z(e) {
          return {
            side: _,
            symbol: g,
            leverage: e,
            customFields: D,
            orderType: w,
          }
        }
        function J(e) {
          P(e)
        }
        function ee(e) {
          Y(e)
        }
      }
      function I(e) {
        return void 0 !== e && e.length > 0
      }
    },
    634499: (e) => {
      e.exports = {
        ar: ['أمر السوق الفوري'],
        ca_ES: 'Market',
        cs: 'Market',
        de: ['Markt'],
        el: 'Market',
        en: 'Market',
        es: ['Mercado'],
        fa: 'Market',
        fr: ['Marché'],
        he_IL: ['שׁוּק'],
        hu_HU: 'Market',
        id_ID: ['Pasar'],
        it: ['Mercato'],
        ja: ['マーケット'],
        ko: ['시장가'],
        ms_MY: ['Pasaran'],
        nl_NL: 'Market',
        pl: ['Rynek'],
        pt: ['Mercado'],
        ro: 'Market',
        ru: ['По рынку'],
        sv: ['Marknad'],
        th: ['ตลาด'],
        tr: ['Piyasa'],
        vi: ['Thị trường'],
        zh: ['市场'],
        zh_TW: ['市場'],
      }
    },
    201109: (e) => {
      e.exports = {
        ar: ['توقف'],
        ca_ES: 'Stop',
        cs: 'Stop',
        de: 'Stop',
        el: 'Stop',
        en: 'Stop',
        es: 'Stop',
        fa: 'Stop',
        fr: 'Stop',
        he_IL: ['סטופ'],
        hu_HU: 'Stop',
        id_ID: 'Stop',
        it: 'Stop',
        ja: ['ストップ'],
        ko: ['지정가'],
        ms_MY: ['Berhenti'],
        nl_NL: 'Stop',
        pl: ['Zatrzymaj'],
        pt: 'Stop',
        ro: 'Stop',
        ru: ['Стоп'],
        sv: ['Stopp'],
        th: ['หยุด'],
        tr: ['Dur'],
        vi: ['Dừng'],
        zh: ['停止'],
        zh_TW: ['停止'],
      }
    },
    692647: (e) => {
      e.exports = {
        ar: ['تأكيد'],
        ca_ES: 'Confirm',
        cs: ['Potvrdit'],
        de: ['Bestätigen'],
        el: 'Confirm',
        en: 'Confirm',
        es: ['Confirmar'],
        fa: 'Confirm',
        fr: ['Confirmer'],
        he_IL: ['אישור'],
        hu_HU: ['Megerősítés'],
        id_ID: ['Konfirmasi'],
        it: ['Conferma'],
        ja: ['確認'],
        ko: ['확인'],
        ms_MY: ['Sahkan'],
        nl_NL: ['Bevestig'],
        pl: ['Potwierdź'],
        pt: ['Confirmar'],
        ro: 'Confirm',
        ru: ['Подтверждение'],
        sv: ['Bekräfta'],
        th: ['ยืนยัน'],
        tr: ['Onayla'],
        vi: ['Xác nhận'],
        zh: ['确认'],
        zh_TW: ['確認'],
      }
    },
    842652: (e) => {
      e.exports = {
        ar: ['القيمة المحددة أكبر من الحد الأقصى للرافعة المالية {max}'],
        ca_ES: 'Specified value is greater than the leverage maximum of {max}',
        cs: 'Specified value is greater than the leverage maximum of {max}',
        de: [
          'Der angegebene Wert ist größer als das Maximum der Hebelwirkung von {max}',
        ],
        el: 'Specified value is greater than the leverage maximum of {max}',
        en: 'Specified value is greater than the leverage maximum of {max}',
        es: [
          'El valor especificado es superior al importe máximo de apalancamiento establecido en {max}',
        ],
        fa: 'Specified value is greater than the leverage maximum of {max}',
        fr: [
          "La valeur spécifiée est supérieure au maximum de l'effet de levier de {max}",
        ],
        he_IL: ['הערך שצוין גדול ממקסימום המינוף של {max}'],
        hu_HU: 'Specified value is greater than the leverage maximum of {max}',
        id_ID: [
          'Nilai yang ditentukan lebih besar dari leverage maksimum {max}',
        ],
        it: [
          'Il valore specificato è maggiore rispetto alla leva massima di {max}',
        ],
        ja: ['指定した値がレバレッジの最大値 {max} を超えています'],
        ko: ['지저 밸류가 {max} 의 레버리지 맥시멈보다 큽니다'],
        ms_MY: [
          'Nilai tertentu adalah lebih besar daripada keumpilan maksimum {max}',
        ],
        nl_NL: 'Specified value is greater than the leverage maximum of {max}',
        pl: [
          'Określona wartość jest większa niż maksymalna dźwignia wynosząca {max}',
        ],
        pt: [
          'O valor especificado é maior que o máximo de alavancagem de {max}.',
        ],
        ro: 'Specified value is greater than the leverage maximum of {max}',
        ru: [
          'Указанное значение больше, чем максимальное значение плеча {max}',
        ],
        sv: [
          'Det angivna värdet är större än det maximala hävstångsvärdet för {max}.',
        ],
        th: ['ค่าที่ระบุมากกว่าค่าเลเวอเรจสูงสุด {max}'],
        tr: ['Belirtilen değer, kaldıraç maksimum {max} değerinden fazla'],
        vi: ['Giá trị đã chỉ định lớn hơn giá trị đòn bẩy tối đa là {max}'],
        zh: ['指定值大于杠杆最大值{max}'],
        zh_TW: ['指定值大於槓桿最大值{max}'],
      }
    },
    666992: (e) => {
      e.exports = {
        ar: ['القيمة المحددة أقل من الحد الأدنى للرافعة المالية {min}'],
        ca_ES: 'Specified value is less than the leverage minimum of {min}',
        cs: 'Specified value is less than the leverage minimum of {min}',
        de: [
          'Der angegebene Wert ist kleiner als das Minimum der Hebelwirkung von {min}',
        ],
        el: 'Specified value is less than the leverage minimum of {min}',
        en: 'Specified value is less than the leverage minimum of {min}',
        es: [
          'El valor especificado es inferior al apalancamiento mínimo establecido en {min}',
        ],
        fa: 'Specified value is less than the leverage minimum of {min}',
        fr: [
          "La valeur spécifiée est inférieure au minimum de l'effet de levier de {min}",
        ],
        he_IL: ['הערך שצוין קטן ממינימום המינוף של {min}'],
        hu_HU: 'Specified value is less than the leverage minimum of {min}',
        id_ID: [
          'Nilai yang ditentukan kurang dari minimum leverage dari {min}',
        ],
        it: [
          'Il valore specificato è maggiore rispetto alla leva minima di {min}',
        ],
        ja: ['指定した値がレバレッジの最小値 {min} を下回っています'],
        ko: ['지정된 값이 레버리지 최소값인 {min} 보다 작습니다.'],
        ms_MY: [
          'Nilai yang diperincikan adalah kurang daripada minimum keumpilan {min}',
        ],
        nl_NL: 'Specified value is less than the leverage minimum of {min}',
        pl: ['Określona wartość jest mniejsza niż minimalna dźwignia {min}'],
        pt: [
          'O valor especificado é menor do que o valor de alavancagem mínimo de {min}.',
        ],
        ro: 'Specified value is less than the leverage minimum of {min}',
        ru: ['Указанное значение меньше, чем минимальное значение плеча {min}'],
        sv: [
          'Det angivna värdet är lägre än det lägsta hävstångsvärdet för {min}',
        ],
        th: ['ค่าที่ระบุน้อยกว่าเลเวอเรจขั้นต่ำ {min}'],
        tr: ['Belirtilen değer, kaldıraç minimum {min} değerinden düşük'],
        vi: ['Giá trị đã chỉ định nhỏ hơn mức đòn bẩy tối thiểu là {min}'],
        zh: ['指定值小于杠杆最小值{min}'],
        zh_TW: ['指定值小於槓桿最小值{min}'],
      }
    },
    757077: (e) => {
      e.exports = {
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
