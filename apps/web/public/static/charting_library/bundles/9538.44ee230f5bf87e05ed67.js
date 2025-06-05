;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9538],
  {
    350191: (e) => {
      e.exports = {
        wrap: 'wrap-Un5MtNUE',
        list: 'list-Un5MtNUE',
        item: 'item-Un5MtNUE',
        selected: 'selected-Un5MtNUE',
        bluishItem: 'bluishItem-Un5MtNUE',
        noPadding: 'noPadding-Un5MtNUE',
      }
    },
    782211: (e) => {
      e.exports = { group: 'group-NGVKpq85' }
    },
    651109: (e) => {
      e.exports = {
        labels: 'labels-Llv4yjs6',
        rewardRisk: 'rewardRisk-Llv4yjs6',
        rewardRiskText: 'rewardRiskText-Llv4yjs6',
        bracketControl: 'bracketControl-Llv4yjs6',
        control: 'control-Llv4yjs6',
        wait: 'wait-Llv4yjs6',
        checkboxLabel: 'checkboxLabel-Llv4yjs6',
        clickableTextColor: 'clickableTextColor-Llv4yjs6',
        checkboxWrapper: 'checkboxWrapper-Llv4yjs6',
        slCheckboxWrapper: 'slCheckboxWrapper-Llv4yjs6',
        checkboxLabelWrapper: 'checkboxLabelWrapper-Llv4yjs6',
        checkbox: 'checkbox-Llv4yjs6',
        inputGroup: 'inputGroup-Llv4yjs6',
        rightBlock: 'rightBlock-Llv4yjs6',
        label: 'label-Llv4yjs6',
        bracketInCurrency: 'bracketInCurrency-Llv4yjs6',
        bracketInPercent: 'bracketInPercent-Llv4yjs6',
        bracketInPips: 'bracketInPips-Llv4yjs6',
        bracketInPrice: 'bracketInPrice-Llv4yjs6',
      }
    },
    114891: (e) => {
      e.exports = {
        title: 'title-DPlbqdw3',
        input: 'input-DPlbqdw3',
        wait: 'wait-DPlbqdw3',
        checkboxWrapper: 'checkboxWrapper-DPlbqdw3',
        checkboxLabel: 'checkboxLabel-DPlbqdw3',
      }
    },
    223302: (e) => {
      e.exports = { customField: 'customField-64DiJaqR' }
    },
    191547: (e) => {
      e.exports = {
        wrapper: 'wrapper-kb0OuE9E',
        row: 'row-kb0OuE9E',
        header: 'header-kb0OuE9E',
        cell: 'cell-kb0OuE9E',
        cellTitle: 'cellTitle-kb0OuE9E',
        cellValue: 'cellValue-kb0OuE9E',
        cellRightAligned: 'cellRightAligned-kb0OuE9E',
        cellSideBuy: 'cellSideBuy-kb0OuE9E',
        cellSideSell: 'cellSideSell-kb0OuE9E',
        marker: 'marker-kb0OuE9E',
        disabled: 'disabled-kb0OuE9E',
      }
    },
    74704: (e) => {
      e.exports = { button: 'button-pP_E6i3F' }
    },
    885004: (e) => {
      e.exports = {
        clickableText: 'clickableText-RTuybJqa',
        clickableTextColor: 'clickableTextColor-RTuybJqa',
      }
    },
    963208: (e) => {
      e.exports = { body: 'body-X70j90Zy' }
    },
    17817: (e) => {
      e.exports = { footer: 'footer-fSCU20uC' }
    },
    278895: (e) => {
      e.exports = { header: 'header-BitPgYCK', close: 'close-BitPgYCK' }
    },
    639379: (e) => {
      e.exports = { message: 'message-tNeiOkjz', error: 'error-tNeiOkjz' }
    },
    109315: (e) => {
      e.exports = { container: 'container-HTBJo9ba', top: 'top-HTBJo9ba' }
    },
    902390: (e) => {
      e.exports = { list: 'list-HGwPo2aR', item: 'item-HGwPo2aR' }
    },
    493455: (e, t, s) => {
      s.d(t, { ControlGroup: () => c })
      var o = s(50959),
        r = s(497754),
        n = s(380327),
        l = s(782211),
        i = s.n(l)
      function a(e, t, s) {
        return {
          isTop: e < t,
          isRight: e % t == t - 1,
          isBottom: e >= t * (s - 1),
          isLeft: e % t == 0,
        }
      }
      function c(e) {
        const {
            children: t,
            rows: s,
            cols: l,
            disablePositionAdjustment: c,
            className: p,
            ...d
          } = e,
          h = o.Children.count(t),
          u = null != l ? l : h,
          m = null != s ? s : ((e, t) => Math.ceil(e / t))(h, u),
          b = (0, o.useMemo)(() => {
            const e = []
            for (let t = 0; t < h; t++)
              e.push({
                isGrouped: !0,
                cellState: a(t, u, m),
                disablePositionAdjustment: c,
              })
            return e
          }, [h, u, m, c]),
          k = o.Children.map(t, (e, t) =>
            o.createElement(n.ControlGroupContext.Provider, { value: b[t] }, e),
          ),
          C = {
            '--ui-lib-control-group-cols': u.toString(10),
            '--ui-lib-control-group-rows': m.toString(10),
          }
        return o.createElement(
          'span',
          { className: r(i().group, p), style: C, ...d },
          k,
        )
      }
    },
    788865: (e, t, s) => {
      s.d(t, { BracketControlGroup: () => E })
      var o = s(50959),
        r = s(497754),
        n = s(609838),
        l = s(661851),
        i = s(972535),
        a = s(656846),
        c = s(493455),
        p = s(302946),
        d = s(363111),
        h = s(587125)
      function u(e) {
        const {
            inputMode: t,
            control: s,
            className: r,
            error: n,
            errorMessage: i,
            errorHandler: a,
            onFocus: c,
            inputReference: p,
            intent: d,
            highlight: u,
            highlightRemoveRoundBorder: m,
            disabled: b,
            fontSizeStyle: k,
          } = e,
          C = (0, l.useObservable)(s.value$, s.getValue())
        return o.createElement(h.NumberInput, {
          inputMode: t,
          intent: d,
          highlight: u,
          highlightRemoveRoundBorder: m,
          value: C,
          onValueChange: (e) => {
            var t
            null == c || c(),
              s.setValue(e),
              null === (t = s.onModifiedCallback) || void 0 === t || t.call(s)
          },
          formatter: s.formatter,
          className: r,
          step: s.step,
          error: n,
          errorMessage: i,
          errorHandler: a,
          onFocus: c,
          inputReference: p,
          disabled: b,
          fontSizeStyle: k,
        })
      }
      var m = s(895318),
        b = s(885004)
      function k(e) {
        const { theme: t = b } = e
        return o.createElement(
          'span',
          {
            className: r(b.clickableText, t.clickableTextColor, e.className),
            ref: e.reference,
            tabIndex: e.tabIndex,
            onClick: e.onClick,
            onKeyDown: e.onKeyDown,
          },
          e.text,
        )
      }
      var C = s(101614),
        v = s(738036),
        g = s(651109)
      const y = {
          [a.BracketType.StopLoss]: n.t(null, void 0, s(241648)),
          [a.BracketType.TakeProfit]: n.t(null, void 0, s(129266)),
          [a.BracketType.TrailingStop]: n.t(null, void 0, s(86430)),
        },
        f = n.t(null, void 0, s(782806))
      class T extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._slTypeElement = null),
            (this._slTypeDropdown = null),
            (this._setSLTypeElement = (e) => {
              this._slTypeElement = e
            }),
            (this._setSlTypeDropdownRef = (e) => {
              this._slTypeDropdown = e
            }),
            (this._typeToggle = () => {
              this.setState((e) => ({ isSLTypeOpened: !e.isSLTypeOpened })),
                this.props.enabled || this.props.onToggleEnabled()
            }),
            (this._onSLTypeSelect = (e) => {
              this.props.setBracketType(this.props.stopLossTypes[e]),
                this.setState({ isSLTypeOpened: !1 })
            }),
            (this._onClickOutside = (e) => {
              ;(this._slTypeDropdown &&
                this._slTypeDropdown.contains(e.target)) ||
                this.setState({ isSLTypeOpened: !1 })
            }),
            (this._focusHandler = (e) => () => this.props.onFocus(e)),
            (this.state = { isSLTypeOpened: !1 })
        }
        render() {
          const {
              inputDisabled: e,
              labelDisabled: t,
              checkboxDisabled: s,
            } = this.props.controlState,
            n = this.props.type !== a.BracketType.TakeProfit,
            l = y[this.props.type],
            i = n && this.context.supportTrailingStop && !t
          let d
          d = i
            ? o.createElement(
                v.OutsideEvent,
                {
                  click: !0,
                  mouseDown: !0,
                  touchStart: !0,
                  handler: this._onClickOutside,
                },
                (e) =>
                  o.createElement(
                    'span',
                    { className: g.checkboxLabelWrapper, ref: e },
                    o.createElement(k, {
                      className: g.checkboxLabel,
                      text: l,
                      tabIndex: -1,
                      onClick: this._typeToggle,
                      reference: this._setSLTypeElement,
                      theme: g.clickableTextColor,
                    }),
                    o.createElement(C.DropdownList, {
                      root: 'document',
                      isOpened: this.state.isSLTypeOpened,
                      items: this._mapSLTypesNames(),
                      target: this._slTypeElement || void 0,
                      inheritWidthFromTarget: !1,
                      onSelect: this._onSLTypeSelect,
                      reference: this._setSlTypeDropdownRef,
                    }),
                  ),
              )
            : o.createElement('span', { className: g.checkboxLabel }, l)
          const h = o.createElement(
              'div',
              {
                className: r(
                  i ? g.slCheckboxWrapper : g.checkboxWrapper,
                  'apply-common-tooltip',
                ),
                title: i ? f : l,
              },
              o.createElement(p.Checkbox, {
                className: g.checkbox,
                checked: this.props.enabled,
                label: i ? void 0 : d,
                tabIndex: -1,
                onChange: this.props.onToggleEnabled,
                disabled: s,
              }),
              i && d,
            ),
            b = Boolean(this.props.error && this.props.error.res),
            T = this.props.error && this.props.error.msg,
            w = this.props.isCryptoBracket
              ? 'showCryptoBracketsInCurrency'
              : 'showBracketsInCurrency',
            E = this.props.isCryptoBracket
              ? 'showCryptoBracketsInPercent'
              : 'showBracketsInPercent'
          return o.createElement(m.SettingsContext.Consumer, null, (t) => {
            const s = []
            return (
              this.props.showRiskControls &&
                t[w] &&
                s.push(
                  o.createElement(u, {
                    ...this._generateControlProps(2),
                    control: this.props.riskInCurrency,
                    className: this._generateClassName(2),
                    onFocus: this._focusHandler(2),
                    errorHandler: this.props.errorHandler,
                    error: b && this._isSelectedControl(2),
                    errorMessage: T,
                    disabled: e,
                    fontSizeStyle: this.props.fontSizeStyle,
                    key: 'riskInCurrency',
                  }),
                ),
              this.props.showRiskControls &&
                t[E] &&
                s.push(
                  o.createElement(u, {
                    ...this._generateControlProps(3),
                    control: this.props.riskInPercent,
                    className: this._generateClassName(3),
                    onFocus: this._focusHandler(3),
                    errorHandler: this.props.errorHandler,
                    error: b && this._isSelectedControl(3),
                    errorMessage: T,
                    disabled: e,
                    fontSizeStyle: this.props.fontSizeStyle,
                    key: 'riskInPercent',
                  }),
                ),
              o.createElement(
                'div',
                { className: r(g.bracketControl, n && g.rightBlock) },
                h,
                o.createElement(
                  c.ControlGroup,
                  { cols: 1, className: g.inputGroup },
                  !this.props.isPipsControlHidden &&
                    o.createElement(u, {
                      ...this._generateControlProps(0),
                      control: this.props.pips,
                      className: this._generateClassName(0),
                      onFocus: this._focusHandler(0),
                      errorHandler: this.props.errorHandler,
                      error: b && this._isSelectedControl(0),
                      errorMessage: T,
                      inputReference: this.props.handlePipsInputRef,
                      disabled: e,
                      fontSizeStyle: this.props.fontSizeStyle,
                    }),
                  o.createElement(u, {
                    ...this._generateControlProps(1),
                    control: this.props.price,
                    className: this._generateClassName(1),
                    onFocus: this._focusHandler(1),
                    errorHandler: this.props.errorHandler,
                    error: b && this._isSelectedControl(1),
                    errorMessage: T,
                    inputReference: this.props.handlePriceInputRef,
                    disabled: e,
                    fontSizeStyle: this.props.fontSizeStyle,
                    inputMode: 'text',
                  }),
                  s,
                ),
              )
            )
          })
        }
        _mapSLTypesNames() {
          return this.props.stopLossTypes.map((e) => ({
            index: e,
            elem: o.createElement('span', null, y[e]),
          }))
        }
        _isSelectedControl(e) {
          return this.props.enabled && this.props.focusedControl === e
        }
        _generateClassName(e) {
          return r(
            g.control,
            !this.props.enabled && g.wait,
            0 === e && g.bracketInPips,
            1 === e && g.bracketInPrice,
            2 === e && g.bracketInCurrency,
            3 === e && g.bracketInPercent,
          )
        }
        _generateControlProps(e) {
          const t = {}
          return (
            this._isSelectedControl(e) && (t.highlight = !0),
            Boolean(this.props.error && this.props.error.res) &&
              this._isSelectedControl(e) &&
              (t.intent = 'danger'),
            t
          )
        }
      }
      function w(e) {
        const {
            model: t,
            isCryptoBracket: s,
            showRiskControls: r,
            orderTicketFocus: n,
          } = e,
          {
            enabled$: c,
            error$: p,
            focusedControl$: d,
            bracketType$: h,
            stopLossTypes: u,
            pips: m,
            price: b,
            riskInCurrency: k,
            riskInPercent: C,
            roundToStopLimitPriceStepRequired: v,
            isValuesInitialized: g,
            controlState: y,
            onControlFocused: f,
            getFocusedControl: w,
            getEnabled: E,
            getBracketType: x,
            getError: S,
            setFocusedControl: N,
            setEnabled: _,
            setBracketType: P,
            setControlError: L,
          } = t,
          M = (0, l.useObservable)(d, w()),
          I = (0, l.useObservable)(h, x()),
          D = (0, l.useObservable)(c, E()),
          R = (0, l.useObservable)(p, S()),
          B = (0, o.useRef)(null),
          O = (0, o.useRef)(null)
        return (
          (0, o.useEffect)(() => {
            if (i.mobiletouch || !D) return
            const e = (e) => {
              null !== e &&
                g &&
                (e.focus(), e.setSelectionRange(e.value.length, e.value.length))
            }
            ;((I === a.BracketType.TakeProfit && 3 === n) ||
              (I === a.BracketType.StopLoss && 4 === n)) &&
              e(O.current),
              I === a.BracketType.TrailingStop && 4 === n && e(B.current)
          }, [g]),
          o.createElement(T, {
            type: I,
            enabled: D,
            error: R,
            stopLossTypes: u,
            pips: m,
            price: b,
            riskInCurrency: k,
            riskInPercent: C,
            focusedControl: M,
            onFocus: (e) => {
              D || _(!0)
              M !== e && N(e)
              f.fire()
            },
            onToggleEnabled: () => {
              _(!D), f.fire()
            },
            errorHandler: (e) => {
              L(e)
            },
            handlePipsInputRef: (e) => (B.current = e),
            handlePriceInputRef: (e) => (O.current = e),
            setBracketType: P,
            isPipsControlHidden: v,
            controlState: y,
            isCryptoBracket: s,
            showRiskControls: r,
            fontSizeStyle: 'medium',
          })
        )
      }
      T.contextType = d.Context
      class E extends o.PureComponent {
        constructor(e) {
          super(e), (this._callback = () => this.forceUpdate())
        }
        componentDidMount() {
          this._subscribeToModel(this.props.model)
        }
        componentWillUnmount() {
          this._unsubscribeFromModel(this.props.model)
        }
        render() {
          const e = this.props.model,
            t =
              (e.takeProfitModel &&
                e.takeProfitModel.roundToStopLimitPriceStepRequired) ||
              (e.stopLossModel &&
                e.stopLossModel.roundToStopLimitPriceStepRequired),
            l = 'supportCryptoBrackets' in e && !0 === e.supportCryptoBrackets,
            i = l ? 'showCryptoBracketsInCurrency' : 'showBracketsInCurrency',
            a = l ? 'showCryptoBracketsInPercent' : 'showBracketsInPercent',
            c = e.showRiskControls,
            p = e.rewardRisk.value()
          return o.createElement(m.SettingsContext.Consumer, null, (d) =>
            o.createElement(
              o.Fragment,
              null,
              e.takeProfitModel &&
                o.createElement(w, {
                  model: e.takeProfitModel,
                  orderTicketFocus: this.props.focus,
                  isCryptoBracket: l,
                  showRiskControls: c,
                }),
              e.takeProfitModel &&
                e.stopLossModel &&
                o.createElement(
                  'div',
                  { className: g.labels },
                  o.createElement(
                    'div',
                    {
                      className: r(g.rewardRisk, p && 'apply-common-tooltip'),
                      title: p ? n.t(null, void 0, s(214078)) : void 0,
                    },
                    o.createElement('span', { className: g.rewardRiskText }, p),
                  ),
                  !t &&
                    o.createElement(
                      'span',
                      null,
                      'forex' === e.symbolType
                        ? n.t(null, void 0, s(778621))
                        : n.t(null, void 0, s(130973)),
                    ),
                  o.createElement('span', null, n.t(null, void 0, s(25684))),
                  c &&
                    d[i] &&
                    o.createElement(
                      'span',
                      null,
                      e.takeProfitModel ? e.takeProfitModel.currency : '',
                    ),
                  c &&
                    d[a] &&
                    o.createElement(
                      'span',
                      {
                        className: r('apply-common-tooltip'),
                        title: n.t(null, void 0, s(852997)),
                      },
                      '%',
                    ),
                ),
              e.stopLossModel &&
                o.createElement(w, {
                  model: e.stopLossModel,
                  orderTicketFocus: this.props.focus,
                  isCryptoBracket: l,
                  showRiskControls: c,
                }),
            ),
          )
        }
        _subscribeToModel(e) {
          e.rewardRisk.subscribe(this._callback)
        }
        _unsubscribeFromModel(e) {
          e.rewardRisk.unsubscribe(this._callback)
        }
      }
    },
    40176: (e, t, s) => {
      s.d(t, { CustomFields: () => b })
      var o = s(50959),
        r = s(363111),
        n = s(794087),
        l = s(302946),
        i = s(114891)
      function a(e) {
        const t = o.createElement(
          'span',
          { className: i.checkboxLabel },
          e.checkboxTitle,
        )
        return o.createElement(
          'div',
          null,
          e.title &&
            e.title.length > 0 &&
            o.createElement('div', { className: i.title }, e.title),
          o.createElement(n.InputWithError, {
            className: e.className,
            inputClassName: i.input,
            type: e.inputType,
            value: e.text,
            placeholder: e.placeholder,
            onChange: e.onInputChange,
            onClick: e.onClick,
            error: void 0 !== e.errorMessage,
            errorMessage: e.errorMessage,
          }),
          o.createElement(
            'div',
            { className: i.checkboxWrapper },
            o.createElement(l.Checkbox, {
              checked: e.checked,
              label: t,
              onChange: e.onCheckboxToggle,
            }),
          ),
        )
      }
      var c = s(661851),
        p = s(297265)
      function d(e) {
        const {
            inputType: t,
            text$: s,
            getText: n,
            setText: l,
            checked$: d,
            getChecked: h,
            setChecked: u,
            title: m,
            checkboxTitle: b,
            placeholder: k,
            orderPanelStatus: C,
            onControlFocused: v,
            errorMessage: g,
          } = e,
          y = (0, c.useObservable)(s, n()),
          f = (0, c.useObservable)(d, h()),
          T = (0, p.useWatchedValueReadonly)({ watchedValue: g })
        return o.createElement(
          'div',
          { className: i.customFieldWithCheckboxContainer },
          o.createElement(a, {
            className: C === r.OrderPanelStatus.Wait && i.wait,
            inputType: t,
            text: y,
            checked: f,
            title: m,
            checkboxTitle: b,
            placeholder: k,
            status: C,
            onInputChange: (e) => l(e.currentTarget.value),
            onCheckboxToggle: () => {
              u(!f), v.fire()
            },
            onClick: () => v.fire(),
            errorMessage: T,
          }),
        )
      }
      var h = s(587374),
        u = s(165962),
        m = s(223302)
      function b(e) {
        const { customFieldModels: t, orderPanelStatus: s, onClose: n } = e
        return o.createElement(
          o.Fragment,
          null,
          t.map((e) =>
            o.createElement(
              'div',
              { key: e.id, className: m.customField },
              'TextWithCheckBox' === e.type &&
                o.createElement(d, {
                  inputType: e.inputType,
                  text$: e.text$,
                  getText: e.getText,
                  setText: e.setText,
                  placeholder: e.placeholder,
                  checked$: e.checked$,
                  getChecked: e.getChecked,
                  setChecked: e.setChecked,
                  title: e.title,
                  checkboxTitle: e.checkboxTitle,
                  orderPanelStatus: s,
                  onControlFocused: e.onControlFocused,
                  errorMessage: e.errorMessage,
                }),
              'Checkbox' === e.type &&
                o.createElement(u.CheckboxCustomField, {
                  title: e.title,
                  help: e.help,
                  checked$: e.checked$,
                  getChecked: e.getChecked,
                  setChecked: e.setChecked,
                  disabled: e.disabled,
                  onControlFocused: e.onControlFocused,
                }),
              'ComboBox' === e.type &&
                o.createElement(h.CustomComboboxContainer, {
                  title: e.title,
                  items: e.items,
                  selectedItem$: e.selectedItem$,
                  getSelectedItem: e.getSelectedItem,
                  setSelectedItem: e.setSelectedItem,
                  onControlFocused: e.onControlFocused,
                  onClose: n,
                  disabled: e.items.length <= 1,
                  forceUserToSelectValue: s === r.OrderPanelStatus.Active,
                  alwaysShowAttachedErrors$: e.alwaysShowAttachedErrors$,
                }),
            ),
          ),
        )
      }
    },
    274837: (e, t, s) => {
      s.d(t, { useCommonDialogHandlers: () => a })
      var o = s(50959),
        r = s(660538),
        n = s(559410),
        l = s(206594),
        i = s(996038)
      function a(e) {
        const { isOpened: t, onOpen: s, onClose: a } = e
        ;(0, o.useEffect)(() => {
          const e = () => {
            null == a || a()
          }
          n.subscribe(l.CLOSE_POPUPS_AND_DIALOGS_COMMAND, e, null)
          const o = window.matchMedia(i.DialogBreakpoints.TabletSmall),
            c = window.matchMedia('(orientation: portrait)'),
            p = () => {
              t ? null == s || s(o.matches) : null == a || a()
            }
          return (
            p(),
            (0, r.mediaQueryAddEventListener)(c, p),
            () => {
              n.unsubscribe(l.CLOSE_POPUPS_AND_DIALOGS_COMMAND, e, null),
                (0, r.mediaQueryRemoveEventListener)(c, p)
            }
          )
        }, [t, a, s])
      }
    },
    564245: (e, t, s) => {
      s.d(t, { InfoTable: () => l })
      var o = s(50959),
        r = s(497754),
        n = s(191547)
      function l(e) {
        const t = e.rows.map((t, s) =>
          o.createElement(
            'div',
            {
              key: s,
              className: r(n.row, e.disabled && n.disabled),
              'data-name': 'info-table-row',
            },
            o.createElement(
              'div',
              {
                className: r(n.cell, n.cellTitle, t.listMarker && n.marker),
                'data-name': 'info-table-cell-title',
              },
              t.title,
            ),
            void 0 !== t.value &&
              o.createElement(
                'div',
                {
                  className: r(
                    n.cell,
                    n.cellValue,
                    e.rightAlignedValues && n.cellRightAligned,
                    void 0 !== t.type && i(t.type),
                  ),
                  'data-name': 'info-table-cell-value',
                },
                t.value,
              ),
          ),
        )
        return o.createElement(
          'div',
          { className: n.wrapper },
          e.header && o.createElement('div', { className: n.header }, e.header),
          t,
        )
      }
      function i(e) {
        switch (e) {
          case 0:
            return n.cellSideBuy
          case 1:
            return n.cellSideSell
          default:
            return
        }
      }
    },
    447538: (e, t, s) => {
      s.d(t, { PlaceAndModifyButton: () => p })
      var o = s(50959),
        r = s(423869),
        n = s(234404),
        l = s(171529),
        i = s(901317)
      var a = s(661851),
        c = s(74704)
      function p(e) {
        const { model: t, reference: s, buttonModel: p } = e,
          d =
            Object.hasOwn(t, 'sideModel') && 'sideModel' in t
              ? t.sideModel.value$
              : r.EMPTY,
          [h] = ((e) => {
            const [t, s] = (0, o.useState)(e.value())
            return (
              (0, o.useLayoutEffect)(() => {
                const t = (e) => s(e)
                return e.subscribe(t), () => e.unsubscribe(t)
              }, [e]),
              [t, (t) => e.setValue(t)]
            )
          })(t.disabled),
          [u] = (0, i.useWatchedValue)(t.loading),
          m = (0, a.useObservable)(p.value$, p.getValue()),
          b = 1 === (0, a.useObservable)(d, t.side()) ? 'brand' : 'red'
        return u
          ? o.createElement(
              l.SquareButton,
              {
                reference: s,
                className: c.button,
                size: 'xlarge',
                disabled: !0,
                'data-name': 'place-and-modify-button',
              },
              o.createElement(n.Loader, null),
            )
          : o.createElement(
              l.SquareButton,
              {
                ...m,
                reference: s,
                className: c.button,
                size: 'xlarge',
                color: b,
                disabled: h,
                onClick: () => t.doneButtonClick(),
                'data-name': 'place-and-modify-button',
              },
              void 0 === m.secondaryText ? m.primaryText : null,
            )
      }
    },
    438980: (e, t, s) => {
      s.d(t, { Measure: () => r })
      var o = s(664332)
      function r(e) {
        const { children: t, onResize: s } = e
        return t((0, o.useResizeObserver)(s || (() => {}), [null === s]))
      }
    },
    930894: (e, t, s) => {
      s.d(t, { Body: () => l })
      var o = s(50959),
        r = s(497754)
      s(278895), s(608636), s(72571)
      s(17817)
      var n = s(963208)
      function l(e) {
        return o.createElement(
          'div',
          { className: r(n.body, e.className), ref: e.reference },
          e.children,
        )
      }
      s(908783), s(639379)
    },
    101614: (e, t, s) => {
      s.d(t, { DropdownList: () => x })
      var o = s(50959),
        r = s(350191),
        n = s(497754),
        l = s(500962),
        i = s(273388),
        a = s(902390)
      class c extends o.PureComponent {
        constructor(e) {
          super(e)
        }
        render() {
          return o.createElement(
            'div',
            {
              className: this.props.className,
              onClick: this.props.onClick,
              ref: this.props.reference,
            },
            this.props.children,
          )
        }
      }
      var p = s(438980)
      class d extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleResize = ([e]) => {
              var t, s
              null === (s = (t = this.props).onMeasure) ||
                void 0 === s ||
                s.call(t, e.target.getBoundingClientRect())
            })
        }
        render() {
          const { theme: e = a } = this.props,
            t = n(e.list, {
              [this.props.className]: Boolean(this.props.className),
            }),
            { fontSize: s = 13 } = this.props,
            r = {
              bottom: this.props.bottom,
              fontSize: s,
              left: this.props.left,
              height: this.props.height || 'auto',
              right: this.props.right,
              top: this.props.top,
              width: this.props.width,
              zIndex: this.props.zIndex,
            }
          return o.createElement(
            p.Measure,
            {
              onResize: Boolean(this.props.onMeasure)
                ? this._handleResize
                : null,
            },
            (e) =>
              o.createElement(
                'div',
                {
                  className: t,
                  style: r,
                  ref: (0, i.mergeRefs)([this.props.reference, e]),
                },
                this._wrapItems(this.props.items, this.props.selected),
              ),
          )
        }
        componentDidMount() {
          if (
            ((this._el = l.findDOMNode(this)),
            void 0 !== this.props.selected &&
              this.props.shouldScrollIfNotVisible)
          ) {
            const e = this._items[this.props.selected]
            e && this._scrollIfNotVisible(e)
          }
        }
        componentDidUpdate() {
          if (
            void 0 !== this.props.selected &&
            this.props.shouldScrollIfNotVisible
          ) {
            const e = this._items[this.props.selected]
            e && this._scrollIfNotVisible(e)
          }
        }
        _wrapItems(e = [], t) {
          this._items = []
          const { itemWrap: s = c, theme: r = a } = this.props,
            l = s
          return e.map((e, s) => {
            const i = n(r.item, {
              [this.props.itemsClassName]: Boolean(this.props.itemsClassName),
              [this.props.selectedClassName]: t === s,
            })
            return o.createElement(
              l,
              {
                reference: (t) => {
                  t && this._items.push({ elem: t, index: s, value: e })
                },
                key: s,
                onClick: () => this._onSelect(s),
                className: i,
              },
              e.elem,
            )
          })
        }
        _onSelect(e) {
          this.props.onSelect && this.props.onSelect(e, this._items[e].value)
        }
        _scrollIfNotVisible(e) {
          const t = this._el.scrollTop,
            s = this._el.scrollTop + this._el.clientHeight,
            o = e.elem.offsetTop,
            r = o + e.elem.clientHeight
          o <= t
            ? e.elem.scrollIntoView(!0)
            : r >= s && e.elem.scrollIntoView(!1)
        }
      }
      d.defaultProps = { shouldScrollIfNotVisible: !0 }
      var h = s(841037),
        u = s(874485)
      class m extends o.PureComponent {
        render() {
          const e = {
            position: 'absolute',
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            bottom: this.props.bottom,
            right: this.props.right,
            left: this.props.left,
            zIndex: this.props.zIndex,
          }
          return o.createElement(
            'div',
            {
              className: this.props.className,
              style: e,
              ref: this.props.reference,
            },
            this.props.children,
          )
        }
      }
      m.displayName = 'Dropdown Container'
      const b = (0, u.makeOverlapable)((0, h.makeAttachable)(m))
      var k = s(109315),
        C = s(650151)
      class v extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._container = null),
            (this._setContainerRef = (e) => {
              'function' == typeof this.props.reference &&
                this.props.reference(e),
                'object' == typeof this.props.reference &&
                  (this.props.reference.current = e),
                (this._container = e)
            })
        }
        componentDidMount() {
          this.props.onDropdownWheelNoPassive &&
            this._addPassiveListenerOnWheel(this.props.onDropdownWheelNoPassive)
        }
        componentDidUpdate(e) {
          this.props.onDropdownWheelNoPassive !== e.onDropdownWheelNoPassive &&
            this._updatePassiveListenerOnWheel(e.onDropdownWheelNoPassive)
        }
        componentWillUnmount() {
          this.props.onDropdownWheelNoPassive &&
            this._removePassiveListenerOnWheel(
              this.props.onDropdownWheelNoPassive,
            )
        }
        render() {
          const {
              shadow: e = 'bottom',
              children: t,
              className: s,
            } = this.props,
            r = n(k.container, k[e], s),
            l = { maxHeight: this.props.maxHeight }
          return o.createElement(
            'div',
            {
              ref: this._setContainerRef,
              style: l,
              className: r,
              onTouchStart: this.props.onDropdownTouchStart,
              onTouchMove: this.props.onDropdownTouchMove,
              onTouchEnd: this.props.onDropdownTouchEnd,
              onWheel: this.props.onDropdownWheel,
            },
            t,
          )
        }
        _updatePassiveListenerOnWheel(e) {
          e && this._removePassiveListenerOnWheel(e),
            this.props.onDropdownWheelNoPassive &&
              this._addPassiveListenerOnWheel(
                this.props.onDropdownWheelNoPassive,
              )
        }
        _addPassiveListenerOnWheel(e) {
          ;(0, C.ensureNotNull)(this._container).addEventListener('wheel', e, {
            passive: !1,
          })
        }
        _removePassiveListenerOnWheel(e) {
          ;(0, C.ensureNotNull)(this._container).removeEventListener('wheel', e)
        }
      }
      var g = s(579184)
      const y =
        ((f = d),
        ((T = class extends o.PureComponent {
          constructor(e) {
            super(e), (this._items = this.props.items)
          }
          componentDidUpdate(e) {
            if (e.command !== this.props.command && this.props.command)
              switch (this.props.command.name) {
                case 'next':
                  this._next()
                  break
                case 'prev':
                  this._prev()
              }
            e.items !== this.props.items && (this._items = this.props.items)
          }
          render() {
            return o.createElement(f, { ...this.props }, this.props.children)
          }
          _next() {
            const { selected: e = -1 } = this.props,
              t = e + 1
            this._items.length - 1 >= t
              ? this._navigateTo(t)
              : this._navigateTo(0)
          }
          _prev() {
            const { selected: e = -1 } = this.props,
              t = e - 1,
              s = this._items.length - 1
            0 <= t ? this._navigateTo(t) : this._navigateTo(s)
          }
          _navigateTo(e) {
            this.props.onNavigate && this.props.onNavigate(e, this._items[e])
          }
        }).displayName = 'Navigateable Component'),
        T)
      var f, T
      const w = (0, g.makeAnchorable)(b),
        E = { top: 'top', bottom: 'bottom', topRight: 'top' }
      class x extends o.PureComponent {
        render() {
          const {
              anchor: e = 'bottom',
              fontSize: t = 14,
              root: s = 'parent',
            } = this.props,
            l = n(r.list, r[e]),
            { dropdownClassName: i, height: a, ...c } = this.props
          return o.createElement(
            w,
            { ...c, className: i, root: s },
            o.createElement(
              v,
              {
                className: this.props.dropdownContainerClassName,
                shadow: E[e],
                maxHeight: this.props.maxHeight,
                onDropdownTouchStart: this.props.onDropdownTouchStart
                  ? this.props.onDropdownTouchStart
                  : void 0,
                onDropdownTouchMove: this.props.onDropdownTouchMove
                  ? this.props.onDropdownTouchMove
                  : void 0,
                onDropdownTouchEnd: this.props.onDropdownTouchEnd
                  ? this.props.onDropdownTouchEnd
                  : void 0,
                onDropdownWheelNoPassive: this.props.onDropdownWheelNoPassive
                  ? this.props.onDropdownWheelNoPassive
                  : void 0,
              },
              o.createElement(y, {
                ...c,
                width: this.props.width,
                height: a,
                className: this.props.className || l,
                itemsClassName: this.props.itemsClassName || r.item,
                selectedClassName: this.props.selectedClassName || r.selected,
                fontSize: t,
                reference: this.props.reference,
              }),
            ),
          )
        }
      }
    },
    608636: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13"><path fill="currentColor" d="M5.18 6.6L1.3 2.7.6 2 2 .59l.7.7 3.9 3.9 3.89-3.9.7-.7L12.61 2l-.71.7L8 6.6l3.89 3.89.7.7-1.4 1.42-.71-.71L6.58 8 2.72 11.9l-.71.7-1.41-1.4.7-.71 3.9-3.9z"/></svg>'
    },
  },
])
