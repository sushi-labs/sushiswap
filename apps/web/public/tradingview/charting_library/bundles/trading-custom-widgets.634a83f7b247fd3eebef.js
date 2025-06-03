;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3809],
  {
    422191: (e) => {
      e.exports = { label: 'label-oHMFhnC8' }
    },
    115356: (e) => {
      e.exports = {
        calculator: 'calculator-vLRZh3q9',
        calculatorWithInput: 'calculatorWithInput-vLRZh3q9',
        input: 'input-vLRZh3q9',
        buttonsWrapper: 'buttonsWrapper-vLRZh3q9',
        buttonWithOperation: 'buttonWithOperation-vLRZh3q9',
        buttonIcon: 'buttonIcon-vLRZh3q9',
      }
    },
    368173: (e) => {
      e.exports = { menuBox: 'menuBox-rm7KgfIT' }
    },
    463039: (e, t, n) => {
      n.d(t, { Label: () => u })
      var a = n(50959),
        i = n(497754),
        r = n.n(i),
        o = n(102691),
        s = n(422191)
      function u(e) {
        const { htmlFor: t, children: n, className: i, id: u, ...l } = e
        return a.createElement(
          o.BeforeSlot,
          { ...l, className: r()(s.label, i) },
          a.createElement('label', { id: u, htmlFor: t }, n),
        )
      }
    },
    713191: (e, t, n) => {
      n.r(t), n.d(t, { render: () => s })
      var a = n(50959),
        i = n(500962),
        r = n(650151),
        o = n(129018)
      function s(e, t, n) {
        e
          ? i.render(
              a.createElement(o.QuantityCalculator, {
                ...(0, r.ensureDefined)(n),
              }),
              t,
            )
          : i.unmountComponentAtNode(t)
      }
    },
    129018: (e, t, n) => {
      n.d(t, { QuantityCalculator: () => w })
      var a = n(50959),
        i = n(960521),
        r = n(624216),
        o = n(510618),
        s = n(493173),
        u = n(529719),
        l = n(497754),
        m = n.n(l),
        c = n(609838),
        p = n(180185),
        h = n(72571),
        d = n(463039),
        v = n(380327),
        f = n(99708),
        g = n(587125),
        x = n(600297),
        I = n(218666),
        k = n(96634),
        C = n(115589),
        _ = n(672197),
        b = n(115356)
      const y = {
        isGrouped: !1,
        cellState: { isTop: !1, isRight: !1, isBottom: !1, isLeft: !1 },
      }
      function E(e) {
        const {
            min: t,
            max: i,
            step: r,
            uiStep: o,
            reference: s,
            withInput: u,
            valueInput: l,
            onChangeValueInput: E,
            onClick: B,
            onClose: T,
            onInputClick: w,
          } = e,
          [N, S] = (0, a.useState)(!1),
          [D, L] = (0, a.useState)(void 0),
          [V, M] = (0, a.useState)(!1),
          z = (0, a.useRef)(null),
          R = (0, a.useCallback)(
            (e) => {
              const n = { min: t, max: i, step: r },
                a = (0, f.checkQtyError)(n, e, !0),
                o = V || a.res,
                s = V ? undefined : a.msg
              S(o), L(s)
            },
            [V, t, i, r],
          )
        function W(e, t) {
          var n
          null === (n = z.current) || void 0 === n || n.blur(), B(e, t)
        }
        return (
          (0, a.useEffect)(() => {
            R(l)
          }, [R, l]),
          a.createElement(
            'div',
            {
              className: m()(b.calculator, u && b.calculatorWithInput),
              tabIndex: -1,
              ref: s,
              onKeyDown: (e) => {
                l && !N && 13 === (0, p.hashFromEvent)(e) && T()
              },
            },
            u &&
              a.createElement(
                a.Fragment,
                null,
                a.createElement(
                  d.Label,
                  { htmlFor: 'calculator-input' },
                  c.t(null, void 0, n(766596)),
                ),
                a.createElement(g.NumberInput, {
                  id: 'calculator-input',
                  inputReference: (e) => (z.current = e),
                  className: b.input,
                  value: l,
                  max: i,
                  min: t,
                  step: r,
                  uiStep: o,
                  mode: 'float',
                  error: N,
                  errorMessage: D,
                  errorHandler: (e) => {
                    M(e)
                  },
                  onValueChange: E,
                  onClick: w,
                  alwaysUpdateValueFromProps: !0,
                }),
              ),
            a.createElement(
              v.ControlGroupContext.Provider,
              { value: y },
              a.createElement(
                'div',
                { className: b.buttonsWrapper },
                a.createElement(x.Button, {
                  value: -r,
                  buttonType: x.ButtonType.IncDec,
                  icon: a.createElement(h.Icon, {
                    className: b.buttonIcon,
                    icon: k,
                  }),
                  onClick: W,
                  className: b.buttonWithOperation,
                }),
                a.createElement(x.Button, {
                  value: r,
                  buttonType: x.ButtonType.IncDec,
                  icon: a.createElement(h.Icon, {
                    className: b.buttonIcon,
                    icon: I,
                  }),
                  onClick: W,
                  className: b.buttonWithOperation,
                }),
                a.createElement(x.Button, {
                  value: 1,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 5,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 25,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 100,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 500,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 1e3,
                  buttonType: x.ButtonType.PlusValue,
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: 0,
                  buttonType: x.ButtonType.Clear,
                  icon: a.createElement(h.Icon, {
                    className: b.buttonIcon,
                    icon: C,
                  }),
                  onClick: W,
                }),
                a.createElement(x.Button, {
                  value: t || r,
                  buttonType: x.ButtonType.Default,
                  icon: a.createElement(h.Icon, {
                    className: b.buttonIcon,
                    icon: _,
                  }),
                  onClick: W,
                }),
              ),
            ),
          )
        )
      }
      var B = n(368173)
      const T = (0, s.mergeThemes)(o.DEFAULT_MENU_THEME, { menuBox: B.menuBox })
      class w extends a.PureComponent {
        constructor(e) {
          super(e),
            (this._setCalcRef = (e) => {
              this.props.calcReference && this.props.calcReference(e)
            }),
            (this._calculatorStepHandler = (e, t) => {
              const {
                min: n,
                max: a,
                uiStep: r,
                trackEventTarget: o,
                trackEvent: s,
              } = this.props
              if (
                (void 0 !== s &&
                  void 0 !== o &&
                  s(
                    o,
                    'Calculator Button',
                    (0, u.prepareCalculatorEventText)(e, t),
                  ),
                t === x.ButtonType.Clear || t === x.ButtonType.Default)
              )
                return this._updateValueByCalc(e)
              const l = this.props.valueGetter()
              if (null === l) return
              let m = Number((0, i.Big)(l).plus(e))
              if ((m < n || a < m) && t !== x.ButtonType.IncDec)
                return this._updateValueByCalc(l)
              if (t === x.ButtonType.IncDec) {
                if (((m = this._calcByStep(l, e, n, r)), a < m))
                  return this._updateValueByCalc(a)
                if (m < n) return this._updateValueByCalc(n)
              }
              return this._updateValueByCalc(m)
            }),
            (this._updateValueByCalc = (e) => {
              var t, n
              this._handlerValueInput(e),
                this.props.onValueChange(e, !0),
                void 0 !== this.props.errorHandler &&
                  this.props.errorHandler(!1),
                this.props.calculatorUsedStat &&
                  this.props.calculatorUsedStat(),
                null === (n = (t = this.props).onFocus) ||
                  void 0 === n ||
                  n.call(t)
            }),
            (this._onInputClick = () => {
              const { trackEventTarget: e, trackEvent: t } = this.props
              void 0 !== t &&
                void 0 !== e &&
                t(e, 'Calculator Input', 'Quantity input field')
            }),
            (this.state = { valueInput: e.valueGetter() }),
            (this._handlerValueInput = this._handlerValueInput.bind(this))
        }
        render() {
          const {
            min: e,
            max: t,
            step: n,
            uiStep: i,
            withInput: o,
            targetEl: s,
            position: u,
            onClose: l,
            onClickOutside: m,
            onKeyboardClose: c,
          } = this.props
          return a.createElement(
            r.PopupMenu,
            {
              isOpened: !0,
              onClose: l,
              onClickOutside: m,
              onKeyboardClose: c,
              position: u,
              doNotCloseOn: s,
              theme: T,
            },
            a.createElement(E, {
              min: e,
              max: t,
              step: n,
              uiStep: i,
              withInput: o,
              reference: this._setCalcRef,
              valueInput: this.state.valueInput,
              onChangeValueInput: this._updateValueByCalc,
              onClick: this._calculatorStepHandler,
              onClose: l,
              onInputClick: this._onInputClick,
            }),
          )
        }
        _calcByStep(e, t, n, a) {
          const r = Math.sign(t),
            o = Math.abs(null != a ? a : t),
            s = new i.Big(e),
            u = s.minus(n).mod(t)
          let l = s.plus(r * o)
          return (
            u.eq(0) || (l = l.plus((r > 0 ? 0 : 1) * o).minus(u)), l.toNumber()
          )
        }
        _handlerValueInput(e) {
          this.setState({ valueInput: e })
        }
      }
    },
    493173: (e, t, n) => {
      function a(e, t, n = {}) {
        return Object.assign(
          {},
          e,
          ((e, t, n = {}) => {
            const a = Object.assign({}, t)
            for (const i of Object.keys(t)) {
              const r = n[i] || i
              r in e && (a[i] = [e[r], t[i]].join(' '))
            }
            return a
          })(e, t, n),
        )
      }
      n.d(t, { mergeThemes: () => a })
    },
    476007: (e, t, n) => {
      n.d(t, { SplitThousandsFormatter: () => r })
      var a = n(793361),
        i = n(710263)
      class r {
        constructor(e = ' ') {
          this._divider = e
        }
        format(e) {
          const t = (0, a.splitThousands)(e, this._divider)
          return (0, i.isRtl)() ? (0, i.startWithLTR)(t) : t
        }
        parse(e) {
          const t = (0, i.stripLTRMarks)(e).split(this._divider).join(''),
            n = Number(t)
          return isNaN(n) || /e/i.test(t)
            ? { res: !1 }
            : { res: !0, value: n, suggest: this.format(n) }
        }
      }
    },
    115589: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9.36 5a4.44 4.44 0 0 0-4.39 4.5c0 2.49 1.97 4.5 4.39 4.5 1.62 0 3.04-.9 3.8-2.25l.84.5A5.33 5.33 0 0 1 9.36 15 5.43 5.43 0 0 1 4 9.5C4 6.46 6.4 4 9.36 4c1.98 0 3.71 1.1 4.64 2.75l-.84.5A4.36 4.36 0 0 0 9.36 5Z"/></svg>'
    },
    96634: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M5 9h9v1H5V9Z"/></svg>'
    },
    218666: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9.5 4.5h-1v4h-4v1h4v4h1v-4h4v-1h-4v-4Z"/></svg>'
    },
    672197: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M10 6.13V8L6 5.5 10 3v2.1A5 5 0 1 1 4 10a.5.5 0 0 1 1 0 4 4 0 1 0 5-3.87Z"/></svg>'
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
  },
])
