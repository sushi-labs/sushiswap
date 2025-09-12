;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6265],
  {
    45658: (e) => {
      e.exports = {
        small: 'small-CtnpmPzP',
        medium: 'medium-CtnpmPzP',
        large: 'large-CtnpmPzP',
        switchView: 'switchView-CtnpmPzP',
        checked: 'checked-CtnpmPzP',
        disabled: 'disabled-CtnpmPzP',
        track: 'track-CtnpmPzP',
        thumb: 'thumb-CtnpmPzP',
      }
    },
    20071: (e) => {
      e.exports = {
        switcher: 'switcher-fwE97QDf',
        input: 'input-fwE97QDf',
        thumbWrapper: 'thumbWrapper-fwE97QDf',
        disabled: 'disabled-fwE97QDf',
        checked: 'checked-fwE97QDf',
      }
    },
    53483: (e) => {
      e.exports = { scrollable: 'scrollable-vwgPOHG8', tabs: 'tabs-vwgPOHG8' }
    },
    83428: (e) => {
      e.exports = {
        defaultsButtonText: 'defaultsButtonText-aJgjxj2V',
        defaultsButtonItem: 'defaultsButtonItem-aJgjxj2V',
        defaultsButtonIcon: 'defaultsButtonIcon-aJgjxj2V',
      }
    },
    50670: (e) => {
      e.exports = {
        themesButtonText: 'themesButtonText-AeBgp7zz',
        themesButtonIcon: 'themesButtonIcon-AeBgp7zz',
        defaultsButtonText: 'defaultsButtonText-AeBgp7zz',
        defaultsButtonItem: 'defaultsButtonItem-AeBgp7zz',
      }
    },
    238: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    33636: (e) => {
      e.exports = { 'link-item': 'link-item-eIA09f0e' }
    },
    32498: (e) => {
      e.exports = {
        'arrow-icon': 'arrow-icon-NIrWNOPk',
        dropped: 'dropped-NIrWNOPk',
        'size-xsmall': 'size-xsmall-NIrWNOPk',
        'size-small': 'size-small-NIrWNOPk',
        'size-medium': 'size-medium-NIrWNOPk',
        'size-large': 'size-large-NIrWNOPk',
        'size-xlarge': 'size-xlarge-NIrWNOPk',
      }
    },
    56406: (e) => {
      e.exports = {
        'underline-tab': 'underline-tab-cfYYXvwA',
        'disable-focus-outline': 'disable-focus-outline-cfYYXvwA',
        'enable-cursor-pointer': 'enable-cursor-pointer-cfYYXvwA',
        selected: 'selected-cfYYXvwA',
        'disable-active-state-styles': 'disable-active-state-styles-cfYYXvwA',
        'size-xsmall': 'size-xsmall-cfYYXvwA',
        'size-small': 'size-small-cfYYXvwA',
        'size-medium': 'size-medium-cfYYXvwA',
        'size-large': 'size-large-cfYYXvwA',
        'size-xlarge': 'size-xlarge-cfYYXvwA',
        fake: 'fake-cfYYXvwA',
        'margin-xsmall': 'margin-xsmall-cfYYXvwA',
        'margin-small': 'margin-small-cfYYXvwA',
        'margin-medium': 'margin-medium-cfYYXvwA',
        'margin-large': 'margin-large-cfYYXvwA',
        'margin-xlarge': 'margin-xlarge-cfYYXvwA',
        collapse: 'collapse-cfYYXvwA',
        'ellipsis-children': 'ellipsis-children-cfYYXvwA',
      }
    },
    98163: (e) => {
      e.exports = {
        'scroll-wrap': 'scroll-wrap-SmxgjhBJ',
        'size-xlarge': 'size-xlarge-SmxgjhBJ',
        'enable-scroll': 'enable-scroll-SmxgjhBJ',
        'underline-tabs': 'underline-tabs-SmxgjhBJ',
        'size-large': 'size-large-SmxgjhBJ',
        'size-medium': 'size-medium-SmxgjhBJ',
        'size-small': 'size-small-SmxgjhBJ',
        'size-xsmall': 'size-xsmall-SmxgjhBJ',
        'make-grid-column': 'make-grid-column-SmxgjhBJ',
        'stretch-tabs': 'stretch-tabs-SmxgjhBJ',
        'equal-tab-size': 'equal-tab-size-SmxgjhBJ',
      }
    },
    50368: (e) => {
      e.exports = {
        underline: 'underline-Pun8HxCz',
        center: 'center-Pun8HxCz',
        corner: 'corner-Pun8HxCz',
        disabled: 'disabled-Pun8HxCz',
      }
    },
    38546: (e, t, l) => {
      l.d(t, { DialogTabs: () => o })
      var n = l(50959),
        r = l(86720)
      const o = n.forwardRef((e, t) => {
        const { id: l, tabs: o, activeTab: i, onChange: s, className: a } = e
        return n.createElement(
          'div',
          { className: a, ref: t },
          n.createElement(r.UnderlineButtonTabs, {
            id: l,
            items: o,
            isActive: (e) => e.id === i,
            onActivate: (e) => {
              s(e.id)
            },
            overflowBehaviour: 'scroll',
          }),
        )
      })
    },
    81346: (e, t, l) => {
      l.r(t), l.d(t, { EditObjectDialogRenderer: () => kl })
      var n = l(50959),
        r = l(50151),
        o = l(11542),
        i = l(45126),
        s = l(86129),
        a = l(56840),
        c = l(56570),
        d = l(76422),
        p = l(51768),
        u = l(50182),
        h = l(59064),
        m = l(86656),
        v = l(79036),
        y = l(37289),
        g = l(32755),
        b = l(48531),
        f = l(38546),
        w = l(78890),
        C = l(53483)
      class P extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClose = (e) => {
              ;(e?.target &&
                (e.target.closest('[data-dialog-name="gopro"]') ||
                  e.target.closest('[data-name=support-dialog]'))) ||
                this.props.onClose()
            }),
            (this._handleResetToDefaults = () => {
              const { source: e, model: t } = this.props
              ;(0, v.isStudy)(e) && t.restorePropertiesForSource(e)
            }),
            (this._handleSaveAsDefaults = () => {
              const { source: e } = this.props
              ;(0, v.isStudy)(e) &&
                (e.properties().saveDefaults(),
                d.emit('study_dialog_save_defaults', e.id()))
            }),
            (this._renderFooterLeft = (e) => {
              const { source: t, model: l } = this.props
              if ((0, g.isLineTool)(t))
                return n.createElement(b.FooterMenu, {
                  sources: [t],
                  chartUndoModel: l,
                })
              if ((0, v.isStudy)(t))
                return n.createElement(w.PropertyActions, {
                  saveAsDefaults: this._handleSaveAsDefaults,
                  resetToDefaults: this._handleResetToDefaults,
                  mode: e ? 'compact' : 'normal',
                })
              throw new TypeError('Unsupported source type.')
            }),
            (this._handleSelect = (e) => {
              this.setState({ activeTabId: e }, () => {
                this._requestResize && this._requestResize()
              }),
                this.props.onActiveTabChanged &&
                  this.props.onActiveTabChanged(e)
            }),
            (this._handleScroll = () => {
              h.globalCloseDelegate.fire()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this.props.onClose()
            })
          const { pages: t, initialActiveTab: l } = this.props,
            r = t.find((e) => e.id === l) ?? t[0]
          this.state = { activeTabId: r.id }
        }
        render() {
          const {
            title: e,
            onCancel: t,
            onClose: l,
            shouldReturnFocus: r,
          } = this.props
          return n.createElement(u.AdaptiveConfirmDialog, {
            dataName: 'indicator-properties-dialog',
            title: e,
            isOpened: !0,
            onSubmit: this._handleSubmit,
            onCancel: t,
            onClickOutside: this._handleClose,
            onClose: l,
            footerLeftRenderer: this._renderFooterLeft,
            render: this._renderChildren(),
            submitOnEnterKey: !1,
            shouldReturnFocus: r,
          })
        }
        _renderChildren() {
          return ({ requestResize: e }) => {
            this._requestResize = e
            const { pages: t, source: l, model: r } = this.props,
              { activeTabId: o } = this.state,
              i = t.find((e) => e.id === o) ?? t[0],
              s = 'Component' in i ? void 0 : i.page,
              a = t.map(({ label: e, id: t }) => ({
                label: e,
                id: t,
                dataId: `indicator-properties-dialog-tabs-${t}`,
              }))
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(f.DialogTabs, {
                className: C.tabs,
                id: 'indicator-properties-dialog-tabs',
                activeTab: i.id,
                onChange: this._handleSelect,
                tabs: a,
              }),
              n.createElement(
                m.TouchScrollContainer,
                { className: C.scrollable, onScroll: this._handleScroll },
                'Component' in i
                  ? n.createElement(i.Component, { source: l, model: r })
                  : n.createElement(y.PropertiesEditorTab, {
                      page: s,
                      tableKey: i.id,
                    }),
              ),
            )
          }
        }
      }
      var S = l(33900),
        E = l(28388)
      class T extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._properties = this.props.source.properties()),
            (this._inputs = new E.MetaInfoHelper(
              this.props.source.metaInfo(),
            ).getUserEditableInputs())
        }
        render() {
          return n.createElement(S.InputsTabContent, {
            property: this._properties,
            model: this.props.model,
            study: this.props.source,
            studyMetaInfo: this.props.source.metaInfo(),
            inputs: this._inputs,
          })
        }
      }
      var x = l(22064),
        k = l(94113),
        _ = l(68159),
        I = l(353),
        L = l(30582),
        R = l(49794),
        D = l(56530)
      const B = new i.TranslatedString(
        'change visibility',
        o.t(null, void 0, l(1924)),
      )
      class V extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { visible: l } = this.props
              l && t(l, e, B)
            })
        }
        render() {
          const { id: e, title: t, visible: l, disabled: r } = this.props,
            o = (0, s.clean)((0, D.getTranslatedInputTitle)(t), !0)
          return n.createElement(L.BoolInputComponent, {
            label: o,
            disabled: r,
            input: { id: e, type: 'bool', defval: !0, name: 'visible' },
            value: !l || (0, R.getPropertyValue)(l),
            onChange: this._onChange,
          })
        }
      }
      V.contextType = I.StylePropertyContext
      var N = l(24980),
        A = l(11684),
        z = l(10428),
        M = l(94697),
        W = l(94152),
        H = l(18819),
        F = l(14643),
        O = l(46464),
        U = l(96298),
        G = l(18621),
        Y = l(98450),
        j = l(91512),
        X = l(93976),
        q = l(72914),
        J = l(21579)
      const K = {
          [k.LineStudyPlotStyle.Line]: {
            type: k.LineStudyPlotStyle.Line,
            order: 0,
            icon: W,
            label: o.t(null, void 0, l(3554)),
          },
          [k.LineStudyPlotStyle.LineWithBreaks]: {
            type: k.LineStudyPlotStyle.LineWithBreaks,
            order: 1,
            icon: H,
            label: o.t(null, void 0, l(34862)),
          },
          [k.LineStudyPlotStyle.StepLine]: {
            type: k.LineStudyPlotStyle.StepLine,
            order: 2,
            icon: F,
            label: o.t(null, void 0, l(69217)),
          },
          [k.LineStudyPlotStyle.StepLineWithBreaks]: {
            type: k.LineStudyPlotStyle.StepLineWithBreaks,
            order: 3,
            icon: O,
            label: o.t(null, void 0, l(14788)),
          },
          [k.LineStudyPlotStyle.StepLineWithDiamonds]: {
            type: k.LineStudyPlotStyle.StepLineWithDiamonds,
            order: 4,
            icon: U,
            label: o.t(null, void 0, l(11877)),
          },
          [k.LineStudyPlotStyle.Histogram]: {
            type: k.LineStudyPlotStyle.Histogram,
            order: 5,
            icon: G,
            label: o.t(null, void 0, l(78057)),
          },
          [k.LineStudyPlotStyle.Cross]: {
            type: k.LineStudyPlotStyle.Cross,
            order: 6,
            icon: Y,
            label: o.t(null, { context: 'chart_type' }, l(33857)),
          },
          [k.LineStudyPlotStyle.Area]: {
            type: k.LineStudyPlotStyle.Area,
            order: 7,
            icon: j,
            label: o.t(null, void 0, l(34456)),
          },
          [k.LineStudyPlotStyle.AreaWithBreaks]: {
            type: k.LineStudyPlotStyle.AreaWithBreaks,
            order: 8,
            icon: X,
            label: o.t(null, void 0, l(7349)),
          },
          [k.LineStudyPlotStyle.Columns]: {
            type: k.LineStudyPlotStyle.Columns,
            order: 9,
            icon: q,
            label: o.t(null, void 0, l(55761)),
          },
          [k.LineStudyPlotStyle.Circles]: {
            type: k.LineStudyPlotStyle.Circles,
            order: 10,
            icon: J,
            label: o.t(null, void 0, l(5669)),
          },
        },
        $ = Object.values(K)
          .sort((e, t) => e.order - t.order)
          .map((e) => ({
            value: e.type,
            selectedContent: n.createElement(M.DisplayItem, { icon: e.icon }),
            content: n.createElement(M.DropItem, {
              icon: e.icon,
              label: e.label,
            }),
          })),
        Z = o.t(null, void 0, l(72926))
      class Q extends n.PureComponent {
        render() {
          const {
            id: e,
            plotType: t,
            className: l,
            priceLine: r,
            plotTypeChange: o,
            priceLineChange: i,
            disabled: s,
          } = this.props
          if (!(t in K)) return null
          const a = {
            readonly: !0,
            content: n.createElement(
              n.Fragment,
              null,
              n.createElement(z.MenuItemSwitcher, {
                id: 'PlotTypePriceLineSwitch',
                checked: r,
                label: Z,
                preventLabelHighlight: !0,
                value: 'priceLineSwitcher',
                onChange: i,
              }),
              n.createElement(A.PopupMenuSeparator, null),
            ),
          }
          return n.createElement(M.IconDropdown, {
            id: e,
            disabled: s,
            className: l,
            hideArrowButton: !0,
            items: [a, ...$],
            value: t,
            onChange: o,
          })
        }
      }
      var ee = l(67565),
        te = l(52444)
      const le = new i.TranslatedString(
          'change plot type',
          o.t(null, void 0, l(43439)),
        ),
        ne = new i.TranslatedString(
          'change price line visibility',
          o.t(null, void 0, l(8662)),
        )
      class re extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context,
                {
                  styleProp: { plottype: l },
                } = this.props
              l && t(l, e, le)
            }),
            (this._onPriceLineChange = (e) => {
              const { setValue: t } = this.context,
                {
                  styleProp: { trackPrice: l },
                } = this.props
              l && t(l, e, ne)
            })
        }
        render() {
          const {
              id: e,
              paletteColor: t,
              paletteColorProps: l,
              styleProp: r,
              isLine: o,
              hasPlotTypeSelect: i,
              grouped: s,
              offset: a,
            } = this.props,
            c = l.childs()
          return n.createElement(
            N.InputRow,
            {
              grouped: s,
              label: n.createElement(
                'div',
                { className: te.childRowContainer },
                (0, D.getTranslatedInputTitle)(t.name),
              ),
              offset: a,
            },
            n.createElement(ee.ColorWithLinePropertySelect, {
              disabled: !r.visible.value(),
              color: c.color,
              transparency: r.transparency,
              thickness: o ? c.width : void 0,
              isPaletteColor: !0,
            }),
            o && i && r.plottype && r.trackPrice
              ? n.createElement(Q, {
                  id: (0, x.createDomId)(e, 'plot-type-select'),
                  disabled: !r.visible.value(),
                  className: te.smallStyleControl,
                  plotType: r.plottype.value(),
                  priceLine: r.trackPrice.value(),
                  plotTypeChange: this._onPlotTypeChange,
                  priceLineChange: this._onPriceLineChange,
                })
              : null,
          )
        }
      }
      re.contextType = I.StylePropertyContext
      var oe = l(71891)
      function ie(e, t, l, o, i, s, a) {
        const c = t.colors,
          d = l.colors
        return Object.keys(c).map((t, l) =>
          n.createElement(re, {
            key: a ? `${t}-secondary` : t,
            id: e,
            grouped: !0,
            paletteColor: (0, r.ensureDefined)(c[t]),
            paletteColorProps: (0, r.ensureDefined)(d[t]),
            styleProp: o,
            isLine: i,
            hasPlotTypeSelect: 0 === l,
            offset: s,
          }),
        )
      }
      class se extends n.PureComponent {
        render() {
          const {
              plot: e,
              area: t,
              palette: l,
              paletteProps: o,
              hideVisibilitySwitch: i,
              styleProp: s,
              showOnlyTitle: a,
              showSeparator: c = !0,
              offset: d,
              secondaryPalette: p,
              secondaryPaletteProps: u,
              title: h,
            } = this.props,
            m = e ? e.id : (0, r.ensureDefined)(t).id,
            v = !m.startsWith('fill') && e && (0, k.isLinePlot)(e)
          return n.createElement(
            n.Fragment,
            null,
            !i &&
              n.createElement(
                oe.PropertyTable.Row,
                null,
                n.createElement(
                  oe.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, offset: d },
                  a
                    ? n.createElement('div', null, h)
                    : n.createElement(V, {
                        id: m,
                        title: h,
                        visible: s.visible,
                      }),
                ),
              ),
            ie(m, l, o, s, v, d),
            p && u && ie(m, p, u, s, v, d, !0),
            c && n.createElement(oe.PropertyTable.GroupSeparator, null),
          )
        }
      }
      se.contextType = I.StylePropertyContext
      var ae = l(9343),
        ce = l(1183)
      class de extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._visible = new ce.StudyPlotVisibleProperty(
              e.styleProp.display,
            ))
        }
        render() {
          const {
            title: e,
            plot: t,
            area: l,
            palette: r,
            paletteProps: o,
            hideVisibilitySwitch: i,
            styleProp: s,
            showOnlyTitle: a,
            showSeparator: c = !0,
            offset: d,
          } = this.props
          return n.createElement(se, {
            plot: t,
            area: l,
            title: e,
            palette: r,
            paletteProps: o,
            styleProp: { ...s, visible: this._visible },
            showSeparator: c,
            hideVisibilitySwitch: i,
            showOnlyTitle: a,
            offset: d,
          })
        }
        componentWillUnmount() {
          this._visible.destroy()
        }
      }
      de.contextType = I.StylePropertyContext
      class pe extends n.PureComponent {
        constructor(e) {
          super(e), (this._visible = new ce.StudyPlotVisibleProperty(e.display))
        }
        render() {
          const { id: e, title: t, disabled: l } = this.props
          return n.createElement(V, {
            id: e,
            title: t,
            disabled: l,
            visible: this._visible,
          })
        }
        componentWillUnmount() {
          this._visible.destroy()
        }
      }
      pe.contextType = I.StylePropertyContext
      var ue = l(50890)
      const he = new i.TranslatedString(
          'change plot type',
          o.t(null, void 0, l(43439)),
        ),
        me = new i.TranslatedString(
          'change price line visibility',
          o.t(null, void 0, l(8662)),
        )
      class ve extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context,
                {
                  property: { plottype: l },
                } = this.props
              l && t(l, e, he)
            }),
            (this._onPriceLineChange = (e) => {
              const { setValue: t } = this.context,
                {
                  property: { trackPrice: l },
                } = this.props
              l && t(l, e, me)
            })
        }
        render() {
          const {
            id: e,
            title: t,
            isRGB: l,
            isFundamental: r,
            property: {
              color: o,
              plottype: i,
              linewidth: s,
              transparency: a,
              trackPrice: c,
              display: d,
            },
          } = this.props
          return n.createElement(
            N.InputRow,
            { label: n.createElement(pe, { id: e, title: t, display: d }) },
            l && !r
              ? this._getInputForRgb()
              : n.createElement(ee.ColorWithLinePropertySelect, {
                  disabled: 0 === d.value(),
                  color: o,
                  transparency: a,
                  thickness: s,
                }),
            n.createElement(Q, {
              id: (0, x.createDomId)(e, 'plot-type-select'),
              disabled: 0 === d.value(),
              className: te.smallStyleControl,
              plotType: i.value(),
              priceLine: c.value(),
              plotTypeChange: this._onPlotTypeChange,
              priceLineChange: this._onPriceLineChange,
            }),
          )
        }
        _getInputForRgb() {
          const { id: e, showLineWidth: t, property: l } = this.props,
            { linewidth: r, display: o } = l
          return r && t
            ? n.createElement(ue.LineWidthSelect, {
                id: (0, x.createDomId)(e, 'line-width-select'),
                property: r,
                disabled: 0 === o.value(),
              })
            : null
        }
      }
      ve.contextType = I.StylePropertyContext
      const ye = n.createContext(null)
      var ge = l(53598)
      const be = new i.TranslatedString(
        'change line style',
        o.t(null, void 0, l(28818)),
      )
      class fe extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onLineStyleChange = (e) => {
              const { setValue: t } = this.context,
                { lineStyle: l } = this.props
              t(l, e, be)
            })
        }
        render() {
          const { lineStyle: e, ...t } = this.props
          return n.createElement(ge.LineStyleSelect, {
            ...t,
            lineStyle: (0, R.getPropertyValue)(e),
            lineStyleChange: this._onLineStyleChange,
          })
        }
      }
      fe.contextType = I.StylePropertyContext
      class we extends n.PureComponent {
        render() {
          const {
              id: e,
              isRGB: t,
              title: l,
              visible: r,
              color: o,
              transparency: i,
              thickness: s,
              children: a,
              switchable: c = !0,
              offset: d,
              grouped: p,
              disabled: u,
              lineStyle: h,
            } = this.props,
            m = u || (r && !(Array.isArray(r) ? r[0].value() : r.value()))
          return n.createElement(
            N.InputRow,
            {
              label: c
                ? n.createElement(V, {
                    id: e,
                    title: l,
                    visible: r,
                    disabled: u,
                  })
                : l,
              offset: d,
              grouped: p,
            },
            t
              ? h
                ? n.createElement(fe, {
                    id: (0, x.createDomId)(e, 'line-style-select'),
                    disabled: m,
                    className: te.smallStyleControl,
                    lineStyle: h,
                  })
                : null
              : n.createElement(ee.ColorWithLinePropertySelect, {
                  disabled: m,
                  color: o,
                  transparency: i,
                  thickness: s,
                  lineStyle: h,
                }),
            a,
          )
        }
      }
      we.contextType = I.StylePropertyContext
      class Ce extends n.PureComponent {
        constructor(e) {
          super(e), (this._visible = new ce.StudyPlotVisibleProperty(e.display))
        }
        render() {
          const {
            id: e,
            isRGB: t,
            title: l,
            color: r,
            transparency: o,
            thickness: i,
            children: s,
            switchable: a = !0,
            offset: c,
            grouped: d,
          } = this.props
          return n.createElement(we, {
            id: e,
            isRGB: t,
            title: l,
            color: r,
            transparency: o,
            thickness: i,
            children: s,
            switchable: a,
            offset: c,
            grouped: d,
            visible: this._visible,
          })
        }
        componentWillUnmount() {
          this._visible.destroy()
        }
      }
      Ce.contextType = I.StylePropertyContext
      class Pe extends n.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            property: { colorup: l, colordown: o, transparency: i, display: s },
          } = this.props
          return n.createElement(ye.Consumer, null, (a) =>
            n.createElement(
              n.Fragment,
              null,
              n.createElement(
                oe.PropertyTable.Row,
                null,
                n.createElement(
                  oe.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, grouped: !0 },
                  n.createElement(pe, {
                    id: e,
                    title: pt((0, r.ensureNotNull)(a), e),
                    display: s,
                  }),
                ),
              ),
              !t &&
                n.createElement(
                  n.Fragment,
                  null,
                  n.createElement(Ce, {
                    id: e,
                    title: ot,
                    color: l,
                    transparency: i,
                    display: s,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                  n.createElement(Ce, {
                    id: e,
                    title: it,
                    color: o,
                    transparency: i,
                    display: s,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                ),
              n.createElement(oe.PropertyTable.GroupSeparator, null),
            ),
          )
        }
      }
      Pe.contextType = I.StylePropertyContext
      var Se = l(87795),
        Ee = l.n(Se),
        Te = l(97754),
        xe = l.n(Te),
        ke = l(31261),
        _e = l(87125),
        Ie = l(90405),
        Le = l(85904)
      const Re = {
          [Le.MarkLocation.AboveBar]: {
            value: Le.MarkLocation.AboveBar,
            content: o.t(null, void 0, l(8305)),
            order: 0,
          },
          [Le.MarkLocation.BelowBar]: {
            value: Le.MarkLocation.BelowBar,
            content: o.t(null, void 0, l(9417)),
            order: 1,
          },
          [Le.MarkLocation.Top]: {
            value: Le.MarkLocation.Top,
            content: o.t(null, void 0, l(97118)),
            order: 2,
          },
          [Le.MarkLocation.Bottom]: {
            value: Le.MarkLocation.Bottom,
            content: o.t(null, void 0, l(27567)),
            order: 3,
          },
          [Le.MarkLocation.Absolute]: {
            value: Le.MarkLocation.Absolute,
            content: o.t(null, void 0, l(69758)),
            order: 4,
          },
        },
        De = Object.values(Re).sort((e, t) => e.order - t.order)
      class Be extends n.PureComponent {
        render() {
          const {
            id: e,
            shapeLocation: t,
            className: l,
            menuItemClassName: r,
            shapeLocationChange: o,
            disabled: i,
          } = this.props
          return n.createElement(Ie.Select, {
            id: e,
            disabled: i,
            className: l,
            menuItemClassName: r,
            items: De,
            value: t,
            onChange: o,
          })
        }
      }
      const Ve = new i.TranslatedString(
          'change char',
          o.t(null, void 0, l(86955)),
        ),
        Ne = new i.TranslatedString(
          'change location',
          o.t(null, void 0, l(6834)),
        )
      class Ae extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onCharChange = (e) => {
              const { setValue: t } = this.context,
                l = e.currentTarget.value.trim(),
                n = Ee()(l),
                o = 0 === n.length ? '' : n[n.length - 1]
              t((0, r.ensureDefined)(this.props.property.childs().char), o, Ve)
            }),
            (this._onLocationChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().location, e, Ne)
            })
        }
        render() {
          const {
              id: e,
              title: t,
              char: l,
              isRGB: o,
              property: i,
              hasPalette: s,
            } = this.props,
            {
              color: a,
              transparency: c,
              char: d,
              location: p,
              display: u,
            } = i.childs()
          return n.createElement(
            N.InputRow,
            {
              grouped: s,
              label: n.createElement(pe, { id: e, title: t, display: u }),
            },
            !s &&
              !o &&
              n.createElement(_e.BasicColorSelect, {
                disabled: 0 === u.value(),
                color: a,
                transparency: c,
              }),
            n.createElement(ke.InputControl, {
              disabled: void 0 === d || 0 === u.value(),
              className: te.smallStyleControl,
              value: (0, r.ensureDefined)(d?.value() ?? l),
              onChange: this._onCharChange,
            }),
            n.createElement(Be, {
              id: (0, x.createDomId)(e, 'shape-style-select'),
              disabled: 0 === u.value(),
              className: Te(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: p.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      Ae.contextType = I.StylePropertyContext
      var ze,
        Me = l(31785),
        We = l(69151),
        He = l(67211),
        Fe = l(83786),
        Oe = l(50858),
        Ue = l(13201),
        Ge = l(59058),
        Ye = l(8537),
        je = l(2309),
        Xe = l(78240),
        qe = l(41683),
        Je = l(63798),
        Ke = l(23223)
      !((e) => {
        ;(e.ArrowDown = 'arrow_down'),
          (e.ArrowUp = 'arrow_up'),
          (e.Circle = 'circle'),
          (e.Cross = 'cross'),
          (e.Diamond = 'diamond'),
          (e.Flag = 'flag'),
          (e.LabelDown = 'label_down'),
          (e.LabelUp = 'label_up'),
          (e.Square = 'square'),
          (e.TriangleDown = 'triangle_down'),
          (e.TriangleUp = 'triangle_up'),
          (e.XCross = 'x_cross')
      })(ze || (ze = {}))
      const $e = {
        arrow_down: We,
        arrow_up: He,
        circle: Fe,
        cross: Oe,
        diamond: Ue,
        flag: Ge,
        label_down: Ye,
        label_up: je,
        square: Xe,
        triangle_down: qe,
        triangle_up: Je,
        x_cross: Ke,
      }
      function Ze(e) {
        return $e[e]
      }
      const Qe = []
      Object.keys(Me.plotShapesData).forEach((e) => {
        const t = Me.plotShapesData[e]
        Qe.push({
          id: t.id,
          value: t.id,
          selectedContent: n.createElement(M.DisplayItem, { icon: Ze(t.icon) }),
          content: n.createElement(M.DropItem, {
            icon: Ze(t.icon),
            label: t.guiName,
          }),
        })
      })
      class et extends n.PureComponent {
        render() {
          const {
            id: e,
            shapeStyleId: t,
            className: l,
            shapeStyleChange: r,
            disabled: o,
          } = this.props
          return n.createElement(M.IconDropdown, {
            id: e,
            disabled: o,
            className: l,
            hideArrowButton: !0,
            items: Qe,
            value: t,
            onChange: r,
          })
        }
      }
      const tt = new i.TranslatedString(
          'change shape',
          o.t(null, void 0, l(83468)),
        ),
        lt = new i.TranslatedString(
          'change location',
          o.t(null, void 0, l(6834)),
        )
      class nt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().plottype, e, tt)
            }),
            (this._onLocationChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().location, e, lt)
            })
        }
        render() {
          const {
              id: e,
              title: t,
              isRGB: l,
              hasPalette: r,
              property: o,
            } = this.props,
            {
              color: i,
              transparency: s,
              plottype: a,
              location: c,
              display: d,
            } = o.childs()
          return n.createElement(
            N.InputRow,
            {
              grouped: r,
              label: n.createElement(pe, { id: e, title: t, display: d }),
            },
            !r &&
              !l &&
              n.createElement(_e.BasicColorSelect, {
                disabled: 0 === d.value(),
                color: i,
                transparency: s,
              }),
            n.createElement(et, {
              id: (0, x.createDomId)(e, 'shape-style-select'),
              disabled: 0 === d.value(),
              className: te.smallStyleControl,
              shapeStyleId: a.value(),
              shapeStyleChange: this._onPlotTypeChange,
            }),
            n.createElement(Be, {
              id: (0, x.createDomId)(e, 'shape-location-select'),
              disabled: 0 === d.value(),
              className: Te(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: c.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      nt.contextType = I.StylePropertyContext
      const rt = (0, ae.getLogger)('Chart.Study.PropertyPage'),
        ot = o.t(null, void 0, l(22691)),
        it = o.t(null, void 0, l(71776)),
        st = o.t(null, void 0, l(74406)),
        at = o.t(null, void 0, l(32163)),
        ct = o.t(null, void 0, l(38408))
      class dt extends n.PureComponent {
        render() {
          const { plot: e, palettes: t, study: l } = this.props,
            o = e.id,
            i = l.properties().styles,
            s = l.metaInfo().styles,
            a = i[o],
            c = e.type,
            d = t.main,
            p = !!l.metaInfo().isRGB
          if ('line' === c || 'bar_colorer' === c || 'bg_colorer' === c)
            return d && d.palette && d.paletteProps
              ? n.createElement(de, {
                  title: s?.[o]?.title ?? o,
                  plot: e,
                  palette: d.palette,
                  paletteProps: d.paletteProps,
                  styleProp: a,
                })
              : n.createElement(ve, {
                  id: o,
                  title: (0, r.ensureDefined)(s?.[o]?.title),
                  property: a,
                  isRGB: p,
                  isFundamental: false,
                  showLineWidth: 'line' === c,
                })
          if ('arrows' === c) {
            const r = this._getPlotSwitch(o, pt(l, o), a.display)
            if (p) return r
            const i = t.up,
              s = t.down
            return i || s
              ? n.createElement(
                  n.Fragment,
                  null,
                  r,
                  i && i.palette && i.paletteProps
                    ? n.createElement(de, {
                        title: ot,
                        plot: e,
                        palette: i.palette,
                        paletteProps: i.paletteProps,
                        styleProp: a,
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : n.createElement(Ce, {
                        id: o,
                        isRGB: p,
                        title: ot,
                        color: a.colorup,
                        display: a.display,
                        transparency: a.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  s && s.palette && s.paletteProps
                    ? n.createElement(de, {
                        title: it,
                        plot: e,
                        palette: s.palette,
                        paletteProps: s.paletteProps,
                        styleProp: a,
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : n.createElement(Ce, {
                        id: o,
                        isRGB: p,
                        title: it,
                        color: a.colordown,
                        display: a.display,
                        transparency: a.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  n.createElement(oe.PropertyTable.GroupSeparator, null),
                )
              : n.createElement(Pe, {
                  id: o,
                  property: a,
                  isRGB: p,
                  plot: e,
                  palettes: t,
                  styleProp: a,
                })
          }
          if ('chars' === c || 'shapes' === c) {
            const t = (0, r.ensureDefined)(s?.[o]),
              l = t.title
            return n.createElement(
              n.Fragment,
              null,
              'chars' === c
                ? n.createElement(Ae, {
                    id: o,
                    title: l,
                    char: t.char,
                    property: a,
                    hasPalette: Boolean(d && d.palette),
                    isRGB: p,
                  })
                : n.createElement(nt, {
                    id: o,
                    title: l,
                    property: a,
                    hasPalette: Boolean(d && d.palette),
                    isRGB: p,
                  }),
              d &&
                d.palette &&
                d.paletteProps &&
                n.createElement(de, {
                  title: l,
                  plot: e,
                  palette: d.palette,
                  paletteProps: d.paletteProps,
                  hideVisibilitySwitch: !0,
                  styleProp: a,
                }),
            )
          }
          if ((0, k.isOhlcPlot)(e)) {
            const i = e.target,
              s = l.properties().ohlcPlots[i],
              a = (0, r.ensureDefined)(
                (0, r.ensureDefined)(l.metaInfo().ohlcPlots)[i],
              ),
              c = this._getPlotSwitch(o, a.title, s.display)
            if (p) return c
            const u = t.wick && t.wick.palette && t.wick.paletteProps,
              h = t.border && t.border.palette && t.border.paletteProps
            return n.createElement(
              n.Fragment,
              null,
              c,
              d && d.palette && d.paletteProps
                ? n.createElement(de, {
                    title: st,
                    plot: e,
                    palette: d.palette,
                    paletteProps: d.paletteProps,
                    styleProp: s,
                    showSeparator: !1,
                    showOnlyTitle: !0,
                    offset: !0,
                  })
                : n.createElement(Ce, {
                    id: o,
                    isRGB: p,
                    title: st,
                    display: s.display,
                    color: s.color,
                    transparency: s.transparency,
                    switchable: !1,
                    grouped: !0,
                    offset: !0,
                  }),
              t.wick &&
                t.wick.palette &&
                t.wick.paletteProps &&
                n.createElement(de, {
                  title: at,
                  plot: e,
                  palette: t.wick.palette,
                  paletteProps: t.wick.paletteProps,
                  styleProp: s,
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!u && s.wickColor) &&
                n.createElement(Ce, {
                  id: o,
                  isRGB: p,
                  title: at,
                  display: s.display,
                  color: s.wickColor,
                  transparency: s.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              t.border &&
                t.border.palette &&
                t.border.paletteProps &&
                n.createElement(de, {
                  title: ct,
                  plot: e,
                  palette: t.border.palette,
                  paletteProps: t.border.paletteProps,
                  styleProp: s,
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!h && s.borderColor) &&
                n.createElement(Ce, {
                  id: o,
                  isRGB: p,
                  title: ct,
                  display: s.display,
                  color: s.borderColor,
                  transparency: s.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              n.createElement(oe.PropertyTable.GroupSeparator, null),
            )
          }
          return rt.logError('Unknown plot type: ' + c), null
        }
        _getPlotSwitch(e, t, l) {
          return n.createElement(
            oe.PropertyTable.Row,
            null,
            n.createElement(
              oe.PropertyTable.Cell,
              { placement: 'first', colSpan: 2 },
              n.createElement(pe, { id: e, title: t, display: l }),
            ),
          )
        }
      }
      function pt(e, t) {
        const l = (0, r.ensureDefined)(e.metaInfo().styles),
          { title: n } = (0, r.ensureDefined)(l[t])
        return (0, r.ensureDefined)(n)
      }
      var ut = l(91699)
      const ht = new i.TranslatedString(
        'change value',
        o.t(null, void 0, l(21333)),
      )
      class mt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onValueChange = (e) => {
              const { setValue: t } = this.context,
                { value: l } = this.props.property
              t(l, e, ht)
            })
        }
        render() {
          const {
            id: e,
            name: t,
            property: {
              color: l,
              linestyle: r,
              linewidth: o,
              transparency: i,
              value: s,
              visible: a,
            },
          } = this.props
          return n.createElement(
            N.InputRow,
            {
              labelAlign: 'adaptive',
              label: n.createElement(V, { id: e, title: t, visible: a }),
            },
            n.createElement(
              'div',
              { className: te.block },
              n.createElement(
                'div',
                { className: te.group },
                n.createElement(ee.ColorWithLinePropertySelect, {
                  disabled: !a.value(),
                  color: l,
                  transparency: i,
                  thickness: o,
                  lineStyle: r,
                }),
              ),
              n.createElement(
                'div',
                {
                  className: Te(
                    te.wrapGroup,
                    te.defaultSelect,
                    te.additionalSelect,
                  ),
                },
                n.createElement(ut.FloatInputComponent, {
                  input: { id: '', name: '', type: 'float', defval: 0 },
                  value: s.value(),
                  disabled: !a.value(),
                  onChange: this._onValueChange,
                }),
              ),
            ),
          )
        }
      }
      mt.contextType = I.StylePropertyContext
      class vt extends n.PureComponent {
        render() {
          const {
            orders: { visible: e, showLabels: t, showQty: r },
          } = this.props
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(V, {
                  id: 'chart-orders-switch',
                  title: o.t(null, void 0, l(6532)),
                  visible: e,
                }),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(V, {
                  id: 'chart-orders-labels-switch',
                  title: o.t(null, void 0, l(38712)),
                  visible: t,
                }),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(V, {
                  id: 'chart-orders-qty-switch',
                  title: o.t(null, void 0, l(98721)),
                  visible: r,
                }),
              ),
            ),
          )
        }
      }
      vt.contextType = I.StylePropertyContext
      var yt = l(9233),
        gt = l(55297)
      const bt = new i.TranslatedString(
          'change percent width',
          o.t(null, void 0, l(62294)),
        ),
        ft = new i.TranslatedString(
          'change placement',
          o.t(null, void 0, l(81891)),
        ),
        wt = new i.TranslatedString(
          'change values visibility',
          o.t(null, void 0, l(9344)),
        ),
        Ct = [
          {
            value: yt.HHistDirection.LeftToRight,
            content: o.t(null, void 0, l(11626)),
          },
          {
            value: yt.HHistDirection.RightToLeft,
            content: o.t(null, void 0, l(50421)),
          },
        ],
        Pt = o.t(null, void 0, l(4622)),
        St = o.t(null, void 0, l(10783)),
        Et = o.t(null, void 0, l(60092)),
        Tt = o.t(null, void 0, l(77753))
      class xt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPercentWidthChange = (e) => {
              const { setValue: t } = this.context,
                { percentWidth: l } = this.props.property.childs()
              t(l, e, bt)
            }),
            (this._onPlacementChange = (e) => {
              const { setValue: t } = this.context,
                { direction: l } = this.props.property.childs()
              t(l, e, ft)
            }),
            (this._onShowValuesChange = (e) => {
              const { setValue: t } = this.context,
                { showValues: l } = this.props.property.childs()
              t(l, e, wt)
            })
        }
        render() {
          const { hHistInfo: e, property: t } = this.props,
            {
              percentWidth: l,
              direction: r,
              showValues: o,
              valuesColor: i,
              visible: s,
            } = t.childs(),
            { title: a } = e
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                {
                  placement: 'first',
                  colSpan: 2,
                  grouped: !0,
                },
                n.createElement(V, { id: a, title: a, visible: s }),
              ),
            ),
            n.createElement(
              N.InputRow,
              {
                label: n.createElement(
                  'div',
                  { className: te.childRowContainer },
                  Pt,
                ),
                grouped: !0,
              },
              n.createElement(gt.IntegerInputComponent, {
                input: { id: '', name: '', type: 'integer', defval: 0 },
                value: l.value(),
                disabled: !s.value(),
                onChange: this._onPercentWidthChange,
              }),
            ),
            n.createElement(
              N.InputRow,
              {
                label: n.createElement(
                  'div',
                  { className: te.childRowContainer },
                  St,
                ),
                grouped: !0,
              },
              n.createElement(Ie.Select, {
                id: 'hhist-graphic-placement-select',
                disabled: !s.value(),
                className: te.defaultSelect,
                menuItemClassName: te.defaultSelectItem,
                items: Ct,
                value: r.value(),
                onChange: this._onPlacementChange,
              }),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                {
                  className: te.childRowContainer,
                  placement: 'first',
                  colSpan: 2,
                  grouped: !0,
                },
                n.createElement(L.BoolInputComponent, {
                  label: Et,
                  input: {
                    id: a + '_showValues',
                    type: 'bool',
                    defval: !0,
                    name: 'visible',
                  },
                  value: !o || o.value(),
                  disabled: !s.value(),
                  onChange: this._onShowValuesChange,
                }),
              ),
            ),
            n.createElement(
              N.InputRow,
              {
                label: n.createElement(
                  'div',
                  { className: te.childRowContainer },
                  Tt,
                ),
                grouped: !0,
              },
              n.createElement(_e.BasicColorSelect, {
                disabled: s && !s.value(),
                color: i,
              }),
            ),
            this._renderColors(),
            n.createElement(oe.PropertyTable.GroupSeparator, null),
          )
        }
        _renderColors() {
          const { property: e, hHistInfo: t } = this.props,
            { colors: l, transparencies: r, visible: o } = e.childs(),
            { titles: i } = t
          return l
            .childNames()
            .map((e) =>
              n.createElement(
                N.InputRow,
                {
                  key: e,
                  grouped: !0,
                  label: n.createElement(
                    'div',
                    { className: te.childRowContainer },
                    i[+e],
                  ),
                },
                n.createElement(_e.BasicColorSelect, {
                  disabled: !o.value(),
                  color: l[+e],
                  transparency: r[+e],
                }),
              ),
            )
        }
      }
      xt.contextType = I.StylePropertyContext
      class kt extends n.PureComponent {
        render() {
          const { title: e, property: t } = this.props,
            { color: l, width: r, style: o, visible: i } = t.childs()
          return n.createElement(
            N.InputRow,
            { label: n.createElement(V, { id: e, title: e, visible: i }) },
            n.createElement(ee.ColorWithLinePropertySelect, {
              disabled: !i.value(),
              color: l,
              transparency: t.child('transparency'),
              thickness: r,
              lineStyle: o,
            }),
          )
        }
      }
      var _t, It
      ;(kt.contextType = I.StylePropertyContext),
        ((e) => {
          ;(e.Triangle = 'triangle'), (e.Rectangle = 'rectangle')
        })(_t || (_t = {})),
        ((e) => {
          ;(e.Verdana = 'Verdana'),
            (e.CourierNew = 'Courier New'),
            (e.TimesNewRoman = 'Times New Roman'),
            (e.Arial = 'Arial')
        })(It || (It = {}))
      class Lt extends n.PureComponent {
        render() {
          const { graphicType: e, study: t } = this.props,
            l = t.metaInfo(),
            o = l.graphics,
            i = t.properties().graphics.childs(),
            s = (0, r.ensureDefined)(o[e])
          return Object.keys(s).map((t, o) => {
            const s = (0, r.ensureDefined)(i[e]?.childs()[t])
            return 'horizlines' === e || 'vertlines' === e
              ? n.createElement(kt, {
                  key: t,
                  title: (0, r.ensureDefined)(l.graphics[e]?.[t]).name,
                  property: s,
                })
              : 'lines' === e
                ? n.createElement(kt, {
                    key: t,
                    title: (0, r.ensureDefined)(l.graphics.lines?.[t]).title,
                    property: s,
                  })
                : 'hhists' === e
                  ? n.createElement(xt, {
                      key: t,
                      hHistInfo: (0, r.ensureDefined)(l.graphics.hhists?.[t]),
                      property: s,
                    })
                  : null
          })
        }
      }
      var Rt = l(73146),
        Dt = l(66045)
      const Bt = new i.TranslatedString(
          'change font size',
          o.t(null, void 0, l(27745)),
        ),
        Vt = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map((e) => ({
          value: e,
          title: e.toString(),
        }))
      class Nt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onFontSizeChange = (e) => {
              const { setValue: t } = this.context,
                { fontSize: l } = this.props
              t(l, e, Bt)
            })
        }
        render() {
          const { fontSize: e, ...t } = this.props
          return n.createElement(Dt.FontSizeSelect, {
            ...t,
            fontSizes: Vt,
            fontSize: e.value(),
            fontSizeChange: this._onFontSizeChange,
          })
        }
      }
      Nt.contextType = I.StylePropertyContext
      const At = new i.TranslatedString(
          'change visibility',
          o.t(null, void 0, l(1924)),
        ),
        zt = o.t(null, void 0, l(62791)),
        Mt = o.t(null, void 0, l(5119)),
        Wt = {
          Traditional: new Set([
            'S5/R5',
            'S4/R4',
            'S3/R3',
            'S2/R2',
            'S1/R1',
            'P',
          ]),
          Fibonacci: new Set(['S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Woodie: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Classic: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          DM: new Set(['S1/R1', 'P']),
          DeMark: new Set(['S1/R1', 'P']),
          Camarilla: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Floor: new Set(['S3/R3', 'S2/R2', 'S1/R1', 'P']),
        }
      class Ht extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { levelsStyle: l } = this.props.property.childs(),
                { showLabels: n } = l.childs()
              t(n, e, At)
            })
        }
        render() {
          const { fontsize: e, levelsStyle: t } = this.props.property.childs()
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              N.InputRow,
              {
                labelAlign: 'adaptive',
                label: n.createElement('span', null, zt),
              },
              n.createElement(
                'div',
                { className: te.block },
                n.createElement(
                  'div',
                  { className: Te(te.wrapGroup, te.additionalSelect) },
                  n.createElement(Nt, {
                    id: 'pivot-points-standard-font-size-select',
                    fontSize: e,
                  }),
                ),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(L.BoolInputComponent, {
                  label: Mt,
                  input: {
                    id: 'ShowLabels',
                    type: 'bool',
                    defval: !0,
                    name: 'visible',
                  },
                  value: t.childs().showLabels.value(),
                  onChange: this._onChange,
                }),
              ),
            ),
            this._renderColors(),
          )
        }
        _renderColors() {
          const { levelsStyle: e, inputs: t } = this.props.property.childs(),
            { colors: l, widths: o, visibility: i } = e.childs(),
            { kind: s } = t.childs(),
            a = (0, r.ensureDefined)(Wt[s.value()])
          return l
            .childNames()
            .filter((e) => a.has(e))
            .map((e) =>
              n.createElement(we, {
                key: e,
                id: e,
                title: e,
                color: l.childs()[e],
                visible: i.childs()[e],
                thickness: o.childs()[e],
              }),
            )
        }
      }
      Ht.contextType = I.StylePropertyContext
      const Ft = o.t(null, void 0, l(10783)),
        Ot = [
          {
            value: yt.HHistDirection.RightToLeft,
            content: o.t(null, void 0, l(50421)),
          },
          {
            value: yt.HHistDirection.LeftToRight,
            content: o.t(null, void 0, l(11626)),
          },
        ],
        Ut = new i.TranslatedString(
          'change visibility',
          o.t(null, void 0, l(1924)),
        ),
        Gt =
          (new i.TranslatedString(
            'change expand blocks',
            o.t(null, void 0, l(85889)),
          ),
          o.t(null, void 0, l(81363))),
        Yt = o.t(null, void 0, l(60092)),
        jt = o.t(null, void 0, l(4622)),
        Xt = o.t(null, void 0, l(73033)),
        qt = o.t(null, { context: 'input' }, l(49191)),
        Jt = o.t(null, { context: 'input' }, l(76542))
      class Kt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              this._setHhistsProperty('visible', e)
            }),
            (this._onShowValuesChange = (e) => {
              this._setHhistsProperty('showValues', e)
            }),
            (this._onValueChange = (e) => {
              this._setHhistsProperty('percentWidth', e)
            }),
            (this._onDirectionChange = (e) => {
              this._setHhistsProperty('direction', e)
            })
        }
        render() {
          const { metaInfo: e } = this.props,
            {
              graphics: t,
              styles: l,
              showLabelsOnPriceScale: o,
              showLegendValues: i,
            } = this.props.property.childs(),
            { hhists: s, horizlines: a, polygons: c } = t.childs(),
            d = (0, r.ensureDefined)(e.graphics.hhists),
            p = Object.keys(d),
            u = s.childs()[p[0]],
            h = u.childs().visible,
            m = p.map((e) => s.childs()[e].childs().showValues),
            v = u.childs().percentWidth,
            y = u.childs().direction,
            g = p.map((e) => s.childs()[e].childs().valuesColor),
            b = a.childs()?.vahLines,
            f = e.graphics.horizlines?.vahLines,
            w = a.childs()?.valLines,
            C = e.graphics.horizlines?.valLines,
            P = a.childs().pocLines,
            S = (0, r.ensureDefined)(e.graphics.horizlines?.pocLines),
            E = l.childs().developingPoc,
            T = new ce.StudyPlotVisibleProperty(E.childs().display),
            x = (0, r.ensureDefined)(e.styles?.developingPoc),
            k = l.childs().developingVAHigh,
            _ = new ce.StudyPlotVisibleProperty(k.childs().display),
            I = l.childs().developingVALow,
            R = new ce.StudyPlotVisibleProperty(I.childs().display),
            B = e.graphics.polygons && e.graphics.polygons.histBoxBg
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(L.BoolInputComponent, {
                  label: Gt,
                  input: {
                    id: 'VolumeProfile',
                    type: 'bool',
                    defval: !0,
                    name: 'visible',
                  },
                  value: h.value(),
                  onChange: this._onChange,
                }),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement(
                  'div',
                  { className: te.childRowContainer },
                  n.createElement(L.BoolInputComponent, {
                    disabled: !h.value(),
                    label: Yt,
                    input: {
                      id: 'ShowValues',
                      type: 'bool',
                      defval: !0,
                      name: 'visible',
                    },
                    value: m[0].value(),
                    onChange: this._onShowValuesChange,
                  }),
                ),
              ),
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement(_e.BasicColorSelect, {
                  disabled: !h.value() || !m[0].value(),
                  color: g,
                }),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement('div', { className: te.childRowContainer }, jt),
              ),
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement(gt.IntegerInputComponent, {
                  disabled: !h.value(),
                  input: { id: '', name: '', type: 'integer', defval: 0 },
                  value: v.value(),
                  onChange: this._onValueChange,
                }),
              ),
            ),
            n.createElement(
              oe.PropertyTable.Row,
              null,
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement('div', { className: te.childRowContainer }, Ft),
              ),
              n.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement(Ie.Select, {
                  id: 'hhist-direction-select',
                  disabled: !h.value(),
                  className: te.defaultSelect,
                  menuItemClassName: te.defaultSelectItem,
                  items: Ot,
                  value: y.value(),
                  onChange: this._onDirectionChange,
                }),
              ),
            ),
            p.map((e) =>
              n.createElement(
                n.Fragment,
                { key: e },
                s
                  .childs()
                  [e].childs()
                  .colors.childNames()
                  .map((t, l) => {
                    const r = d[e]
                    return n.createElement(
                      N.InputRow,
                      {
                        key: l,
                        label: n.createElement(
                          'div',
                          { className: te.childRowContainer },
                          (r && (0, D.getTranslatedInputTitle)(r.titles[l])) ||
                            '',
                        ),
                      },
                      n.createElement(_e.BasicColorSelect, {
                        disabled: !h.value(),
                        color: s.childs()[e].childs().colors.childs()[l],
                        transparency: s
                          .childs()
                          [e].childs()
                          .transparencies.childs()[l],
                      }),
                    )
                  }),
              ),
            ),
            f &&
              b &&
              n.createElement(we, {
                id: 'vahLines',
                title: f.name,
                color: b.childs().color,
                visible: b.childs().visible,
                thickness: b.childs().width,
                lineStyle: b.childs().style,
              }),
            C &&
              w &&
              n.createElement(we, {
                id: 'valLines',
                title: C.name,
                color: w.childs().color,
                visible: w.childs().visible,
                thickness: w.childs().width,
                lineStyle: w.childs().style,
              }),
            n.createElement(we, {
              id: 'pocLines',
              title: S.name,
              color: P.childs().color,
              visible: P.childs().visible,
              thickness: P.childs().width,
              lineStyle: P.childs().style,
            }),
            E &&
              n.createElement(we, {
                id: 'developingPoc',
                title:
                  (x.title && (0, D.getTranslatedInputTitle)(x.title)) || '',
                color: E.childs().color,
                visible: T,
                thickness: E.childs().linewidth,
                lineStyle: E.childs().linestyle,
              }),
            k &&
              I &&
              n.createElement(we, {
                id: 'developingPoc',
                title: Xt,
                color: [k.childs().color, I.childs().color],
                visible: [_, R],
                thickness: [k.childs().linewidth, I.childs().linewidth],
                lineStyle: [k.childs().linestyle, I.childs().linestyle],
              }),
            c &&
              n.createElement(
                N.InputRow,
                {
                  label: n.createElement(
                    'div',
                    null,
                    (B && (0, D.getTranslatedInputTitle)(B.name)) || '',
                  ),
                },
                n.createElement(_e.BasicColorSelect, {
                  color: c.childs().histBoxBg.childs().color,
                  transparency: c.childs().histBoxBg.childs().transparency,
                }),
              ),
            (o || i) &&
              'VbPFixed' !== e.shortId &&
              n.createElement(
                n.Fragment,
                null,
                o &&
                  n.createElement(
                    oe.PropertyTable.Cell,
                    { placement: 'first', colSpan: 2 },
                    n.createElement(V, {
                      id: 'showLabelsOnPriceScale',
                      title: Jt,
                      visible: o,
                    }),
                  ),
                i &&
                  n.createElement(
                    oe.PropertyTable.Cell,
                    { placement: 'first', colSpan: 2 },
                    n.createElement(V, {
                      id: 'showLegendValues',
                      title: qt,
                      visible: i,
                    }),
                  ),
              ),
          )
        }
        _setHhistsProperty(e, t) {
          const { setValue: l } = this.context,
            { metaInfo: n, property: o } = this.props,
            i = o.childs().graphics.childs().hhists,
            s = Object.keys((0, r.ensureDefined)(n.graphics.hhists)),
            a = i.childs()
          l(
            s.map((t) => (0, r.ensureDefined)(a[t].child(e))),
            t,
            Ut,
          )
        }
      }
      function $t() {
        const e = (0, r.ensureNotNull)((0, n.useContext)(ye)),
          t = e.metaInfo(),
          l = e.properties()
        return n.createElement(Kt, { metaInfo: t, property: l })
      }
      Kt.contextType = I.StylePropertyContext
      var Zt = l(28117)
      const Qt = {
        VbPFixed: $t,
        PivotPointsStandard: () => {
          const e = (0, r.ensureNotNull)((0, n.useContext)(ye)).properties()
          return n.createElement(Ht, { property: e })
        },
        VbPVisible: $t,
        VbPAnchored: $t,
      }
      class el extends n.PureComponent {
        render() {
          const e = (0, r.ensureNotNull)(this.context)
          return n.createElement(ye.Consumer, null, (t) =>
            n.createElement(
              I.StylePropertyContainer,
              {
                property: (0, r.ensureNotNull)(t).properties(),
                affectSave: (0, Rt.doesStudyLikeAffectSave)(
                  (0, r.ensureNotNull)(t),
                ),
                model: e,
              },
              n.createElement(
                oe.PropertyTable,
                null,
                this._renderCustomContent(
                  (0, r.ensureNotNull)(t).metaInfo().shortId,
                ),
              ),
            ),
          )
        }
        _renderCustomContent(e) {
          if (e in Qt) {
            const t = Qt[e]
            return n.createElement(t, null)
          }
          return null
        }
      }
      el.contextType = Zt.ModelContext
      var tl = l(65388)
      const ll = new i.TranslatedString(
          'change precision',
          o.t(null, void 0, l(61863)),
        ),
        nl = o.t(null, void 0, l(16564)),
        rl = o.t(null, void 0, l(59766)),
        ol = [{ value: 'default', content: nl }]
      for (let e = 0; e <= 8; e++) ol.push({ value: e, content: e.toString() })
      class il extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { precision: l } = this.props
              t(l, e, ll)
            })
        }
        render() {
          const { id: e, precision: t } = this.props
          return n.createElement(
            N.InputRow,
            { label: rl },
            n.createElement(Ie.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: ol,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      il.contextType = I.StylePropertyContext
      const sl = new i.TranslatedString(
          'change min tick',
          o.t(null, void 0, l(26476)),
        ),
        al = o.t(null, void 0, l(16564)),
        cl = o.t(null, void 0, l(64075)),
        dl = [
          { priceScale: 1, minMove: 1, frac: !1 },
          { priceScale: 10, minMove: 1, frac: !1 },
          { priceScale: 100, minMove: 1, frac: !1 },
          { priceScale: 1e3, minMove: 1, frac: !1 },
          { priceScale: 1e4, minMove: 1, frac: !1 },
          { priceScale: 1e5, minMove: 1, frac: !1 },
          { priceScale: 1e6, minMove: 1, frac: !1 },
          { priceScale: 1e7, minMove: 1, frac: !1 },
          { priceScale: 1e8, minMove: 1, frac: !1 },
          { priceScale: 2, minMove: 1, frac: !0 },
          { priceScale: 4, minMove: 1, frac: !0 },
          { priceScale: 8, minMove: 1, frac: !0 },
          { priceScale: 16, minMove: 1, frac: !0 },
          { priceScale: 32, minMove: 1, frac: !0 },
          { priceScale: 64, minMove: 1, frac: !0 },
          { priceScale: 128, minMove: 1, frac: !0 },
          { priceScale: 320, minMove: 1, frac: !0 },
        ],
        pl = [{ id: 'tick-default', value: 'default', content: al }]
      for (let e = 0; e < dl.length; e++) {
        const t = dl[e]
        pl.push({
          value: t.priceScale + ',' + t.minMove + ',' + t.frac,
          content: t.minMove + '/' + t.priceScale,
        })
      }
      class ul extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { minTick: l } = this.props
              t(l, e, sl)
            })
        }
        render() {
          const { id: e, minTick: t } = this.props
          return n.createElement(
            N.InputRow,
            { label: cl },
            n.createElement(Ie.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: pl,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      ul.contextType = I.StylePropertyContext
      var hl = l(86067)
      class ml extends n.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            title: l,
            visible: r,
            bottomColor: o,
            topColor: i,
            transparency: s,
            children: a,
            switchable: c = !0,
            offset: d,
            grouped: p,
          } = this.props
          return n.createElement(
            N.InputRow,
            {
              label: c
                ? n.createElement(V, { id: e, title: l, visible: r })
                : l,
              offset: d,
              grouped: p,
            },
            t
              ? null
              : n.createElement(
                  n.Fragment,
                  null,
                  i &&
                    n.createElement(_e.BasicColorSelect, {
                      disabled:
                        r && !(Array.isArray(r) ? r[0].value() : r.value()),
                      color: i,
                      transparency: s,
                    }),
                  o &&
                    n.createElement(
                      'div',
                      { className: xe()(o && i && te.additionalSelect) },
                      n.createElement(_e.BasicColorSelect, {
                        disabled:
                          r && !(Array.isArray(r) ? r[0].value() : r.value()),
                        color: o,
                        transparency: s,
                      }),
                    ),
                ),
            a,
          )
        }
      }
      ml.contextType = I.StylePropertyContext
      const vl = o.t(null, void 0, l(79468)),
        yl = o.t(null, { context: 'input' }, l(49191)),
        gl = o.t(null, { context: 'input' }, l(76542)),
        bl = o.t(null, void 0, l(89702))
      class fl extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._findPlotPalettes = (e) => {
              const { study: t } = this.props,
                l = t.metaInfo(),
                n = (0, r.ensureDefined)(l.palettes)
              return (0, k.isBarColorerPlot)(e) || (0, k.isBgColorerPlot)(e)
                ? {
                    main: {
                      palette: n[e.palette],
                      paletteProps: t.properties().palettes[e.palette],
                    },
                  }
                : this._findPalettesByTargetId(e.id)
            })
        }
        render() {
          const { study: e } = this.props,
            t = e.metaInfo()
          if ((0, tl.isCustomStudy)(t.shortId)) return n.createElement(el, null)
          const l = e.properties(),
            {
              precision: r,
              strategy: o,
              minTick: i,
              showLabelsOnPriceScale: s,
              showLegendValues: a,
            } = l,
            c = t.plots.length > 0,
            d = t.plots.some((e) => !(0, k.isPlotWithTechnicalValues)(e)),
            p = c || t.inputs.some((e) => 'price' === e.type),
            u = (0, Rt.createAdapter)(e).canOverrideMinTick()
          return n.createElement(
            oe.PropertyTable,
            null,
            this._plotsElement(),
            this._bandsElement(),
            this._bandsBackgroundsElement(),
            this._areasBackgroundsElement(),
            this._filledAreasElement(),
            this._graphicsElement(),
            u &&
              n.createElement(ul, {
                id: (0, x.createDomId)(t.id, 'min-tick-select'),
                minTick: i,
              }),
            _.StudyMetaInfo.isScriptStrategy(t) &&
              n.createElement(vt, { orders: o.orders }),
            (p || d) &&
              n.createElement(
                oe.PropertyTable.Row,
                null,
                n.createElement(oe.PropertyTable.GroupSeparator, { size: 1 }),
                n.createElement(hl.GroupTitleSection, { title: bl, name: bl }),
                p &&
                  n.createElement(il, {
                    id: (0, x.createDomId)(t.id, 'precision-select'),
                    precision: r,
                  }),
                d &&
                  n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      oe.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      n.createElement(V, {
                        id: 'showLabelsOnPriceScale',
                        title: gl,
                        visible: s,
                      }),
                    ),
                    n.createElement(
                      oe.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      n.createElement(V, {
                        id: 'showLegendValues',
                        title: yl,
                        visible: a,
                      }),
                    ),
                  ),
              ),
          )
        }
        _plotsElement() {
          const { study: e } = this.props,
            t = e.metaInfo()
          return new E.MetaInfoHelper(t)
            .getUserEditablePlots()
            .filter(
              (e) =>
                !(
                  (0, k.isUpColorerPlot)(e) ||
                  (0, k.isDownColorerPlot)(e) ||
                  (0, k.isCandleBorderColorerPlot)(e) ||
                  (0, k.isCandleWickColorerPlot)(e)
                ),
            )
            .map((t) => {
              const l = (0, k.isOhlcPlot)(t) ? { ...t, id: t.target } : t,
                r = this._findPlotPalettes(l)
              return n.createElement(dt, {
                key: t.id,
                plot: t,
                palettes: r,
                study: e,
              })
            })
        }
        _bandsElement() {
          const { study: e } = this.props,
            t = e.metaInfo().bands,
            l = e.properties().childs().bands
          return (
            t &&
            l &&
            t.map((e, t) => {
              if (!e.isHidden)
                return n.createElement(mt, {
                  key: t,
                  id: e.name,
                  name: e.name,
                  property: l[t],
                })
            })
          )
        }
        _bandsBackgroundsElement() {
          const { study: e } = this.props,
            t = e.properties(),
            { bandsBackground: l } = t
          return (
            l &&
            n.createElement(we, {
              id: 'bandsBackground',
              title: vl,
              visible: l.fillBackground,
              color: l.backgroundColor,
              transparency: l.transparency,
            })
          )
        }
        _areasBackgroundsElement() {
          const { study: e } = this.props,
            t = e.metaInfo(),
            l = e.properties(),
            { areaBackground: r } = l
          return t.isRGB
            ? null
            : r &&
                n.createElement(we, {
                  id: 'areaBackground',
                  title: vl,
                  visible: r.fillBackground,
                  color: r.backgroundColor,
                  transparency: r.transparency,
                })
        }
        _filledAreasElement() {
          const { study: e } = this.props,
            t = e.metaInfo(),
            l = t.filledAreas
          return !l || t.isRGB
            ? []
            : l.map((l) => {
                const o = t.filledAreasStyle?.[l.id]
                if (o) {
                  if (o.isHidden) return null
                } else if (l.isHidden) return null
                const i = e.properties().filledAreasStyle[l.id],
                  s = l.title || vl
                if (
                  i.hasChild('fillType') &&
                  'gradient' === i.childs().fillType.value()
                ) {
                  if (i.topColor || i.bottomColor)
                    return n.createElement(ml, {
                      key: l.id,
                      id: l.id,
                      title: s,
                      bottomColor: i.bottomColor,
                      topColor: i.topColor,
                      visible: i.visible,
                      transparency: i.transparency,
                    })
                  if (l.palette) {
                    const e = this._findPalettesByTargetId(l.id),
                      t = (0, r.ensureDefined)(e.main),
                      o = e.secondary
                    return n.createElement(se, {
                      key: l.id,
                      title: l.title,
                      area: l,
                      palette: (0, r.ensureDefined)(t.palette),
                      paletteProps: (0, r.ensureDefined)(t.paletteProps),
                      secondaryPalette: o?.palette,
                      secondaryPaletteProps: o?.paletteProps,
                      styleProp: i,
                    })
                  }
                  return null
                }
                if (l.palette) {
                  const e = this._findPalettesByTargetId(l.id),
                    t = (0, r.ensureDefined)(e.main)
                  return n.createElement(se, {
                    key: l.id,
                    title: l.title,
                    area: l,
                    palette: (0, r.ensureDefined)(t.palette),
                    paletteProps: (0, r.ensureDefined)(t.paletteProps),
                    styleProp: i,
                  })
                }
                return n.createElement(we, {
                  key: l.id,
                  id: l.id,
                  title: s,
                  color: i.color,
                  visible: i.visible,
                  transparency: i.transparency,
                })
              })
        }
        _graphicsElement() {
          const { study: e } = this.props,
            t = e.metaInfo().graphics
          return (
            t &&
            Object.keys(t).map((t, l) =>
              n.createElement(Lt, { key: t, graphicType: t, study: e }),
            )
          )
        }
        _findPalettesByTargetId(e) {
          const { study: t } = this.props,
            l = t.metaInfo(),
            n = l.plots,
            o = (0, r.ensureDefined)(l.palettes),
            i = {}
          for (const l of n) {
            if (
              ((0, k.isPaletteColorerPlot)(l) || (0, k.isOhlcColorerPlot)(l)) &&
              l.target === e
            ) {
              if (i.main) {
                i.secondary = {
                  palette: o[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }
                continue
              }
              i.main = {
                palette: o[l.palette],
                paletteProps: t.properties().palettes[l.palette],
              }
            }
            ;(0, k.isUpColorerPlot)(l) &&
              l.target === e &&
              (i.up = {
                palette: o[l.palette],
                paletteProps: t.properties().palettes[l.palette],
              }),
              (0, k.isDownColorerPlot)(l) &&
                l.target === e &&
                (i.down = {
                  palette: o[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }),
              (0, k.isCandleWickColorerPlot)(l) &&
                l.target === e &&
                (i.wick = {
                  palette: o[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }),
              (0, k.isCandleBorderColorerPlot)(l) &&
                l.target === e &&
                (i.border = {
                  palette: o[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                })
          }
          return i
        }
      }
      function wl(e) {
        return (0, I.bindPropertyContext)(
          fl,
          { ...e, property: e.study.properties() },
          (0, Rt.doesStudyLikeAffectSave)(e.study),
        )
      }
      class Cl extends n.PureComponent {
        render() {
          return n.createElement(
            Zt.ModelContext.Provider,
            { value: this.props.model },
            n.createElement(
              ye.Provider,
              { value: this.props.source },
              n.createElement(wl, { study: this.props.source }),
            ),
          )
        }
      }
      var Pl = l(57717),
        Sl = l(29280),
        El = l(26434),
        Tl = l(19466),
        xl = l(87896)
      class kl extends Sl.DialogRenderer {
        constructor(e, t, l, n) {
          super(),
            (this._timeout = null),
            (this._handleClose = () => {
              this._rootInstance?.unmount(),
                this._setVisibility(!1),
                this._subscription.unsubscribe(
                  this,
                  this._handleCollectionChanged,
                )
            }),
            (this._handleCancel = () => {
              this._model.undoToCheckpoint(this._checkpoint)
            }),
            (this._handleSubmit = () => {}),
            (this._handleActiveTabChanged = (e) => {
              a.setValue(this._activeTabSettingsName(), e)
            }),
            (this._source = e),
            (this._model = t),
            (this._propertyPages = n),
            (this._checkpoint = this._ensureCheckpoint(l)),
            (this._subscription = this._model
              .model()
              .dataSourceCollectionChanged()),
            this._subscription.subscribe(this, this._handleCollectionChanged)
        }
        hide(e) {
          e ? this._handleCancel() : this._handleSubmit(), this._handleClose()
        }
        isVisible() {
          return this.visible().value()
        }
        show(e = {}) {
          if (!c.enabled('property_pages') || this.isVisible()) return
          const t = this._source.metaInfo()
          if (
            ((0, g.isLineTool)(this._source) &&
              (0, p.trackEvent)(
                'GUI',
                'Drawing Properties',
                this._source.name(),
              ),
            (0, v.isStudy)(this._source))
          ) {
            const e =
              !this._source.isPine() || this._source.isStandardPine()
                ? t.description
                : 'Custom Pine'
            ;(0, p.trackEvent)('GUI', 'Study Properties', e)
          }
          let r = []
          const i = new E.MetaInfoHelper(t)
          i.hasUserEditableInputs() &&
            r.push({
              id: 'inputs',
              label: o.t(null, void 0, l(21429)),
              Component: T,
            }),
            i.hasUserEditableProperties(),
            i.hasUserEditableStyles() &&
              r.push({
                id: 'style',
                label: o.t(null, void 0, l(92516)),
                Component: Cl,
              }),
            this._propertyPages ||
              r.push({
                id: 'visibilities',
                label: o.t(null, void 0, l(40091)),
                page: this._createVisibilitiesPropertyPage(),
              }),
            (r = this._getPagesForStudyLineTool(r))
          const u =
            e.initialTab ||
            a.getValue(this._activeTabSettingsName()) ||
            'inputs'
          const h = (0, s.clean)(t.shortDescription, !0)
          const m = r.find((e) => e.id === u) ?? r[0]
          ;(this._rootInstance = (0, xl.createReactRoot)(
            n.createElement(P, {
              title: h,
              model: this._model,
              source: this._source,
              initialActiveTab: m.id,
              pages: r,
              shouldReturnFocus: e.shouldReturnFocus,
              onSubmit: this._handleSubmit,
              onCancel: this._handleCancel,
              onClose: this._handleClose,
              onActiveTabChanged: this._handleActiveTabChanged,
            }),
            this._container,
          )),
            this._setVisibility(!0),
            d.emit('edit_object_dialog', {
              objectType: 'study',
              scriptTitle: this._source.title(Tl.TitleDisplayTarget.StatusLine),
            })
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs()
          return (0, Pl.createPropertyPage)(
            (0, El.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._model,
              e,
              new i.TranslatedString(
                this._source.name(!0),
                this._source.title(Tl.TitleDisplayTarget.StatusLine, !0),
              ),
            ),
            'visibility',
            o.t(null, void 0, l(40091)),
          )
        }
        _activeTabSettingsName() {
          return 'properties_dialog.active_tab.study'
        }
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
        _getPagesForStudyLineTool(e) {
          if (this._propertyPages) {
            const t = this._propertyPages.filter(
              (e) => 'coordinates' === e.id || 'visibility' === e.id,
            )
            return [
              ...e,
              ...t.map((e) => ({ id: e.id, label: e.title, page: e })),
            ]
          }
          return e
        }
        _handleCollectionChanged() {
          null === this._timeout &&
            (this._timeout = setTimeout(() => {
              this._closeDialogIfSourceIsDeleted(), (this._timeout = null)
            }))
        }
        _closeDialogIfSourceIsDeleted() {
          null === this._model.model().dataSourceForId(this._source.id()) &&
            this._handleClose()
        }
      }
    },
    78890: (e, t, l) => {
      l.d(t, { PropertyActions: () => m })
      var n = l(50959),
        r = l(97754),
        o = l.n(r),
        i = l(9745),
        s = l(11542),
        a = l(95276),
        c = l(16396),
        d = l(44996),
        p = l(83428)
      const u = {
        reset: s.t(null, void 0, l(33533)),
        saveAsDefault: s.t(null, void 0, l(99687)),
        defaults: s.t(null, void 0, l(48572)),
      }
      var h
      !((e) => {
        ;(e.Normal = 'normal'), (e.Compact = 'compact')
      })(h || (h = {}))
      class m extends n.PureComponent {
        render() {
          const { mode: e, saveAsDefaults: t, resetToDefaults: l } = this.props
          return n.createElement(
            a.ControlDisclosure,
            {
              id: 'property-actions',
              className: o()('normal' === e && p.defaultsButtonText),
              hideArrowButton: 'compact' === e,
              buttonChildren: this._getPlaceHolderItem('compact' === e),
            },
            n.createElement(c.PopupMenuItem, {
              className: p.defaultsButtonItem,
              isActive: !1,
              label: u.reset,
              onClick: l,
            }),
            n.createElement(c.PopupMenuItem, {
              className: p.defaultsButtonItem,
              isActive: !1,
              label: u.saveAsDefault,
              onClick: t,
            }),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? n.createElement(i.Icon, {
                className: p.defaultsButtonIcon,
                icon: d,
              })
            : u.defaults
        }
      }
    },
    48531: (e, t, l) => {
      l.d(t, { FooterMenu: () => f })
      var n = l(50959),
        r = l(11542),
        o = l(9745),
        i = l(95276),
        s = l(90692),
        a = l(50670),
        c = l(44996)
      function d(e) {
        return e.isTabletWidth
          ? n.createElement(o.Icon, { className: a.themesButtonIcon, icon: c })
          : n.createElement(n.Fragment, null, r.t(null, void 0, l(93553)))
      }
      function p(e) {
        return n.createElement(
          s.MatchMedia,
          {
            rule: '(max-width: 768px)',
          },
          (t) =>
            n.createElement(
              i.ControlDisclosure,
              {
                className: !t && a.themesButtonText,
                hideArrowButton: t,
                buttonChildren: n.createElement(d, { isTabletWidth: t }),
              },
              e.children,
            ),
        )
      }
      var u = l(16396),
        h = l(96040),
        m = l(70412),
        v = l(32563),
        y = l(60925)
      function g(e) {
        const { name: t, onRemove: l, onClick: r } = e,
          [o, i] = (0, m.useHover)(),
          s = n.useCallback(() => r(t), [r, t]),
          c = n.useCallback(() => {
            l && l(t)
          }, [l, t])
        return n.createElement(
          'div',
          { ...i },
          n.createElement(u.PopupMenuItem, {
            className: a.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: s,
            toolbox:
              l &&
              n.createElement(h.RemoveButton, {
                hidden: !v.mobiletouch && !o,
                onClick: c,
                icon: y,
              }),
          }),
        )
      }
      function b(e) {
        return n.createElement(
          p,
          null,
          n.createElement(g, {
            onClick: () => {
              const { sources: t, chartUndoModel: l } = e
              l.restoreLineToolsFactoryDefaults(t)
            },
            name: r.t(null, void 0, l(62511)),
          }),
        )
      }
      function f(e) {
        return n.createElement(b, { ...e })
      }
    },
    37289: (e, t, l) => {
      l.d(t, { PropertiesEditorTab: () => c })
      var n = l(50959),
        r = l(66849)
      const o = {
          'Elliott Impulse Wave (12345)Degree': 'normal',
          'Elliott Triangle Wave (ABCDE)Degree': 'normal',
          'Elliott Triple Combo Wave (WXYXZ)Degree': 'normal',
          'Elliott Correction Wave (ABC)Degree': 'normal',
          'Elliott Double Combo Wave (WXY)Degree': 'normal',
          BarsPatternMode: 'normal',
          StudyInputSource: 'normal',
        },
        i = {
          TextText: 'big',
          AnchoredTextText: 'big',
          NoteText: 'big',
          AnchoredNoteText: 'big',
          CalloutText: 'big',
          BalloonText: 'big',
        }
      var s = l(71891),
        a = l(68215)
      function c(e) {
        const { page: t, pageRef: l, tableKey: c } = e
        return n.createElement(
          r.ControlCustomHeightContext.Provider,
          { value: i },
          n.createElement(
            r.ControlCustomWidthContext.Provider,
            { value: o },
            t &&
              n.createElement(
                s.PropertyTable,
                { reference: l, key: c },
                t.definitions
                  .value()
                  .map((e) =>
                    n.createElement(a.Section, { key: e.id, definition: e }),
                  ),
              ),
          ),
        )
      }
    },
    11684: (e, t, l) => {
      l.d(t, { PopupMenuSeparator: () => a })
      var n,
        r = l(50959),
        o = l(97754),
        i = l.n(o),
        s = l(238)
      function a(e) {
        const { size: t = 'normal', className: l, ariaHidden: n = !1 } = e
        return r.createElement('div', {
          className: i()(
            s.separator,
            'small' === t && s.small,
            'normal' === t && s.normal,
            'large' === t && s.large,
            l,
          ),
          role: 'separator',
          'aria-hidden': n,
        })
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Large = 'large'), (e.Normal = 'normal')
      })(n || (n = {}))
    },
    86720: (e, t, l) => {
      l.d(t, { UnderlineButtonTabs: () => J })
      var n,
        r = l(50959),
        o = l(97754),
        i = l.n(o),
        s = l(11542),
        a = l(95854),
        c = l(38528),
        d = l(47201),
        p = l(7953),
        u = l(36966),
        h = l(26597)
      !((e) => {
        ;(e.XSmall = 'xsmall'),
          (e.Small = 'small'),
          (e.Medium = 'medium'),
          (e.Large = 'large'),
          (e.XLarge = 'xlarge')
      })(n || (n = {}))
      const m = (0, r.createContext)({
        size: 'small',
        overflowBehaviour: void 0,
      })
      var v = l(17946),
        y = l(56406)
      function g(e) {
        const {
          size: t = 'xsmall',
          active: l,
          fake: n,
          enableActiveStateStyles: r,
          anchor: i = !1,
          hideFocusOutline: s = !1,
          equalTabSize: a,
          className: c,
          overflowBehaviour: d,
        } = e
        return o(
          y['underline-tab'],
          y[`size-${t}`],
          l && y.selected,
          !r && y['disable-active-state-styles'],
          s && y['disable-focus-outline'],
          n && y.fake,
          i && y['enable-cursor-pointer'],
          a && y[`margin-${t}`],
          'collapse' === d && y.collapse,
          c,
        )
      }
      const b = (0, r.forwardRef)((e, t) => {
        const { size: l, overflowBehaviour: n } = (0, r.useContext)(m),
          o = (0, r.useContext)(v.CustomBehaviourContext),
          {
            active: s,
            fake: a,
            className: c,
            enableActiveStateStyles: d = o.enableActiveStateStyles,
            hideFocusOutline: p = !1,
            equalTabSize: u,
            children: h,
            ...b
          } = e
        return r.createElement(
          'button',
          {
            ...b,
            ref: t,
            className: g({
              size: l,
              active: s,
              fake: a,
              enableActiveStateStyles: d,
              hideFocusOutline: p,
              equalTabSize: u,
              className: c,
              overflowBehaviour: n,
            }),
          },
          u && 'string' == typeof h
            ? r.createElement(
                'span',
                {
                  className: i()(
                    y['ellipsis-children'],
                    'apply-overflow-tooltip',
                  ),
                },
                h,
              )
            : h,
        )
      })
      b.displayName = 'UnderlineTabsBaseButton'
      const f = (0, r.forwardRef)((e, t) => {
        const {
            item: l,
            highlighted: n,
            handleItemRef: o,
            onClick: i,
            'aria-disabled': s,
            ...a
          } = e,
          c = (0, r.useCallback)(() => {
            i && i(l)
          }, [i, l]),
          d = (0, r.useCallback)(
            (e) => {
              o && o(l, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [l, o, t],
          )
        return r.createElement(
          b,
          { ...a, id: l.id, onClick: c, ref: d },
          l.label,
        )
      })
      f.displayName = 'UnderlineButtonTab'
      var w = l(50151),
        C = l(16396),
        P = l(4523),
        S = l(9745),
        E = l(47531),
        T = l(2948),
        x = l(63509),
        k = l(68874),
        _ = l(32498)
      function I(e) {
        switch (e) {
          case 'xsmall':
            return E
          case 'small':
            return T
          case 'medium':
          case 'large':
            return x
          case 'xlarge':
            return k
        }
      }
      function L(e) {
        const { size: t, isDropped: l = !1 } = e
        return r.createElement(S.Icon, {
          icon: I(t),
          className: o(_['arrow-icon'], _[`size-${t}`], l && _.dropped),
        })
      }
      var R = l(33636)
      const D = 4,
        B = 4
      function V(e) {
        const {
            size: t,
            disabled: l,
            isOpened: n,
            enableActiveStateStyles: o,
            hideFocusOutline: i,
            fake: s,
            items: a,
            buttonContent: d,
            buttonRef: p,
            isAnchorTabs: u,
            isHighlighted: h,
            onButtonClick: m,
            onItemClick: v,
            onClose: y,
          } = e,
          g = (0, r.useRef)(null),
          f = (0, c.useMergedRefs)([p, g]),
          S = ((e, t) => {
            const l = (0, r.useRef)(A)
            return (
              (0, r.useEffect)(() => {
                const e = getComputedStyle((0, w.ensureNotNull)(t.current))
                l.current = {
                  xsmall: N(e, 'xsmall'),
                  small: N(e, 'small'),
                  medium: N(e, 'medium'),
                  large: N(e, 'large'),
                  xlarge: N(e, 'xlarge'),
                }
              }, [t]),
              (0, r.useCallback)(() => {
                const n = (0, w.ensureNotNull)(
                    t.current,
                  ).getBoundingClientRect(),
                  r = l.current[e]
                return {
                  x: n.left,
                  y: n.top + n.height + r + D,
                  indentFromWindow: { top: B, bottom: B, left: B, right: B },
                }
              }, [t, e])
            )
          })(t, g)
        return r.createElement(P.PopupMenuDisclosureView, {
          buttonRef: g,
          listboxTabIndex: -1,
          isOpened: n,
          onClose: y,
          listboxAria: { 'aria-hidden': !0 },
          popupPosition: S,
          button: r.createElement(
            b,
            {
              'aria-hidden': !0,
              disabled: l,
              active: n,
              onClick: m,
              ref: f,
              tabIndex: -1,
              enableActiveStateStyles: o,
              hideFocusOutline: i,
              fake: s,
            },
            d,
            r.createElement(L, { size: t, isDropped: n }),
          ),
          popupChildren: a.map((e) =>
            r.createElement(C.PopupMenuItem, {
              key: e.id,
              className: u ? R['link-item'] : void 0,
              onClick: v,
              onClickArg: e,
              isActive: h(e),
              label: e.label,
              isDisabled: e.disabled,
              link: 'href' in e ? e.href : void 0,
              rel: 'rel' in e ? e.rel : void 0,
              target: 'target' in e ? e.target : void 0,
              renderComponent:
                'renderComponent' in e ? e.renderComponent : void 0,
              dontClosePopup: !0,
            }),
          ),
        })
      }
      function N(e, t) {
        return Number.parseInt(
          e.getPropertyValue(`--ui-lib-underline-tabs-tab-margin-bottom-${t}`),
          10,
        )
      }
      const A = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
      var z = l(75774),
        M = l(86781),
        W = l(86240),
        H = l(98163)
      function F(e) {
        const { size: t, overflowBehaviour: l, className: n } = e
        return o(
          H['scroll-wrap'],
          H[`size-${t}`],
          'scroll' === l && H['enable-scroll'],
          n,
        )
      }
      function O() {
        const [e, t] = (0, r.useState)(!1)
        return (
          (0, r.useEffect)(() => {
            t(z.mobiletouch)
          }, []),
          e
        )
      }
      var U = l(90484),
        G = l(63273),
        Y = l(50368),
        j = l.n(Y)
      const X = 100
      function q(e) {
        const { disabled: t, translateX: l, transitionDuration: n } = e,
          i = e.scale / 100
        return r.createElement(
          'div',
          {
            className: o(j().underline, t && j().disabled),
            style: {
              transform: `translateX(${l}px) scaleX(${i})`,
              transitionDuration: `${n}ms`,
            },
          },
          r.createElement('div', {
            className: j().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
          r.createElement('div', {
            className: j().center,
            style: { transform: `scaleX(${1 - 30 / e.scale})` },
          }),
          r.createElement('div', {
            className: j().corner,
            style: { transform: `scaleX(${1 / i})` },
          }),
        )
      }
      function J(e) {
        const {
            id: t,
            items: n,
            activationType: o,
            orientation: v,
            disabled: y,
            moreButtonContent: g = s.t(null, void 0, l(37117)),
            size: b = 'small',
            onActivate: w,
            isActive: C,
            className: P,
            style: S,
            overflowBehaviour: E,
            enableActiveStateStyles: T,
            tablistLabelId: x,
            tablistLabel: k,
            'data-name': _ = 'underline-tabs-buttons',
            stretchTabs: I,
            equalTabSize: L,
            defaultKeyboardFocus: R,
            stopPropagationIfKeyboardActionHandled: D,
            keyboardNavigationLoop: B,
            focusableItemAttributes: N,
          } = e,
          A = O(),
          z = ((e) => {
            const t = (0, M.useSafeMatchMedia)(
                W['media-mf-phone-landscape'],
                !0,
              ),
              l = O()
            return e ?? (l || !t ? 'scroll' : 'collapse')
          })(E),
          Y = (0, r.useRef)(!1),
          j = (0, r.useCallback)((e) => e.id, []),
          J = 'none' === z && I,
          K = 'none' === z && L,
          $ = T ?? !A,
          {
            visibleItems: Z,
            hiddenItems: Q,
            containerRefCallback: ee,
            innerContainerRefCallback: te,
            moreButtonRef: le,
            setItemRef: ne,
          } = (0, a.useCollapsible)(n, j, C),
          re = 'collapse' === z ? Z : n,
          oe = 'collapse' === z ? Q : [],
          ie = (0, r.useCallback)((e) => oe.includes(e), [oe]),
          se = (0, r.useRef)(new Map()),
          {
            isOpened: ae,
            open: ce,
            close: de,
            onButtonClick: pe,
          } = (0, p.useDisclosure)({ id: t, disabled: y }),
          ue = ((e = 'xsmall') => {
            switch (e) {
              case 'xsmall':
              case 'small':
                return 12
              case 'medium':
                return 16
              case 'large':
              case 'xlarge':
                return 20
            }
          })(b),
          {
            tabsBindings: he,
            tablistBinding: me,
            scrollWrapBinding: ve,
            onActivate: ye,
            onHighlight: ge,
            isHighlighted: be,
          } = (0, u.useTabs)({
            id: t,
            items: [...re, ...oe],
            activationType: o,
            orientation: v,
            disabled: y,
            tablistLabelId: x,
            tablistLabel: k,
            onActivate: w,
            isActive: C,
            isCollapsed: ie,
            isRtl: G.isRtl,
            itemsRefs: se,
            isDisclosureOpened: ae,
            defaultKeyboardFocus: R,
            stopPropagationIfKeyboardActionHandled: D,
            keyboardNavigationLoop: B,
            focusableItemAttributes: N,
            scrollIntoViewOptions: { additionalScroll: ue },
          }),
          fe = n.find(C),
          we = oe.find(be),
          Ce = (0, r.useCallback)(() => {
            fe && ge(fe)
          }, [ge, fe]),
          Pe = (0, r.useCallback)(
            (e) => he.find((t) => t.id === e.id) ?? {},
            [he],
          ),
          Se = (0, r.useCallback)(() => {
            de(), Ce(), (Y.current = !0)
          }, [de, Ce]),
          Ee = (0, r.useCallback)(() => {
            we && (ye(we), ge(we, 200))
          }, [ye, ge, we])
        ;(ve.ref = (0, c.useMergedRefs)([ve.ref, ee])),
          (me.ref = (0, c.useMergedRefs)([me.ref, te])),
          (me.onKeyDown = (0, d.createSafeMulticastEventHandler)(
            (0, h.useKeyboardEventHandler)([
              (0, h.useKeyboardClose)(ae, Se),
              (0, h.useKeyboardActionHandler)(
                [13, 32],
                Ee,
                (0, r.useCallback)(() => Boolean(we), [we]),
              ),
            ]),
            me.onKeyDown,
          ))
        const Te = (0, r.useCallback)(
            (e) => {
              ;(Y.current = !0), pe(e)
            },
            [Y, pe],
          ),
          xe = (0, r.useCallback)(
            (e) => {
              e && ye(e)
            },
            [ye],
          )
        ;(0, r.useEffect)(() => {
          Y.current ? (Y.current = !1) : (we && !ae && ce(), !we && ae && de())
        }, [we, ae, ce, de])
        const ke = ((e, t, l = []) => {
          const [n, o] = (0, r.useState)(),
            i = (0, r.useRef)(),
            s = (0, r.useRef)(),
            a = (e) => {
              const t = e.parentElement ?? void 0
              if (void 0 === t) return
              const l = void 0 === s.current || s.current === e ? 0 : X
              s.current = e
              const { left: n, right: r, width: i } = e.getBoundingClientRect(),
                { left: a, right: c } = t.getBoundingClientRect(),
                d = (0, G.isRtl)() ? r - c : n - a
              o({ translateX: d, scale: i, transitionDuration: l })
            }
          return (
            (0, r.useEffect)(() => {
              const e = (0, U.default)((e) => {
                const t = e[0].target
                void 0 !== t && a(t)
              }, 50)
              i.current = new ResizeObserver(e)
            }, []),
            (0, r.useEffect)(() => {
              if (void 0 === t) return
              const l = e.get(t)
              return void 0 !== l
                ? (a(l), i.current?.observe(l), () => i.current?.disconnect())
                : void 0
            }, l),
            n
          )
        })(se.current, fe ?? we, [fe ?? we, re, b, J, z])
        return r.createElement(
          m.Provider,
          { value: { size: b, overflowBehaviour: z } },
          r.createElement(
            'div',
            {
              ...ve,
              className: F({ size: b, overflowBehaviour: z, className: P }),
              style: S,
              'data-name': _,
            },
            r.createElement(
              'div',
              {
                ...me,
                className: i()(H['underline-tabs'], {
                  [H['make-grid-column']]: J || K,
                  [H['stretch-tabs']]: J,
                  [H['equal-tab-size']]: K,
                }),
              },
              re.map((e) =>
                r.createElement(f, {
                  ...Pe(e),
                  key: e.id,
                  item: e,
                  onClick: ye,
                  enableActiveStateStyles: $,
                  hideFocusOutline: A,
                  ref: ne(j(e)),
                  ...(e.dataId && { 'data-id': e.dataId }),
                  equalTabSize: K,
                }),
              ),
              oe.map((e) =>
                r.createElement(f, {
                  ...Pe(e),
                  ref: ne(j(e)),
                  key: e.id,
                  item: e,
                  fake: !0,
                }),
              ),
              'collapse' === z &&
                r.createElement(V, {
                  size: b,
                  disabled: y,
                  isOpened: ae,
                  items: oe,
                  buttonContent: g,
                  buttonRef: le,
                  isHighlighted: be,
                  onButtonClick: Te,
                  onItemClick: xe,
                  onClose: de,
                  enableActiveStateStyles: $,
                  hideFocusOutline: A,
                  fake: 0 === oe.length,
                }),
              ke
                ? r.createElement(q, { ...ke, disabled: y })
                : r.createElement('div', null),
            ),
          ),
        )
      }
      var K = l(38952)
      function $(e) {
        return r.createElement('a', { ...(0, K.renameRef)(e) })
      }
      ;(0, r.forwardRef)((e, t) => {
        const { size: l, overflowBehaviour: n } = (0, r.useContext)(m),
          o = (0, r.useContext)(v.CustomBehaviourContext),
          {
            item: i,
            highlighted: s,
            handleItemRef: a,
            onClick: c,
            active: d,
            fake: p,
            className: u,
            enableActiveStateStyles: h = o.enableActiveStateStyles,
            hideFocusOutline: y = !1,
            disabled: b,
            'aria-disabled': f,
            ...w
          } = e,
          C = (0, r.useCallback)(
            (e) => {
              f ? e.preventDefault() : c && c(i)
            },
            [c, f, i],
          ),
          P = (0, r.useCallback)(
            (e) => {
              a && a(i, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [i, a, t],
          ),
          S = i.renderComponent ?? $
        return r.createElement(
          S,
          {
            ...w,
            id: i.id,
            'aria-disabled': f,
            onClick: C,
            reference: P,
            href: i.href,
            rel: i.rel,
            target: i.target,
            className: g({
              size: l,
              active: d,
              fake: p,
              enableActiveStateStyles: h,
              anchor: !0,
              hideFocusOutline: y,
              className: u,
              overflowBehaviour: n,
            }),
          },
          i.label,
        )
      }).displayName = 'UnderlineAnchorTab'
    },
    22315: (e) => {
      e.exports = {
        wrapper: 'wrapper-bl9AR3Gv',
        hovered: 'hovered-bl9AR3Gv',
        switchWrap: 'switchWrap-bl9AR3Gv',
        withIcon: 'withIcon-bl9AR3Gv',
        labelRow: 'labelRow-bl9AR3Gv',
        label: 'label-bl9AR3Gv',
        icon: 'icon-bl9AR3Gv',
        labelHint: 'labelHint-bl9AR3Gv',
        labelOn: 'labelOn-bl9AR3Gv',
        accessible: 'accessible-bl9AR3Gv',
      }
    },
    52444: (e) => {
      e.exports = {
        smallStyleControl: 'smallStyleControl-l5f4IL9k',
        additionalSelect: 'additionalSelect-l5f4IL9k',
        childRowContainer: 'childRowContainer-l5f4IL9k',
        defaultSelect: 'defaultSelect-l5f4IL9k',
        defaultSelectItem: 'defaultSelectItem-l5f4IL9k',
        block: 'block-l5f4IL9k',
        group: 'group-l5f4IL9k',
        wrapGroup: 'wrapGroup-l5f4IL9k',
        textMarkGraphicBlock: 'textMarkGraphicBlock-l5f4IL9k',
        textMarkGraphicWrapGroup: 'textMarkGraphicWrapGroup-l5f4IL9k',
        transparency: 'transparency-l5f4IL9k',
        color: 'color-l5f4IL9k',
      }
    },
    10428: (e, t, l) => {
      l.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => f,
        MenuItemSwitcher: () => w,
      })
      var n,
        r = l(50959),
        o = l(97754),
        i = l.n(o),
        s = l(17946),
        a = l(45658)
      function c(e) {
        const { size: t = 'small', checked: l, disabled: n } = e
        return r.createElement(
          'span',
          {
            className: i()(a.switchView, a[t], n && a.disabled, l && a.checked),
          },
          r.createElement('span', { className: a.track }),
          r.createElement('span', { className: a.thumb }),
        )
      }
      !((e) => {
        ;(e.Small = 'small'), (e.Medium = 'medium'), (e.Large = 'large')
      })(n || (n = {}))
      var d,
        p = l(3343),
        u = l(20071),
        h = l.n(u)
      function m(e) {
        const t = (0, r.useContext)(s.CustomBehaviourContext),
          {
            size: l,
            intent: n = 'default',
            checked: i,
            className: a,
            enableActiveStateStyles: d = t.enableActiveStateStyles,
            disabled: u,
            onChange: m,
            title: v,
            id: y,
            name: g,
            value: b,
            tabIndex: f,
            role: w = 'switch',
            ariaDisabled: C,
            reference: P,
            ariaLabelledBy: S,
            ariaLabel: E,
            ...T
          } = e
        return r.createElement(
          'span',
          { className: o(a, h().switcher) },
          r.createElement('input', {
            ...T,
            type: 'checkbox',
            className: o(
              h().input,
              d && h().activeStylesEnabled,
              i && h().checked,
              u && h().disabled,
            ),
            role: w,
            'aria-checked': i,
            checked: i,
            onKeyDown: (e) => {
              13 === (0, p.hashFromEvent)(e) && e.currentTarget?.click()
            },
            onChange: m,
            disabled: u,
            'aria-disabled': C,
            tabIndex: f,
            title: v,
            id: y,
            name: g,
            value: b,
            ref: P,
            'aria-label': E,
            'aria-labelledby': S,
          }),
          r.createElement(
            'span',
            { className: o(h().thumbWrapper, h()[n]) },
            r.createElement(c, { checked: i, size: l, disabled: u }),
          ),
        )
      }
      !((e) => {
        ;(e.Default = 'default'), (e.Select = 'select')
      })(d || (d = {}))
      var v = l(9745),
        y = l(50238),
        g = l(90186),
        b = l(22315)
      const f = b
      function w(e) {
        const {
            role: t,
            checked: l,
            onChange: n,
            className: o,
            id: s,
            label: a,
            labelDescription: c,
            preventLabelHighlight: d,
            value: u,
            reference: h,
            switchReference: f,
            theme: w = b,
            disabled: C,
            switchRole: P,
            icon: S,
          } = e,
          [E, T] = (0, y.useRovingTabindexElement)(null),
          x = i()(w.label, l && !d && w.labelOn),
          k = i()(
            o,
            w.wrapper,
            l && w.wrapperWithOnLabel,
            c && w.wrapperWithDescription,
          )
        return r.createElement(
          'label',
          {
            role: t,
            className: i()(k, S && w.withIcon, b.accessible),
            htmlFor: s,
            ref: h,
            onKeyDown: (e) => {
              if (e.target !== e.currentTarget) return
              const t = (0, p.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                E.current instanceof HTMLElement && E.current.click())
            },
            tabIndex: T,
            'data-role': 'menuitem',
            'aria-disabled': e.disabled || void 0,
            'aria-selected': l,
          },
          void 0 !== S &&
            r.createElement(v.Icon, { className: w.icon, icon: S }),
          r.createElement(
            'div',
            { className: w.labelRow },
            r.createElement('div', { className: x }, a),
            c && r.createElement('div', { className: w.labelHint }, c),
          ),
          r.createElement(
            'div',
            { className: b.switchWrap },
            r.createElement(m, {
              disabled: C,
              className: w.switch,
              reference: (e) => {
                E(e), f?.(e)
              },
              checked: l,
              onChange: (e) => {
                const t = e.target.checked
                void 0 !== n && n(t)
              },
              value: u,
              tabIndex: -1,
              id: s,
              role: P,
              ariaDisabled: !0,
              ...(0, g.filterDataProps)(e),
            }),
          ),
        )
      }
    },
    57717: (e, t, l) => {
      l.r(t), l.d(t, { createPropertyPage: () => r })
      var n = l(64147)
      function r(e, t, l, r = null) {
        const o = {
          id: t,
          title: l,
          definitions: new n.WatchedValue(e.definitions),
          visible: e.visible ?? new n.WatchedValue(!0).readonly(),
        }
        return null !== r && (o.icon = r), o
      }
    },
    26434: (e, t, l) => {
      l.r(t),
        l.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ae,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => ce,
        })
      var n = l(11542),
        r = l(45126),
        o = l(32097),
        i = l(64147),
        s = l(10074),
        a = l(1819),
        c = l(73305),
        d = l(46112)
      const p = new r.TranslatedString(
          'change {title} visibility on ticks',
          n.t(null, void 0, l(98596)),
        ),
        u = new r.TranslatedString(
          'change {title} visibility on seconds',
          n.t(null, void 0, l(41315)),
        ),
        h = new r.TranslatedString(
          'change {title} seconds from',
          n.t(null, void 0, l(86780)),
        ),
        m = new r.TranslatedString(
          'change {title} seconds to',
          n.t(null, void 0, l(6573)),
        ),
        v = new r.TranslatedString(
          'change {title} visibility on minutes',
          n.t(null, void 0, l(78219)),
        ),
        y = new r.TranslatedString(
          'change {title} minutes from',
          n.t(null, void 0, l(59820)),
        ),
        g = new r.TranslatedString(
          'change {title} minutes to',
          n.t(null, void 0, l(38011)),
        ),
        b = new r.TranslatedString(
          'change {title} visibility on hours',
          n.t(null, void 0, l(68715)),
        ),
        f = new r.TranslatedString(
          'change {title} hours from',
          n.t(null, void 0, l(8306)),
        ),
        w = new r.TranslatedString(
          'change {title} hours to',
          n.t(null, void 0, l(67233)),
        ),
        C = new r.TranslatedString(
          'change {title} visibility on days',
          n.t(null, void 0, l(56402)),
        ),
        P = new r.TranslatedString(
          'change {title} days from',
          n.t(null, void 0, l(91201)),
        ),
        S = new r.TranslatedString(
          'change {title} days to',
          n.t(null, void 0, l(96135)),
        ),
        E = new r.TranslatedString(
          'change {title} visibility on weeks',
          n.t(null, void 0, l(71084)),
        ),
        T = new r.TranslatedString(
          'change {title} weeks from',
          n.t(null, void 0, l(32481)),
        ),
        x = new r.TranslatedString(
          'change {title} weeks to',
          n.t(null, void 0, l(18678)),
        ),
        k = new r.TranslatedString(
          'change {title} visibility on months',
          n.t(null, void 0, l(67583)),
        ),
        _ = new r.TranslatedString(
          'change {title} months from',
          n.t(null, void 0, l(99122)),
        ),
        I = new r.TranslatedString(
          'change {title} months to',
          n.t(null, void 0, l(10518)),
        ),
        L =
          (new r.TranslatedString(
            'change {title} visibility on ranges',
            n.t(null, { replace: { ranges: 'ranges' } }, l(55616)),
          ),
          n.t(null, void 0, l(24821))),
        R = n.t(null, void 0, l(65188)),
        D = n.t(null, void 0, l(42562)),
        B = n.t(null, void 0, l(56796)),
        V = n.t(null, void 0, l(72942)),
        N = n.t(null, void 0, l(835)),
        A = n.t(null, void 0, l(43154)),
        z = new r.TranslatedString('ticks', n.t(null, void 0, l(3539))),
        M = new r.TranslatedString('seconds', n.t(null, void 0, l(751))),
        W = new r.TranslatedString('seconds from', n.t(null, void 0, l(35801))),
        H = new r.TranslatedString('seconds to', n.t(null, void 0, l(73419))),
        F = new r.TranslatedString('minutes', n.t(null, void 0, l(18726))),
        O = new r.TranslatedString('minutes from', n.t(null, void 0, l(22476))),
        U = new r.TranslatedString('minutes to', n.t(null, void 0, l(67649))),
        G = new r.TranslatedString('hours', n.t(null, void 0, l(2359))),
        Y = new r.TranslatedString('hours from', n.t(null, void 0, l(82267))),
        j = new r.TranslatedString('hours to', n.t(null, void 0, l(15600))),
        X = new r.TranslatedString('days', n.t(null, void 0, l(35813))),
        q = new r.TranslatedString('days from', n.t(null, void 0, l(59215))),
        J = new r.TranslatedString('days to', n.t(null, void 0, l(89919))),
        K = new r.TranslatedString('weeks', n.t(null, void 0, l(45537))),
        $ = new r.TranslatedString('weeks from', n.t(null, void 0, l(92859))),
        Z = new r.TranslatedString('weeks to', n.t(null, void 0, l(44127))),
        Q = new r.TranslatedString('months', n.t(null, void 0, l(95300))),
        ee = new r.TranslatedString('months from', n.t(null, void 0, l(17250))),
        te = new r.TranslatedString('months to', n.t(null, void 0, l(2828))),
        le = (new r.TranslatedString('ranges', 'ranges'), [1, 59]),
        ne = [1, 59],
        re = [1, 24],
        oe = [1, 366],
        ie = [1, 52],
        se = [1, 12]
      function ae(e, t, l) {
        const n = []
        if ((0, a.isTicksEnabled)()) {
          const r = (0, o.createCheckablePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.ticks,
                p.format({ title: l }),
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: L },
          )
          n.push(r)
        }
        if ((0, s.isSecondsEnabled)()) {
          const r = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.seconds,
                u.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                h.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                m.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: R,
              min: new i.WatchedValue(le[0]),
              max: new i.WatchedValue(le[1]),
            },
          )
          n.push(r)
        }
        const r = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.minutes,
                v.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                y.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.minutesTo,
                g.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: D,
              min: new i.WatchedValue(ne[0]),
              max: new i.WatchedValue(ne[1]),
            },
          ),
          c = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.hours,
                b.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.hoursFrom,
                f.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.hoursTo,
                w.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: B,
              min: new i.WatchedValue(re[0]),
              max: new i.WatchedValue(re[1]),
            },
          ),
          d = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.days,
                C.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.daysFrom,
                P.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.daysTo,
                S.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: V,
              min: new i.WatchedValue(oe[0]),
              max: new i.WatchedValue(oe[1]),
            },
          )
        n.push(r, c, d)
        const z = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.weeks,
                E.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.weeksFrom,
                T.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.weeksTo,
                x.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: N,
              min: new i.WatchedValue(ie[0]),
              max: new i.WatchedValue(ie[1]),
            },
          ),
          M = (0, o.createRangePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(
                e,
                t.months,
                k.format({ title: l }),
              ),
              from: (0, o.convertToDefinitionProperty)(
                e,
                t.monthsFrom,
                _.format({ title: l }),
              ),
              to: (0, o.convertToDefinitionProperty)(
                e,
                t.monthsTo,
                I.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: A,
              min: new i.WatchedValue(se[0]),
              max: new i.WatchedValue(se[1]),
            },
          )
        return n.push(z, M), { definitions: n }
      }
      function ce(e, t) {
        const l = []
        if ((0, a.isTicksEnabled)()) {
          const n = (0, o.createCheckablePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.ticks),
                z,
                t,
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: L },
          )
          l.push(n)
        }
        if ((0, s.isSecondsEnabled)()) {
          const n = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.seconds),
                M,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsFrom),
                W,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsTo),
                H,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: R,
              min: new i.WatchedValue(le[0]),
              max: new i.WatchedValue(le[1]),
            },
          )
          l.push(n)
        }
        const n = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutes),
                F,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesFrom),
                O,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesTo),
                U,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: D,
              min: new i.WatchedValue(ne[0]),
              max: new i.WatchedValue(ne[1]),
            },
          ),
          r = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hours),
                G,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursFrom),
                Y,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursTo),
                j,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: B,
              min: new i.WatchedValue(re[0]),
              max: new i.WatchedValue(re[1]),
            },
          ),
          p = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.days),
                X,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysFrom),
                q,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysTo),
                J,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: V,
              min: new i.WatchedValue(oe[0]),
              max: new i.WatchedValue(oe[1]),
            },
          )
        l.push(n, r, p)
        const u = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeks),
                K,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksFrom),
                $,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksTo),
                Z,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: N,
              min: new i.WatchedValue(ie[0]),
              max: new i.WatchedValue(ie[1]),
            },
          ),
          h = (0, o.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.months),
                Q,
                t,
              ),
              from: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsFrom),
                ee,
                t,
              ),
              to: new d.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsTo),
                te,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: A,
              min: new i.WatchedValue(se[0]),
              max: new i.WatchedValue(se[1]),
            },
          )
        return l.push(u, h), { definitions: l }
      }
    },
    46112: (e, t, l) => {
      l.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var n = l(50151),
        r = l(11542),
        o = l(45126),
        i = l(12988)
      const s = new o.TranslatedString(
        'change {propertyName} property',
        r.t(null, void 0, l(25167)),
      )
      class a extends i.Property {
        constructor(e, t, l) {
          super(),
            (this._isProcess = !1),
            (this._listenersMappers = []),
            (this._valueApplier = {
              applyValue: (e, t) => {
                this._propertyApplier.setProperty(e, t, s)
              },
            }),
            (this._baseProperty = e),
            (this._propertyApplier = l),
            (this._propertyName = t)
        }
        destroy() {
          this._baseProperty.destroy(), super.destroy()
        }
        value() {
          return this._baseProperty.value()
        }
        setValue(e, t) {
          this._propertyApplier.beginUndoMacro(
            s.format({ propertyName: this._propertyName }),
          ),
            (this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, this._valueApplier),
            (this._isProcess = !1),
            this._propertyApplier.endUndoMacro(),
            this._listenersMappers.forEach((e) => {
              e.method.call(e.obj, this, '')
            })
        }
        subscribe(e, t) {
          const l = () => {
            this._isProcess || t.call(e, this, '')
          }
          this._listenersMappers.push({ obj: e, method: t, callback: l }),
            this._baseProperty.subscribe(e, l)
        }
        unsubscribe(e, t) {
          const l = (0, n.ensureDefined)(
            this._listenersMappers.find((l) => l.obj === e && l.method === t)
              ?.callback,
          )
          this._baseProperty.unsubscribe(e, l)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    1183: (e, t, l) => {
      l.d(t, { StudyPlotVisibleProperty: () => o })
      var n = l(34776),
        r = l(23073)
      class o extends r.PropertyBase {
        constructor(e) {
          super(),
            (this._displayProperty = e),
            this._displayProperty.subscribe(
              this,
              this._displayPropertyValueChanged,
            )
        }
        destroy() {
          this._displayProperty.unsubscribe(
            this,
            this._displayPropertyValueChanged,
          ),
            this._listeners.destroy()
        }
        value() {
          return 0 !== this._displayProperty.value()
        }
        setValue(e, t) {
          this._displayProperty.setValue(e ? 15 : 0)
        }
        setValueSilently(e) {
          this._displayProperty.setValueSilently(e ? 15 : 0)
        }
        storeStateIfUndefined() {
          return !1
        }
        weakReference() {
          return (0, n.weakReference)(this)
        }
        ownership() {
          return (0, n.ownership)(this)
        }
        _displayPropertyValueChanged() {
          this.fireChanged()
        }
      }
    },
    47531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    63509: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.57 7.85 9 12.62l5.43-4.77-1.32-1.5L9 9.95l-4.11-3.6-1.32 1.5Z"/></svg>'
    },
    68874: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m14 18.41-6.7-6.7 1.4-1.42 5.3 5.3 5.3-5.3 1.4 1.41-6.7 6.71Z"/></svg>'
    },
    69151: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 21l7.424-6.114a.5.5 0 0 0-.318-.886H18.5V7h-9v7H6.894a.5.5 0 0 0-.318.886L14 21z"/></svg>'
    },
    67211: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 7l7.424 6.114a.5.5 0 0 1-.318.886H18.5v7h-9v-7H6.894a.5.5 0 0 1-.318-.886L14 7z"/></svg>'
    },
    83786: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><circle stroke="currentColor" cx="14" cy="14" r="6.5"/></svg>'
    },
    50858: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 14.5h11M14.5 20V9"/></svg>'
    },
    13201: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14.354 6.646L14 6.293l-.354.353-7 7-.353.354.353.354 7 7 .354.353.354-.353 7-7 .353-.354-.353-.354-7-7z"/></svg>'
    },
    59058: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8.5 22v-5.5m0 0v-8L12 7l4 2.5 3.5-1v8l-3.5 1-4-2.5-3.5 1.5z"/></svg>'
    },
    8537: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 8.5h-.5v9.707l.146.147 3 3 .354.353.354-.353 3-3 .146-.147V8.5H11z"/></svg>'
    },
    2309: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 18.5h-.5V8.793l.146-.147 3-3L14 5.293l.354.353 3 3 .146.147V18.5H11z"/></svg>'
    },
    78240: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 7.5h13v13h-13z"/></svg>'
    },
    41683: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 11.265l.478-.765H8.098l.478.765 5 8 .424.678.424-.678 5-8z"/></svg>'
    },
    63798: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 16.735l.478.765H8.098l.478-.765 5-8L14 8.057l.424.678 5 8z"/></svg>'
    },
    23223: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 9l11 11M9 20L20 9"/></svg>'
    },
    93976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M13 11.5l-1.915-1.532a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82V18.5a1 1 0 0 0 1 1H13m3.5-7l4.293-4.293c.63-.63 1.707-.184 1.707.707V18.5a1 1 0 0 1-1 1H16"/><path fill="currentColor" d="M14 6h1v2h-1zM14 11h1v2h-1zM14 16h1v2h-1zM14 21h1v2h-1z"/></svg>'
    },
    91512: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13.52v4.98a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V8.914c0-.89-1.077-1.337-1.707-.707l-4.66 4.66a1 1 0 0 1-1.332.074l-3.716-2.973a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82z"/></svg>'
    },
    21579: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM16.5 19a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM22.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>'
    },
    72914: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 12.5v8h3v-8h-3zM12.5 7.5v13h3v-13h-3zM18.5 15.5v5h3v-5h-3z"/></svg>'
    },
    98450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M17 8.5h7M20.5 12V5M10 19.5h7M13.5 23v-7M3 12.5h7M6.5 16V9"/></svg>'
    },
    18621: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4.5 20v-7m3 7V10m3 10V8m3 12V10m3 10v-8m3 8V10m3 10V8"/></svg>'
    },
    18819: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l5-5a1.414 1.414 0 0 1 2 0m11-1l-5 5a1.414 1.414 0 0 1-2 0"/><path fill="currentColor" d="M14 5h1v2h-1zM14 10h1v2h-1zM14 15h1v2h-1zM14 20h1v2h-1z"/></svg>'
    },
    94152: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>'
    },
    46464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14 3h1v2h-1V3Zm1 5h-1v2h1V8Zm-1 5h1v2h-1v-2Zm0 5h1v2h-1v-2Zm0 5h1v2h-1v-2ZM10 5h2V4H9v18H6v-5H5v6h5V5Zm11 16h1V7h-5v10h1V8h3v13Z"/></svg>'
    },
    96298: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M9.8 2.7l.7-.7.7.7 2.1 2.1.2.2H18v9.5l.2.2 2.1 2.1.2.2H24v1h-3.5l-.2.2-2.1 2.1-.7.7-.7-.7-2.1-2.1-.7-.7.7-.7 2.1-2.1.2-.2V6h-3.5l-.2.2-2.1 2.1-.2.2V24H5.5v-1H10V8.5l-.2-.2-2.1-2.1-.7-.7.7-.7 2.1-2.1zM8.4 5.5l2.09 2.09 2.09-2.09-2.09-2.09L8.41 5.5zm9.09 14.09l-2.09-2.09 2.09-2.09 2.09 2.09-2.09 2.09z"/></svg>'
    },
    14643: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 17v5.5h4v-18h4v12h4v-9h4V21"/></svg>'
    },
  },
])
