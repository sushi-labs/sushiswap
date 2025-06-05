;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6265],
  {
    26574: (e) => {
      e.exports = {
        switcher: 'switcher-fwE97QDf',
        'thumb-wrapper': 'thumb-wrapper-fwE97QDf',
        'size-small': 'size-small-fwE97QDf',
        'size-medium': 'size-medium-fwE97QDf',
        'size-large': 'size-large-fwE97QDf',
        input: 'input-fwE97QDf',
        'intent-default': 'intent-default-fwE97QDf',
        'disable-active-state-styles': 'disable-active-state-styles-fwE97QDf',
        'intent-select': 'intent-select-fwE97QDf',
        'intent-all-blue': 'intent-all-blue-fwE97QDf',
        track: 'track-fwE97QDf',
        thumb: 'thumb-fwE97QDf',
      }
    },
    14904: (e) => {
      e.exports = { scrollable: 'scrollable-vwgPOHG8', tabs: 'tabs-vwgPOHG8' }
    },
    92229: (e) => {
      e.exports = {
        defaultsButtonText: 'defaultsButtonText-zcLkuEMM',
        defaultsButtonItem: 'defaultsButtonItem-zcLkuEMM',
        defaultsButtonIcon: 'defaultsButtonIcon-zcLkuEMM',
      }
    },
    47334: (e) => {
      e.exports = {
        themesButtonText: 'themesButtonText-AeBgp7zz',
        themesButtonIcon: 'themesButtonIcon-AeBgp7zz',
        defaultsButtonText: 'defaultsButtonText-AeBgp7zz',
        defaultsButtonItem: 'defaultsButtonItem-AeBgp7zz',
      }
    },
    92910: (e) => {
      e.exports = {
        separator: 'separator-QjUlCDId',
        small: 'small-QjUlCDId',
        normal: 'normal-QjUlCDId',
        large: 'large-QjUlCDId',
      }
    },
    38546: (e, t, l) => {
      l.d(t, { DialogTabs: () => o })
      var n = l(50959),
        r = l(75983)
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
          }),
        )
      })
    },
    63374: (e, t, l) => {
      l.r(t), l.d(t, { EditObjectDialogRenderer: () => dl })
      var n = l(962),
        r = l(50959),
        o = l(50151),
        i = l(11542),
        s = l(36298),
        a = l(54358),
        c = l(56840),
        p = l(14483),
        d = l(76422),
        u = l(51768),
        h = l(50945),
        m = l(50182),
        v = l(59064),
        y = l(86656),
        g = l(28853),
        b = l(37289),
        w = l(92249),
        f = l(48531),
        C = l(38546),
        P = l(14904)
      class S extends r.PureComponent {
        constructor(e) {
          var t
          super(e),
            (this._handleClose = (e) => {
              ;((null == e ? void 0 : e.target) &&
                (e.target.closest('[data-dialog-name="gopro"]') ||
                  e.target.closest('[data-name=support-dialog]'))) ||
                this.props.onClose()
            }),
            (this._renderFooterLeft = (e) => {
              const { source: t, model: l } = this.props
              if ((0, w.isLineTool)(t))
                return r.createElement(f.FooterMenu, {
                  sources: [t],
                  chartUndoModel: l,
                })
              if ((0, g.isStudy)(t))
                return r.createElement(h.StudyDefaultsManager, {
                  model: l,
                  source: t,
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
              v.globalCloseDelegate.fire()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this.props.onClose()
            })
          const { pages: l, initialActiveTab: n } = this.props,
            o =
              null !== (t = l.find((e) => e.id === n)) && void 0 !== t
                ? t
                : l[0]
          this.state = { activeTabId: o.id }
        }
        render() {
          const {
            title: e,
            onCancel: t,
            onClose: l,
            shouldReturnFocus: n,
          } = this.props
          return r.createElement(m.AdaptiveConfirmDialog, {
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
            shouldReturnFocus: n,
          })
        }
        _renderChildren() {
          return ({ requestResize: e }) => {
            var t
            this._requestResize = e
            const { pages: l, source: n, model: o } = this.props,
              { activeTabId: i } = this.state,
              s =
                null !== (t = l.find((e) => e.id === i)) && void 0 !== t
                  ? t
                  : l[0],
              a = 'Component' in s ? void 0 : s.page,
              c = l.map(({ label: e, id: t }) => ({
                label: e,
                id: t,
                dataId: `indicator-properties-dialog-tabs-${t}`,
              }))
            return r.createElement(
              r.Fragment,
              null,
              r.createElement(C.DialogTabs, {
                className: P.tabs,
                id: 'indicator-properties-dialog-tabs',
                activeTab: s.id,
                onChange: this._handleSelect,
                tabs: c,
              }),
              r.createElement(
                y.TouchScrollContainer,
                { className: P.scrollable, onScroll: this._handleScroll },
                'Component' in s
                  ? r.createElement(s.Component, { source: n, model: o })
                  : r.createElement(b.PropertiesEditorTab, {
                      page: a,
                      tableKey: s.id,
                    }),
              ),
            )
          }
        }
      }
      var E = l(39828),
        T = l(96362)
      class _ extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._properties = this.props.source.properties()),
            (this._inputs = new T.MetaInfoHelper(
              this.props.source.metaInfo(),
            ).getUserEditableInputs())
        }
        render() {
          return r.createElement(E.InputsTabContent, {
            property: this._properties,
            model: this.props.model,
            study: this.props.source,
            studyMetaInfo: this.props.source.metaInfo(),
            inputs: this._inputs,
          })
        }
      }
      var k = l(22064),
        x = l(72877),
        I = l(42856),
        L = l(41594),
        D = l(4781),
        R = l(17948)
      const V = new s.TranslatedString(
        'change visibility',
        i.t(null, void 0, l(21511)),
      )
      class M extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { visible: l } = this.props
              l && t(l, e, V)
            })
        }
        render() {
          const { id: e, title: t, visible: n, disabled: o } = this.props,
            s = (0, a.clean)(i.t(t, { context: 'input' }, l(88601)), !0)
          return r.createElement(D.BoolInputComponent, {
            label: s,
            disabled: o,
            input: { id: e, type: 'bool', defval: !0, name: 'visible' },
            value: !n || (0, R.getPropertyValue)(n),
            onChange: this._onChange,
          })
        }
      }
      M.contextType = L.StylePropertyContext
      var B = l(12949),
        N = l(51613),
        W = l(69297),
        A = l(94697),
        z = l(94152),
        F = l(18819),
        H = l(14643),
        G = l(46464),
        U = l(96298),
        O = l(18621),
        j = l(98450),
        Q = l(91512),
        Z = l(93976),
        Y = l(72914),
        q = l(21579)
      const K = {
          [x.LineStudyPlotStyle.Line]: {
            type: x.LineStudyPlotStyle.Line,
            order: 0,
            icon: z,
            label: i.t(null, void 0, l(1277)),
          },
          [x.LineStudyPlotStyle.LineWithBreaks]: {
            type: x.LineStudyPlotStyle.LineWithBreaks,
            order: 1,
            icon: F,
            label: i.t(null, void 0, l(54934)),
          },
          [x.LineStudyPlotStyle.StepLine]: {
            type: x.LineStudyPlotStyle.StepLine,
            order: 2,
            icon: H,
            label: i.t(null, void 0, l(79511)),
          },
          [x.LineStudyPlotStyle.StepLineWithBreaks]: {
            type: x.LineStudyPlotStyle.StepLineWithBreaks,
            order: 3,
            icon: G,
            label: i.t(null, void 0, l(64108)),
          },
          [x.LineStudyPlotStyle.StepLineWithDiamonds]: {
            type: x.LineStudyPlotStyle.StepLineWithDiamonds,
            order: 4,
            icon: U,
            label: i.t(null, void 0, l(67767)),
          },
          [x.LineStudyPlotStyle.Histogram]: {
            type: x.LineStudyPlotStyle.Histogram,
            order: 5,
            icon: O,
            label: i.t(null, void 0, l(11091)),
          },
          [x.LineStudyPlotStyle.Cross]: {
            type: x.LineStudyPlotStyle.Cross,
            order: 6,
            icon: j,
            label: i.t(null, { context: 'chart_type' }, l(74274)),
          },
          [x.LineStudyPlotStyle.Area]: {
            type: x.LineStudyPlotStyle.Area,
            order: 7,
            icon: Q,
            label: i.t(null, void 0, l(42097)),
          },
          [x.LineStudyPlotStyle.AreaWithBreaks]: {
            type: x.LineStudyPlotStyle.AreaWithBreaks,
            order: 8,
            icon: Z,
            label: i.t(null, void 0, l(65262)),
          },
          [x.LineStudyPlotStyle.Columns]: {
            type: x.LineStudyPlotStyle.Columns,
            order: 9,
            icon: Y,
            label: i.t(null, void 0, l(36018)),
          },
          [x.LineStudyPlotStyle.Circles]: {
            type: x.LineStudyPlotStyle.Circles,
            order: 10,
            icon: q,
            label: i.t(null, void 0, l(39495)),
          },
        },
        $ = Object.values(K)
          .sort((e, t) => e.order - t.order)
          .map((e) => ({
            value: e.type,
            selectedContent: r.createElement(A.DisplayItem, { icon: e.icon }),
            content: r.createElement(A.DropItem, {
              icon: e.icon,
              label: e.label,
            }),
          })),
        X = i.t(null, void 0, l(91492))
      class J extends r.PureComponent {
        render() {
          const {
            id: e,
            plotType: t,
            className: l,
            priceLine: n,
            plotTypeChange: o,
            priceLineChange: i,
            disabled: s,
          } = this.props
          if (!(t in K)) return null
          const a = {
            readonly: !0,
            content: r.createElement(
              r.Fragment,
              null,
              r.createElement(W.MenuItemSwitcher, {
                id: 'PlotTypePriceLineSwitch',
                checked: n,
                label: X,
                preventLabelHighlight: !0,
                value: 'priceLineSwitcher',
                onChange: i,
              }),
              r.createElement(N.PopupMenuSeparator, null),
            ),
          }
          return r.createElement(A.IconDropdown, {
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
      var ee = l(41552),
        te = l(62433)
      const le = new s.TranslatedString(
          'change plot type',
          i.t(null, void 0, l(15683)),
        ),
        ne = new s.TranslatedString(
          'change price line visibility',
          i.t(null, void 0, l(67761)),
        )
      class re extends r.PureComponent {
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
              paletteColorProps: n,
              styleProp: o,
              isLine: s,
              hasPlotTypeSelect: a,
              grouped: c,
              offset: p,
            } = this.props,
            d = n.childs()
          return r.createElement(
            B.InputRow,
            {
              grouped: c,
              label: r.createElement(
                'div',
                { className: te.childRowContainer },
                i.t(t.name, { context: 'input' }, l(88601)),
              ),
              offset: p,
            },
            r.createElement(ee.ColorWithThicknessSelect, {
              disabled: !o.visible.value(),
              color: d.color,
              transparency: o.transparency,
              thickness: s ? d.width : void 0,
              isPaletteColor: !0,
            }),
            s && a && o.plottype && o.trackPrice
              ? r.createElement(J, {
                  id: (0, k.createDomId)(e, 'plot-type-select'),
                  disabled: !o.visible.value(),
                  className: te.smallStyleControl,
                  plotType: o.plottype.value(),
                  priceLine: o.trackPrice.value(),
                  plotTypeChange: this._onPlotTypeChange,
                  priceLineChange: this._onPriceLineChange,
                })
              : null,
          )
        }
      }
      re.contextType = L.StylePropertyContext
      var oe = l(11062)
      function ie(e, t, l, n, i, s, a) {
        const c = t.colors,
          p = l.colors
        return Object.keys(c).map((t, l) =>
          r.createElement(re, {
            key: a ? `${t}-secondary` : t,
            id: e,
            grouped: !0,
            paletteColor: (0, o.ensureDefined)(c[t]),
            paletteColorProps: (0, o.ensureDefined)(p[t]),
            styleProp: n,
            isLine: i,
            hasPlotTypeSelect: 0 === l,
            offset: s,
          }),
        )
      }
      class se extends r.PureComponent {
        render() {
          const {
              plot: e,
              area: t,
              palette: l,
              paletteProps: n,
              hideVisibilitySwitch: i,
              styleProp: s,
              showOnlyTitle: a,
              showSeparator: c = !0,
              offset: p,
              secondaryPalette: d,
              secondaryPaletteProps: u,
              title: h,
            } = this.props,
            m = e ? e.id : (0, o.ensureDefined)(t).id,
            v = !m.startsWith('fill') && e && (0, x.isLinePlot)(e)
          return r.createElement(
            r.Fragment,
            null,
            !i &&
              r.createElement(
                oe.PropertyTable.Row,
                null,
                r.createElement(
                  oe.PropertyTable.Cell,
                  {
                    placement: 'first',
                    colSpan: 2,
                    offset: p,
                  },
                  a
                    ? r.createElement('div', null, h)
                    : r.createElement(M, {
                        id: m,
                        title: h,
                        visible: s.visible,
                      }),
                ),
              ),
            ie(m, l, n, s, v, p),
            d && u && ie(m, d, u, s, v, p, !0),
            c && r.createElement(oe.PropertyTable.GroupSeparator, null),
          )
        }
      }
      se.contextType = L.StylePropertyContext
      var ae = l(99970)
      class ce extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._visible = new ae.StudyPlotVisibleProperty(
              e.styleProp.display,
            ))
        }
        render() {
          const {
            title: e,
            plot: t,
            area: l,
            palette: n,
            paletteProps: o,
            hideVisibilitySwitch: i,
            styleProp: s,
            showOnlyTitle: a,
            showSeparator: c = !0,
            offset: p,
          } = this.props
          return r.createElement(se, {
            plot: t,
            area: l,
            title: e,
            palette: n,
            paletteProps: o,
            styleProp: { ...s, visible: this._visible },
            showSeparator: c,
            hideVisibilitySwitch: i,
            showOnlyTitle: a,
            offset: p,
          })
        }
        componentWillUnmount() {
          this._visible.destroy()
        }
      }
      ce.contextType = L.StylePropertyContext
      class pe extends r.PureComponent {
        constructor(e) {
          super(e), (this._visible = new ae.StudyPlotVisibleProperty(e.display))
        }
        render() {
          const { id: e, title: t, disabled: l } = this.props
          return r.createElement(M, {
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
      pe.contextType = L.StylePropertyContext
      var de = l(50890)
      const ue = new s.TranslatedString(
          'change plot type',
          i.t(null, void 0, l(15683)),
        ),
        he = new s.TranslatedString(
          'change price line visibility',
          i.t(null, void 0, l(67761)),
        )
      class me extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context,
                {
                  property: { plottype: l },
                } = this.props
              l && t(l, e, ue)
            }),
            (this._onPriceLineChange = (e) => {
              const { setValue: t } = this.context,
                {
                  property: { trackPrice: l },
                } = this.props
              l && t(l, e, he)
            })
        }
        render() {
          const {
            id: e,
            title: t,
            isRGB: l,
            isFundamental: n,
            property: {
              color: o,
              plottype: i,
              linewidth: s,
              transparency: a,
              trackPrice: c,
              display: p,
            },
          } = this.props
          return r.createElement(
            B.InputRow,
            { label: r.createElement(pe, { id: e, title: t, display: p }) },
            l && !n
              ? this._getInputForRgb()
              : r.createElement(ee.ColorWithThicknessSelect, {
                  disabled: 0 === p.value(),
                  color: o,
                  transparency: a,
                  thickness: s,
                }),
            r.createElement(J, {
              id: (0, k.createDomId)(e, 'plot-type-select'),
              disabled: 0 === p.value(),
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
            { linewidth: n, display: o } = l
          return n && t
            ? r.createElement(de.LineWidthSelect, {
                id: (0, k.createDomId)(e, 'line-width-select'),
                property: n,
                disabled: 0 === o.value(),
              })
            : null
        }
      }
      me.contextType = L.StylePropertyContext
      const ve = r.createContext(null)
      class ye extends r.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            title: l,
            visible: n,
            color: o,
            transparency: i,
            thickness: s,
            children: a,
            switchable: c = !0,
            offset: p,
            grouped: d,
            disabled: u,
          } = this.props
          return r.createElement(
            B.InputRow,
            {
              label: c
                ? r.createElement(M, {
                    id: e,
                    title: l,
                    visible: n,
                    disabled: u,
                  })
                : l,
              offset: p,
              grouped: d,
            },
            t
              ? null
              : r.createElement(ee.ColorWithThicknessSelect, {
                  disabled:
                    u || (n && !(Array.isArray(n) ? n[0].value() : n.value())),
                  color: o,
                  transparency: i,
                  thickness: s,
                }),
            a,
          )
        }
      }
      ye.contextType = L.StylePropertyContext
      class ge extends r.PureComponent {
        constructor(e) {
          super(e), (this._visible = new ae.StudyPlotVisibleProperty(e.display))
        }
        render() {
          const {
            id: e,
            isRGB: t,
            title: l,
            color: n,
            transparency: o,
            thickness: i,
            children: s,
            switchable: a = !0,
            offset: c,
            grouped: p,
          } = this.props
          return r.createElement(ye, {
            id: e,
            isRGB: t,
            title: l,
            color: n,
            transparency: o,
            thickness: i,
            children: s,
            switchable: a,
            offset: c,
            grouped: p,
            visible: this._visible,
          })
        }
        componentWillUnmount() {
          this._visible.destroy()
        }
      }
      ge.contextType = L.StylePropertyContext
      class be extends r.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            property: { colorup: l, colordown: n, transparency: i, display: s },
          } = this.props
          return r.createElement(ve.Consumer, null, (a) =>
            r.createElement(
              r.Fragment,
              null,
              r.createElement(
                oe.PropertyTable.Row,
                null,
                r.createElement(
                  oe.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, grouped: !0 },
                  r.createElement(pe, {
                    id: e,
                    title: Ze((0, o.ensureNotNull)(a), e),
                    display: s,
                  }),
                ),
              ),
              !t &&
                r.createElement(
                  r.Fragment,
                  null,
                  r.createElement(ge, {
                    id: e,
                    title: He,
                    color: l,
                    transparency: i,
                    display: s,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                  r.createElement(ge, {
                    id: e,
                    title: Ge,
                    color: n,
                    transparency: i,
                    display: s,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                ),
              r.createElement(oe.PropertyTable.GroupSeparator, null),
            ),
          )
        }
      }
      be.contextType = L.StylePropertyContext
      var we = l(87795),
        fe = l.n(we),
        Ce = l(97754),
        Pe = l.n(Ce),
        Se = l(31261),
        Ee = l(90405),
        Te = l(95586)
      const _e = {
          [Te.MarkLocation.AboveBar]: {
            value: Te.MarkLocation.AboveBar,
            content: i.t(null, void 0, l(41389)),
            order: 0,
          },
          [Te.MarkLocation.BelowBar]: {
            value: Te.MarkLocation.BelowBar,
            content: i.t(null, void 0, l(78626)),
            order: 1,
          },
          [Te.MarkLocation.Top]: {
            value: Te.MarkLocation.Top,
            content: i.t(null, void 0, l(65994)),
            order: 2,
          },
          [Te.MarkLocation.Bottom]: {
            value: Te.MarkLocation.Bottom,
            content: i.t(null, void 0, l(91757)),
            order: 3,
          },
          [Te.MarkLocation.Absolute]: {
            value: Te.MarkLocation.Absolute,
            content: i.t(null, void 0, l(29520)),
            order: 4,
          },
        },
        ke = Object.values(_e).sort((e, t) => e.order - t.order)
      class xe extends r.PureComponent {
        render() {
          const {
            id: e,
            shapeLocation: t,
            className: l,
            menuItemClassName: n,
            shapeLocationChange: o,
            disabled: i,
          } = this.props
          return r.createElement(Ee.Select, {
            id: e,
            disabled: i,
            className: l,
            menuItemClassName: n,
            items: ke,
            value: t,
            onChange: o,
          })
        }
      }
      const Ie = new s.TranslatedString(
          'change char',
          i.t(null, void 0, l(98491)),
        ),
        Le = new s.TranslatedString(
          'change location',
          i.t(null, void 0, l(38361)),
        )
      class De extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onCharChange = (e) => {
              const { setValue: t } = this.context,
                l = e.currentTarget.value.trim(),
                n = fe()(l),
                r = 0 === n.length ? '' : n[n.length - 1]
              t((0, o.ensureDefined)(this.props.property.childs().char), r, Ie)
            }),
            (this._onLocationChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().location, e, Le)
            })
        }
        render() {
          var e
          const {
              id: t,
              title: l,
              char: n,
              isRGB: i,
              property: s,
              hasPalette: a,
            } = this.props,
            {
              color: c,
              transparency: p,
              char: d,
              location: u,
              display: h,
            } = s.childs()
          return r.createElement(
            B.InputRow,
            {
              grouped: a,
              label: r.createElement(pe, { id: t, title: l, display: h }),
            },
            !a &&
              !i &&
              r.createElement(ee.ColorWithThicknessSelect, {
                disabled: 0 === h.value(),
                color: c,
                transparency: p,
              }),
            r.createElement(Se.InputControl, {
              disabled: void 0 === d || 0 === h.value(),
              className: te.smallStyleControl,
              value: (0, o.ensureDefined)(
                null !== (e = null == d ? void 0 : d.value()) && void 0 !== e
                  ? e
                  : n,
              ),
              onChange: this._onCharChange,
            }),
            r.createElement(xe, {
              id: (0, k.createDomId)(t, 'shape-style-select'),
              disabled: 0 === h.value(),
              className: Ce(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: u.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      De.contextType = L.StylePropertyContext
      var Re = l(76058)
      const Ve = {
        arrow_down: l(69151),
        arrow_up: l(67211),
        circle: l(83786),
        cross: l(50858),
        diamond: l(13201),
        flag: l(59058),
        label_down: l(8537),
        label_up: l(2309),
        square: l(78240),
        triangle_down: l(41683),
        triangle_up: l(6570),
        x_cross: l(23223),
      }
      function Me(e) {
        return Ve[e]
      }
      const Be = []
      Object.keys(Re.plotShapesData).forEach((e) => {
        const t = Re.plotShapesData[e]
        Be.push({
          id: t.id,
          value: t.id,
          selectedContent: r.createElement(A.DisplayItem, { icon: Me(t.icon) }),
          content: r.createElement(A.DropItem, {
            icon: Me(t.icon),
            label: t.guiName,
          }),
        })
      })
      class Ne extends r.PureComponent {
        render() {
          const {
            id: e,
            shapeStyleId: t,
            className: l,
            shapeStyleChange: n,
            disabled: o,
          } = this.props
          return r.createElement(A.IconDropdown, {
            id: e,
            disabled: o,
            className: l,
            hideArrowButton: !0,
            items: Be,
            value: t,
            onChange: n,
          })
        }
      }
      const We = new s.TranslatedString(
          'change shape',
          i.t(null, void 0, l(86888)),
        ),
        Ae = new s.TranslatedString(
          'change location',
          i.t(null, void 0, l(38361)),
        )
      class ze extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().plottype, e, We)
            }),
            (this._onLocationChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().location, e, Ae)
            })
        }
        render() {
          const {
              id: e,
              title: t,
              isRGB: l,
              hasPalette: n,
              property: o,
            } = this.props,
            {
              color: i,
              transparency: s,
              plottype: a,
              location: c,
              display: p,
            } = o.childs()
          return r.createElement(
            B.InputRow,
            {
              grouped: n,
              label: r.createElement(pe, { id: e, title: t, display: p }),
            },
            !n &&
              !l &&
              r.createElement(ee.ColorWithThicknessSelect, {
                disabled: 0 === p.value(),
                color: i,
                transparency: s,
              }),
            r.createElement(Ne, {
              id: (0, k.createDomId)(e, 'shape-style-select'),
              disabled: 0 === p.value(),
              className: te.smallStyleControl,
              shapeStyleId: a.value(),
              shapeStyleChange: this._onPlotTypeChange,
            }),
            r.createElement(xe, {
              id: (0, k.createDomId)(e, 'shape-location-select'),
              disabled: 0 === p.value(),
              className: Ce(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: c.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      ze.contextType = L.StylePropertyContext
      const Fe = (0, l(59224).getLogger)('Chart.Study.PropertyPage'),
        He = i.t(null, void 0, l(98802)),
        Ge = i.t(null, void 0, l(41361)),
        Ue = i.t(null, void 0, l(83760)),
        Oe = i.t(null, void 0, l(26458)),
        je = i.t(null, void 0, l(48848))
      class Qe extends r.PureComponent {
        render() {
          var e, t, l
          const { plot: n, palettes: i, study: s } = this.props,
            a = n.id,
            c = s.properties().styles,
            p = s.metaInfo().styles,
            d = c[a],
            u = n.type,
            h = i.main,
            m = !!s.metaInfo().isRGB
          if ('line' === u || 'bar_colorer' === u || 'bg_colorer' === u)
            return h && h.palette && h.paletteProps
              ? r.createElement(ce, {
                  title:
                    null !==
                      (t =
                        null === (e = null == p ? void 0 : p[a]) || void 0 === e
                          ? void 0
                          : e.title) && void 0 !== t
                      ? t
                      : a,
                  plot: n,
                  palette: h.palette,
                  paletteProps: h.paletteProps,
                  styleProp: d,
                })
              : r.createElement(me, {
                  id: a,
                  title: (0, o.ensureDefined)(
                    null === (l = null == p ? void 0 : p[a]) || void 0 === l
                      ? void 0
                      : l.title,
                  ),
                  property: d,
                  isRGB: m,
                  isFundamental: false,
                  showLineWidth: 'line' === u,
                })
          if ('arrows' === u) {
            const e = this._getPlotSwitch(a, Ze(s, a), d.display)
            if (m) return e
            const t = i.up,
              l = i.down
            return t || l
              ? r.createElement(
                  r.Fragment,
                  null,
                  e,
                  t && t.palette && t.paletteProps
                    ? r.createElement(ce, {
                        title: He,
                        plot: n,
                        palette: t.palette,
                        paletteProps: t.paletteProps,
                        styleProp: d,
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : r.createElement(ge, {
                        id: a,
                        isRGB: m,
                        title: He,
                        color: d.colorup,
                        display: d.display,
                        transparency: d.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  l && l.palette && l.paletteProps
                    ? r.createElement(ce, {
                        title: Ge,
                        plot: n,
                        palette: l.palette,
                        paletteProps: l.paletteProps,
                        styleProp: d,
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : r.createElement(ge, {
                        id: a,
                        isRGB: m,
                        title: Ge,
                        color: d.colordown,
                        display: d.display,
                        transparency: d.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  r.createElement(oe.PropertyTable.GroupSeparator, null),
                )
              : r.createElement(be, {
                  id: a,
                  property: d,
                  isRGB: m,
                  plot: n,
                  palettes: i,
                  styleProp: d,
                })
          }
          if ('chars' === u || 'shapes' === u) {
            const e = (0, o.ensureDefined)(null == p ? void 0 : p[a]),
              t = e.title
            return r.createElement(
              r.Fragment,
              null,
              'chars' === u
                ? r.createElement(De, {
                    id: a,
                    title: t,
                    char: e.char,
                    property: d,
                    hasPalette: Boolean(h && h.palette),
                    isRGB: m,
                  })
                : r.createElement(ze, {
                    id: a,
                    title: t,
                    property: d,
                    hasPalette: Boolean(h && h.palette),
                    isRGB: m,
                  }),
              h &&
                h.palette &&
                h.paletteProps &&
                r.createElement(ce, {
                  title: t,
                  plot: n,
                  palette: h.palette,
                  paletteProps: h.paletteProps,
                  hideVisibilitySwitch: !0,
                  styleProp: d,
                }),
            )
          }
          if ((0, x.isOhlcPlot)(n)) {
            const e = n.target,
              t = s.properties().ohlcPlots[e],
              l = (0, o.ensureDefined)(
                (0, o.ensureDefined)(s.metaInfo().ohlcPlots)[e],
              ),
              c = this._getPlotSwitch(a, l.title, t.display)
            if (m) return c
            const p = i.wick && i.wick.palette && i.wick.paletteProps,
              d = i.border && i.border.palette && i.border.paletteProps
            return r.createElement(
              r.Fragment,
              null,
              c,
              h && h.palette && h.paletteProps
                ? r.createElement(ce, {
                    title: Ue,
                    plot: n,
                    palette: h.palette,
                    paletteProps: h.paletteProps,
                    styleProp: t,
                    showSeparator: !1,
                    showOnlyTitle: !0,
                    offset: !0,
                  })
                : r.createElement(ge, {
                    id: a,
                    isRGB: m,
                    title: Ue,
                    display: t.display,
                    color: t.color,
                    transparency: t.transparency,
                    switchable: !1,
                    grouped: !0,
                    offset: !0,
                  }),
              i.wick &&
                i.wick.palette &&
                i.wick.paletteProps &&
                r.createElement(ce, {
                  title: Oe,
                  plot: n,
                  palette: i.wick.palette,
                  paletteProps: i.wick.paletteProps,
                  styleProp: t,
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!p && t.wickColor) &&
                r.createElement(ge, {
                  id: a,
                  isRGB: m,
                  title: Oe,
                  display: t.display,
                  color: t.wickColor,
                  transparency: t.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              i.border &&
                i.border.palette &&
                i.border.paletteProps &&
                r.createElement(ce, {
                  title: je,
                  plot: n,
                  palette: i.border.palette,
                  paletteProps: i.border.paletteProps,
                  styleProp: t,
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!d && t.borderColor) &&
                r.createElement(ge, {
                  id: a,
                  isRGB: m,
                  title: je,
                  display: t.display,
                  color: t.borderColor,
                  transparency: t.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              r.createElement(oe.PropertyTable.GroupSeparator, null),
            )
          }
          return Fe.logError('Unknown plot type: ' + u), null
        }
        _getPlotSwitch(e, t, l) {
          return r.createElement(
            oe.PropertyTable.Row,
            null,
            r.createElement(
              oe.PropertyTable.Cell,
              { placement: 'first', colSpan: 2 },
              r.createElement(pe, { id: e, title: t, display: l }),
            ),
          )
        }
      }
      function Ze(e, t) {
        const l = (0, o.ensureDefined)(e.metaInfo().styles),
          { title: n } = (0, o.ensureDefined)(l[t])
        return (0, o.ensureDefined)(n)
      }
      var Ye = l(47510),
        qe = l(53598)
      const Ke = new s.TranslatedString(
        'change line style',
        i.t(null, void 0, l(28691)),
      )
      class $e extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onLineStyleChange = (e) => {
              const { setValue: t } = this.context,
                { lineStyle: l } = this.props
              t(l, e, Ke)
            })
        }
        render() {
          const { lineStyle: e, ...t } = this.props
          return r.createElement(qe.LineStyleSelect, {
            ...t,
            lineStyle: (0, R.getPropertyValue)(e),
            lineStyleChange: this._onLineStyleChange,
          })
        }
      }
      $e.contextType = L.StylePropertyContext
      const Xe = new s.TranslatedString(
        'change value',
        i.t(null, void 0, l(50463)),
      )
      class Je extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onValueChange = (e) => {
              const { setValue: t } = this.context,
                { value: l } = this.props.property
              t(l, e, Xe)
            })
        }
        render() {
          const {
            id: e,
            name: t,
            property: {
              color: l,
              linestyle: n,
              linewidth: o,
              transparency: i,
              value: s,
              visible: a,
            },
          } = this.props
          return r.createElement(
            B.InputRow,
            {
              labelAlign: 'adaptive',
              label: r.createElement(M, { id: e, title: t, visible: a }),
            },
            r.createElement(
              'div',
              { className: te.block },
              r.createElement(
                'div',
                { className: te.group },
                r.createElement(ee.ColorWithThicknessSelect, {
                  disabled: !a.value(),
                  color: l,
                  transparency: i,
                  thickness: o,
                }),
                r.createElement($e, {
                  id: (0, k.createDomId)(e, 'line-style-select'),
                  disabled: !a.value(),
                  className: te.smallStyleControl,
                  lineStyle: n,
                }),
              ),
              r.createElement(
                'div',
                {
                  className: Ce(
                    te.wrapGroup,
                    te.defaultSelect,
                    te.additionalSelect,
                  ),
                },
                r.createElement(Ye.FloatInputComponent, {
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
      Je.contextType = L.StylePropertyContext
      class et extends r.PureComponent {
        render() {
          const {
            orders: { visible: e, showLabels: t, showQty: n },
          } = this.props
          return r.createElement(
            r.Fragment,
            null,
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                r.createElement(M, {
                  id: 'chart-orders-switch',
                  title: i.t(null, void 0, l(77409)),
                  visible: e,
                }),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                r.createElement(M, {
                  id: 'chart-orders-labels-switch',
                  title: i.t(null, void 0, l(86520)),
                  visible: t,
                }),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                r.createElement(M, {
                  id: 'chart-orders-qty-switch',
                  title: i.t(null, void 0, l(66596)),
                  visible: n,
                }),
              ),
            ),
          )
        }
      }
      et.contextType = L.StylePropertyContext
      var tt = l(90164),
        lt = l(96438)
      const nt = new s.TranslatedString(
          'change percent width',
          i.t(null, void 0, l(51081)),
        ),
        rt = new s.TranslatedString(
          'change placement',
          i.t(null, void 0, l(47634)),
        ),
        ot = new s.TranslatedString(
          'change values visibility',
          i.t(null, void 0, l(12628)),
        ),
        it = [
          {
            value: tt.HHistDirection.LeftToRight,
            content: i.t(null, void 0, l(19286)),
          },
          {
            value: tt.HHistDirection.RightToLeft,
            content: i.t(null, void 0, l(21141)),
          },
        ],
        st = i.t(null, void 0, l(95247)),
        at = i.t(null, void 0, l(91502)),
        ct = i.t(null, void 0, l(91322)),
        pt = i.t(null, void 0, l(19221))
      class dt extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPercentWidthChange = (e) => {
              const { setValue: t } = this.context,
                { percentWidth: l } = this.props.property.childs()
              t(l, e, nt)
            }),
            (this._onPlacementChange = (e) => {
              const { setValue: t } = this.context,
                { direction: l } = this.props.property.childs()
              t(l, e, rt)
            }),
            (this._onShowValuesChange = (e) => {
              const { setValue: t } = this.context,
                { showValues: l } = this.props.property.childs()
              t(l, e, ot)
            })
        }
        render() {
          const { hHistInfo: e, property: t } = this.props,
            {
              percentWidth: l,
              direction: n,
              showValues: o,
              valuesColor: i,
              visible: s,
            } = t.childs(),
            { title: a } = e
          return r.createElement(
            r.Fragment,
            null,
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2, grouped: !0 },
                r.createElement(M, { id: a, title: a, visible: s }),
              ),
            ),
            r.createElement(
              B.InputRow,
              {
                label: r.createElement(
                  'div',
                  { className: te.childRowContainer },
                  st,
                ),
                grouped: !0,
              },
              r.createElement(lt.IntegerInputComponent, {
                input: { id: '', name: '', type: 'integer', defval: 0 },
                value: l.value(),
                disabled: !s.value(),
                onChange: this._onPercentWidthChange,
              }),
            ),
            r.createElement(
              B.InputRow,
              {
                label: r.createElement(
                  'div',
                  { className: te.childRowContainer },
                  at,
                ),
                grouped: !0,
              },
              r.createElement(Ee.Select, {
                id: 'hhist-graphic-placement-select',
                disabled: !s.value(),
                className: te.defaultSelect,
                menuItemClassName: te.defaultSelectItem,
                items: it,
                value: n.value(),
                onChange: this._onPlacementChange,
              }),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                {
                  className: te.childRowContainer,
                  placement: 'first',
                  colSpan: 2,
                  grouped: !0,
                },
                r.createElement(D.BoolInputComponent, {
                  label: ct,
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
            r.createElement(
              B.InputRow,
              {
                label: r.createElement(
                  'div',
                  { className: te.childRowContainer },
                  pt,
                ),
                grouped: !0,
              },
              r.createElement(ee.ColorWithThicknessSelect, {
                disabled: s && !s.value(),
                color: i,
              }),
            ),
            this._renderColors(),
            r.createElement(oe.PropertyTable.GroupSeparator, null),
          )
        }
        _renderColors() {
          const { property: e, hHistInfo: t } = this.props,
            { colors: l, transparencies: n, visible: o } = e.childs(),
            { titles: i } = t
          return l
            .childNames()
            .map((e) =>
              r.createElement(
                B.InputRow,
                {
                  key: e,
                  grouped: !0,
                  label: r.createElement(
                    'div',
                    { className: te.childRowContainer },
                    i[+e],
                  ),
                },
                r.createElement(ee.ColorWithThicknessSelect, {
                  disabled: !o.value(),
                  color: l[+e],
                  transparency: n[+e],
                }),
              ),
            )
        }
      }
      dt.contextType = L.StylePropertyContext
      class ut extends r.PureComponent {
        render() {
          const { title: e, property: t } = this.props,
            { color: l, width: n, style: o, visible: i } = t.childs()
          return r.createElement(
            B.InputRow,
            { label: r.createElement(M, { id: e, title: e, visible: i }) },
            r.createElement(ee.ColorWithThicknessSelect, {
              disabled: !i.value(),
              color: l,
              transparency: t.child('transparency'),
              thickness: n,
            }),
            r.createElement($e, {
              id: (0, k.createDomId)(e, 'line-style-select'),
              disabled: !i.value(),
              className: te.smallStyleControl,
              lineStyle: o,
            }),
          )
        }
      }
      var ht, mt
      ;(ut.contextType = L.StylePropertyContext),
        ((e) => {
          ;(e.Triangle = 'triangle'), (e.Rectangle = 'rectangle')
        })(ht || (ht = {})),
        ((e) => {
          ;(e.Verdana = 'Verdana'),
            (e.CourierNew = 'Courier New'),
            (e.TimesNewRoman = 'Times New Roman'),
            (e.Arial = 'Arial')
        })(mt || (mt = {}))
      class vt extends r.PureComponent {
        render() {
          const { graphicType: e, study: t } = this.props,
            l = t.metaInfo(),
            n = l.graphics,
            i = t.properties().graphics.childs(),
            s = (0, o.ensureDefined)(n[e])
          return Object.keys(s).map((t, n) => {
            var s, a, c, p
            const d = (0, o.ensureDefined)(
              null === (s = i[e]) || void 0 === s ? void 0 : s.childs()[t],
            )
            return 'horizlines' === e || 'vertlines' === e
              ? r.createElement(ut, {
                  key: t,
                  title: (0, o.ensureDefined)(
                    null === (a = l.graphics[e]) || void 0 === a
                      ? void 0
                      : a[t],
                  ).name,
                  property: d,
                })
              : 'lines' === e
                ? r.createElement(ut, {
                    key: t,
                    title: (0, o.ensureDefined)(
                      null === (c = l.graphics.lines) || void 0 === c
                        ? void 0
                        : c[t],
                    ).title,
                    property: d,
                  })
                : 'hhists' === e
                  ? r.createElement(dt, {
                      key: t,
                      hHistInfo: (0, o.ensureDefined)(
                        null === (p = l.graphics.hhists) || void 0 === p
                          ? void 0
                          : p[t],
                      ),
                      property: d,
                    })
                  : null
          })
        }
      }
      var yt = l(66045)
      const gt = new s.TranslatedString(
          'change font size',
          i.t(null, void 0, l(7378)),
        ),
        bt = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map((e) => ({
          value: e,
          title: e.toString(),
        }))
      class wt extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onFontSizeChange = (e) => {
              const { setValue: t } = this.context,
                { fontSize: l } = this.props
              t(l, e, gt)
            })
        }
        render() {
          const { fontSize: e, ...t } = this.props
          return r.createElement(yt.FontSizeSelect, {
            ...t,
            fontSizes: bt,
            fontSize: e.value(),
            fontSizeChange: this._onFontSizeChange,
          })
        }
      }
      wt.contextType = L.StylePropertyContext
      const ft = new s.TranslatedString(
          'change visibility',
          i.t(null, void 0, l(21511)),
        ),
        Ct = i.t(null, void 0, l(64606)),
        Pt = i.t(null, void 0, l(94420)),
        St = {
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
      class Et extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { levelsStyle: l } = this.props.property.childs(),
                { showLabels: n } = l.childs()
              t(n, e, ft)
            })
        }
        render() {
          const { fontsize: e, levelsStyle: t } = this.props.property.childs()
          return r.createElement(
            r.Fragment,
            null,
            r.createElement(
              B.InputRow,
              {
                labelAlign: 'adaptive',
                label: r.createElement('span', null, Ct),
              },
              r.createElement(
                'div',
                { className: te.block },
                r.createElement(
                  'div',
                  { className: Ce(te.wrapGroup, te.additionalSelect) },
                  r.createElement(wt, {
                    id: 'pivot-points-standard-font-size-select',
                    fontSize: e,
                  }),
                ),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                r.createElement(D.BoolInputComponent, {
                  label: Pt,
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
            { colors: l, widths: n, visibility: i } = e.childs(),
            { kind: s } = t.childs(),
            a = (0, o.ensureDefined)(St[s.value()])
          return l
            .childNames()
            .filter((e) => a.has(e))
            .map((e) =>
              r.createElement(ye, {
                key: e,
                id: e,
                title: e,
                color: l.childs()[e],
                visible: i.childs()[e],
                thickness: n.childs()[e],
              }),
            )
        }
      }
      Et.contextType = L.StylePropertyContext
      const Tt = i.t(null, void 0, l(91502)),
        _t = [
          {
            value: tt.HHistDirection.RightToLeft,
            content: i.t(null, void 0, l(21141)),
          },
          {
            value: tt.HHistDirection.LeftToRight,
            content: i.t(null, void 0, l(19286)),
          },
        ],
        kt = new s.TranslatedString(
          'change visibility',
          i.t(null, void 0, l(21511)),
        ),
        xt = i.t(null, void 0, l(14414)),
        It = i.t(null, void 0, l(91322)),
        Lt = i.t(null, void 0, l(95247)),
        Dt = i.t(null, void 0, l(31577)),
        Rt = i.t(null, { context: 'input' }, l(45811)),
        Vt = i.t(null, { context: 'input' }, l(41596))
      class Mt extends r.PureComponent {
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
          var e, t, n, s, a, c
          const { metaInfo: p } = this.props,
            {
              graphics: d,
              styles: u,
              showLabelsOnPriceScale: h,
              showLegendValues: m,
            } = this.props.property.childs(),
            { hhists: v, horizlines: y, polygons: g } = d.childs(),
            b = (0, o.ensureDefined)(p.graphics.hhists),
            w = Object.keys(b),
            f = v.childs()[w[0]],
            C = f.childs().visible,
            P = w.map((e) => v.childs()[e].childs().showValues),
            S = f.childs().percentWidth,
            E = f.childs().direction,
            T = w.map((e) => v.childs()[e].childs().valuesColor),
            _ = null === (e = y.childs()) || void 0 === e ? void 0 : e.vahLines,
            k =
              null === (t = p.graphics.horizlines) || void 0 === t
                ? void 0
                : t.vahLines,
            x = null === (n = y.childs()) || void 0 === n ? void 0 : n.valLines,
            I =
              null === (s = p.graphics.horizlines) || void 0 === s
                ? void 0
                : s.valLines,
            L = y.childs().pocLines,
            R = (0, o.ensureDefined)(
              null === (a = p.graphics.horizlines) || void 0 === a
                ? void 0
                : a.pocLines,
            ),
            V = u.childs().developingPoc,
            N = new ae.StudyPlotVisibleProperty(V.childs().display),
            W = (0, o.ensureDefined)(
              null === (c = p.styles) || void 0 === c
                ? void 0
                : c.developingPoc,
            ),
            A = u.childs().developingVAHigh,
            z = new ae.StudyPlotVisibleProperty(A.childs().display),
            F = u.childs().developingVALow,
            H = new ae.StudyPlotVisibleProperty(F.childs().display),
            G = p.graphics.polygons && p.graphics.polygons.histBoxBg
          return r.createElement(
            r.Fragment,
            null,
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                r.createElement(D.BoolInputComponent, {
                  label: xt,
                  input: {
                    id: 'VolumeProfile',
                    type: 'bool',
                    defval: !0,
                    name: 'visible',
                  },
                  value: C.value(),
                  onChange: this._onChange,
                }),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                r.createElement(
                  'div',
                  { className: te.childRowContainer },
                  r.createElement(D.BoolInputComponent, {
                    disabled: !C.value(),
                    label: It,
                    input: {
                      id: 'ShowValues',
                      type: 'bool',
                      defval: !0,
                      name: 'visible',
                    },
                    value: P[0].value(),
                    onChange: this._onShowValuesChange,
                  }),
                ),
              ),
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                r.createElement(ee.ColorWithThicknessSelect, {
                  disabled: !C.value() || !P[0].value(),
                  color: T,
                }),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                r.createElement('div', { className: te.childRowContainer }, Lt),
              ),
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                r.createElement(lt.IntegerInputComponent, {
                  disabled: !C.value(),
                  input: { id: '', name: '', type: 'integer', defval: 0 },
                  value: S.value(),
                  onChange: this._onValueChange,
                }),
              ),
            ),
            r.createElement(
              oe.PropertyTable.Row,
              null,
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'first' },
                r.createElement('div', { className: te.childRowContainer }, Tt),
              ),
              r.createElement(
                oe.PropertyTable.Cell,
                { placement: 'last' },
                r.createElement(Ee.Select, {
                  id: 'hhist-direction-select',
                  disabled: !C.value(),
                  className: te.defaultSelect,
                  menuItemClassName: te.defaultSelectItem,
                  items: _t,
                  value: E.value(),
                  onChange: this._onDirectionChange,
                }),
              ),
            ),
            w.map((e) =>
              r.createElement(
                r.Fragment,
                { key: e },
                v
                  .childs()
                  [e].childs()
                  .colors.childNames()
                  .map((t, n) => {
                    const o = b[e]
                    return r.createElement(
                      B.InputRow,
                      {
                        key: n,
                        label: r.createElement(
                          'div',
                          { className: te.childRowContainer },
                          (o &&
                            i.t(o.titles[n], { context: 'input' }, l(88601))) ||
                            '',
                        ),
                      },
                      r.createElement(ee.ColorWithThicknessSelect, {
                        disabled: !C.value(),
                        color: v.childs()[e].childs().colors.childs()[n],
                        transparency: v
                          .childs()
                          [e].childs()
                          .transparencies.childs()[n],
                      }),
                    )
                  }),
              ),
            ),
            k &&
              _ &&
              r.createElement(
                ye,
                {
                  id: 'vahLines',
                  title: k.name,
                  color: _.childs().color,
                  visible: _.childs().visible,
                  thickness: _.childs().width,
                },
                r.createElement($e, {
                  id: 'vah-lines-line-style-select',
                  disabled: !_.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: _.childs().style,
                }),
              ),
            I &&
              x &&
              r.createElement(
                ye,
                {
                  id: 'valLines',
                  title: I.name,
                  color: x.childs().color,
                  visible: x.childs().visible,
                  thickness: x.childs().width,
                },
                r.createElement($e, {
                  id: 'val-lines-line-style-select',
                  disabled: !x.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: x.childs().style,
                }),
              ),
            r.createElement(
              ye,
              {
                id: 'pocLines',
                title: R.name,
                color: L.childs().color,
                visible: L.childs().visible,
                thickness: L.childs().width,
              },
              r.createElement($e, {
                id: 'poc-lines-line-style-select',
                disabled: !L.childs().visible.value(),
                className: te.smallStyleControl,
                lineStyle: L.childs().style,
              }),
            ),
            V &&
              r.createElement(
                ye,
                {
                  id: 'developingPoc',
                  title:
                    (W.title && i.t(W.title, { context: 'input' }, l(88601))) ||
                    '',
                  color: V.childs().color,
                  visible: N,
                  thickness: V.childs().linewidth,
                },
                r.createElement($e, {
                  id: 'developing-poc-line-style-select',
                  disabled: !N.value(),
                  className: te.smallStyleControl,
                  lineStyle: V.childs().linestyle,
                }),
              ),
            A &&
              F &&
              r.createElement(
                ye,
                {
                  id: 'developingPoc',
                  title: Dt,
                  color: [A.childs().color, F.childs().color],
                  visible: [z, H],
                  thickness: [A.childs().linewidth, F.childs().linewidth],
                },
                r.createElement($e, {
                  id: 'developing-VA-line-style-select',
                  disabled: !z.value() && !H.value(),
                  className: te.smallStyleControl,
                  lineStyle: [A.childs().linestyle, F.childs().linestyle],
                }),
              ),
            g &&
              r.createElement(
                B.InputRow,
                {
                  label: r.createElement(
                    'div',
                    null,
                    (G && i.t(G.name, { context: 'input' }, l(88601))) || '',
                  ),
                },
                r.createElement(ee.ColorWithThicknessSelect, {
                  color: g.childs().histBoxBg.childs().color,
                  transparency: g.childs().histBoxBg.childs().transparency,
                }),
              ),
            (h || m) &&
              'VbPFixed' !== p.shortId &&
              r.createElement(
                r.Fragment,
                null,
                h &&
                  r.createElement(
                    oe.PropertyTable.Cell,
                    { placement: 'first', colSpan: 2 },
                    r.createElement(M, {
                      id: 'showLabelsOnPriceScale',
                      title: Vt,
                      visible: h,
                    }),
                  ),
                m &&
                  r.createElement(
                    oe.PropertyTable.Cell,
                    { placement: 'first', colSpan: 2 },
                    r.createElement(M, {
                      id: 'showLegendValues',
                      title: Rt,
                      visible: m,
                    }),
                  ),
              ),
          )
        }
        _setHhistsProperty(e, t) {
          const { setValue: l } = this.context,
            { metaInfo: n, property: r } = this.props,
            i = r.childs().graphics.childs().hhists,
            s = Object.keys((0, o.ensureDefined)(n.graphics.hhists)),
            a = i.childs()
          l(
            s.map((t) => (0, o.ensureDefined)(a[t].child(e))),
            t,
            kt,
          )
        }
      }
      function Bt() {
        const e = (0, o.ensureNotNull)((0, r.useContext)(ve)),
          t = e.metaInfo(),
          l = e.properties()
        return r.createElement(Mt, { metaInfo: t, property: l })
      }
      Mt.contextType = L.StylePropertyContext
      var Nt = l(51717)
      const Wt = {
        VbPFixed: Bt,
        PivotPointsStandard: () => {
          const e = (0, o.ensureNotNull)((0, r.useContext)(ve)).properties()
          return r.createElement(Et, { property: e })
        },
        VbPVisible: Bt,
        VbPAnchored: Bt,
      }
      class At extends r.PureComponent {
        render() {
          const e = (0, o.ensureNotNull)(this.context)
          return r.createElement(ve.Consumer, null, (t) =>
            r.createElement(
              L.StylePropertyContainer,
              { property: (0, o.ensureNotNull)(t).properties(), model: e },
              r.createElement(
                oe.PropertyTable,
                null,
                this._renderCustomContent(
                  (0, o.ensureNotNull)(t).metaInfo().shortId,
                ),
              ),
            ),
          )
        }
        _renderCustomContent(e) {
          if (e in Wt) {
            const t = Wt[e]
            return r.createElement(t, null)
          }
          return null
        }
      }
      At.contextType = Nt.ModelContext
      var zt = l(43886)
      const Ft = new s.TranslatedString(
          'change precision',
          i.t(null, void 0, l(164)),
        ),
        Ht = i.t(null, void 0, l(4329)),
        Gt = i.t(null, void 0, l(73947)),
        Ut = [{ value: 'default', content: Ht }]
      for (let e = 0; e <= 8; e++) Ut.push({ value: e, content: e.toString() })
      class Ot extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { precision: l } = this.props
              t(l, e, Ft)
            })
        }
        render() {
          const { id: e, precision: t } = this.props
          return r.createElement(
            B.InputRow,
            { label: Gt },
            r.createElement(Ee.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: Ut,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      Ot.contextType = L.StylePropertyContext
      const jt = new s.TranslatedString(
          'change min tick',
          i.t(null, void 0, l(20834)),
        ),
        Qt = i.t(null, void 0, l(4329)),
        Zt = i.t(null, void 0, l(36993)),
        Yt = [
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
        qt = [{ id: 'tick-default', value: 'default', content: Qt }]
      for (let e = 0; e < Yt.length; e++) {
        const t = Yt[e]
        qt.push({
          value: t.priceScale + ',' + t.minMove + ',' + t.frac,
          content: t.minMove + '/' + t.priceScale,
        })
      }
      class Kt extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { minTick: l } = this.props
              t(l, e, jt)
            })
        }
        render() {
          const { id: e, minTick: t } = this.props
          return r.createElement(
            B.InputRow,
            { label: Zt },
            r.createElement(Ee.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: qt,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      Kt.contextType = L.StylePropertyContext
      var $t = l(73146),
        Xt = l(86067)
      class Jt extends r.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            title: l,
            visible: n,
            bottomColor: o,
            topColor: i,
            transparency: s,
            children: a,
            switchable: c = !0,
            offset: p,
            grouped: d,
          } = this.props
          return r.createElement(
            B.InputRow,
            {
              label: c
                ? r.createElement(M, { id: e, title: l, visible: n })
                : l,
              offset: p,
              grouped: d,
            },
            t
              ? null
              : r.createElement(
                  r.Fragment,
                  null,
                  i &&
                    r.createElement(ee.ColorWithThicknessSelect, {
                      disabled:
                        n && !(Array.isArray(n) ? n[0].value() : n.value()),
                      color: i,
                      transparency: s,
                    }),
                  o &&
                    r.createElement(
                      'div',
                      { className: Pe()(o && i && te.additionalSelect) },
                      r.createElement(ee.ColorWithThicknessSelect, {
                        disabled:
                          n && !(Array.isArray(n) ? n[0].value() : n.value()),
                        color: o,
                        transparency: s,
                      }),
                    ),
                ),
            a,
          )
        }
      }
      Jt.contextType = L.StylePropertyContext
      const el = i.t(null, void 0, l(27331)),
        tl = i.t(null, { context: 'input' }, l(45811)),
        ll = i.t(null, { context: 'input' }, l(41596)),
        nl = i.t(null, void 0, l(40297))
      class rl extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._findPlotPalettes = (e) => {
              const { study: t } = this.props,
                l = t.metaInfo(),
                n = (0, o.ensureDefined)(l.palettes)
              return (0, x.isBarColorerPlot)(e) || (0, x.isBgColorerPlot)(e)
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
          if ((0, zt.isCustomStudy)(t.shortId)) return r.createElement(At, null)
          const l = e.properties(),
            {
              precision: n,
              strategy: o,
              minTick: i,
              showLabelsOnPriceScale: s,
              showLegendValues: a,
            } = l,
            c = t.plots.length > 0,
            p = t.plots.some((e) => !(0, x.isPlotWithTechnicalValues)(e)),
            d = c || t.inputs.some((e) => 'price' === e.type),
            u = (0, $t.createAdapter)(e).canOverrideMinTick()
          return r.createElement(
            oe.PropertyTable,
            null,
            this._plotsElement(),
            this._bandsElement(),
            this._bandsBackgroundsElement(),
            this._areasBackgroundsElement(),
            this._filledAreasElement(),
            this._graphicsElement(),
            u &&
              r.createElement(Kt, {
                id: (0, k.createDomId)(t.id, 'min-tick-select'),
                minTick: i,
              }),
            I.StudyMetaInfo.isScriptStrategy(t) &&
              r.createElement(et, { orders: o.orders }),
            (d || p) &&
              r.createElement(
                oe.PropertyTable.Row,
                null,
                r.createElement(oe.PropertyTable.GroupSeparator, { size: 1 }),
                r.createElement(Xt.GroupTitleSection, { title: nl, name: nl }),
                d &&
                  r.createElement(Ot, {
                    id: (0, k.createDomId)(t.id, 'precision-select'),
                    precision: n,
                  }),
                p &&
                  r.createElement(
                    r.Fragment,
                    null,
                    r.createElement(
                      oe.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      r.createElement(M, {
                        id: 'showLabelsOnPriceScale',
                        title: ll,
                        visible: s,
                      }),
                    ),
                    r.createElement(
                      oe.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      r.createElement(M, {
                        id: 'showLegendValues',
                        title: tl,
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
          return new T.MetaInfoHelper(t)
            .getUserEditablePlots()
            .filter(
              (e) =>
                !(
                  (0, x.isUpColorerPlot)(e) ||
                  (0, x.isDownColorerPlot)(e) ||
                  (0, x.isCandleBorderColorerPlot)(e) ||
                  (0, x.isCandleWickColorerPlot)(e)
                ),
            )
            .map((t) => {
              const l = (0, x.isOhlcPlot)(t) ? { ...t, id: t.target } : t,
                n = this._findPlotPalettes(l)
              return r.createElement(Qe, {
                key: t.id,
                plot: t,
                palettes: n,
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
                return r.createElement(Je, {
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
            r.createElement(ye, {
              id: 'bandsBackground',
              title: el,
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
            { areaBackground: n } = l
          return t.isRGB
            ? null
            : n &&
                r.createElement(ye, {
                  id: 'areaBackground',
                  title: el,
                  visible: n.fillBackground,
                  color: n.backgroundColor,
                  transparency: n.transparency,
                })
        }
        _filledAreasElement() {
          const { study: e } = this.props,
            t = e.metaInfo(),
            l = t.filledAreas
          return !l || t.isRGB
            ? []
            : l.map((t) => {
                if (t.isHidden) return null
                const l = e.properties().filledAreasStyle[t.id],
                  n = t.title || el
                if (
                  l.hasChild('fillType') &&
                  'gradient' === l.childs().fillType.value()
                ) {
                  if (l.topColor || l.bottomColor)
                    return r.createElement(Jt, {
                      key: t.id,
                      id: t.id,
                      title: n,
                      bottomColor: l.bottomColor,
                      topColor: l.topColor,
                      visible: l.visible,
                      transparency: l.transparency,
                    })
                  if (t.palette) {
                    const e = this._findPalettesByTargetId(t.id),
                      n = (0, o.ensureDefined)(e.main),
                      i = e.secondary
                    return r.createElement(se, {
                      key: t.id,
                      title: t.title,
                      area: t,
                      palette: (0, o.ensureDefined)(n.palette),
                      paletteProps: (0, o.ensureDefined)(n.paletteProps),
                      secondaryPalette: null == i ? void 0 : i.palette,
                      secondaryPaletteProps:
                        null == i ? void 0 : i.paletteProps,
                      styleProp: l,
                    })
                  }
                  return null
                }
                if (t.palette) {
                  const e = this._findPalettesByTargetId(t.id),
                    n = (0, o.ensureDefined)(e.main)
                  return r.createElement(se, {
                    key: t.id,
                    title: t.title,
                    area: t,
                    palette: (0, o.ensureDefined)(n.palette),
                    paletteProps: (0, o.ensureDefined)(n.paletteProps),
                    styleProp: l,
                  })
                }
                return r.createElement(ye, {
                  key: t.id,
                  id: t.id,
                  title: n,
                  color: l.color,
                  visible: l.visible,
                  transparency: l.transparency,
                })
              })
        }
        _graphicsElement() {
          const { study: e } = this.props,
            t = e.metaInfo().graphics
          return (
            t &&
            Object.keys(t).map((t, l) =>
              r.createElement(vt, { key: t, graphicType: t, study: e }),
            )
          )
        }
        _findPalettesByTargetId(e) {
          const { study: t } = this.props,
            l = t.metaInfo(),
            n = l.plots,
            r = (0, o.ensureDefined)(l.palettes),
            i = {}
          for (const l of n) {
            if (
              ((0, x.isPaletteColorerPlot)(l) || (0, x.isOhlcColorerPlot)(l)) &&
              l.target === e
            ) {
              if (i.main) {
                i.secondary = {
                  palette: r[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }
                continue
              }
              i.main = {
                palette: r[l.palette],
                paletteProps: t.properties().palettes[l.palette],
              }
            }
            ;(0, x.isUpColorerPlot)(l) &&
              l.target === e &&
              (i.up = {
                palette: r[l.palette],
                paletteProps: t.properties().palettes[l.palette],
              }),
              (0, x.isDownColorerPlot)(l) &&
                l.target === e &&
                (i.down = {
                  palette: r[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }),
              (0, x.isCandleWickColorerPlot)(l) &&
                l.target === e &&
                (i.wick = {
                  palette: r[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                }),
              (0, x.isCandleBorderColorerPlot)(l) &&
                l.target === e &&
                (i.border = {
                  palette: r[l.palette],
                  paletteProps: t.properties().palettes[l.palette],
                })
          }
          return i
        }
      }
      function ol(e) {
        return (0, L.bindPropertyContext)(rl, {
          ...e,
          property: e.study.properties(),
        })
      }
      class il extends r.PureComponent {
        render() {
          return r.createElement(
            Nt.ModelContext.Provider,
            { value: this.props.model },
            r.createElement(
              ve.Provider,
              { value: this.props.source },
              r.createElement(ol, { study: this.props.source }),
            ),
          )
        }
      }
      var sl = l(73955),
        al = l(85067),
        cl = l(97456),
        pl = l(37591)
      class dl extends al.DialogRenderer {
        constructor(e, t, l, r) {
          super(),
            (this._timeout = null),
            (this._handleClose = () => {
              n.unmountComponentAtNode(this._container),
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
              c.setValue(this._activeTabSettingsName(), e)
            }),
            (this._source = e),
            (this._model = t),
            (this._propertyPages = r),
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
          var t
          if (!p.enabled('property_pages')) return
          const o = this._source.metaInfo()
          if (
            ((0, w.isLineTool)(this._source) &&
              (0, u.trackEvent)(
                'GUI',
                'Drawing Properties',
                this._source.name(),
              ),
            (0, g.isStudy)(this._source))
          ) {
            const e =
              !this._source.isPine() || this._source.isStandardPine()
                ? o.description
                : 'Custom Pine'
            ;(0, u.trackEvent)('GUI', 'Study Properties', e)
          }
          let s = []
          const h = new T.MetaInfoHelper(o)
          h.hasUserEditableInputs() &&
            s.push({
              id: 'inputs',
              label: i.t(null, void 0, l(66304)),
              Component: _,
            }),
            h.hasUserEditableProperties(),
            h.hasUserEditableStyles() &&
              s.push({
                id: 'style',
                label: i.t(null, void 0, l(32733)),
                Component: il,
              }),
            this._propertyPages ||
              s.push({
                id: 'visibilities',
                label: i.t(null, void 0, l(21852)),
                page: this._createVisibilitiesPropertyPage(),
              }),
            (s = this._getPagesForStudyLineTool(s))
          const m =
            e.initialTab ||
            c.getValue(this._activeTabSettingsName()) ||
            'inputs'
          const v = (0, a.clean)(o.shortDescription, !0)
          const y =
            null !== (t = s.find((e) => e.id === m)) && void 0 !== t ? t : s[0]
          n.render(
            r.createElement(S, {
              title: v,
              model: this._model,
              source: this._source,
              initialActiveTab: y.id,
              pages: s,
              shouldReturnFocus: e.shouldReturnFocus,
              onSubmit: this._handleSubmit,
              onCancel: this._handleCancel,
              onClose: this._handleClose,
              onActiveTabChanged: this._handleActiveTabChanged,
            }),
            this._container,
          ),
            this._setVisibility(!0),
            d.emit('edit_object_dialog', {
              objectType: 'study',
              scriptTitle: this._source.title(pl.TitleDisplayTarget.StatusLine),
            })
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs()
          return (0, sl.createPropertyPage)(
            (0, cl.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._model,
              e,
              new s.TranslatedString(
                this._source.name(!0),
                this._source.title(pl.TitleDisplayTarget.StatusLine, !0),
              ),
            ),
            'visibility',
            i.t(null, void 0, l(21852)),
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
    50945: (e, t, l) => {
      l.d(t, { StudyDefaultsManager: () => h })
      var n = l(50959),
        r = l(97754),
        o = l.n(r),
        i = l(9745),
        s = l(11542),
        a = l(95276),
        c = l(16396),
        p = l(44996),
        d = l(92229)
      const u = {
        reset: s.t(null, void 0, l(79782)),
        saveAsDefault: s.t(null, void 0, l(18229)),
        defaults: s.t(null, void 0, l(98938)),
      }
      class h extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleResetToDefaults = () => {
              this.props.model.restorePropertiesForSource(this.props.source)
            }),
            (this._handleSaveAsDefaults = () => {
              this.props.source.properties().saveDefaults()
            })
        }
        render() {
          const { mode: e } = this.props
          return n.createElement(
            a.ControlDisclosure,
            {
              id: 'study-defaults-manager',
              className: o()('normal' === e && d.defaultsButtonText),
              hideArrowButton: 'compact' === e,
              buttonChildren: this._getPlaceHolderItem('compact' === e),
            },
            n.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: u.reset,
              onClick: this._handleResetToDefaults,
            }),
            n.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: u.saveAsDefault,
              onClick: this._handleSaveAsDefaults,
            }),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? n.createElement(i.Icon, {
                className: d.defaultsButtonIcon,
                icon: p,
              })
            : u.defaults
        }
      }
    },
    48531: (e, t, l) => {
      l.d(t, { FooterMenu: () => b })
      var n = l(50959),
        r = l(11542),
        o = l(9745),
        i = l(95276),
        s = l(90692),
        a = l(47334),
        c = l(44996)
      function p(e) {
        return e.isTabletWidth
          ? n.createElement(o.Icon, { className: a.themesButtonIcon, icon: c })
          : n.createElement(n.Fragment, null, r.t(null, void 0, l(19611)))
      }
      function d(e) {
        return n.createElement(
          s.MatchMedia,
          { rule: 'screen and (max-width: 768px)' },
          (t) =>
            n.createElement(
              i.ControlDisclosure,
              {
                className: !t && a.themesButtonText,
                hideArrowButton: t,
                buttonChildren: n.createElement(p, { isTabletWidth: t }),
              },
              e.children,
            ),
        )
      }
      var u = l(16396),
        h = l(96040),
        m = l(70412),
        v = l(32563)
      function y(e) {
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
              }),
          }),
        )
      }
      function g(e) {
        return n.createElement(
          d,
          null,
          n.createElement(y, {
            onClick: () => {
              const { sources: t, chartUndoModel: l } = e
              l.restoreLineToolsFactoryDefaults(t)
            },
            name: r.t(null, void 0, l(67049)),
          }),
        )
      }
      function b(e) {
        return n.createElement(g, { ...e })
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
      var s = l(11062),
        a = l(82064)
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
    51613: (e, t, l) => {
      l.d(t, { PopupMenuSeparator: () => s })
      var n = l(50959),
        r = l(97754),
        o = l.n(r),
        i = l(92910)
      function s(e) {
        const { size: t = 'normal', className: l, ariaHidden: r = !1 } = e
        return n.createElement('div', {
          className: o()(
            i.separator,
            'small' === t && i.small,
            'normal' === t && i.normal,
            'large' === t && i.large,
            l,
          ),
          role: 'separator',
          'aria-hidden': r,
        })
      }
    },
    40670: (e) => {
      e.exports = {
        wrapper: 'wrapper-bl9AR3Gv',
        hovered: 'hovered-bl9AR3Gv',
        withIcon: 'withIcon-bl9AR3Gv',
        labelRow: 'labelRow-bl9AR3Gv',
        label: 'label-bl9AR3Gv',
        switchWrap: 'switchWrap-bl9AR3Gv',
        icon: 'icon-bl9AR3Gv',
        labelHint: 'labelHint-bl9AR3Gv',
        labelOn: 'labelOn-bl9AR3Gv',
        accessible: 'accessible-bl9AR3Gv',
      }
    },
    62433: (e) => {
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
    69297: (e, t, l) => {
      l.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => g,
        MenuItemSwitcher: () => b,
      })
      var n = l(50959),
        r = l(97754),
        o = l.n(r),
        i = l(17946),
        s = l(26574),
        a = l.n(s)
      function c(e) {
        const t = (0, n.useContext)(i.CustomBehaviourContext),
          {
            className: l,
            intent: o = 'default',
            size: s = 'small',
            enableActiveStateStyles: c = t.enableActiveStateStyles,
          } = e
        return r(
          l,
          a().switcher,
          a()[`size-${s}`],
          a()[`intent-${o}`],
          !c && a()['disable-active-state-styles'],
        )
      }
      function p(e) {
        var t
        const {
            reference: l,
            size: r,
            intent: o,
            role: i,
            'aria-checked': s,
            checked: p,
            defaultChecked: d,
            onKeyDown: u,
            ...h
          } = e,
          m = (0, n.useCallback)(
            (e) => {
              13 === e.keyCode && e.target.click(), u && u(e)
            },
            [u],
          )
        return n.createElement(
          'span',
          { className: c(e) },
          n.createElement('input', {
            ...h,
            type: 'checkbox',
            className: a().input,
            ref: l,
            role: null != i ? i : 'switch',
            'aria-checked':
              null !== (t = null != s ? s : p) && void 0 !== t ? t : d,
            checked: p,
            defaultChecked: d,
            onKeyDown: m,
          }),
          n.createElement(
            'span',
            { className: a()['thumb-wrapper'] },
            n.createElement('span', { className: a().track }),
            n.createElement('span', { className: a().thumb }),
          ),
        )
      }
      var d = l(9745),
        u = l(16838),
        h = l(3343),
        m = l(50238),
        v = l(90186),
        y = l(40670)
      const g = y
      function b(e) {
        const {
            className: t,
            checked: l,
            id: r,
            label: i,
            labelDescription: s,
            value: a,
            preventLabelHighlight: c,
            reference: g,
            switchReference: b,
            theme: w = y,
            disabled: f,
            icon: C,
          } = e,
          [P, S] = (0, m.useRovingTabindexElement)(null),
          E = o()(w.label, l && !c && w.labelOn),
          T = o()(
            t,
            w.wrapper,
            l && w.wrapperWithOnLabel,
            s && w.wrapperWithDescription,
          )
        return n.createElement(
          'label',
          {
            className: o()(
              T,
              C && w.withIcon,
              u.PLATFORM_ACCESSIBILITY_ENABLED && y.accessible,
            ),
            htmlFor: r,
            ref: g,
            onKeyDown: (e) => {
              if (
                !u.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, h.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                P.current instanceof HTMLElement && P.current.click())
            },
            tabIndex: S,
            'data-role': u.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
            'aria-disabled':
              (u.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
          },
          void 0 !== C &&
            n.createElement(d.Icon, { className: w.icon, icon: C }),
          n.createElement(
            'div',
            { className: w.labelRow },
            n.createElement('div', { className: E }, i),
            s && n.createElement('div', { className: w.labelHint }, s),
          ),
          n.createElement(
            'div',
            { className: y.switchWrap },
            n.createElement(p, {
              disabled: f,
              className: w.switch,
              reference: (e) => {
                P(e), null == b || b(e)
              },
              checked: l,
              onChange: (t) => {
                const l = t.target.checked
                void 0 !== e.onChange && e.onChange(l)
              },
              value: a,
              tabIndex: -1,
              id: r,
              role: e.switchRole,
              'aria-disabled': u.PLATFORM_ACCESSIBILITY_ENABLED,
              ...(0, v.filterDataProps)(e),
            }),
          ),
        )
      }
    },
    73955: (e, t, l) => {
      l.r(t), l.d(t, { createPropertyPage: () => r })
      var n = l(97145)
      function r(e, t, l, r = null) {
        var o
        const i = {
          id: t,
          title: l,
          definitions: new n.WatchedValue(e.definitions),
          visible:
            null !== (o = e.visible) && void 0 !== o
              ? o
              : new n.WatchedValue(!0).readonly(),
        }
        return null !== r && (i.icon = r), i
      }
    },
    97456: (e, t, l) => {
      l.r(t),
        l.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ae,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => ce,
        })
      var n = l(11542),
        r = l(36298),
        o = l(14483),
        i = l(295),
        s = l(97145),
        a = l(94025),
        c = l(68806),
        p = l(62513)
      const d = new r.TranslatedString(
          'change {title} visibility on ticks',
          n.t(null, void 0, l(30810)),
        ),
        u = new r.TranslatedString(
          'change {title} visibility on seconds',
          n.t(null, void 0, l(46948)),
        ),
        h = new r.TranslatedString(
          'change {title} seconds from',
          n.t(null, void 0, l(2822)),
        ),
        m = new r.TranslatedString(
          'change {title} seconds to',
          n.t(null, void 0, l(66161)),
        ),
        v = new r.TranslatedString(
          'change {title} visibility on minutes',
          n.t(null, void 0, l(64370)),
        ),
        y = new r.TranslatedString(
          'change {title} minutes from',
          n.t(null, void 0, l(15106)),
        ),
        g = new r.TranslatedString(
          'change {title} minutes to',
          n.t(null, void 0, l(91633)),
        ),
        b = new r.TranslatedString(
          'change {title} visibility on hours',
          n.t(null, void 0, l(68971)),
        ),
        w = new r.TranslatedString(
          'change {title} hours from',
          n.t(null, void 0, l(35388)),
        ),
        f = new r.TranslatedString(
          'change {title} hours to',
          n.t(null, void 0, l(78586)),
        ),
        C = new r.TranslatedString(
          'change {title} visibility on days',
          n.t(null, void 0, l(29088)),
        ),
        P = new r.TranslatedString(
          'change {title} days from',
          n.t(null, void 0, l(41377)),
        ),
        S = new r.TranslatedString(
          'change {title} days to',
          n.t(null, void 0, l(13355)),
        ),
        E = new r.TranslatedString(
          'change {title} visibility on weeks',
          n.t(null, void 0, l(24941)),
        ),
        T = new r.TranslatedString(
          'change {title} weeks from',
          n.t(null, void 0, l(21339)),
        ),
        _ = new r.TranslatedString(
          'change {title} weeks to',
          n.t(null, void 0, l(68643)),
        ),
        k = new r.TranslatedString(
          'change {title} visibility on months',
          n.t(null, void 0, l(6659)),
        ),
        x = new r.TranslatedString(
          'change {title} months from',
          n.t(null, void 0, l(59635)),
        ),
        I = new r.TranslatedString(
          'change {title} months to',
          n.t(null, void 0, l(74266)),
        ),
        L =
          (new r.TranslatedString(
            'change {title} visibility on ranges',
            n.t(null, { replace: { ranges: 'ranges' } }, l(8917)),
          ),
          n.t(null, void 0, l(30973))),
        D = n.t(null, void 0, l(71129)),
        R = n.t(null, void 0, l(28134)),
        V = n.t(null, void 0, l(63099)),
        M = n.t(null, void 0, l(22192)),
        B = n.t(null, void 0, l(21594)),
        N = n.t(null, void 0, l(95543)),
        W = new r.TranslatedString('ticks', n.t(null, void 0, l(59523))),
        A = new r.TranslatedString('seconds', n.t(null, void 0, l(32925))),
        z = new r.TranslatedString('seconds from', n.t(null, void 0, l(6049))),
        F = new r.TranslatedString('seconds to', n.t(null, void 0, l(39017))),
        H = new r.TranslatedString('minutes', n.t(null, void 0, l(16465))),
        G = new r.TranslatedString('minutes from', n.t(null, void 0, l(25586))),
        U = new r.TranslatedString('minutes to', n.t(null, void 0, l(72317))),
        O = new r.TranslatedString('hours', n.t(null, void 0, l(3143))),
        j = new r.TranslatedString('hours from', n.t(null, void 0, l(84775))),
        Q = new r.TranslatedString('hours to', n.t(null, void 0, l(11255))),
        Z = new r.TranslatedString('days', n.t(null, void 0, l(82211))),
        Y = new r.TranslatedString('days from', n.t(null, void 0, l(14077))),
        q = new r.TranslatedString('days to', n.t(null, void 0, l(33486))),
        K = new r.TranslatedString('weeks', n.t(null, void 0, l(93016))),
        $ = new r.TranslatedString('weeks from', n.t(null, void 0, l(32002))),
        X = new r.TranslatedString('weeks to', n.t(null, void 0, l(28091))),
        J = new r.TranslatedString('months', n.t(null, void 0, l(58964))),
        ee = new r.TranslatedString('months from', n.t(null, void 0, l(71770))),
        te = new r.TranslatedString('months to', n.t(null, void 0, l(37179))),
        le = (new r.TranslatedString('ranges', 'ranges'), [1, 59]),
        ne = [1, 59],
        re = [1, 24],
        oe = [1, 366],
        ie = [1, 52],
        se = [1, 12]
      function ae(e, t, l) {
        const n = []
        if (o.enabled('tick_resolution')) {
          const r = (0, i.createCheckablePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.ticks,
                d.format({ title: l }),
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: L },
          )
          n.push(r)
        }
        if ((0, a.isSecondsEnabled)()) {
          const r = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.seconds,
                u.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                h.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                m.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: D,
              min: new s.WatchedValue(le[0]),
              max: new s.WatchedValue(le[1]),
            },
          )
          n.push(r)
        }
        const r = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.minutes,
                v.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                y.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.minutesTo,
                g.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: R,
              min: new s.WatchedValue(ne[0]),
              max: new s.WatchedValue(ne[1]),
            },
          ),
          c = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.hours,
                b.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.hoursFrom,
                w.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.hoursTo,
                f.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: V,
              min: new s.WatchedValue(re[0]),
              max: new s.WatchedValue(re[1]),
            },
          ),
          p = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.days,
                C.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.daysFrom,
                P.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.daysTo,
                S.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: M,
              min: new s.WatchedValue(oe[0]),
              max: new s.WatchedValue(oe[1]),
            },
          )
        n.push(r, c, p)
        const W = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.weeks,
                E.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.weeksFrom,
                T.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.weeksTo,
                _.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: B,
              min: new s.WatchedValue(ie[0]),
              max: new s.WatchedValue(ie[1]),
            },
          ),
          A = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(
                e,
                t.months,
                k.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.monthsFrom,
                x.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.monthsTo,
                I.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: N,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          )
        return n.push(W, A), { definitions: n }
      }
      function ce(e, t) {
        const l = []
        if (o.enabled('tick_resolution')) {
          const n = (0, i.createCheckablePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.ticks),
                W,
                t,
              ),
            },
            { id: 'IntervalsVisibilitiesTicks', title: L },
          )
          l.push(n)
        }
        if ((0, a.isSecondsEnabled)()) {
          const n = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.seconds),
                A,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsFrom),
                z,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsTo),
                F,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: D,
              min: new s.WatchedValue(le[0]),
              max: new s.WatchedValue(le[1]),
            },
          )
          l.push(n)
        }
        const n = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutes),
                H,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesFrom),
                G,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesTo),
                U,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMinutes',
              title: R,
              min: new s.WatchedValue(ne[0]),
              max: new s.WatchedValue(ne[1]),
            },
          ),
          r = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hours),
                O,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursFrom),
                j,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursTo),
                Q,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesHours',
              title: V,
              min: new s.WatchedValue(re[0]),
              max: new s.WatchedValue(re[1]),
            },
          ),
          d = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.days),
                Z,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysFrom),
                Y,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysTo),
                q,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesDays',
              title: M,
              min: new s.WatchedValue(oe[0]),
              max: new s.WatchedValue(oe[1]),
            },
          )
        l.push(n, r, d)
        const u = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeks),
                K,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksFrom),
                $,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksTo),
                X,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: B,
              min: new s.WatchedValue(ie[0]),
              max: new s.WatchedValue(ie[1]),
            },
          ),
          h = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.months),
                J,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsFrom),
                ee,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsTo),
                te,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesMonths',
              title: N,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          )
        return l.push(u, h), { definitions: l }
      }
    },
    62513: (e, t, l) => {
      l.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var n = l(50151),
        r = l(11542),
        o = l(36298),
        i = l(88640)
      const s = new o.TranslatedString(
        'change {propertyName} property',
        r.t(null, void 0, l(18567)),
      )
      class a extends i.default {
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
          var l
          const r = (0, n.ensureDefined)(
            null ===
              (l = this._listenersMappers.find(
                (l) => l.obj === e && l.method === t,
              )) || void 0 === l
              ? void 0
              : l.callback,
          )
          this._baseProperty.unsubscribe(e, r)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    99970: (e, t, l) => {
      l.d(t, { StudyPlotVisibleProperty: () => o })
      var n = l(19782),
        r = l(57898)
      class o {
        constructor(e) {
          ;(this._subscribers = new r.Delegate()),
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
            this._subscribers.destroy()
        }
        value() {
          return 0 !== this._displayProperty.value()
        }
        setValue(e, t) {
          this._displayProperty.setValue(e ? 15 : 0)
        }
        subscribe(e, t) {
          this._subscribers.subscribe(e, t, !1)
        }
        unsubscribe(e, t) {
          this._subscribers.unsubscribe(e, t)
        }
        unsubscribeAll(e) {
          this._subscribers.unsubscribeAll(e)
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
          this._subscribers.fire(this)
        }
      }
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
    6570: (e) => {
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
