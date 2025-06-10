;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6780],
  {
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
    29521: (e) => {
      e.exports = { scrollable: 'scrollable-Ycj0dUGE', tabs: 'tabs-Ycj0dUGE' }
    },
    95327: (e) => {
      e.exports = {
        titleWrap: 'titleWrap-e3jFxbHm',
        ellipsis: 'ellipsis-e3jFxbHm',
        hideInput: 'hideInput-e3jFxbHm',
        hideText: 'hideText-e3jFxbHm',
        empty: 'empty-e3jFxbHm',
        hideEmpty: 'hideEmpty-e3jFxbHm',
        editIcon: 'editIcon-e3jFxbHm',
      }
    },
    95747: (e) => {
      e.exports = { tabs: 'tabs-xNPrJ8dY' }
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
    38546: (e, t, i) => {
      i.d(t, { DialogTabs: () => n })
      var s = i(50959),
        a = i(86720)
      const n = s.forwardRef((e, t) => {
        const { id: i, tabs: n, activeTab: o, onChange: l, className: r } = e
        return s.createElement(
          'div',
          { className: r, ref: t },
          s.createElement(a.UnderlineButtonTabs, {
            id: i,
            items: n,
            isActive: (e) => e.id === o,
            onActivate: (e) => {
              l(e.id)
            },
            overflowBehaviour: 'scroll',
          }),
        )
      })
    },
    78890: (e, t, i) => {
      i.d(t, { PropertyActions: () => p })
      var s = i(50959),
        a = i(97754),
        n = i.n(a),
        o = i(9745),
        l = i(11542),
        r = i(95276),
        c = i(16396),
        u = i(44996),
        d = i(83428)
      const m = {
        reset: l.t(null, void 0, i(33533)),
        saveAsDefault: l.t(null, void 0, i(99687)),
        defaults: l.t(null, void 0, i(48572)),
      }
      var h
      !((e) => {
        ;(e.Normal = 'normal'), (e.Compact = 'compact')
      })(h || (h = {}))
      class p extends s.PureComponent {
        render() {
          const { mode: e, saveAsDefaults: t, resetToDefaults: i } = this.props
          return s.createElement(
            r.ControlDisclosure,
            {
              id: 'property-actions',
              className: n()('normal' === e && d.defaultsButtonText),
              hideArrowButton: 'compact' === e,
              buttonChildren: this._getPlaceHolderItem('compact' === e),
            },
            s.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: m.reset,
              onClick: i,
            }),
            s.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: m.saveAsDefault,
              onClick: t,
            }),
          )
        }
        _getPlaceHolderItem(e) {
          return e
            ? s.createElement(o.Icon, {
                className: d.defaultsButtonIcon,
                icon: u,
              })
            : m.defaults
        }
      }
    },
    48531: (e, t, i) => {
      i.d(t, { FooterMenu: () => C })
      var s = i(50959),
        a = i(11542),
        n = i(9745),
        o = i(95276),
        l = i(90692),
        r = i(50670),
        c = i(44996)
      function u(e) {
        return e.isTabletWidth
          ? s.createElement(n.Icon, { className: r.themesButtonIcon, icon: c })
          : s.createElement(s.Fragment, null, a.t(null, void 0, i(93553)))
      }
      function d(e) {
        return s.createElement(
          l.MatchMedia,
          { rule: '(max-width: 768px)' },
          (t) =>
            s.createElement(
              o.ControlDisclosure,
              {
                className: !t && r.themesButtonText,
                hideArrowButton: t,
                buttonChildren: s.createElement(u, { isTabletWidth: t }),
              },
              e.children,
            ),
        )
      }
      var m = i(16396),
        h = i(96040),
        p = i(70412),
        g = i(32563),
        b = i(60925)
      function f(e) {
        const { name: t, onRemove: i, onClick: a } = e,
          [n, o] = (0, p.useHover)(),
          l = s.useCallback(() => a(t), [a, t]),
          c = s.useCallback(() => {
            i && i(t)
          }, [i, t])
        return s.createElement(
          'div',
          { ...o },
          s.createElement(m.PopupMenuItem, {
            className: r.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: l,
            toolbox:
              i &&
              s.createElement(h.RemoveButton, {
                hidden: !g.mobiletouch && !n,
                onClick: c,
                icon: b,
              }),
          }),
        )
      }
      function v(e) {
        return s.createElement(
          d,
          null,
          s.createElement(f, {
            onClick: () => {
              const { sources: t, chartUndoModel: i } = e
              i.restoreLineToolsFactoryDefaults(t)
            },
            name: a.t(null, void 0, i(62511)),
          }),
        )
      }
      function C(e) {
        return s.createElement(v, { ...e })
      }
    },
    37289: (e, t, i) => {
      i.d(t, { PropertiesEditorTab: () => c })
      var s = i(50959),
        a = i(66849)
      const n = {
          'Elliott Impulse Wave (12345)Degree': 'normal',
          'Elliott Triangle Wave (ABCDE)Degree': 'normal',
          'Elliott Triple Combo Wave (WXYXZ)Degree': 'normal',
          'Elliott Correction Wave (ABC)Degree': 'normal',
          'Elliott Double Combo Wave (WXY)Degree': 'normal',
          BarsPatternMode: 'normal',
          StudyInputSource: 'normal',
        },
        o = {
          TextText: 'big',
          AnchoredTextText: 'big',
          NoteText: 'big',
          AnchoredNoteText: 'big',
          CalloutText: 'big',
          BalloonText: 'big',
        }
      var l = i(71891),
        r = i(68215)
      function c(e) {
        const { page: t, pageRef: i, tableKey: c } = e
        return s.createElement(
          a.ControlCustomHeightContext.Provider,
          { value: o },
          s.createElement(
            a.ControlCustomWidthContext.Provider,
            { value: n },
            t &&
              s.createElement(
                l.PropertyTable,
                { reference: i, key: c },
                t.definitions
                  .value()
                  .map((e) =>
                    s.createElement(r.Section, { key: e.id, definition: e }),
                  ),
              ),
          ),
        )
      }
    },
    75892: (e, t, i) => {
      i.r(t), i.d(t, { SourcePropertiesEditorRenderer: () => z })
      var s = i(50959),
        a = i(76422),
        n = i(50151),
        o = i(49483),
        l = i(56840),
        r = i.n(l),
        c = i(11542),
        u = i(50182),
        d = i(59064),
        m = i(48531),
        h = i(37289),
        p = i(86656),
        g = i(19466),
        b = i(32755),
        f = i(79036),
        v = i(98017),
        C = i(29875),
        _ = i(85719),
        x = i(90692),
        S = i(45126),
        T = i(38546),
        y = i(78890),
        w = i(68495),
        I = i(56570),
        E = i(29521)
      const A = new S.TranslatedString(
        'change {sourceTitle} title to {newSourceTitle}',
        c.t(null, void 0, i(23687)),
      )
      class P extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._activePageRef = s.createRef()),
            (this._handleChangeMode = (e) => {
              this.setState({ isRenaming: e })
            }),
            (this._getTranslatedStringForSource = (e) =>
              new S.TranslatedString(
                e.name(),
                e.title(g.TitleDisplayTarget.StatusLine),
              )),
            (this._setTitle = (e) => {
              const { source: t, model: i } = this.props,
                s = A.format({
                  sourceTitle:
                    t.properties().title.value() ||
                    this._getTranslatedStringForSource(t),
                  newSourceTitle: e,
                })
              i.setProperty(
                t.properties().title,
                e,
                s,
                _.lineToolsDoNotAffectChartInvalidation && (0, b.isLineTool)(t),
              )
            }),
            (this._getActionPageById = (e) => {
              if (!e) return
              const { pages: t } = this.props
              return t.find((t) => t.id.toLowerCase() === e.toLowerCase())
            }),
            (this._onChangeActivePageDefinitions = () => {
              this.setState({ tableKey: Date.now() }, () => {
                this._requestResize && this._requestResize()
              })
            }),
            (this._handleResetToDefaults = () => {
              const { source: e, model: t } = this.props
              ;(0, f.isStudy)(e) && t.restorePropertiesForSource(e)
            }),
            (this._handleSaveAsDefaults = () => {
              const { source: e } = this.props
              ;(0, f.isStudy)(e) && e.properties().saveDefaults()
            }),
            (this._renderFooterLeft = () => {
              const { source: e, model: t } = this.props
              return (0, b.isLineTool)(e)
                ? s.createElement(m.FooterMenu, {
                    sources: [e],
                    chartUndoModel: t,
                  })
                : s.createElement(
                    x.MatchMedia,
                    { rule: '(max-width: 440px)' },
                    (t) =>
                      (0, f.isStudy)(e) &&
                      s.createElement(y.PropertyActions, {
                        saveAsDefaults: this._handleSaveAsDefaults,
                        resetToDefaults: this._handleResetToDefaults,
                        mode: t ? 'compact' : 'normal',
                      }),
                  )
            }),
            (this._subscribe = (e) => {
              e && e.definitions.subscribe(this._onChangeActivePageDefinitions)
            }),
            (this._unsubscribe = (e) => {
              e &&
                e.definitions.unsubscribe(this._onChangeActivePageDefinitions)
            }),
            (this._getActiveTabSettingsName = () => {
              const { source: e } = this.props
              return e instanceof v.Series
                ? 'properties_dialog.active_tab.chart'
                : e instanceof C.LineDataSource
                  ? 'properties_dialog.active_tab.drawing'
                  : (0, f.isStudy)(e)
                    ? 'properties_dialog.active_tab.study'
                    : ''
            }),
            (this._handleSelectPage = (e) => {
              const { activePageId: t } = this.state,
                i = this._getActionPageById(t),
                s = this._getActionPageById(e),
                a = this._getActiveTabSettingsName()
              t !== e &&
                (this._unsubscribe(i),
                a && r().setValue(a, e),
                this._subscribe(s),
                this.setState({ activePageId: e, tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize(),
                    this._focusActivePageFirstTextInput()
                }))
            }),
            (this._handleScroll = () => {
              d.globalCloseDelegate.fire()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this._closePopupDialog()
            }),
            (this._closePopupDialog = () => {
              window.lineToolPropertiesToolbar &&
                window.lineToolPropertiesToolbar.refresh(),
                this.props.onClose()
            })
          const { pages: t } = this.props
          let i
          if (this._getActionPageById(this.props.activePageId))
            i = (0, n.ensureDefined)(this.props.activePageId)
          else {
            const e = r().getValue(this._getActiveTabSettingsName(), ''),
              s = this._getActionPageById(e)
            i = s ? s.id : t[0].id
          }
          ;(this.state = {
            activePageId: i,
            tableKey: Date.now(),
            isRenaming: !1,
          }),
            window.lineToolPropertiesToolbar &&
              window.lineToolPropertiesToolbar.hide()
        }
        componentDidMount() {
          const { activePageId: e } = this.state,
            t = this._getActionPageById(e)
          this._focusActivePageFirstTextInput(), this._subscribe(t)
        }
        componentWillUnmount() {
          const { activePageId: e } = this.props,
            t = this._getActionPageById(e)
          clearTimeout(this._timeout), this._unsubscribe(t)
        }
        render() {
          const { onCancel: e, source: t } = this.props,
            { activePageId: i, isRenaming: a } = this.state,
            n =
              t.properties().title?.value() ||
              t.title(g.TitleDisplayTarget.StatusLine),
            o = s.createElement(w.Title, {
              isRenaming: a,
              onChangeMode: this._handleChangeMode,
              setTitle: this._setTitle,
              defaultTitle: n,
              canBeRenamed: (0, b.isLineTool)(t) && !I.enabled('widget'),
            })
          return s.createElement(u.AdaptiveConfirmDialog, {
            dataName: (0, f.isStudy)(t)
              ? 'indicator-properties-dialog'
              : 'source-properties-editor',
            dataDialogName: n,
            title: o,
            isOpened: !0,
            onSubmit: this._handleSubmit,
            onCancel: e,
            onClickOutside: this._handleSubmit,
            onClose: this._closePopupDialog,
            footerLeftRenderer: this._renderFooterLeft,
            render: this._renderChildren(i),
            submitOnEnterKey: !1,
            showCloseIcon: !a,
          })
        }
        _renderChildren(e) {
          return ({ requestResize: t }) => {
            this._requestResize = t
            const { pages: i, source: a } = this.props,
              n = i.filter((e) => e.visible.value()),
              o = n.find((t) => t.id === e) ?? n[0],
              l = (0, f.isStudy)(a)
                ? 'indicator-properties-dialog-tabs'
                : 'source-properties-editor-tabs',
              r = n.map(({ title: e, id: t }) => ({
                label: e,
                id: t,
                dataId: `${l}-${t}`,
              }))
            return s.createElement(
              s.Fragment,
              null,
              s.createElement(T.DialogTabs, {
                className: E.tabs,
                id: l,
                activeTab: o.id,
                onChange: this._handleSelectPage,
                tabs: r,
              }),
              s.createElement(
                p.TouchScrollContainer,
                { className: E.scrollable, onScroll: this._handleScroll },
                s.createElement(h.PropertiesEditorTab, {
                  page: o,
                  pageRef: this._activePageRef,
                  tableKey: this.state.tableKey,
                }),
              ),
            )
          }
        }
        _focusActivePageFirstTextInput() {
          if (!o.CheckMobile.any() && this._activePageRef.current) {
            const e = this._activePageRef.current.querySelector(
              'input[type=text],textarea',
            )
            e &&
              (this._timeout = setTimeout(() => {
                e.focus()
              }, 0))
          }
        }
      }
      var k = i(29280),
        B = i(87896)
      class z extends k.DialogRenderer {
        constructor(e) {
          super(),
            (this._timeout = null),
            (this._handleClose = () => {
              this._rootInstance?.unmount(),
                this._setVisibility(!1),
                this._onClose && this._onClose(),
                this._subscription.unsubscribe(
                  this,
                  this._handleCollectionChanged,
                )
            }),
            (this._handleSubmit = () => {
              const e = this._source
              ;(0, b.isLineTool)(e) &&
                e.hasAlert().value() &&
                setTimeout(() => {
                  e.areLocalAndServerAlertsMismatch() && e.synchronizeAlert(!0)
                })
            }),
            (this._handleCancel = () => {
              this._model.undoToCheckpoint(this._checkpoint)
            }),
            (this._propertyPages = e.propertyPages),
            (this._model = e.model),
            (this._activePageId = e.activePageId),
            (this._onClose = e.onClose),
            (this._source = e.source),
            (this._checkpoint = this._ensureCheckpoint(e.undoCheckPoint)),
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
        show(e) {
          this.isVisible() ||
            ((this._rootInstance = (0, B.createReactRoot)(
              s.createElement(P, {
                source: this._source,
                onSubmit: this._handleSubmit,
                onClose: this._handleClose,
                onCancel: this._handleCancel,
                pages: this._propertyPages,
                model: this._model,
                activePageId: this._activePageId,
                shouldReturnFocus: e?.shouldReturnFocus,
              }),
              this._container,
            )),
            this._setVisibility(!0),
            a.emit('drawings_settings_dialog', {
              objectType: 'drawing',
              scriptTitle: this._source.title(g.TitleDisplayTarget.StatusLine),
            }))
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
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
      }
    },
    68495: (e, t, i) => {
      i.d(t, { Title: () => m })
      var s = i(50959),
        a = i(97754),
        n = i(31261),
        o = i(9745),
        l = i(14729),
        r = i(68335),
        c = i(51768),
        u = i(48040),
        d = i(95327)
      function m(e) {
        const {
            isRenaming: t,
            onChangeMode: i,
            setTitle: m,
            defaultTitle: h,
            canBeRenamed: p,
          } = e,
          g = (0, s.useRef)(null),
          [b, f] = (0, s.useState)(h),
          [v, C] = (0, s.useState)(h)
        return (
          (0, s.useEffect)(() => {
            t &&
              g.current &&
              (g.current.focus(), g.current.setSelectionRange(0, b.length))
          }, [t]),
          s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'div',
              { className: a(d.titleWrap, t && d.hideText) },
              s.createElement('span', { className: d.ellipsis }, ' ', v),
              p &&
                s.createElement(
                  s.Fragment,
                  null,
                  s.createElement(o.Icon, {
                    className: a(d.editIcon),
                    icon: u,
                    onClick: () => {
                      ;(0, c.trackEvent)('GUI', 'Rename', 'Drawing settings'),
                        f(v),
                        i(!0)
                    },
                    'data-name': 'edit',
                    'data-role': 'button',
                  }),
                  s.createElement('div', {
                    className: a(d.empty, !t && d.hideEmpty),
                  }),
                ),
            ),
            p &&
              s.createElement(
                'div',
                { className: a(!t && d.hideInput), 'data-disable-drag': !0 },
                s.createElement(n.InputControl, {
                  value: b,
                  onChange: (e) => {
                    f(e.currentTarget.value)
                  },
                  onBlur: _,
                  reference: g,
                  onClick: l.preventDefault,
                  onKeyDown: (e) => {
                    27 === (0, r.hashFromEvent)(e) &&
                      (e.preventDefault(), f(h), i(!1))
                    13 === (0, r.hashFromEvent)(e) && (e.preventDefault(), _())
                  },
                  'data-disable-drag': !0,
                  stretch: !0,
                }),
              ),
          )
        )
        function _() {
          '' !== b && (m(b), C(b)), i(!1)
        }
      }
    },
    66512: (e, t, i) => {
      i.r(t), i.d(t, { SourcesPropertiesEditorRenderer: () => f })
      var s = i(50959),
        a = i(29280),
        n = i(87896),
        o = i(11542),
        l = i(86656),
        r = i(50182),
        c = i(48531),
        u = i(37289),
        d = i(68495),
        m = i(56570),
        h = i(38546),
        p = i(95747)
      const g = o.t(null, void 0, i(8954))
      function b(e) {
        const {
            propertyPages: t,
            onSubmit: i,
            onCancel: a,
            onClose: n,
            title: o,
            activeTabId: b,
            sources: f,
            undoModel: v,
            renamable: C,
          } = e,
          _ = b && t.filter((e) => e.id === b).length > 0 ? b : t[0].id,
          x = v.model().lineToolsGroupModel().groupForLineTool(f[0]),
          S = !!(
            C &&
            x &&
            o &&
            f.every(
              (e) =>
                x?.id ===
                v.model().lineToolsGroupModel().groupForLineTool(e)?.id,
            )
          ),
          [T, y] = (0, s.useState)(_),
          [w, I] = (0, s.useState)(!1),
          [E, A] = (0, s.useState)(o || g),
          P = (0, s.useMemo)(
            () =>
              t.map(({ title: e, id: t }) => ({
                label: e,
                id: t,
                dataId: `sources-properties-editor-tabs-${t}`,
              })),
            [t],
          )
        const k = s.createElement(d.Title, {
          isRenaming: w,
          onChangeMode: (e) => {
            I(e)
          },
          setTitle: (e) => {
            x && (x.setName(e), A(e))
          },
          defaultTitle: E,
          canBeRenamed: S && !m.enabled('widget'),
        })
        return s.createElement(r.AdaptiveConfirmDialog, {
          dataName: 'sources-properties-editor',
          dataDialogName: E,
          title: k,
          isOpened: !0,
          onSubmit: i,
          onCancel: a,
          onClickOutside: n,
          onClose: n,
          footerLeftRenderer: () =>
            s.createElement(c.FooterMenu, { sources: f, chartUndoModel: v }),
          render: () => {
            const e = t.find((e) => e.id === T)
            return s.createElement(
              s.Fragment,
              null,
              s.createElement(h.DialogTabs, {
                className: p.tabs,
                id: 'sources-properties-editor-tabs',
                activeTab: T,
                onChange: y,
                tabs: P,
              }),
              s.createElement(
                l.TouchScrollContainer,
                null,
                s.createElement(u.PropertiesEditorTab, {
                  page: e,
                  tableKey: T,
                }),
              ),
            )
          },
          submitOnEnterKey: !1,
          showCloseIcon: !w,
        })
      }
      class f extends a.DialogRenderer {
        constructor(e) {
          super(),
            (this._dataSourceChangedPromise = null),
            (this._submitHandler = () => {
              Promise.resolve().then(() => {
                this._sources.map((e) => {
                  e.areLocalAndServerAlertsMismatch() && e.synchronizeAlert(!0)
                })
              }),
                this._close()
            }),
            (this._cancelHandler = () => {
              this._undoModel.undoToCheckpoint(this._undoCheckpoint)
            }),
            (this._closeHandler = () => {
              this._close()
            }),
            (this._dataSourceCollectionChangedHandler = () => {
              null === this._dataSourceChangedPromise &&
                (this._dataSourceChangedPromise = Promise.resolve().then(() => {
                  const e = this._undoModel.model()
                  this._sources.find(
                    (t) => null === e.dataSourceForId(t.id()),
                  ) && this._close(),
                    (this._dataSourceChangedPromise = null)
                }))
            }),
            (this._sources = e.sources),
            (this._propertyPages = e.propertyPages),
            (this._undoModel = e.undoModel),
            (this._title = e.title),
            (this._activeTabId = e.activeTabId),
            (this._renamable = e.renamable),
            (this._undoCheckpoint = this._undoModel.createUndoCheckpoint()),
            this._undoModel
              .model()
              .dataSourceCollectionChanged()
              .subscribe(this, this._dataSourceCollectionChangedHandler)
        }
        destroy() {
          this._close()
        }
        show() {
          this._isVisible() || (this._mount(), this._setVisibility(!0))
        }
        hide() {
          this._isVisible() && (this._unmount(), this._setVisibility(!1))
        }
        _mount() {
          this._rootInstance = (0, n.createReactRoot)(
            s.createElement(b, {
              propertyPages: this._propertyPages,
              sources: this._sources,
              undoModel: this._undoModel,
              onSubmit: this._submitHandler,
              onCancel: this._cancelHandler,
              onClose: this._closeHandler,
              title: this._title,
              activeTabId: this._activeTabId,
              renamable: this._renamable,
            }),
            this._container,
          )
        }
        _unmount() {
          this._rootInstance?.unmount()
        }
        _isVisible() {
          return this.visible().value()
        }
        _close() {
          this.hide(),
            this._undoModel
              .model()
              .dataSourceCollectionChanged()
              .unsubscribe(this, this._dataSourceCollectionChangedHandler)
        }
      }
    },
    86720: (e, t, i) => {
      i.d(t, { UnderlineButtonTabs: () => U })
      var s,
        a = i(50959),
        n = i(97754),
        o = i.n(n),
        l = i(11542),
        r = i(95854),
        c = i(38528),
        u = i(47201),
        d = i(7953),
        m = i(36966),
        h = i(26597)
      !((e) => {
        ;(e.XSmall = 'xsmall'),
          (e.Small = 'small'),
          (e.Medium = 'medium'),
          (e.Large = 'large'),
          (e.XLarge = 'xlarge')
      })(s || (s = {}))
      const p = (0, a.createContext)({
        size: 'small',
        overflowBehaviour: void 0,
      })
      var g = i(17946),
        b = i(56406)
      function f(e) {
        const {
          size: t = 'xsmall',
          active: i,
          fake: s,
          enableActiveStateStyles: a,
          anchor: o = !1,
          hideFocusOutline: l = !1,
          equalTabSize: r,
          className: c,
          overflowBehaviour: u,
        } = e
        return n(
          b['underline-tab'],
          b[`size-${t}`],
          i && b.selected,
          !a && b['disable-active-state-styles'],
          l && b['disable-focus-outline'],
          s && b.fake,
          o && b['enable-cursor-pointer'],
          r && b[`margin-${t}`],
          'collapse' === u && b.collapse,
          c,
        )
      }
      const v = (0, a.forwardRef)((e, t) => {
        const { size: i, overflowBehaviour: s } = (0, a.useContext)(p),
          n = (0, a.useContext)(g.CustomBehaviourContext),
          {
            active: l,
            fake: r,
            className: c,
            enableActiveStateStyles: u = n.enableActiveStateStyles,
            hideFocusOutline: d = !1,
            equalTabSize: m,
            children: h,
            ...v
          } = e
        return a.createElement(
          'button',
          {
            ...v,
            ref: t,
            className: f({
              size: i,
              active: l,
              fake: r,
              enableActiveStateStyles: u,
              hideFocusOutline: d,
              equalTabSize: m,
              className: c,
              overflowBehaviour: s,
            }),
          },
          m && 'string' == typeof h
            ? a.createElement(
                'span',
                {
                  className: o()(
                    b['ellipsis-children'],
                    'apply-overflow-tooltip',
                  ),
                },
                h,
              )
            : h,
        )
      })
      v.displayName = 'UnderlineTabsBaseButton'
      const C = (0, a.forwardRef)((e, t) => {
        const {
            item: i,
            highlighted: s,
            handleItemRef: n,
            onClick: o,
            'aria-disabled': l,
            ...r
          } = e,
          c = (0, a.useCallback)(() => {
            o && o(i)
          }, [o, i]),
          u = (0, a.useCallback)(
            (e) => {
              n && n(i, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [i, n, t],
          )
        return a.createElement(
          v,
          { ...r, id: i.id, onClick: c, ref: u },
          i.label,
        )
      })
      C.displayName = 'UnderlineButtonTab'
      var _ = i(50151),
        x = i(16396),
        S = i(4523),
        T = i(9745),
        y = i(47531),
        w = i(2948),
        I = i(63509),
        E = i(68874),
        A = i(32498)
      function P(e) {
        switch (e) {
          case 'xsmall':
            return y
          case 'small':
            return w
          case 'medium':
          case 'large':
            return I
          case 'xlarge':
            return E
        }
      }
      function k(e) {
        const { size: t, isDropped: i = !1 } = e
        return a.createElement(T.Icon, {
          icon: P(t),
          className: n(A['arrow-icon'], A[`size-${t}`], i && A.dropped),
        })
      }
      var B = i(33636)
      const z = 4,
        N = 4
      function R(e) {
        const {
            size: t,
            disabled: i,
            isOpened: s,
            enableActiveStateStyles: n,
            hideFocusOutline: o,
            fake: l,
            items: r,
            buttonContent: u,
            buttonRef: d,
            isAnchorTabs: m,
            isHighlighted: h,
            onButtonClick: p,
            onItemClick: g,
            onClose: b,
          } = e,
          f = (0, a.useRef)(null),
          C = (0, c.useMergedRefs)([d, f]),
          T = ((e, t) => {
            const i = (0, a.useRef)(M)
            return (
              (0, a.useEffect)(() => {
                const e = getComputedStyle((0, _.ensureNotNull)(t.current))
                i.current = {
                  xsmall: D(e, 'xsmall'),
                  small: D(e, 'small'),
                  medium: D(e, 'medium'),
                  large: D(e, 'large'),
                  xlarge: D(e, 'xlarge'),
                }
              }, [t]),
              (0, a.useCallback)(() => {
                const s = (0, _.ensureNotNull)(
                    t.current,
                  ).getBoundingClientRect(),
                  a = i.current[e]
                return {
                  x: s.left,
                  y: s.top + s.height + a + z,
                  indentFromWindow: { top: N, bottom: N, left: N, right: N },
                }
              }, [t, e])
            )
          })(t, f)
        return a.createElement(S.PopupMenuDisclosureView, {
          buttonRef: f,
          listboxTabIndex: -1,
          isOpened: s,
          onClose: b,
          listboxAria: { 'aria-hidden': !0 },
          popupPosition: T,
          button: a.createElement(
            v,
            {
              'aria-hidden': !0,
              disabled: i,
              active: s,
              onClick: p,
              ref: C,
              tabIndex: -1,
              enableActiveStateStyles: n,
              hideFocusOutline: o,
              fake: l,
            },
            u,
            a.createElement(k, { size: t, isDropped: s }),
          ),
          popupChildren: r.map((e) =>
            a.createElement(x.PopupMenuItem, {
              key: e.id,
              className: m ? B['link-item'] : void 0,
              onClick: g,
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
      function D(e, t) {
        return Number.parseInt(
          e.getPropertyValue(`--ui-lib-underline-tabs-tab-margin-bottom-${t}`),
          10,
        )
      }
      const M = { xsmall: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
      var F = i(75774),
        Y = i(86781),
        H = i(86240),
        L = i(98163)
      function X(e) {
        const { size: t, overflowBehaviour: i, className: s } = e
        return n(
          L['scroll-wrap'],
          L[`size-${t}`],
          'scroll' === i && L['enable-scroll'],
          s,
        )
      }
      function j() {
        const [e, t] = (0, a.useState)(!1)
        return (
          (0, a.useEffect)(() => {
            t(F.mobiletouch)
          }, []),
          e
        )
      }
      var O = i(90484),
        W = i(63273),
        K = i(50368),
        V = i.n(K)
      const q = 100
      function J(e) {
        const { disabled: t, translateX: i, transitionDuration: s } = e,
          o = e.scale / 100
        return a.createElement(
          'div',
          {
            className: n(V().underline, t && V().disabled),
            style: {
              transform: `translateX(${i}px) scaleX(${o})`,
              transitionDuration: `${s}ms`,
            },
          },
          a.createElement('div', {
            className: V().corner,
            style: { transform: `scaleX(${1 / o})` },
          }),
          a.createElement('div', {
            className: V().center,
            style: { transform: `scaleX(${1 - 30 / e.scale})` },
          }),
          a.createElement('div', {
            className: V().corner,
            style: { transform: `scaleX(${1 / o})` },
          }),
        )
      }
      function U(e) {
        const {
            id: t,
            items: s,
            activationType: n,
            orientation: g,
            disabled: b,
            moreButtonContent: f = l.t(null, void 0, i(37117)),
            size: v = 'small',
            onActivate: _,
            isActive: x,
            className: S,
            style: T,
            overflowBehaviour: y,
            enableActiveStateStyles: w,
            tablistLabelId: I,
            tablistLabel: E,
            'data-name': A = 'underline-tabs-buttons',
            stretchTabs: P,
            equalTabSize: k,
            defaultKeyboardFocus: B,
            stopPropagationIfKeyboardActionHandled: z,
            keyboardNavigationLoop: N,
            focusableItemAttributes: D,
          } = e,
          M = j(),
          F = ((e) => {
            const t = (0, Y.useSafeMatchMedia)(
                H['media-mf-phone-landscape'],
                !0,
              ),
              i = j()
            return e ?? (i || !t ? 'scroll' : 'collapse')
          })(y),
          K = (0, a.useRef)(!1),
          V = (0, a.useCallback)((e) => e.id, []),
          U = 'none' === F && P,
          $ = 'none' === F && k,
          Z = w ?? !M,
          {
            visibleItems: G,
            hiddenItems: Q,
            containerRefCallback: ee,
            innerContainerRefCallback: te,
            moreButtonRef: ie,
            setItemRef: se,
          } = (0, r.useCollapsible)(s, V, x),
          ae = 'collapse' === F ? G : s,
          ne = 'collapse' === F ? Q : [],
          oe = (0, a.useCallback)((e) => ne.includes(e), [ne]),
          le = (0, a.useRef)(new Map()),
          {
            isOpened: re,
            open: ce,
            close: ue,
            onButtonClick: de,
          } = (0, d.useDisclosure)({ id: t, disabled: b }),
          me = ((e = 'xsmall') => {
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
          })(v),
          {
            tabsBindings: he,
            tablistBinding: pe,
            scrollWrapBinding: ge,
            onActivate: be,
            onHighlight: fe,
            isHighlighted: ve,
          } = (0, m.useTabs)({
            id: t,
            items: [...ae, ...ne],
            activationType: n,
            orientation: g,
            disabled: b,
            tablistLabelId: I,
            tablistLabel: E,
            onActivate: _,
            isActive: x,
            isCollapsed: oe,
            isRtl: W.isRtl,
            itemsRefs: le,
            isDisclosureOpened: re,
            defaultKeyboardFocus: B,
            stopPropagationIfKeyboardActionHandled: z,
            keyboardNavigationLoop: N,
            focusableItemAttributes: D,
            scrollIntoViewOptions: { additionalScroll: me },
          }),
          Ce = s.find(x),
          _e = ne.find(ve),
          xe = (0, a.useCallback)(() => {
            Ce && fe(Ce)
          }, [fe, Ce]),
          Se = (0, a.useCallback)(
            (e) => he.find((t) => t.id === e.id) ?? {},
            [he],
          ),
          Te = (0, a.useCallback)(() => {
            ue(), xe(), (K.current = !0)
          }, [ue, xe]),
          ye = (0, a.useCallback)(() => {
            _e && (be(_e), fe(_e, 200))
          }, [be, fe, _e])
        ;(ge.ref = (0, c.useMergedRefs)([ge.ref, ee])),
          (pe.ref = (0, c.useMergedRefs)([pe.ref, te])),
          (pe.onKeyDown = (0, u.createSafeMulticastEventHandler)(
            (0, h.useKeyboardEventHandler)([
              (0, h.useKeyboardClose)(re, Te),
              (0, h.useKeyboardActionHandler)(
                [13, 32],
                ye,
                (0, a.useCallback)(() => Boolean(_e), [_e]),
              ),
            ]),
            pe.onKeyDown,
          ))
        const we = (0, a.useCallback)(
            (e) => {
              ;(K.current = !0), de(e)
            },
            [K, de],
          ),
          Ie = (0, a.useCallback)(
            (e) => {
              e && be(e)
            },
            [be],
          )
        ;(0, a.useEffect)(() => {
          K.current ? (K.current = !1) : (_e && !re && ce(), !_e && re && ue())
        }, [_e, re, ce, ue])
        const Ee = ((e, t, i = []) => {
          const [s, n] = (0, a.useState)(),
            o = (0, a.useRef)(),
            l = (0, a.useRef)(),
            r = (e) => {
              const t = e.parentElement ?? void 0
              if (void 0 === t) return
              const i = void 0 === l.current || l.current === e ? 0 : q
              l.current = e
              const { left: s, right: a, width: o } = e.getBoundingClientRect(),
                { left: r, right: c } = t.getBoundingClientRect(),
                u = (0, W.isRtl)() ? a - c : s - r
              n({ translateX: u, scale: o, transitionDuration: i })
            }
          return (
            (0, a.useEffect)(() => {
              const e = (0, O.default)((e) => {
                const t = e[0].target
                void 0 !== t && r(t)
              }, 50)
              o.current = new ResizeObserver(e)
            }, []),
            (0, a.useEffect)(() => {
              if (void 0 === t) return
              const i = e.get(t)
              return void 0 !== i
                ? (r(i), o.current?.observe(i), () => o.current?.disconnect())
                : void 0
            }, i),
            s
          )
        })(le.current, Ce ?? _e, [Ce ?? _e, ae, v, U, F])
        return a.createElement(
          p.Provider,
          { value: { size: v, overflowBehaviour: F } },
          a.createElement(
            'div',
            {
              ...ge,
              className: X({ size: v, overflowBehaviour: F, className: S }),
              style: T,
              'data-name': A,
            },
            a.createElement(
              'div',
              {
                ...pe,
                className: o()(L['underline-tabs'], {
                  [L['make-grid-column']]: U || $,
                  [L['stretch-tabs']]: U,
                  [L['equal-tab-size']]: $,
                }),
              },
              ae.map((e) =>
                a.createElement(C, {
                  ...Se(e),
                  key: e.id,
                  item: e,
                  onClick: be,
                  enableActiveStateStyles: Z,
                  hideFocusOutline: M,
                  ref: se(V(e)),
                  ...(e.dataId && { 'data-id': e.dataId }),
                  equalTabSize: $,
                }),
              ),
              ne.map((e) =>
                a.createElement(C, {
                  ...Se(e),
                  ref: se(V(e)),
                  key: e.id,
                  item: e,
                  fake: !0,
                }),
              ),
              'collapse' === F &&
                a.createElement(R, {
                  size: v,
                  disabled: b,
                  isOpened: re,
                  items: ne,
                  buttonContent: f,
                  buttonRef: ie,
                  isHighlighted: ve,
                  onButtonClick: we,
                  onItemClick: Ie,
                  onClose: ue,
                  enableActiveStateStyles: Z,
                  hideFocusOutline: M,
                  fake: 0 === ne.length,
                }),
              Ee
                ? a.createElement(J, { ...Ee, disabled: b })
                : a.createElement('div', null),
            ),
          ),
        )
      }
      var $ = i(38952)
      function Z(e) {
        return a.createElement('a', { ...(0, $.renameRef)(e) })
      }
      ;(0, a.forwardRef)((e, t) => {
        const { size: i, overflowBehaviour: s } = (0, a.useContext)(p),
          n = (0, a.useContext)(g.CustomBehaviourContext),
          {
            item: o,
            highlighted: l,
            handleItemRef: r,
            onClick: c,
            active: u,
            fake: d,
            className: m,
            enableActiveStateStyles: h = n.enableActiveStateStyles,
            hideFocusOutline: b = !1,
            disabled: v,
            'aria-disabled': C,
            ..._
          } = e,
          x = (0, a.useCallback)(
            (e) => {
              C ? e.preventDefault() : c && c(o)
            },
            [c, C, o],
          ),
          S = (0, a.useCallback)(
            (e) => {
              r && r(o, e),
                t && 'object' == typeof t
                  ? (t.current = e)
                  : 'function' == typeof t && t(e)
            },
            [o, r, t],
          ),
          T = o.renderComponent ?? Z
        return a.createElement(
          T,
          {
            ..._,
            id: o.id,
            'aria-disabled': C,
            onClick: x,
            reference: S,
            href: o.href,
            rel: o.rel,
            target: o.target,
            className: f({
              size: i,
              active: u,
              fake: d,
              enableActiveStateStyles: h,
              anchor: !0,
              hideFocusOutline: b,
              className: m,
              overflowBehaviour: s,
            }),
          },
          o.label,
        )
      }).displayName = 'UnderlineAnchorTab'
    },
    47531: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="m4.67 7.38.66-.76L9 9.84l3.67-3.22.66.76L9 11.16 4.67 7.38Z"/></svg>'
    },
    63509: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.57 7.85 9 12.62l5.43-4.77-1.32-1.5L9 9.95l-4.11-3.6-1.32 1.5Z"/></svg>'
    },
    48040: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M16.73 6.56a2.5 2.5 0 0 1 3.54 0l1.17 1.17a2.5 2.5 0 0 1 0 3.54l-.59.58-9 9-1 1-.14.15H6v-4.7l.15-.15 1-1 9-9 .58-.59Zm2.83.7a1.5 1.5 0 0 0-2.12 0l-.23.24 3.29 3.3.23-.24a1.5 1.5 0 0 0 0-2.12l-1.17-1.17Zm.23 4.24L16.5 8.2l-8.3 8.3 3.3 3.3 8.3-8.3Zm-9 9L7.5 17.2l-.5.5V21h3.3l.5-.5Z"/></svg>'
    },
    68874: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m14 18.41-6.7-6.7 1.4-1.42 5.3 5.3 5.3-5.3 1.4 1.41-6.7 6.71Z"/></svg>'
    },
  },
])
