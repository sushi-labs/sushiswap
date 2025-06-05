;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6631],
  {
    11362: (e) => {
      e.exports = {
        wrapper: 'wrapper-GZajBGIm',
        input: 'input-GZajBGIm',
        view: 'view-GZajBGIm',
        danger: 'danger-GZajBGIm',
      }
    },
    4052: (e) => {
      e.exports = {
        box: 'box-ywH2tsV_',
        noOutline: 'noOutline-ywH2tsV_',
        disabled: 'disabled-ywH2tsV_',
        'intent-danger': 'intent-danger-ywH2tsV_',
        checked: 'checked-ywH2tsV_',
        check: 'check-ywH2tsV_',
        icon: 'icon-ywH2tsV_',
        dot: 'dot-ywH2tsV_',
        disableActiveStyles: 'disableActiveStyles-ywH2tsV_',
      }
    },
    65592: (e) => {
      e.exports = {
        checkbox: 'checkbox-vyj6oJxw',
        reverse: 'reverse-vyj6oJxw',
        label: 'label-vyj6oJxw',
        baseline: 'baseline-vyj6oJxw',
      }
    },
    2182: (e) => {
      e.exports = {
        'small-height-breakpoint': '(max-height: 360px)',
        footer: 'footer-PhMf7PhQ',
        submitButton: 'submitButton-PhMf7PhQ',
        buttons: 'buttons-PhMf7PhQ',
      }
    },
    70673: (e, t, n) => {
      n.d(t, { CheckboxInput: () => c })
      var s = n(50959),
        i = n(97754),
        a = n(90186),
        o = n(5811),
        l = n(11362),
        r = n.n(l)
      function c(e) {
        const t = i(r().wrapper, e.className)
        return s.createElement(
          'span',
          { className: t, title: e.title, style: e.style },
          s.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: i(e.intent && r()[e.intent], r().input),
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: () => {
              e.onChange?.(e.value)
            },
            ref: e.reference,
            'aria-required': e['aria-required'],
            'aria-describedby': e['aria-describedby'],
            'aria-invalid': e['aria-invalid'],
            ...(0, a.filterDataProps)(e),
          }),
          s.createElement(o.CheckboxView, {
            className: r().view,
            indeterminate: e.indeterminate,
            checked: e.checked,
            disabled: e.disabled,
            intent: e.intent,
            tabIndex: e.tabIndex,
          }),
        )
      }
    },
    5811: (e, t, n) => {
      n.d(t, { CheckboxView: () => c })
      var s = n(50959),
        i = n(97754),
        a = n(9745),
        o = n(65890),
        l = n(4052),
        r = n.n(l)
      function c(e) {
        const {
            indeterminate: t,
            checked: n,
            tabIndex: l,
            className: c,
            disabled: u,
            disableActiveStyles: h,
            intent: d,
            hideIcon: m,
            ...p
          } = e,
          b = t || !n || m ? '' : o,
          v = i(
            r().box,
            r()[`intent-${d}`],
            !t && r().check,
            !!t && r().dot,
            -1 === l && r().noOutline,
            c,
            n && r().checked,
            u && r().disabled,
            h && r().disableActiveStyles,
          )
        return s.createElement(
          'span',
          { className: v, ...p },
          s.createElement(a.Icon, { icon: b, className: r().icon }),
        )
      }
    },
    15294: (e, t, n) => {
      n.d(t, { Checkbox: () => c })
      var s = n(50959),
        i = n(97754),
        a = n(59416),
        o = n(70673),
        l = n(65592),
        r = n.n(l)
      class c extends s.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...n } = this.props,
            a = i(this.props.className, r().checkbox, {
              [r().reverse]: Boolean(this.props.labelPositionReverse),
              [r().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            l = i(r().label, t, { [r().disabled]: this.props.disabled })
          let c = null
          return (
            this.props.label &&
              (c = s.createElement(
                'span',
                { className: l, title: this.props.title },
                this.props.label,
              )),
            s.createElement(
              'label',
              { className: a },
              s.createElement(o.CheckboxInput, { ...n, className: e }),
              c,
            )
          )
        }
      }
      c.defaultProps = { value: 'on' }
      ;(0, a.makeSwitchGroupItem)(c)
      n(5811)
    },
    59416: (e, t, n) => {
      n.d(t, { SwitchGroup: () => o, makeSwitchGroupItem: () => l })
      var s = n(50959),
        i = n(55883)
      const a = (0, s.createContext)({
        getName: () => '',
        getValues: () => [],
        getOnChange: () => i.default,
        subscribe: i.default,
        unsubscribe: i.default,
      })
      class o extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e)
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e)
            }),
            (this.state = {
              switchGroupContext: {
                getName: this._getName,
                getValues: this._getValues,
                getOnChange: this._getOnChange,
                subscribe: this._subscribe,
                unsubscribe: this._unsubscribe,
              },
            })
        }
        render() {
          return s.createElement(
            a.Provider,
            { value: this.state.switchGroupContext },
            this.props.children,
          )
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values))
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e))
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((n) =>
            t.includes(n) ? !e.includes(n) : e.includes(n),
          )
        }
      }
      function l(e) {
        var t
        return (
          (t = class extends s.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.getOnChange()(e)
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate()
                })
            }
            componentDidMount() {
              this.context.subscribe(this._onUpdate)
            }
            render() {
              return s.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              })
            }
            componentWillUnmount() {
              this.context.unsubscribe(this._onUpdate)
            }
            _getName() {
              return this.context.getName()
            }
            _isChecked() {
              return this.context.getValues().includes(this.props.value)
            }
          }),
          (t.contextType = a),
          t
        )
      }
    },
    50182: (e, t, n) => {
      n.d(t, { AdaptiveConfirmDialog: () => m })
      var s,
        i = n(50959),
        a = n(97754),
        o = n.n(a),
        l = n(67248),
        r = n(50151),
        c = n(11542),
        u = n(68335),
        h = n(79418),
        d = n(2182)
      !((e) => {
        ;(e.Submit = 'submit'), (e.Cancel = 'cancel'), (e.None = 'none')
      })(s || (s = {}))
      class m extends i.PureComponent {
        constructor() {
          super(...arguments),
            (this._dialogRef = i.createRef()),
            (this._handleClose = () => {
              const {
                defaultActionOnClose: e,
                onSubmit: t,
                onCancel: n,
                onClose: s,
              } = this.props
              switch (e) {
                case 'submit':
                  t()
                  break
                case 'cancel':
                  n()
              }
              s()
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleKeyDown = (e) => {
              const {
                onSubmit: t,
                submitButtonDisabled: n,
                submitOnEnterKey: s,
              } = this.props
              13 === (0, u.hashFromEvent)(e) &&
                s &&
                (e.preventDefault(), n || t())
            })
        }
        render() {
          const {
            render: e,
            onClose: t,
            onSubmit: n,
            onCancel: s,
            footerLeftRenderer: a,
            submitButtonText: o,
            submitButtonDisabled: l,
            defaultActionOnClose: r,
            submitOnEnterKey: c,
            ...u
          } = this.props
          return i.createElement(h.AdaptivePopupDialog, {
            ...u,
            ref: this._dialogRef,
            onKeyDown: this._handleKeyDown,
            render: this._renderChildren(),
            onClose: this._handleClose,
          })
        }
        focus() {
          ;(0, r.ensureNotNull)(this._dialogRef.current).focus()
        }
        _renderChildren() {
          return (e) => {
            const {
              render: t,
              footerLeftRenderer: s,
              additionalButtons: a,
              submitButtonText: r,
              submitButtonDisabled: u,
              onSubmit: h,
              cancelButtonText: m,
              showCancelButton: p = !0,
              showSubmitButton: b = !0,
              submitButtonClassName: v,
              cancelButtonClassName: _,
              buttonsWrapperClassName: g,
            } = this.props
            return i.createElement(
              i.Fragment,
              null,
              t(e),
              i.createElement(
                'div',
                { className: d.footer },
                s && s(e.isSmallWidth),
                i.createElement(
                  'div',
                  { className: o()(d.buttons, g) },
                  a,
                  p &&
                    i.createElement(
                      l.Button,
                      {
                        className: _,
                        name: 'cancel',
                        appearance: 'stroke',
                        onClick: this._handleCancel,
                      },
                      m ?? c.t(null, void 0, n(4543)),
                    ),
                  b &&
                    i.createElement(
                      'span',
                      { className: d.submitButton },
                      i.createElement(
                        l.Button,
                        {
                          className: v,
                          disabled: u,
                          name: 'submit',
                          onClick: h,
                          'data-name': 'submit-button',
                        },
                        r ?? c.t(null, void 0, n(19295)),
                      ),
                    ),
                ),
              ),
            )
          }
        }
      }
      m.defaultProps = { defaultActionOnClose: 'submit', submitOnEnterKey: !0 }
    },
    99304: (e) => {
      e.exports = { loading: 'loading-BPaLXf0z' }
    },
    21767: (e) => {
      e.exports = {
        container: 'container-CD9TBN7D',
        withSuggestions: 'withSuggestions-CD9TBN7D',
        title: 'title-CD9TBN7D',
        autocomplete: 'autocomplete-CD9TBN7D',
        saveSymbol: 'saveSymbol-CD9TBN7D',
        saveInterval: 'saveInterval-CD9TBN7D',
        indicators: 'indicators-CD9TBN7D',
        hintLabel: 'hintLabel-CD9TBN7D',
        hintMark: 'hintMark-CD9TBN7D',
        hidden: 'hidden-CD9TBN7D',
        labelWrap: 'labelWrap-CD9TBN7D',
        label: 'label-CD9TBN7D',
        accessibleLabel: 'accessibleLabel-CD9TBN7D',
      }
    },
    3606: (e, t, n) => {
      n.r(t), n.d(t, { StudyTemplateSaver: () => J })
      var s = n(50151),
        i = n(11542),
        a = n(50959),
        o = (n(21251), n(97754)),
        l = n(49483),
        r = n(15294),
        c = n(39416),
        u = n(38780),
        h = n(16684),
        d = n(53680),
        m = n(9745),
        p = n(50182),
        b = n(50655),
        v = n(26996),
        _ = n(99304)
      function g(e) {
        const { isLoading: t } = e
        return a.createElement(
          'span',
          { className: t ? _.loading : void 0 },
          i.t(null, void 0, n(64e3)),
          t && a.createElement(v.Loader, { color: 'white' }),
        )
      }
      class C extends a.PureComponent {
        constructor(e) {
          super(e),
            (this._dialogRef = a.createRef()),
            (this._manager = null),
            (this._handleSubmit = () => {
              this.setState({ isLoading: !0 }), this.props.onSubmit(this)
            }),
            (this.state = { isLoading: !1 })
        }
        render() {
          const {
            isOpened: e,
            saveDisabled: t,
            title: n,
            onClose: s,
          } = this.props
          return a.createElement(p.AdaptiveConfirmDialog, {
            ref: this._dialogRef,
            onClose: s,
            onSubmit: this._handleSubmit,
            onCancel: s,
            onClickOutside: s,
            isOpened: e,
            title: n,
            dataName: 'save-rename-dialog',
            render: this._renderDialogBody(),
            defaultActionOnClose: 'none',
            submitButtonText: a.createElement(g, {
              isLoading: this.state.isLoading,
            }),
            submitButtonDisabled: t,
          })
        }
        focus() {
          ;(0, s.ensureNotNull)(this._dialogRef.current).focus()
        }
        manager() {
          return this._manager
        }
        submit() {
          this.props.onSubmit(this)
        }
        close() {
          this.props.onClose()
        }
        dropLoading() {
          this.setState({ isLoading: !1 })
        }
        _renderDialogBody() {
          return () =>
            a.createElement(
              b.SlotContext.Consumer,
              null,
              (e) => ((this._manager = e), this.props.children),
            )
        }
      }
      var f = n(30575),
        S = n(85508),
        x = n(21767)
      const w = i.t(null, void 0, n(59233)),
        y = i.t(null, void 0, n(6081)),
        N = i.t(null, void 0, n(57149)),
        D = i.t(null, void 0, n(18698)),
        k = [x.hintMark, 'apply-common-tooltip']
      function E(e) {
        const {
            title: t,
            saveSymbolHintText: n,
            saveIntervalHintText: s,
            indicatorsText: i,
            source: l,
            onClose: c,
            onSubmit: u,
          } = e,
          [m, p] = (0, a.useState)(''),
          [b, v] = (0, a.useState)(!1),
          [_, g] = (0, a.useState)(!1),
          [S, k] = (0, a.useState)(!1),
          E = (0, a.useRef)(null),
          B = (0, h.useAutoSelect)()
        return a.createElement(
          C,
          {
            ref: E,
            isOpened: !0,
            saveDisabled: !m,
            title: t,
            onClose: c,
            onSubmit: (e) => {
              u({ title: m, saveSymbol: b, saveInterval: _ }, e)
            },
          },
          a.createElement(
            'div',
            { className: o(x.container, S && x.withSuggestions) },
            a.createElement('div', { className: x.title }, w),
            a.createElement(
              'div',
              { className: x.autocomplete },
              a.createElement(d.Autocomplete, {
                maxLength: 64,
                value: m,
                onChange: p,
                source: l,
                allowUserDefinedValues: !0,
                preventOnFocusOpen: !0,
                noEmptyText: !0,
                preventSearchOnEmptyQuery: !0,
                filter: f.autocompleteFilter,
                setupHTMLInput: (e) => {
                  B.current = e
                },
                onSuggestionsOpen: () => {
                  k(!0)
                },
                onSuggestionsClose: () => {
                  k(!1)
                },
                onBlur: () => {
                  E.current?.focus()
                },
                emojiPicker: !0,
              }),
            ),
            a.createElement(
              'div',
              { className: x.saveSymbol },
              a.createElement(r.Checkbox, {
                label: a.createElement(T, { title: N, hint: n }),
                onChange: () => {
                  v(!b)
                },
                checked: b,
              }),
            ),
            a.createElement(
              'div',
              { className: x.saveInterval },
              a.createElement(r.Checkbox, {
                label: a.createElement(T, { title: D, hint: s }),
                onChange: () => {
                  g(!_)
                },
                checked: _,
              }),
            ),
            a.createElement('div', { className: x.title }, y),
            a.createElement(
              'div',
              { className: o(x.indicators, S && x.withSuggestions) },
              i,
            ),
          ),
        )
      }
      function T(e) {
        const { title: t, hint: n } = e,
          i = (0, c.useFunctionalRefObject)(null)
        return a.createElement(
          'div',
          { className: x.labelWrap },
          a.createElement('span', { className: x.label }, t),
          a.createElement(
            'button',
            {
              type: 'button',
              ref: i,
              'aria-label': n,
              'data-tooltip': n,
              className: o(
                x.hintLabel,
                'apply-common-tooltip',
                x.accessibleLabel,
              ),
              title: n,
              onFocus: () =>
                (0, u.showOnElement)((0, s.ensureNotNull)(i.current)),
              onBlur: () => (0, u.hide)(),
            },
            a.createElement(m.Icon, { className: o(k), icon: S }),
          ),
        )
      }
      l.CheckMobile.any() && k.push(x.hidden)
      var B = n(76422),
        I = n(52092),
        O = n(87896),
        L = n(99663)
      class P {
        constructor(e) {
          ;(this._container = document.createElement('div')),
            (this._rootInstance = null),
            (this.close = () => {
              this.unmount(), this._onClose && this._onClose()
            }),
            (this.unmount = () => {
              B.unsubscribe(
                I.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
                this.unmount,
                null,
              ),
                this._rootInstance?.unmount(),
                (this._rootInstance = null)
            }),
            (this._title = e.title),
            (this._saveSymbolHintText = e.saveSymbolHintText),
            (this._saveIntervalHintText = e.saveIntervalHintText),
            (this._indicatorsText = e.indicatorsText),
            (this._source = e.source),
            (this._onSubmit = e.onSubmit),
            (this._onClose = e.onClose),
            B.subscribe(I.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this.unmount, null)
        }
        destroy() {
          this.unmount()
        }
        show(e) {
          this._mount(e)
        }
        _mount(e) {
          const t = a.createElement(
            L.SlotContext.Provider,
            { value: e || null },
            a.createElement(E, {
              title: this._title,
              saveSymbolHintText: this._saveSymbolHintText,
              saveIntervalHintText: this._saveIntervalHintText,
              indicatorsText: this._indicatorsText,
              source: this._source,
              onClose: this.close,
              onSubmit: this._onSubmit,
            }),
          )
          this._rootInstance
            ? this._rootInstance.render(t)
            : (this._rootInstance = (0, O.createReactRoot)(t, this._container))
        }
      }
      var A = n(39076),
        H = n(3615),
        M = n(24708),
        V = n(22980),
        R = n(76032)
      const G = i.t(null, void 0, n(71924)),
        U = i.t(null, void 0, n(13860)),
        j = i.t(null, void 0, n(63035)),
        F = i.t(null, void 0, n(9372))
      function W(e) {
        if (!('error' in e)) return e.result.id
      }
      function K(e, t, n) {
        const s = (e) => {
          A.backend.invalidateStudyTemplatesList(),
            A.backend.getStudyTemplatesList().then((n) => t(n, W(e)))
        }
        A.backend.saveStudyTemplate(e).then(s)
      }
      class J {
        constructor(e) {
          ;(this._dialog = null),
            (this._onSave = (e, t) => {
              this._options.onSave(e, t), this._close()
            }),
            (this._showSaveDialog = async (e) => {
              const t = this._controller.model().mainSeries().symbol(),
                n = this._controller.model().mainSeries().interval(),
                s = await this._getActualTemplateList()
              await this._showTemplateSaveRenameDialog(s, t, n, e)
            }),
            (this._close = () => {
              this._dialog && (this._dialog.destroy(), (this._dialog = null))
            }),
            (this._options = e),
            (this._controller = e.controller)
        }
        show(e) {
          ;(0, V.runOrSigninWithFeature)(() => this._showSaveDialog(e), {
            feature: 'customIndicators',
            source: 'Study templates save as',
            sourceMeta: 'Chart',
          })
        }
        _doSave(e, t, n) {
          const { title: s, saveSymbol: i, saveInterval: a } = t,
            o = s.trim()
          if (!o) return
          const l = n.manager() || void 0,
            r = (0, R.getStudyTemplateSaveData)(
              o,
              this._controller.model(),
              i,
              a,
            )
          if (e.find((e) => e.name === o)) {
            const e = (e) => {
              e ? K(r, this._onSave) : (n.focus(), n.dropLoading())
            }
            ;((e, t) =>
              new Promise((n) =>
                (0, H.showConfirm)(
                  {
                    text: F.format({ templateName: e }),
                    onConfirm: ({ dialogClose: e }) => {
                      n(!0), e()
                    },
                    onClose: () => n(!1),
                  },
                  t,
                ),
              ))(o, l).then(e)
          } else {
            K(r, this._onSave)
          }
        }
        _getActualTemplateList() {
          return (
            A.backend.invalidateStudyTemplatesList(),
            A.backend.getStudyTemplatesList()
          )
        }
        _showTemplateSaveRenameDialog(e, t, n, s) {
          const i = (0, R.getStudyTemplateMetaInfo)(this._controller.model())
          ;(this._dialog = new P({
            source: e.map((e) => e.name),
            title: G,
            saveSymbolHintText: U.format({ symbol: t }),
            saveIntervalHintText: j.format({
              interval: (0, M.translatedIntervalString)(n),
            }),
            indicatorsText: (0, R.getStudyTemplateDescString)(i.indicators),
            onSubmit: (t, n) => this._doSave(e, t, n),
            onClose: this._close,
          })).show(s)
        }
      }
    },
    30575: (e, t, n) => {
      function s(e, t) {
        return Boolean(
          '' === e || (e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())),
        )
      }
      n.d(t, { autocompleteFilter: () => s })
    },
    65890: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke="currentColor" stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    85508: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 8.5h1.5V14"/><circle fill="currentColor" cx="9" cy="5" r="1"/><path stroke="currentColor" d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/></svg>'
    },
    55883: (e, t, n) => {
      n.d(t, { default: () => s })
      const s = () => {}
    },
  },
])
