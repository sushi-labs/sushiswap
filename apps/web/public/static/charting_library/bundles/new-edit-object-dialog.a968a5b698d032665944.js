;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6265],
  {
    626574: (e) => {
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
    714904: (e) => {
      e.exports = { scrollable: 'scrollable-vwgPOHG8', tabs: 'tabs-vwgPOHG8' }
    },
    334163: (e, t, l) => {
      l.r(t), l.d(t, { EditObjectDialogRenderer: () => dl })
      var n = l(500962),
        r = l(50959),
        o = l(650151),
        i = l(609838),
        s = l(664902),
        a = l(357739),
        c = l(870122),
        p = l(156963),
        d = l(559410),
        h = l(32133),
        u = l(674609),
        m = l(976669),
        y = l(370981),
        v = l(742554),
        g = l(593194),
        b = l(380865),
        w = l(919577),
        f = l(944316),
        C = l(839246),
        P = l(714904)
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
                return r.createElement(u.StudyDefaultsManager, {
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
              y.globalCloseDelegate.fire()
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
                v.TouchScrollContainer,
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
      var E = l(355217),
        T = l(105586)
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
      var k = l(414823),
        x = l(602907),
        I = l(597399),
        L = l(82528),
        V = l(662949),
        R = l(252138)
      const D = new s.TranslatedString(
        'change visibility',
        i.t(null, void 0, l(521511)),
      )
      class M extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = (e) => {
              const { setValue: t } = this.context,
                { visible: l } = this.props
              l && t(l, e, D)
            })
        }
        render() {
          const { id: e, title: t, visible: n, disabled: o } = this.props,
            s = (0, a.clean)(i.t(t, { context: 'input' }, l(788601)), !0)
          return r.createElement(V.BoolInputComponent, {
            label: s,
            disabled: o,
            input: { id: e, type: 'bool', defval: !0, name: 'visible' },
            value: !n || (0, R.getPropertyValue)(n),
            onChange: this._onChange,
          })
        }
      }
      M.contextType = L.StylePropertyContext
      var N = l(966507),
        W = l(917850),
        B = l(321659),
        A = l(865588),
        z = l(294152),
        F = l(718819),
        H = l(614643),
        G = l(646464),
        U = l(396298),
        O = l(718621),
        j = l(98450),
        Q = l(591512),
        Z = l(193976),
        q = l(772914),
        K = l(321579)
      const Y = {
          [x.LineStudyPlotStyle.Line]: {
            type: x.LineStudyPlotStyle.Line,
            order: 0,
            icon: z,
            label: i.t(null, void 0, l(301277)),
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
            label: i.t(null, void 0, l(464108)),
          },
          [x.LineStudyPlotStyle.StepLineWithDiamonds]: {
            type: x.LineStudyPlotStyle.StepLineWithDiamonds,
            order: 4,
            icon: U,
            label: i.t(null, void 0, l(367767)),
          },
          [x.LineStudyPlotStyle.Histogram]: {
            type: x.LineStudyPlotStyle.Histogram,
            order: 5,
            icon: O,
            label: i.t(null, void 0, l(511091)),
          },
          [x.LineStudyPlotStyle.Cross]: {
            type: x.LineStudyPlotStyle.Cross,
            order: 6,
            icon: j,
            label: i.t(null, { context: 'chart_type' }, l(774274)),
          },
          [x.LineStudyPlotStyle.Area]: {
            type: x.LineStudyPlotStyle.Area,
            order: 7,
            icon: Q,
            label: i.t(null, void 0, l(542097)),
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
            icon: q,
            label: i.t(null, void 0, l(636018)),
          },
          [x.LineStudyPlotStyle.Circles]: {
            type: x.LineStudyPlotStyle.Circles,
            order: 10,
            icon: K,
            label: i.t(null, void 0, l(239495)),
          },
        },
        $ = Object.values(Y)
          .sort((e, t) => e.order - t.order)
          .map((e) => ({
            value: e.type,
            selectedContent: r.createElement(A.DisplayItem, { icon: e.icon }),
            content: r.createElement(A.DropItem, {
              icon: e.icon,
              label: e.label,
            }),
          })),
        J = i.t(null, void 0, l(491492))
      class X extends r.PureComponent {
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
          if (!(t in Y)) return null
          const a = {
            readonly: !0,
            content: r.createElement(
              r.Fragment,
              null,
              r.createElement(B.MenuItemSwitcher, {
                id: 'PlotTypePriceLineSwitch',
                checked: n,
                label: J,
                preventLabelHighlight: !0,
                value: 'priceLineSwitcher',
                onChange: i,
              }),
              r.createElement(W.PopupMenuSeparator, null),
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
      var ee = l(14385),
        te = l(462433)
      const le = new s.TranslatedString(
          'change plot type',
          i.t(null, void 0, l(215683)),
        ),
        ne = new s.TranslatedString(
          'change price line visibility',
          i.t(null, void 0, l(867761)),
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
            N.InputRow,
            {
              grouped: c,
              label: r.createElement(
                'div',
                { className: te.childRowContainer },
                i.t(t.name, { context: 'input' }, l(788601)),
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
              ? r.createElement(X, {
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
      var oe = l(459837)
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
              secondaryPaletteProps: h,
              title: u,
            } = this.props,
            m = e ? e.id : (0, o.ensureDefined)(t).id,
            y = !m.startsWith('fill') && e && (0, x.isLinePlot)(e)
          return r.createElement(
            r.Fragment,
            null,
            !i &&
              r.createElement(
                oe.PropertyTable.Row,
                null,
                r.createElement(
                  oe.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, offset: p },
                  a
                    ? r.createElement('div', null, u)
                    : r.createElement(M, {
                        id: m,
                        title: u,
                        visible: s.visible,
                      }),
                ),
              ),
            ie(m, l, n, s, y, p),
            d && h && ie(m, d, h, s, y, p, !0),
            c && r.createElement(oe.PropertyTable.GroupSeparator, null),
          )
        }
      }
      se.contextType = L.StylePropertyContext
      var ae = l(410890)
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
      var de = l(554393)
      const he = new s.TranslatedString(
          'change plot type',
          i.t(null, void 0, l(215683)),
        ),
        ue = new s.TranslatedString(
          'change price line visibility',
          i.t(null, void 0, l(867761)),
        )
      class me extends r.PureComponent {
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
              l && t(l, e, ue)
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
            N.InputRow,
            { label: r.createElement(pe, { id: e, title: t, display: p }) },
            l && !n
              ? this._getInputForRgb()
              : r.createElement(ee.ColorWithThicknessSelect, {
                  disabled: 0 === p.value(),
                  color: o,
                  transparency: a,
                  thickness: s,
                }),
            r.createElement(X, {
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
      const ye = r.createContext(null)
      class ve extends r.PureComponent {
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
            disabled: h,
          } = this.props
          return r.createElement(
            N.InputRow,
            {
              label: c
                ? r.createElement(M, {
                    id: e,
                    title: l,
                    visible: n,
                    disabled: h,
                  })
                : l,
              offset: p,
              grouped: d,
            },
            t
              ? null
              : r.createElement(ee.ColorWithThicknessSelect, {
                  disabled:
                    h || (n && !(Array.isArray(n) ? n[0].value() : n.value())),
                  color: o,
                  transparency: i,
                  thickness: s,
                }),
            a,
          )
        }
      }
      ve.contextType = L.StylePropertyContext
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
          return r.createElement(ve, {
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
          return r.createElement(ye.Consumer, null, (a) =>
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
      var we = l(687795),
        fe = l.n(we),
        Ce = l(497754),
        Pe = l.n(Ce),
        Se = l(654936),
        Ee = l(529631),
        Te = l(694454)
      const _e = {
          [Te.MarkLocation.AboveBar]: {
            value: Te.MarkLocation.AboveBar,
            content: i.t(null, void 0, l(541389)),
            order: 0,
          },
          [Te.MarkLocation.BelowBar]: {
            value: Te.MarkLocation.BelowBar,
            content: i.t(null, void 0, l(278626)),
            order: 1,
          },
          [Te.MarkLocation.Top]: {
            value: Te.MarkLocation.Top,
            content: i.t(null, void 0, l(865994)),
            order: 2,
          },
          [Te.MarkLocation.Bottom]: {
            value: Te.MarkLocation.Bottom,
            content: i.t(null, void 0, l(691757)),
            order: 3,
          },
          [Te.MarkLocation.Absolute]: {
            value: Te.MarkLocation.Absolute,
            content: i.t(null, void 0, l(129520)),
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
          i.t(null, void 0, l(198491)),
        ),
        Le = new s.TranslatedString(
          'change location',
          i.t(null, void 0, l(138361)),
        )
      class Ve extends r.PureComponent {
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
              location: h,
              display: u,
            } = s.childs()
          return r.createElement(
            N.InputRow,
            {
              grouped: a,
              label: r.createElement(pe, { id: t, title: l, display: u }),
            },
            !a &&
              !i &&
              r.createElement(ee.ColorWithThicknessSelect, {
                disabled: 0 === u.value(),
                color: c,
                transparency: p,
              }),
            r.createElement(Se.InputControl, {
              disabled: void 0 === d || 0 === u.value(),
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
              disabled: 0 === u.value(),
              className: Ce(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: h.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      Ve.contextType = L.StylePropertyContext
      var Re = l(355490)
      const De = {
        arrow_down: l(669151),
        arrow_up: l(167211),
        circle: l(583786),
        cross: l(250858),
        diamond: l(713201),
        flag: l(659058),
        label_down: l(808537),
        label_up: l(202309),
        square: l(778240),
        triangle_down: l(241683),
        triangle_up: l(306570),
        x_cross: l(923223),
      }
      function Me(e) {
        return De[e]
      }
      const Ne = []
      Object.keys(Re.plotShapesData).forEach((e) => {
        const t = Re.plotShapesData[e]
        Ne.push({
          id: t.id,
          value: t.id,
          selectedContent: r.createElement(A.DisplayItem, { icon: Me(t.icon) }),
          content: r.createElement(A.DropItem, {
            icon: Me(t.icon),
            label: t.guiName,
          }),
        })
      })
      class We extends r.PureComponent {
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
            items: Ne,
            value: t,
            onChange: n,
          })
        }
      }
      const Be = new s.TranslatedString(
          'change shape',
          i.t(null, void 0, l(486888)),
        ),
        Ae = new s.TranslatedString(
          'change location',
          i.t(null, void 0, l(138361)),
        )
      class ze extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = (e) => {
              const { setValue: t } = this.context
              t(this.props.property.childs().plottype, e, Be)
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
            N.InputRow,
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
            r.createElement(We, {
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
      const Fe = (0, l(6835).getLogger)('Chart.Study.PropertyPage'),
        He = i.t(null, void 0, l(798802)),
        Ge = i.t(null, void 0, l(741361)),
        Ue = i.t(null, void 0, l(883760)),
        Oe = i.t(null, void 0, l(226458)),
        je = i.t(null, void 0, l(248848))
      class Qe extends r.PureComponent {
        render() {
          var e, t, l
          const { plot: n, palettes: i, study: s } = this.props,
            a = n.id,
            c = s.properties().styles,
            p = s.metaInfo().styles,
            d = c[a],
            h = n.type,
            u = i.main,
            m = !!s.metaInfo().isRGB
          if ('line' === h || 'bar_colorer' === h || 'bg_colorer' === h)
            return u && u.palette && u.paletteProps
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
                  palette: u.palette,
                  paletteProps: u.paletteProps,
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
                  showLineWidth: 'line' === h,
                })
          if ('arrows' === h) {
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
          if ('chars' === h || 'shapes' === h) {
            const e = (0, o.ensureDefined)(null == p ? void 0 : p[a]),
              t = e.title
            return r.createElement(
              r.Fragment,
              null,
              'chars' === h
                ? r.createElement(Ve, {
                    id: a,
                    title: t,
                    char: e.char,
                    property: d,
                    hasPalette: Boolean(u && u.palette),
                    isRGB: m,
                  })
                : r.createElement(ze, {
                    id: a,
                    title: t,
                    property: d,
                    hasPalette: Boolean(u && u.palette),
                    isRGB: m,
                  }),
              u &&
                u.palette &&
                u.paletteProps &&
                r.createElement(ce, {
                  title: t,
                  plot: n,
                  palette: u.palette,
                  paletteProps: u.paletteProps,
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
              u && u.palette && u.paletteProps
                ? r.createElement(ce, {
                    title: Ue,
                    plot: n,
                    palette: u.palette,
                    paletteProps: u.paletteProps,
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
          return Fe.logError('Unknown plot type: ' + h), null
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
      var qe = l(600052),
        Ke = l(796855)
      const Ye = new s.TranslatedString(
        'change line style',
        i.t(null, void 0, l(628691)),
      )
      class $e extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onLineStyleChange = (e) => {
              const { setValue: t } = this.context,
                { lineStyle: l } = this.props
              t(l, e, Ye)
            })
        }
        render() {
          const { lineStyle: e, ...t } = this.props
          return r.createElement(Ke.LineStyleSelect, {
            ...t,
            lineStyle: (0, R.getPropertyValue)(e),
            lineStyleChange: this._onLineStyleChange,
          })
        }
      }
      $e.contextType = L.StylePropertyContext
      const Je = new s.TranslatedString(
        'change value',
        i.t(null, void 0, l(50463)),
      )
      class Xe extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._onValueChange = (e) => {
              const { setValue: t } = this.context,
                { value: l } = this.props.property
              t(l, e, Je)
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
            N.InputRow,
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
                r.createElement(qe.FloatInputComponent, {
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
      Xe.contextType = L.StylePropertyContext
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
                  title: i.t(null, void 0, l(607138)),
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
                  title: i.t(null, void 0, l(786520)),
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
                  title: i.t(null, void 0, l(766596)),
                  visible: n,
                }),
              ),
            ),
          )
        }
      }
      et.contextType = L.StylePropertyContext
      var tt = l(767822),
        lt = l(815300)
      const nt = new s.TranslatedString(
          'change percent width',
          i.t(null, void 0, l(851081)),
        ),
        rt = new s.TranslatedString(
          'change placement',
          i.t(null, void 0, l(847634)),
        ),
        ot = new s.TranslatedString(
          'change values visibility',
          i.t(null, void 0, l(212628)),
        ),
        it = [
          {
            value: tt.HHistDirection.LeftToRight,
            content: i.t(null, void 0, l(619286)),
          },
          {
            value: tt.HHistDirection.RightToLeft,
            content: i.t(null, void 0, l(221141)),
          },
        ],
        st = i.t(null, void 0, l(895247)),
        at = i.t(null, void 0, l(621861)),
        ct = i.t(null, void 0, l(391322)),
        pt = i.t(null, void 0, l(319221))
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
                {
                  placement: 'first',
                  colSpan: 2,
                  grouped: !0,
                },
                r.createElement(M, { id: a, title: a, visible: s }),
              ),
            ),
            r.createElement(
              N.InputRow,
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
              N.InputRow,
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
                r.createElement(V.BoolInputComponent, {
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
              N.InputRow,
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
                N.InputRow,
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
      class ht extends r.PureComponent {
        render() {
          const { title: e, property: t } = this.props,
            { color: l, width: n, style: o, visible: i } = t.childs()
          return r.createElement(
            N.InputRow,
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
      var ut, mt
      ;(ht.contextType = L.StylePropertyContext),
        ((e) => {
          ;(e.Triangle = 'triangle'), (e.Rectangle = 'rectangle')
        })(ut || (ut = {})),
        ((e) => {
          ;(e.Verdana = 'Verdana'),
            (e.CourierNew = 'Courier New'),
            (e.TimesNewRoman = 'Times New Roman'),
            (e.Arial = 'Arial')
        })(mt || (mt = {}))
      class yt extends r.PureComponent {
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
              ? r.createElement(ht, {
                  key: t,
                  title: (0, o.ensureDefined)(
                    null === (a = l.graphics[e]) || void 0 === a
                      ? void 0
                      : a[t],
                  ).name,
                  property: d,
                })
              : 'lines' === e
                ? r.createElement(ht, {
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
      var vt = l(408525)
      const gt = new s.TranslatedString(
          'change font size',
          i.t(null, void 0, l(907378)),
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
          return r.createElement(vt.FontSizeSelect, {
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
          i.t(null, void 0, l(521511)),
        ),
        Ct = i.t(null, void 0, l(864606)),
        Pt = i.t(null, void 0, l(194420)),
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
              N.InputRow,
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
                r.createElement(V.BoolInputComponent, {
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
              r.createElement(ve, {
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
      const Tt = i.t(null, void 0, l(621861)),
        _t = [
          {
            value: tt.HHistDirection.RightToLeft,
            content: i.t(null, void 0, l(221141)),
          },
          {
            value: tt.HHistDirection.LeftToRight,
            content: i.t(null, void 0, l(619286)),
          },
        ],
        kt = new s.TranslatedString(
          'change visibility',
          i.t(null, void 0, l(521511)),
        ),
        xt = i.t(null, void 0, l(114414)),
        It = i.t(null, void 0, l(391322)),
        Lt = i.t(null, void 0, l(895247)),
        Vt = i.t(null, void 0, l(731577)),
        Rt = i.t(null, { context: 'input' }, l(323545)),
        Dt = i.t(null, { context: 'input' }, l(641596))
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
              styles: h,
              showLabelsOnPriceScale: u,
              showLegendValues: m,
            } = this.props.property.childs(),
            { hhists: y, horizlines: v, polygons: g } = d.childs(),
            b = (0, o.ensureDefined)(p.graphics.hhists),
            w = Object.keys(b),
            f = y.childs()[w[0]],
            C = f.childs().visible,
            P = w.map((e) => y.childs()[e].childs().showValues),
            S = f.childs().percentWidth,
            E = f.childs().direction,
            T = w.map((e) => y.childs()[e].childs().valuesColor),
            _ = null === (e = v.childs()) || void 0 === e ? void 0 : e.vahLines,
            k =
              null === (t = p.graphics.horizlines) || void 0 === t
                ? void 0
                : t.vahLines,
            x = null === (n = v.childs()) || void 0 === n ? void 0 : n.valLines,
            I =
              null === (s = p.graphics.horizlines) || void 0 === s
                ? void 0
                : s.valLines,
            L = v.childs().pocLines,
            R = (0, o.ensureDefined)(
              null === (a = p.graphics.horizlines) || void 0 === a
                ? void 0
                : a.pocLines,
            ),
            D = h.childs().developingPoc,
            W = new ae.StudyPlotVisibleProperty(D.childs().display),
            B = (0, o.ensureDefined)(
              null === (c = p.styles) || void 0 === c
                ? void 0
                : c.developingPoc,
            ),
            A = h.childs().developingVAHigh,
            z = new ae.StudyPlotVisibleProperty(A.childs().display),
            F = h.childs().developingVALow,
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
                r.createElement(V.BoolInputComponent, {
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
                  r.createElement(V.BoolInputComponent, {
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
                y
                  .childs()
                  [e].childs()
                  .colors.childNames()
                  .map((t, n) => {
                    const o = b[e]
                    return r.createElement(
                      N.InputRow,
                      {
                        key: n,
                        label: r.createElement(
                          'div',
                          { className: te.childRowContainer },
                          (o &&
                            i.t(
                              o.titles[n],
                              { context: 'input' },
                              l(788601),
                            )) ||
                            '',
                        ),
                      },
                      r.createElement(ee.ColorWithThicknessSelect, {
                        disabled: !C.value(),
                        color: y.childs()[e].childs().colors.childs()[n],
                        transparency: y
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
                ve,
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
                ve,
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
              ve,
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
            D &&
              r.createElement(
                ve,
                {
                  id: 'developingPoc',
                  title:
                    (B.title &&
                      i.t(B.title, { context: 'input' }, l(788601))) ||
                    '',
                  color: D.childs().color,
                  visible: W,
                  thickness: D.childs().linewidth,
                },
                r.createElement($e, {
                  id: 'developing-poc-line-style-select',
                  disabled: !W.value(),
                  className: te.smallStyleControl,
                  lineStyle: D.childs().linestyle,
                }),
              ),
            A &&
              F &&
              r.createElement(
                ve,
                {
                  id: 'developingPoc',
                  title: Vt,
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
                N.InputRow,
                {
                  label: r.createElement(
                    'div',
                    null,
                    (G && i.t(G.name, { context: 'input' }, l(788601))) || '',
                  ),
                },
                r.createElement(ee.ColorWithThicknessSelect, {
                  color: g.childs().histBoxBg.childs().color,
                  transparency: g.childs().histBoxBg.childs().transparency,
                }),
              ),
            (u || m) &&
              'VbPFixed' !== p.shortId &&
              r.createElement(
                r.Fragment,
                null,
                u &&
                  r.createElement(
                    oe.PropertyTable.Cell,
                    { placement: 'first', colSpan: 2 },
                    r.createElement(M, {
                      id: 'showLabelsOnPriceScale',
                      title: Dt,
                      visible: u,
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
      function Nt() {
        const e = (0, o.ensureNotNull)((0, r.useContext)(ye)),
          t = e.metaInfo(),
          l = e.properties()
        return r.createElement(Mt, { metaInfo: t, property: l })
      }
      Mt.contextType = L.StylePropertyContext
      var Wt = l(947901)
      const Bt = {
        VbPFixed: Nt,
        PivotPointsStandard: () => {
          const e = (0, o.ensureNotNull)((0, r.useContext)(ye)).properties()
          return r.createElement(Et, { property: e })
        },
        VbPVisible: Nt,
        VbPAnchored: Nt,
      }
      class At extends r.PureComponent {
        render() {
          const e = (0, o.ensureNotNull)(this.context)
          return r.createElement(ye.Consumer, null, (t) =>
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
          if (e in Bt) {
            const t = Bt[e]
            return r.createElement(t, null)
          }
          return null
        }
      }
      At.contextType = Wt.ModelContext
      var zt = l(66247)
      const Ft = new s.TranslatedString(
          'change precision',
          i.t(null, void 0, l(900164)),
        ),
        Ht = i.t(null, void 0, l(204329)),
        Gt = i.t(null, void 0, l(173947)),
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
            N.InputRow,
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
          i.t(null, void 0, l(320834)),
        ),
        Qt = i.t(null, void 0, l(204329)),
        Zt = i.t(null, void 0, l(836993)),
        qt = [
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
        Kt = [{ id: 'tick-default', value: 'default', content: Qt }]
      for (let e = 0; e < qt.length; e++) {
        const t = qt[e]
        Kt.push({
          value: t.priceScale + ',' + t.minMove + ',' + t.frac,
          content: t.minMove + '/' + t.priceScale,
        })
      }
      class Yt extends r.PureComponent {
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
            N.InputRow,
            { label: Zt },
            r.createElement(Ee.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: Kt,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      Yt.contextType = L.StylePropertyContext
      var $t = l(39290),
        Jt = l(852830)
      class Xt extends r.PureComponent {
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
            N.InputRow,
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
      Xt.contextType = L.StylePropertyContext
      const el = i.t(null, void 0, l(527331)),
        tl = i.t(null, { context: 'input' }, l(323545)),
        ll = i.t(null, { context: 'input' }, l(641596)),
        nl = i.t(null, void 0, l(540297))
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
            h = (0, $t.createAdapter)(e).canOverrideMinTick()
          return r.createElement(
            oe.PropertyTable,
            null,
            this._plotsElement(),
            this._bandsElement(),
            this._bandsBackgroundsElement(),
            this._areasBackgroundsElement(),
            this._filledAreasElement(),
            this._graphicsElement(),
            h &&
              r.createElement(Yt, {
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
                r.createElement(Jt.GroupTitleSection, { title: nl, name: nl }),
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
                return r.createElement(Xe, {
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
            r.createElement(ve, {
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
                r.createElement(ve, {
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
                    return r.createElement(Xt, {
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
                return r.createElement(ve, {
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
              r.createElement(yt, { key: t, graphicType: t, study: e }),
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
            Wt.ModelContext.Provider,
            { value: this.props.model },
            r.createElement(
              ye.Provider,
              { value: this.props.source },
              r.createElement(ol, { study: this.props.source }),
            ),
          )
        }
      }
      var sl = l(98361),
        al = l(19406),
        cl = l(412548),
        pl = l(562051)
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
              (0, h.trackEvent)(
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
            ;(0, h.trackEvent)('GUI', 'Study Properties', e)
          }
          let s = []
          const u = new T.MetaInfoHelper(o)
          u.hasUserEditableInputs() &&
            s.push({
              id: 'inputs',
              label: i.t(null, void 0, l(666304)),
              Component: _,
            }),
            u.hasUserEditableProperties(),
            u.hasUserEditableStyles() &&
              s.push({
                id: 'style',
                label: i.t(null, void 0, l(832733)),
                Component: il,
              }),
            this._propertyPages ||
              s.push({
                id: 'visibilities',
                label: i.t(null, void 0, l(221852)),
                page: this._createVisibilitiesPropertyPage(),
              }),
            (s = this._getPagesForStudyLineTool(s))
          const m =
            e.initialTab ||
            c.getValue(this._activeTabSettingsName()) ||
            'inputs'
          const y = (0, a.clean)(o.shortDescription, !0)
          const v =
            null !== (t = s.find((e) => e.id === m)) && void 0 !== t ? t : s[0]
          n.render(
            r.createElement(S, {
              title: y,
              model: this._model,
              source: this._source,
              initialActiveTab: v.id,
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
            i.t(null, void 0, l(221852)),
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
    840670: (e) => {
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
    462433: (e) => {
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
    321659: (e, t, l) => {
      l.d(t, {
        DEFAULT_MENU_ITEM_SWITCHER_THEME: () => g,
        MenuItemSwitcher: () => b,
      })
      var n = l(50959),
        r = l(497754),
        o = l.n(r),
        i = l(234539),
        s = l(626574),
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
            onKeyDown: h,
            ...u
          } = e,
          m = (0, n.useCallback)(
            (e) => {
              13 === e.keyCode && e.target.click(), h && h(e)
            },
            [h],
          )
        return n.createElement(
          'span',
          { className: c(e) },
          n.createElement('input', {
            ...u,
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
      var d = l(72571),
        h = l(892932),
        u = l(930202),
        m = l(865266),
        y = l(800417),
        v = l(840670)
      const g = v
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
            theme: w = v,
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
              h.PLATFORM_ACCESSIBILITY_ENABLED && v.accessible,
            ),
            htmlFor: r,
            ref: g,
            onKeyDown: (e) => {
              if (
                !h.PLATFORM_ACCESSIBILITY_ENABLED ||
                e.target !== e.currentTarget
              )
                return
              const t = (0, u.hashFromEvent)(e)
              ;(13 !== t && 32 !== t) ||
                (e.preventDefault(),
                P.current instanceof HTMLElement && P.current.click())
            },
            tabIndex: S,
            'data-role': h.PLATFORM_ACCESSIBILITY_ENABLED ? 'menuitem' : void 0,
            'aria-disabled':
              (h.PLATFORM_ACCESSIBILITY_ENABLED && e.disabled) || void 0,
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
            { className: v.switchWrap },
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
              'aria-disabled': h.PLATFORM_ACCESSIBILITY_ENABLED,
              ...(0, y.filterDataProps)(e),
            }),
          ),
        )
      }
    },
    98361: (e, t, l) => {
      l.r(t), l.d(t, { createPropertyPage: () => r })
      var n = l(650802)
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
    412548: (e, t, l) => {
      l.r(t),
        l.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ae,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => ce,
        })
      var n = l(609838),
        r = l(664902),
        o = l(156963),
        i = l(308954),
        s = l(650802),
        a = l(739343),
        c = l(986790),
        p = l(770366)
      const d = new r.TranslatedString(
          'change {title} visibility on ticks',
          n.t(null, void 0, l(130810)),
        ),
        h = new r.TranslatedString(
          'change {title} visibility on seconds',
          n.t(null, void 0, l(146948)),
        ),
        u = new r.TranslatedString(
          'change {title} seconds from',
          n.t(null, void 0, l(602822)),
        ),
        m = new r.TranslatedString(
          'change {title} seconds to',
          n.t(null, void 0, l(566161)),
        ),
        y = new r.TranslatedString(
          'change {title} visibility on minutes',
          n.t(null, void 0, l(64370)),
        ),
        v = new r.TranslatedString(
          'change {title} minutes from',
          n.t(null, void 0, l(715106)),
        ),
        g = new r.TranslatedString(
          'change {title} minutes to',
          n.t(null, void 0, l(891633)),
        ),
        b = new r.TranslatedString(
          'change {title} visibility on hours',
          n.t(null, void 0, l(468971)),
        ),
        w = new r.TranslatedString(
          'change {title} hours from',
          n.t(null, void 0, l(435388)),
        ),
        f = new r.TranslatedString(
          'change {title} hours to',
          n.t(null, void 0, l(478586)),
        ),
        C = new r.TranslatedString(
          'change {title} visibility on days',
          n.t(null, void 0, l(229088)),
        ),
        P = new r.TranslatedString(
          'change {title} days from',
          n.t(null, void 0, l(541377)),
        ),
        S = new r.TranslatedString(
          'change {title} days to',
          n.t(null, void 0, l(713355)),
        ),
        E = new r.TranslatedString(
          'change {title} visibility on weeks',
          n.t(null, void 0, l(324941)),
        ),
        T = new r.TranslatedString(
          'change {title} weeks from',
          n.t(null, void 0, l(21339)),
        ),
        _ = new r.TranslatedString(
          'change {title} weeks to',
          n.t(null, void 0, l(468643)),
        ),
        k = new r.TranslatedString(
          'change {title} visibility on months',
          n.t(null, void 0, l(606659)),
        ),
        x = new r.TranslatedString(
          'change {title} months from',
          n.t(null, void 0, l(459635)),
        ),
        I = new r.TranslatedString(
          'change {title} months to',
          n.t(null, void 0, l(974266)),
        ),
        L =
          (new r.TranslatedString(
            'change {title} visibility on ranges',
            n.t(null, { replace: { ranges: 'ranges' } }, l(108917)),
          ),
          n.t(null, void 0, l(130973))),
        V = n.t(null, void 0, l(371129)),
        R = n.t(null, void 0, l(928134)),
        D = n.t(null, void 0, l(463099)),
        M = n.t(null, void 0, l(422192)),
        N = n.t(null, void 0, l(621594)),
        W = n.t(null, void 0, l(695543)),
        B = new r.TranslatedString('ticks', n.t(null, void 0, l(659523))),
        A = new r.TranslatedString('seconds', n.t(null, void 0, l(132925))),
        z = new r.TranslatedString(
          'seconds from',
          n.t(null, void 0, l(706049)),
        ),
        F = new r.TranslatedString('seconds to', n.t(null, void 0, l(939017))),
        H = new r.TranslatedString('minutes', n.t(null, void 0, l(516465))),
        G = new r.TranslatedString(
          'minutes from',
          n.t(null, void 0, l(425586)),
        ),
        U = new r.TranslatedString('minutes to', n.t(null, void 0, l(872317))),
        O = new r.TranslatedString('hours', n.t(null, void 0, l(903143))),
        j = new r.TranslatedString('hours from', n.t(null, void 0, l(84775))),
        Q = new r.TranslatedString('hours to', n.t(null, void 0, l(711255))),
        Z = new r.TranslatedString('days', n.t(null, void 0, l(282211))),
        q = new r.TranslatedString('days from', n.t(null, void 0, l(914077))),
        K = new r.TranslatedString('days to', n.t(null, void 0, l(133486))),
        Y = new r.TranslatedString('weeks', n.t(null, void 0, l(193016))),
        $ = new r.TranslatedString('weeks from', n.t(null, void 0, l(32002))),
        J = new r.TranslatedString('weeks to', n.t(null, void 0, l(428091))),
        X = new r.TranslatedString('months', n.t(null, void 0, l(58964))),
        ee = new r.TranslatedString(
          'months from',
          n.t(null, void 0, l(671770)),
        ),
        te = new r.TranslatedString('months to', n.t(null, void 0, l(737179))),
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
                h.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                u.format({ title: l }),
              ),
              to: (0, i.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                m.format({ title: l }),
              ),
            },
            {
              id: 'IntervalsVisibilitiesSecond',
              title: V,
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
                y.format({ title: l }),
              ),
              from: (0, i.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                v.format({ title: l }),
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
              title: D,
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
        const B = (0, i.createRangePropertyDefinition)(
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
              title: N,
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
              title: W,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          )
        return n.push(B, A), { definitions: n }
      }
      function ce(e, t) {
        const l = []
        if (o.enabled('tick_resolution')) {
          const n = (0, i.createCheckablePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.ticks),
                B,
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
              title: V,
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
              title: D,
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
                q,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysTo),
                K,
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
        const h = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeks),
                Y,
                t,
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksFrom),
                $,
                t,
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksTo),
                J,
                t,
              ),
            },
            {
              id: 'IntervalsVisibilitiesWeeks',
              title: N,
              min: new s.WatchedValue(ie[0]),
              max: new s.WatchedValue(ie[1]),
            },
          ),
          u = (0, i.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.months),
                X,
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
              title: W,
              min: new s.WatchedValue(se[0]),
              max: new s.WatchedValue(se[1]),
            },
          )
        return l.push(h, u), { definitions: l }
      }
    },
    770366: (e, t, l) => {
      l.d(t, { CollectiblePropertyUndoWrapper: () => a })
      var n = l(650151),
        r = l(609838),
        o = l(664902),
        i = l(804550)
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
    410890: (e, t, l) => {
      l.d(t, { StudyPlotVisibleProperty: () => o })
      var n = l(300962),
        r = l(466052)
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
    669151: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 21l7.424-6.114a.5.5 0 0 0-.318-.886H18.5V7h-9v7H6.894a.5.5 0 0 0-.318.886L14 21z"/></svg>'
    },
    167211: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 7l7.424 6.114a.5.5 0 0 1-.318.886H18.5v7h-9v-7H6.894a.5.5 0 0 1-.318-.886L14 7z"/></svg>'
    },
    583786: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><circle stroke="currentColor" cx="14" cy="14" r="6.5"/></svg>'
    },
    250858: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 14.5h11M14.5 20V9"/></svg>'
    },
    713201: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14.354 6.646L14 6.293l-.354.353-7 7-.353.354.353.354 7 7 .354.353.354-.353 7-7 .353-.354-.353-.354-7-7z"/></svg>'
    },
    659058: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8.5 22v-5.5m0 0v-8L12 7l4 2.5 3.5-1v8l-3.5 1-4-2.5-3.5 1.5z"/></svg>'
    },
    808537: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 8.5h-.5v9.707l.146.147 3 3 .354.353.354-.353 3-3 .146-.147V8.5H11z"/></svg>'
    },
    202309: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 18.5h-.5V8.793l.146-.147 3-3L14 5.293l.354.353 3 3 .146.147V18.5H11z"/></svg>'
    },
    778240: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 7.5h13v13h-13z"/></svg>'
    },
    241683: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 11.265l.478-.765H8.098l.478.765 5 8 .424.678.424-.678 5-8z"/></svg>'
    },
    306570: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 16.735l.478.765H8.098l.478-.765 5-8L14 8.057l.424.678 5 8z"/></svg>'
    },
    923223: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 9l11 11M9 20L20 9"/></svg>'
    },
    193976: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M13 11.5l-1.915-1.532a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82V18.5a1 1 0 0 0 1 1H13m3.5-7l4.293-4.293c.63-.63 1.707-.184 1.707.707V18.5a1 1 0 0 1-1 1H16"/><path fill="currentColor" d="M14 6h1v2h-1zM14 11h1v2h-1zM14 16h1v2h-1zM14 21h1v2h-1z"/></svg>'
    },
    591512: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13.52v4.98a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V8.914c0-.89-1.077-1.337-1.707-.707l-4.66 4.66a1 1 0 0 1-1.332.074l-3.716-2.973a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82z"/></svg>'
    },
    321579: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM16.5 19a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM22.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>'
    },
    772914: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 12.5v8h3v-8h-3zM12.5 7.5v13h3v-13h-3zM18.5 15.5v5h3v-5h-3z"/></svg>'
    },
    98450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M17 8.5h7M20.5 12V5M10 19.5h7M13.5 23v-7M3 12.5h7M6.5 16V9"/></svg>'
    },
    718621: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4.5 20v-7m3 7V10m3 10V8m3 12V10m3 10v-8m3 8V10m3 10V8"/></svg>'
    },
    718819: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l5-5a1.414 1.414 0 0 1 2 0m11-1l-5 5a1.414 1.414 0 0 1-2 0"/><path fill="currentColor" d="M14 5h1v2h-1zM14 10h1v2h-1zM14 15h1v2h-1zM14 20h1v2h-1z"/></svg>'
    },
    294152: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>'
    },
    646464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M14 3h1v2h-1V3Zm1 5h-1v2h1V8Zm-1 5h1v2h-1v-2Zm0 5h1v2h-1v-2Zm0 5h1v2h-1v-2ZM10 5h2V4H9v18H6v-5H5v6h5V5Zm11 16h1V7h-5v10h1V8h3v13Z"/></svg>'
    },
    396298: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M9.8 2.7l.7-.7.7.7 2.1 2.1.2.2H18v9.5l.2.2 2.1 2.1.2.2H24v1h-3.5l-.2.2-2.1 2.1-.7.7-.7-.7-2.1-2.1-.7-.7.7-.7 2.1-2.1.2-.2V6h-3.5l-.2.2-2.1 2.1-.2.2V24H5.5v-1H10V8.5l-.2-.2-2.1-2.1-.7-.7.7-.7 2.1-2.1zM8.4 5.5l2.09 2.09 2.09-2.09-2.09-2.09L8.41 5.5zm9.09 14.09l-2.09-2.09 2.09-2.09 2.09 2.09-2.09 2.09z"/></svg>'
    },
    614643: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 17v5.5h4v-18h4v12h4v-9h4V21"/></svg>'
    },
  },
])
