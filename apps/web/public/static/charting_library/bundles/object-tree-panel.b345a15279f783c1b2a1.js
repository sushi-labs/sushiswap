;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5031],
  {
    22813: (e) => {
      e.exports = {
        title: 'title-uNZ8yW1y',
        withoutIcon: 'withoutIcon-uNZ8yW1y',
        buttons: 'buttons-uNZ8yW1y',
        button: 'button-uNZ8yW1y',
        disabled: 'disabled-uNZ8yW1y',
        spacing: 'spacing-uNZ8yW1y',
        toolbar: 'toolbar-uNZ8yW1y',
      }
    },
    87769: (e) => {
      e.exports = {
        wrap: 'wrap-C8ln3wvp',
        dialog: 'dialog-C8ln3wvp',
        offset: 'offset-C8ln3wvp',
        title: 'title-C8ln3wvp',
        main: 'main-C8ln3wvp',
        disabled: 'disabled-C8ln3wvp',
        icon: 'icon-C8ln3wvp',
        pathIcon: 'pathIcon-C8ln3wvp',
        syncIconWrap: 'syncIconWrap-C8ln3wvp',
        syncIcon: 'syncIcon-C8ln3wvp',
        rightButtons: 'rightButtons-C8ln3wvp',
        hover: 'hover-C8ln3wvp',
        expandHandle: 'expandHandle-C8ln3wvp',
        button: 'button-C8ln3wvp',
        selected: 'selected-C8ln3wvp',
        childOfSelected: 'childOfSelected-C8ln3wvp',
        renameInput: 'renameInput-C8ln3wvp',
        warn: 'warn-C8ln3wvp',
        visible: 'visible-C8ln3wvp',
      }
    },
    506909: (e) => {
      e.exports = {
        wrap: 'wrap-ukH4sVzT',
        space: 'space-ukH4sVzT',
        tree: 'tree-ukH4sVzT',
      }
    },
    813550: (e, t, n) => {
      n.d(t, { useForceUpdate: () => i })
      var o = n(50959)
      const i = () => {
        const [, e] = (0, o.useReducer)((e) => e + 1, 0)
        return e
      }
    },
    106690: (e, t, n) => {
      n.d(t, { ObjectTreeNodeRendererContext: () => o })
      const o = n(50959).createContext(null)
    },
    420779: (e, t, n) => {
      n.r(t), n.d(t, { Component: () => L, NodeRenderer: () => A })
      var o = n(50959),
        i = n(497754),
        r = n(650151),
        s = n(72571),
        l = n(156963),
        a = n(609838),
        c = n(535842),
        u = n(693838),
        d = n(671641),
        h = n(654936),
        p = n(199663),
        g = n(180185),
        _ = n(106690),
        b = n(800296),
        v = n(297265),
        m = n(888740),
        f = n(380348),
        S = n(206672),
        T = n(582e3),
        C = n(642469),
        y = n(333765),
        w = n(52870),
        I = n(749756),
        k = n(94007),
        M = n(962766),
        j = n(87769)
      function A(e) {
        const { id: t } = e,
          n = (0, o.useContext)(u.ObjectTreeContext),
          { viewModel: i } = (0, r.ensureNotNull)(n),
          s = i.entity(t)
        return null === s ? null : o.createElement(L, { ...e, entity: s })
      }
      const E = { 0: void 0, 1: S, 2: T }
      function L(e) {
        const {
            id: t,
            isOffset: S,
            isDisabled: T,
            isSelected: A,
            isChildOfSelected: L,
            isHovered: N,
            parentId: O,
            entity: D,
            isExpanded: x,
          } = e,
          z = (0, o.useContext)(u.ObjectTreeContext),
          { viewModel: B } = (0, r.ensureNotNull)(z),
          G = (0, o.useContext)(_.ObjectTreeNodeRendererContext),
          { size: F } = (0, o.useContext)(c.SizeContext),
          [R, P] = (0, o.useState)(!1),
          V = (0, o.useRef)(null),
          [H, W] = (0, o.useState)(D.title().value()),
          [U, K] = (0, o.useState)(D.getIcon()),
          [Z, Y] = (0, o.useState)(D.isLocked()),
          [q, $] = (0, o.useState)(D.isVisible()),
          [Q, J] = (0, o.useState)(D.isActualInterval()),
          [X, ee] = (0, o.useState)(D.getDrawingSyncState()),
          [te, ne] = (0, o.useState)(!1),
          oe = (0, v.useWatchedValueReadonly)({
            watchedValue: B.getChartLayout(),
          }),
          [ie, re] = (0, o.useState)(!1),
          se = (0, o.useRef)(null)
        ;(0, o.useEffect)(() => {
          const e = {}
          D.onLockChanged().subscribe(e, () => Y(D.isLocked())),
            D.onVisibilityChanged().subscribe(e, () => $(D.isVisible()))
          const t = D.title().spawn()
          t.subscribe((e) => W(e)),
            D.onIsActualIntervalChange().subscribe(e, () =>
              J(D.isActualInterval()),
            ),
            D.onSyncStateChanged().subscribe(e, () =>
              ee(D.getDrawingSyncState()),
            )
          const n = D.onIconChanged ? D.onIconChanged() : void 0
          return (
            n && n.subscribe(e, () => K(D.getIcon())),
            () => {
              D.onIsActualIntervalChange().unsubscribeAll(e),
                D.onLockChanged().unsubscribeAll(e),
                D.onVisibilityChanged().unsubscribeAll(e),
                D.onSyncStateChanged().unsubscribeAll(e),
                t.destroy(),
                se.current && clearTimeout(se.current),
                n && n.unsubscribeAll(e)
            }
          )
        }, [D]),
          (0, o.useEffect)(() => {
            R &&
              V.current &&
              (V.current.focus(), V.current.setSelectionRange(0, H.length))
          }, [R]),
          (0, o.useEffect)(() => {
            const e = {}
            return (
              B.hoveredObjectChanged().subscribe(e, fe),
              () => {
                B.hoveredObjectChanged().unsubscribeAll(e)
              }
            )
          }, [x]),
          (0, o.useEffect)(() => {
            B.setHoveredObject(N ? t : null)
          }, [N]),
          (0, o.useEffect)(() => {
            !A && se.current && (clearTimeout(se.current), (se.current = null)),
              P(!1)
          }, [A])
        const le = {}
        if (O) {
          const e = B.entity(O)
          e && (le['data-parent-name'] = e.title().value()),
            (le['data-type'] = D.hasChildren() ? 'group' : 'data-source')
        }
        const ae = l.enabled('test_show_object_tree_debug')
            ? `<${D.id()}> (${D.zOrder()}) ${D.title()}`
            : D.title().value(),
          ce = null !== X ? E[X] : void 0,
          ue = N || te,
          de = R && A,
          he = !!G && G.isTouch,
          pe = !!G && G.isDialog,
          ge = Q && q ? k : M,
          _e = D.hasChildren()
            ? a.t(null, void 0, n(438207))
            : a.t(null, void 0, n(839781))
        let be = null
        return (
          U &&
            U.type === d.IconType.Svg &&
            (be = o.createElement(s.Icon, {
              icon: U.content || '',
              className: j.icon,
            })),
          o.createElement(
            'span',
            {
              className: i(
                j.wrap,
                T && j.disabled,
                A && j.selected,
                S && j.offset,
                L && j.childOfSelected,
                te && !T && !A && !L && j.hover,
                pe && !T && !A && !L && j.dialog,
              ),
              onMouseDown: (e) => {
                R &&
                  !(0, r.ensureNotNull)(V.current).contains(e.target) &&
                  re(!0)
              },
              onClick:
                1 === F
                  ? ve
                  : (e) => {
                      if (e.defaultPrevented) return
                      if (0 !== (0, g.modifiersFromEvent)(e)) return
                      if (se.current)
                        e.preventDefault(),
                          clearTimeout(se.current),
                          (se.current = null),
                          B.openProperties(D),
                          re(!1)
                      else {
                        const e = B.selection().selected()
                        se.current = setTimeout(() => {
                          ;(se.current = null),
                            A &&
                              !ie &&
                              1 === e.length &&
                              B.rename(D, () => P(!0)),
                            re(!1)
                        }, 500)
                      }
                    },
              onContextMenu: he ? void 0 : ve,
            },
            !de &&
              o.createElement(
                o.Fragment,
                null,
                be,
                ce &&
                  (0, f.isMultipleLayout)(oe) &&
                  o.createElement(
                    'div',
                    { className: j.syncIconWrap },
                    o.createElement(s.Icon, {
                      icon: ce,
                      className: j.syncIcon,
                    }),
                  ),
                o.createElement(
                  'span',
                  {
                    className: i(
                      j.title,
                      B.isMain(D) && j.main,
                      (!D.isVisible() || !Q) && j.disabled,
                    ),
                    ...le,
                  },
                  ae,
                ),
                o.createElement(
                  'span',
                  { className: j.rightButtons },
                  D.canBeLocked() &&
                    o.createElement(b.ListItemButton, {
                      title: Z ? m.unlockTitle : m.lockTitle,
                      icon: Z ? w : I,
                      className: i(
                        j.button,
                        (ue || Z) && j.visible,
                        'apply-common-tooltip',
                      ),
                      onClick: (e) => {
                        if (e.defaultPrevented) return
                        e.preventDefault(), B.setIsLocked(t, !D.isLocked())
                      },
                      'data-role': 'button',
                      'data-name': 'lock',
                      'data-active': Z,
                    }),
                  o.createElement(b.ListItemButton, {
                    icon: ge,
                    className: i(
                      j.button,
                      !Q && j.warn,
                      (ue || !q || !Q) && j.visible,
                      'apply-common-tooltip',
                    ),
                    onClick: Q
                      ? (e) => {
                          if (e.defaultPrevented) return
                          e.preventDefault(), B.setIsVisible(t, !D.isVisible())
                        }
                      : (e) => {
                          if (e.defaultPrevented) return
                          e.preventDefault(),
                            B.openProperties(D, C.TabNames.visibility)
                        },
                    title: (() => {
                      if (!Q) return _e
                      return q ? m.hideTitle : m.showTitle
                    })(),
                    'data-role': 'button',
                    'data-name': 'hide',
                    'data-active': !q,
                  }),
                  D.canBeRemoved() &&
                    o.createElement(b.ListItemButton, {
                      title: m.removeTitle,
                      icon: y,
                      className: i(
                        j.button,
                        (he || ue) && j.visible,
                        'apply-common-tooltip',
                      ),
                      onClick: (e) => {
                        if (e.defaultPrevented) return
                        e.preventDefault(), e.stopPropagation(), B.remove(t)
                      },
                      'data-role': 'button',
                      'data-name': 'remove',
                    }),
                ),
              ),
            de &&
              o.createElement(h.InputControl, {
                value: H,
                onChange: (e) => {
                  W(e.currentTarget.value)
                },
                onClick: p.preventDefault,
                className: j.renameInput,
                onKeyDown: (e) => {
                  27 === (0, g.hashFromEvent)(e)
                    ? (e.preventDefault(), W(D.title().value()), P(!1))
                    : 13 === (0, g.hashFromEvent)(e) &&
                      (e.preventDefault(), me())
                },
                reference: (e) => {
                  V.current = e
                },
                onBlur: me,
                onDragStart: (e) => {
                  e.preventDefault(), e.stopPropagation()
                },
                draggable: !0,
                stretch: !0,
              }),
          )
        )
        function ve(e) {
          e.defaultPrevented ||
            R ||
            !D.fullyConstructed() ||
            (e.preventDefault(),
            e.persist(),
            B.openContextMenu(D, () => P(!0), e))
        }
        function me() {
          '' !== H && D.setName(H), W(D.title().value()), P(!1)
        }
        function fe(e) {
          if (D.hasChildren() && !x) {
            const t = null !== e && D.childrenIds().has(e)
            ne(t)
          } else ne(t === e)
        }
      }
    },
    993321: (e, t, n) => {
      n.r(t), n.d(t, { ObjectTree: () => P })
      var o = n(50959),
        i = n(336349),
        r = n(972535),
        s = n(180185),
        l = n(650151),
        a = n(497754),
        c = n(609838),
        u = n(72571),
        d = n(192063),
        h = n(53431),
        p = n(585938),
        g = n(693838),
        _ = n(332913),
        b = n(622614),
        v = n(892932),
        m = n(636296),
        f = n(274059),
        S = n(80465),
        T = n(22813)
      n(32133)
      function C(e) {
        const { hideTitle: t } = e,
          { viewModel: i } = (0, l.ensureNotNull)(
            (0, o.useContext)(g.ObjectTreeContext),
          ),
          r = (0, p.useForceUpdate)(),
          s = i.selection()
        ;(0, o.useEffect)(() => {
          const e = {}
          return (
            i.onChange().subscribe(e, () => r()),
            () => {
              i.onChange().unsubscribeAll(e)
            }
          )
        }, [i]),
          (0, o.useEffect)(() => {
            const e = {}
            return (
              s.onChange().subscribe(e, () => r()),
              () => {
                s.onChange().unsubscribeAll(e)
              }
            )
          }, [s]),
          (0, o.useEffect)(() => {
            ;(0, v.updateTabIndexes)()
          }, [])
        const C = !i.canSelectionBeUnmerged(),
          y = i.isSelectionCopiable(),
          w = i.isSelectionCloneable(),
          I = !y && !w,
          k = i.canSelectionBeGrouped(),
          M = !1
        return o.createElement(
          b.Toolbar,
          { orientation: 'horizontal', className: T.toolbar },
          !t &&
            o.createElement(
              'div',
              { className: a(T.title, T.withoutIcon) },
              c.t(null, void 0, n(831095)),
              M,
            ),
          o.createElement(
            'div',
            { className: T.buttons },
            o.createElement(_.ToolbarIconButton, {
              className: a(T.button, !k && T.disabled),
              icon: S,
              onClick: () => {
                i.createGroupFromSelection()
              },
              isDisabled: !k,
              tooltip: c.t(null, void 0, n(391073)),
              'data-name': 'group-button',
            }),
            o.createElement(
              h.ToolbarMenuButton,
              {
                className: a(T.button, I && T.disabled),
                isDisabled: I,
                content: o.createElement(u.Icon, { icon: m }),
                tooltip: c.t(null, void 0, n(598129)),
                arrow: !1,
                isShowTooltip: !0,
                'data-name': 'copy-clone-button',
              },
              y &&
                o.createElement(d.PopupMenuItem, {
                  'data-name': 'copy',
                  label: c.t(null, void 0, n(35216)),
                  onClick: () => {
                    i.copySelection()
                  },
                }),
              w &&
                o.createElement(d.PopupMenuItem, {
                  'data-name': 'clone',
                  label: c.t(null, void 0, n(552977)),
                  onClick: () => {
                    i.cloneSelection()
                  },
                }),
            ),
            o.createElement(
              h.ToolbarMenuButton,
              {
                className: a(T.button, C && T.disabled),
                isDisabled: C,
                content: o.createElement(u.Icon, { icon: f }),
                tooltip: c.t(null, void 0, n(745828)),
                arrow: !1,
                isShowTooltip: !0,
                'data-name': 'move-to-button',
              },
              o.createElement(d.PopupMenuItem, {
                'data-name': 'new-pane-above',
                label: c.t(null, void 0, n(640887)),
                onClick: () => {
                  i.unmergeSelectionUp()
                },
              }),
              o.createElement(d.PopupMenuItem, {
                'data-name': 'new-pane-below',
                label: c.t(null, void 0, n(796712)),
                onClick: () => {
                  i.unmergeSelectionDown()
                },
              }),
            ),
            t &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement('div', { className: T.spacing }),
                o.createElement(_.ToolbarIconButton, {
                  className: T.button,
                  icon: manageDrawingsIcon,
                  tooltip: c.t(null, void 0, n(72357)),
                  'data-name': 'manage-drawings-button',
                  onClick: j,
                }),
              ),
          ),
        )
        function j() {
          M
        }
      }
      var y = n(317447),
        w = n(254773),
        I = n(849392),
        k = n(451539),
        M = n(471505),
        j = n(289789),
        A = n(129881)
      function E(e) {
        return (0, w.eventChannel)((t) => {
          const n = {}
          return (
            e.onChange().subscribe(n, () => t((0, I.resetTree)())),
            e
              .onGroupCreated()
              .subscribe(n, (e) => t((0, I.setIsExpanded)(e, !0))),
            e
              .selection()
              .onChange()
              .subscribe(n, (e) => t((0, I.setSelectedIds)(e))),
            () => {
              e.onChange().unsubscribeAll(n),
                e.selection().onChange().unsubscribeAll(n),
                e.onGroupCreated().unsubscribeAll(n)
            }
          )
        }, w.buffers.expanding())
      }
      function* L() {
        for (;;)
          yield (0, i.take)([M.SELECT_NEXT, M.SELECT_PREVIOUS]),
            (0, j.trackObjectTreeEvent)('Select', 'Arrow')
      }
      function* N() {
        for (;;) {
          const { mode: e } = yield (0, i.take)(M.SET_IS_SELECTED)
          1 === e && (0, j.trackObjectTreeEvent)('Multi select', 'Ctrl'),
            2 === e && (0, j.trackObjectTreeEvent)('Multi select', 'Shift')
        }
      }
      function* O(e) {
        for (;;) {
          yield (0, i.take)(M.DROP_SELECTION)
          const { node: t, dropType: n } = (0, A.dropTargetSelector)(
            yield (0, i.select)(),
          )
          if (t) {
            const o = (0, A.selectedNodesSelector)(yield (0, i.select)()),
              r = o.map((t) => (0, l.ensureNotNull)(e.entity(t.id)))
            let s = 'Drag'
            1 === t.level && 'inside' !== n && o.some((e) => 2 === e.level)
              ? (s = 'From the group')
              : (2 !== t.level && 'inside' !== n) ||
                  !o.some((e) => 1 === e.level)
                ? 1 === o.length &&
                  o[0].parentId !== t.parentId &&
                  (s = 'Existing pane')
                : (s = 'To the group'),
              (0, j.trackObjectTreeEvent)(s, (0, j.getGaAction)(r))
          }
        }
      }
      function* D(e) {
        yield (0, i.fork)(L), yield (0, i.fork)(N), yield (0, i.fork)(O, e)
      }
      function* x(e) {
        yield (0, i.fork)(D, e)
        const t = yield (0, i.call)(E, e)
        k.logger.logNormal('Opened object tree data source channel')
        try {
          for (;;) {
            const e = yield (0, i.take)(t)
            yield (0, i.put)(e)
          }
        } finally {
          k.logger.logNormal('Closed object tree data source channel'),
            t.close()
        }
      }
      var z = n(106690),
        B = n(199663),
        G = n(330344),
        F = n(506909)
      const R = r.mobiletouch ? 'touch' : 'native'
      function P(e) {
        const {
            viewModel: t,
            showHeader: n = !0,
            nodeRenderer: l,
            isDialog: a = !1,
            hideHeaderTitle: c = !1,
          } = e,
          u = (0, o.useRef)(null),
          d = ((e) => {
            const [t, n] = (0, o.useState)(e.getChartId()),
              i = (0, o.useRef)(t)
            return (
              (i.current = t),
              (0, o.useEffect)(() => {
                return (
                  e.onChange().subscribe(null, t),
                  () => {
                    e.onChange().unsubscribe(null, t)
                  }
                )
                function t() {
                  const t = e.getChartId()
                  i.current !== t && n(t)
                }
              }, []),
              t
            )
          })(t),
          [h, p] = (0, G.useDimensions)(),
          [_, b] = (0, o.useState)(null),
          v = (0, o.useMemo)(() => ({ isTouch: r.touch, isDialog: a }), [a])
        return o.createElement(
          z.ObjectTreeNodeRendererContext.Provider,
          { value: v },
          o.createElement(
            g.ObjectTreeContext.Provider,
            { value: { viewModel: t } },
            o.createElement(
              'div',
              {
                className: F.wrap,
                onContextMenu: B.preventDefaultForContextMenu,
              },
              n && o.createElement(C, { hideTitle: c }),
              o.createElement(
                'div',
                {
                  className: F.space,
                  onClick: (e) => {
                    if (e.defaultPrevented) return
                    if (!(e.target instanceof Element) || null === u.current)
                      return
                    e.target === u.current && t.selection().set([])
                  },
                  ref: h,
                },
                null !== p &&
                  o.createElement(y.Tree, {
                    key: d,
                    height: p.height,
                    width: p.width,
                    canBeAddedToSelection: (e) => {
                      const n = t.entity(e)
                      return t.selection().canBeAddedToSelection(n)
                    },
                    nodeRenderer: l,
                    initState: () => {
                      const { nodes: e, selection: n } = t.getState()
                      return { selectedIds: n, nodes: e }
                    },
                    canMove: (e, n, o) => t.isSelectionDropable(n.id, o),
                    drag: R,
                    rowHeight: V,
                    onSelect: (e) => {
                      const n = e
                        .map((e) => t.entity(e))
                        .filter((e) => null !== e)
                      t.selection().set(n)
                    },
                    onDrop: (e) => {
                      e.preventDefault()
                      const {
                        detail: { target: n, type: o },
                      } = e
                      t.insertSelection(n, o)
                    },
                    scrollToId: _,
                    saga: function* () {
                      yield (0, i.fork)(x, t)
                    },
                    onKeyboardSelect: (e) => {
                      b({ id: e })
                    },
                    outerRef: (e) => {
                      u.current = e
                    },
                    onKeyDown: (e) => {
                      if (13 === (0, s.hashFromEvent)(e)) {
                        e.preventDefault()
                        const n = t.selection().selected(),
                          o = n.length > 0 ? t.entity(n[0]) : void 0
                        o && t.openProperties(o)
                      }
                    },
                    autofocus: a,
                  }),
              ),
            ),
          ),
        )
      }
      function V(e, t) {
        switch (t.type) {
          case 'node':
            return 38
          case 'separator':
            return 13
        }
      }
    },
    888740: (e, t, n) => {
      n.d(t, {
        createGroupTitle: () => i,
        hideTitle: () => a,
        lockTitle: () => l,
        removeTitle: () => u,
        renameTitle: () => r,
        showTitle: () => c,
        unlockTitle: () => s,
      })
      var o = n(609838)
      const i = o.t(null, void 0, n(391073)),
        r = o.t(null, void 0, n(435038)),
        s = o.t(null, void 0, n(715101)),
        l = o.t(null, void 0, n(642284)),
        a = o.t(null, void 0, n(831971)),
        c = o.t(null, void 0, n(581428)),
        u = o.t(null, void 0, n(734596))
    },
    289789: (e, t, n) => {
      n.d(t, { getGaAction: () => r, trackObjectTreeEvent: () => i })
      var o = n(32133)
      function i(e, t) {
        ;(0, o.trackEvent)('Object Tree', e, t)
      }
      function r(e) {
        return e.length > 1 ? 'Multi select' : e[0].gaLabel()
      }
    },
    715489: (e, t, n) => {
      n.r(t), n.d(t, { ObjectTree: () => ge, logger: () => le })
      var o = n(650151),
        i = n(466052)
      var r = n(989348)
      function s(e, t) {
        return `${e}:${t}`
      }
      function l(e) {
        const t = e.split(':')
        return { persistentId: t[0], instanceId: t[1] }
      }
      var a = n(372605)
      class c {
        constructor(e) {
          ;(this._onChange = new i.Delegate()),
            (this._recalculate = () => {
              const e = this._groupModel
                  .groups()
                  .map((e) => s(e.id, e.instanceId())),
                t = this._selectionApi.allSources()
              ;(this._selected = this._selected.filter(
                (n) => e.includes(n) || t.includes(n),
              )),
                this._onChange.fire(this._selected)
            }),
            (this._model = e),
            (this._selectionApi = new r.SelectionApi(this._model)),
            (this._groupModel = this._model.lineToolsGroupModel()),
            (this._selected = this._getSelectedIds()),
            this._selectionApi.onChanged().subscribe(this, () => {
              ;(this._selected = this._getSelectedIds()),
                this._onChange.fire(this._selected)
            }),
            this._groupModel.onChanged().subscribe(this, this._recalculate)
        }
        destroy() {
          this._selectionApi.onChanged().unsubscribeAll(this),
            this._groupModel.onChanged().unsubscribeAll(this)
        }
        set(e) {
          const t = []
          let n = e.map((e) => e.id())
          for (const o of e)
            if (o.hasChildren()) {
              const e = o.childrenIds()
              t.push(...Array.from(e.values())),
                (n = n.filter((t) => !e.has(t)))
            } else t.push(o.id())
          this._selectionApi.set(t.map((e) => l(e).persistentId)),
            (this._selected = n),
            this._onChange.fire(this._selected)
        }
        canBeAddedToSelection(e) {
          return null !== e && e.canBeAddedToSelection()
        }
        onChange() {
          return this._onChange
        }
        selected() {
          return this._selected
        }
        _getSelectedIds() {
          return this._selectionApi
            .allSources()
            .map((e) => this._model.dataSourceForId(e))
            .filter(a.notNull)
            .filter((e) => e.showInObjectTree())
            .map((e) => s(e.id(), e.instanceId()))
        }
      }
      class u {
        constructor(e, t) {
          ;(this._controller = e),
            (this._facade = t),
            (this._groupModel = e.model().lineToolsGroupModel())
        }
        buildTree() {
          const e = {}
          for (const t of this._controller.model().panes()) {
            const n = t
              .sourcesByGroup()
              .all()
              .filter((e) => e.showInObjectTree())
            e[t.id()] = d(t.id(), 0)
            for (const n of this._groupModel.groups()) {
              const i = s(n.id, n.instanceId()),
                r = (0, o.ensureNotNull)(this._facade.getObjectById(i))
              if (r.pane() === t) {
                const o = [...n.lineTools()]
                  .sort((e, t) => (e.zorder() > t.zorder() ? -1 : 1))
                  .map((e) => s(e.id(), e.instanceId()))
                ;(e[r.id()] = d(r.id(), 1, t.id(), o)),
                  e[t.id()].children.push(r.id())
                for (const t of o) e[t] = d(t, 2, r.id())
              }
            }
            for (const o of n) {
              const n = s(o.id(), o.instanceId())
              e[n] || ((e[n] = d(n, 1, t.id())), e[t.id()].children.push(n))
            }
            e[t.id()].children.sort((e, t) => {
              const n = (0, o.ensureNotNull)(this._facade.getObjectById(e)),
                i = (0, o.ensureNotNull)(this._facade.getObjectById(t))
              return (
                (0, o.ensureNotNull)(i.zOrder()) -
                (0, o.ensureNotNull)(n.zOrder())
              )
            })
          }
          return this._facade.invalidateCache(new Set(Object.keys(e))), e
        }
      }
      function d(e, t, n, o = []) {
        return { id: e, level: t, parentId: n, children: o }
      }
      var h = n(609838),
        p = n(664902),
        g = n(156963),
        _ = n(601227),
        b = n(650802),
        v = n(919577),
        m = n(593194),
        f = n(561604),
        S = n(582675),
        T = n(648067),
        C = n(721356),
        y = n(367187),
        w = n(683471),
        I = n(671641),
        k = n(562051),
        M = n(607295),
        j = n(728824),
        A = n(57674)
      const E = new p.TranslatedString(
          'show {title}',
          h.t(null, void 0, n(787358)),
        ),
        L = new p.TranslatedString(
          'hide {title}',
          h.t(null, void 0, n(470301)),
        ),
        N = new p.TranslatedString(
          'lock {title}',
          h.t(null, void 0, n(850193)),
        ),
        O = new p.TranslatedString(
          'unlock {title}',
          h.t(null, void 0, n(192421)),
        ),
        D = new p.TranslatedString(
          'change {sourceTitle} title to {newSourceTitle}',
          h.t(null, void 0, n(328065)),
        ),
        x = new p.TranslatedString(
          'insert source(s) after',
          h.t(null, void 0, n(8343)),
        ),
        z = !1
      function B(e, t) {
        return t.every(
          (t) => !(t.pane() !== e && !t.allowsMovingbetweenPanes()),
        )
      }
      function G(e) {
        return e instanceof S.DataSource && e.showInObjectTree()
          ? s(e.id(), e.instanceId())
          : null
      }
      function F(e) {
        return new p.TranslatedString(
          e.name(),
          e.title(k.TitleDisplayTarget.DataWindow),
        )
      }
      const R = new i.Delegate(),
        P = g.enabled('saveload_separate_drawings_storage')
      function V(e) {
        return 0 === e ? 0 : 1 === e ? 1 : 2
      }
      class H {
        constructor(e, t) {
          ;(this._syncStateChanged = new i.Delegate()),
            (this._updateSyncState = () => {
              this._syncStateChanged.fire(
                (0, o.ensureNotNull)(this.getDrawingSyncState()),
              )
            }),
            (this._undoModel = e),
            (this._dataSource = t),
            (0, v.isLineTool)(t)
              ? (t.linkKey().subscribe(this._updateSyncState),
                t.sharingMode().subscribe(this._updateSyncState),
                (this._title = (0, T.createWVFromGetterAndSubscription)(
                  () => t.properties().title.value() || t.translatedType(),
                  t.properties().title,
                )))
              : (0, C.isSymbolSource)(t)
                ? (this._title = (0, T.createWVFromGetterAndSubscriptions)(
                    () =>
                      t.symbolTitle(
                        k.TitleDisplayTarget.DataWindow,
                        void 0,
                        void 0,
                        (0, _.onWidget)() ? 'exchange' : 'listed_exchange',
                      ),
                    [t.symbolChanged(), t.symbolResolved()],
                  ))
                : (0, m.isStudy)(t)
                  ? (this._title = (0, T.createWVFromGetterAndSubscriptions)(
                      () => t.title(k.TitleDisplayTarget.DataWindow),
                      [
                        t.properties().childs().inputs,
                        this._undoModel
                          .model()
                          .properties()
                          .childs()
                          .paneProperties.childs()
                          .legendProperties.childs().showStudyArguments,
                        t.onParentSourcesChanges(),
                      ],
                    ))
                  : (this._title = new b.WatchedValue(
                      t.title(k.TitleDisplayTarget.DataWindow),
                    ).spawn())
          const n = this._undoModel.lineBeingCreated()
          null !== n &&
            n === t &&
            n.isSynchronizable() &&
            w.isToolCreatingNow.subscribe(this._updateSyncState)
        }
        destroy() {
          ;(0, v.isLineTool)(this._dataSource) &&
            (this._dataSource.linkKey().unsubscribe(this._updateSyncState),
            this._dataSource.sharingMode().unsubscribe(this._updateSyncState)),
            this._title.destroy(),
            w.isToolCreatingNow.unsubscribe(this._updateSyncState)
        }
        id() {
          return s(this._dataSource.id(), this._dataSource.instanceId())
        }
        title() {
          return this._title
        }
        gaLabel() {
          return (0, m.isStudy)(this._dataSource)
            ? 'Study'
            : (0, v.isLineTool)(this._dataSource)
              ? 'Drawing'
              : 'Symbol'
        }
        canBeLocked() {
          return (
            (0, v.isLineTool)(this._dataSource) &&
            this._dataSource.userEditEnabled()
          )
        }
        canBeRemoved() {
          return (
            this._undoModel.mainSeries() !== this._dataSource &&
            this._dataSource.isUserDeletable()
          )
        }
        canBeHidden() {
          return this._dataSource.canBeHidden()
        }
        canBeRenamed() {
          return (0, v.isLineTool)(this._dataSource)
        }
        fullyConstructed() {
          return this._undoModel.lineBeingCreated() !== this._dataSource
        }
        isVisible() {
          return this._dataSource.properties().visible.value()
        }
        isActualInterval() {
          return (
            (!(0, v.isLineTool)(this._dataSource) &&
              !(0, m.isStudy)(this._dataSource)) ||
            this._dataSource.isActualInterval()
          )
        }
        onIsActualIntervalChange() {
          return (0, v.isLineTool)(this._dataSource) ||
            (0, m.isStudy)(this._dataSource)
            ? this._dataSource.onIsActualIntervalChange()
            : R
        }
        isLocked() {
          return (
            !!(0, v.isLineTool)(this._dataSource) &&
            this._dataSource.properties().frozen.value()
          )
        }
        onVisibilityChanged() {
          return this._dataSource.properties().visible.listeners()
        }
        onLockChanged() {
          return (0, v.isLineTool)(this._dataSource)
            ? this._dataSource.properties().frozen.listeners()
            : R
        }
        getIcon() {
          const e = (0, f.getAllSourcesIcons)(),
            t = this._dataSource.getSourceIcon(),
            n = (0, m.isStudyStrategy)(this._dataSource)
          let o = { type: I.IconType.Svg, content: n ? M : j }
          if (e && t)
            if ('loadSvg' === t.type) {
              const [n, i] = t.svgId.split('.'),
                r = 'linetool' === n ? e.linetool[i] : e.series[Number(i)]
              o = { type: I.IconType.Svg, content: r || j }
            } else
              'svgContent' === t.type &&
                (o = { type: I.IconType.Svg, content: t.content })
          return o
        }
        onIconChanged() {
          if (this._dataSource.onSourceIconChanged)
            return this._dataSource.onSourceIconChanged()
        }
        setVisible(e) {
          const t = (e ? E : L).format({ title: F(this._dataSource) })
          this._undoModel.setProperty(
            this._dataSource.properties().visible,
            e,
            t,
          )
        }
        setLocked(e) {
          if ((0, v.isLineTool)(this._dataSource)) {
            const t = (e ? N : O).format({ title: F(this._dataSource) })
            this._undoModel.setProperty(
              this._dataSource.properties().frozen,
              e,
              t,
            )
          }
        }
        setName(e) {
          if ((0, v.isLineTool)(this._dataSource)) {
            const t = D.format({
              sourceTitle:
                this._dataSource.properties().title.value() ||
                F(this._dataSource),
              newSourceTitle: e,
            })
            this._undoModel.setProperty(
              this._dataSource.properties().title,
              e,
              t,
              z,
            )
          }
        }
        isCopiable() {
          return this._dataSource.copiable()
        }
        isClonable() {
          return this._dataSource.cloneable()
        }
        zOrder() {
          return this._dataSource.zorder()
        }
        remove() {
          this._undoModel.removeSource(this._dataSource, !1)
        }
        canBeAddedToSelection() {
          return this._undoModel
            .selection()
            .canBeAddedToSelection(this._dataSource)
        }
        setAsSelection() {
          this._undoModel.model().selectionMacro((e) => {
            e.clearSelection(), e.addSourceToSelection(this._dataSource)
          })
        }
        addToSelection() {
          this._undoModel.model().selectionMacro((e) => {
            e.addSourceToSelection(this._dataSource)
          })
        }
        addSourcesToArray(e) {
          return e.push(this._dataSource), e
        }
        insertSourcesBeforeThis(e) {
          this._insertSources(e, (e) =>
            this._undoModel.insertBefore(e, this._dataSource),
          )
        }
        insertSourcesAfterThis(e) {
          this._insertSources(e, (e) =>
            this._undoModel.insertAfter(e, this._dataSource),
          )
        }
        childrenIds() {
          return new Set()
        }
        hasChildren() {
          return !1
        }
        pane() {
          return (0, o.ensureNotNull)(
            this._undoModel.model().paneForSource(this._dataSource),
          )
        }
        allowsMovingbetweenPanes() {
          return !(0, v.isLineTool)(this._dataSource)
        }
        canBeAddedToGroup() {
          return (
            (0, v.isLineTool)(this._dataSource) &&
            this._dataSource.boundToSymbol()
          )
        }
        canInsertBeforeThis(e) {
          return this._canInsertBeforeOrAfter(e)
        }
        canInsertAfterThis(e) {
          return this._canInsertBeforeOrAfter(e)
        }
        detachFromParent() {
          if ((0, v.isLineTool)(this._dataSource)) {
            const e = this._undoModel.model(),
              t = this._undoModel.lineToolsGroupController(),
              n = e.lineToolsGroupModel().groupForLineTool(this._dataSource)
            null !== n && t.excludeLineToolFromGroup(n, this._dataSource)
          }
        }
        canBeSyncedInLayout() {
          return (
            (0, v.isLineTool)(this._dataSource) &&
            this._dataSource.isSynchronizable()
          )
        }
        onSyncStateChanged() {
          return this._syncStateChanged
        }
        setDrawingSyncState(e) {
          if (!this.canBeSyncedInLayout() || !this.fullyConstructed()) return
          const t = this._dataSource
          switch (e) {
            case 0:
              if (null === t.linkKey().value()) return
              this._undoModel.unlinkLines([t])
              break
            case 1:
              if (null !== t.linkKey().value()) return
              this._undoModel.shareLineTools([t], 1)
          }
        }
        getDrawingSyncState() {
          return this.canBeSyncedInLayout()
            ? P
              ? this.fullyConstructed()
                ? V(this._dataSource.sharingMode().value())
                : 0
              : this.fullyConstructed() &&
                  null !== this._dataSource.linkKey().value()
                ? 1
                : 0
            : null
        }
        doNotAffectChartInvalidation() {
          return (0, v.isLineTool)(this._dataSource) && z
        }
        _canInsertBeforeOrAfter(e) {
          const t = this._undoModel.model()
          if (!B(this.pane(), e)) return !1
          if ((0, v.isLineTool)(this._dataSource)) {
            if (
              null !==
                t.lineToolsGroupModel().groupForLineTool(this._dataSource) &&
              e.some((e) => !e.canBeAddedToGroup())
            )
              return !1
          }
          return !0
        }
        _insertSources(e, t) {
          const n = this._undoModel.model(),
            i = this._undoModel.lineToolsGroupController()
          this._undoModel.beginUndoMacro(x)
          const r = () => {
              e.forEach((e) => e.detachFromParent())
            },
            s = e.reduce((e, t) => t.addSourcesToArray(e), [])
          if ((0, v.isLineTool)(this._dataSource)) {
            const t = n.lineToolsGroupModel().groupForLineTool(this._dataSource)
            null !== t
              ? ((0, o.assert)(!e.some((e) => e.hasChildren())),
                s.forEach((e) => {
                  ;(0, v.isLineTool)(e) &&
                    (t.containsLineTool(e) || i.addLineToolToGroup(t, e))
                }))
              : r()
          } else r()
          t(s), this._undoModel.endUndoMacro()
        }
      }
      class W {
        constructor(e, t) {
          ;(this._onVisibilityChanged = new i.Delegate()),
            (this._onLockChanged = new i.Delegate()),
            (this._onIsActualIntervalChanged = new i.Delegate()),
            (this._syncStateChanged = new i.Delegate()),
            (this._linkKeyChangedBound = this._linkKeyChanged.bind(this)),
            (this._undoModel = e),
            (this._group = t),
            (this._lineTools = t.lineTools()),
            (this._paneId = (0, o.ensureNotNull)(
              e.model().paneForSource(this._lineTools[0]),
            ).id())
          const n = () => {
            this._lineTools.forEach((e) => {
              e
                .properties()
                .visible.listeners()
                .subscribe(this, () => this._onVisibilityChanged.fire()),
                e
                  .properties()
                  .frozen.listeners()
                  .subscribe(this, () => this._onLockChanged.fire()),
                e
                  .onIsActualIntervalChange()
                  .subscribe(this, () =>
                    this._onIsActualIntervalChanged.fire(),
                  ),
                e.linkKey().subscribe(this._linkKeyChangedBound),
                e.sharingMode().subscribe(this._linkKeyChangedBound)
            })
          }
          this._group.onChanged().subscribe(this, (e) => {
            this._unsubscribeFromAllLineTools(),
              (this._lineTools = this._group.lineTools()),
              n(),
              e.lockedChanged && this._onLockChanged.fire(),
              e.visibilityChanged && this._onVisibilityChanged.fire(),
              e.isActualIntervalChanged &&
                this._onIsActualIntervalChanged.fire()
            const t = this.getDrawingSyncState()
            null !== t && this._syncStateChanged.fire(t)
          }),
            n(),
            (this._lastActualZOrder = this.zOrder()),
            (this._lastIsVisible = this.isVisible()),
            (this._lastIsActualInterval = this.isActualInterval()),
            (this._lastIsLocked = this.isLocked())
        }
        destroy() {
          this._unsubscribeFromAllLineTools(),
            this._group.onChanged().unsubscribeAll(this)
        }
        id() {
          return s(this._group.id, this._group.instanceId())
        }
        title() {
          return this._group.name()
        }
        gaLabel() {
          return 'Group'
        }
        getIcon() {
          return { type: I.IconType.Svg, content: A }
        }
        canBeRemoved() {
          return !0
        }
        canBeHidden() {
          return !0
        }
        canBeLocked() {
          return !0
        }
        canBeRenamed() {
          return !0
        }
        fullyConstructed() {
          return !0
        }
        isVisible() {
          return (
            this._group.lineTools().length > 0 &&
              (this._lastIsVisible = 'Invisible' !== this._group.visibility()),
            this._lastIsVisible
          )
        }
        isActualInterval() {
          return (
            this._group.lineTools().length > 0 &&
              (this._lastIsActualInterval = this._group
                .lineTools()
                .some((e) => e.isActualInterval())),
            this._lastIsActualInterval
          )
        }
        onIsActualIntervalChange() {
          return this._onIsActualIntervalChanged
        }
        isLocked() {
          return (
            this._group.lineTools().length > 0 &&
              (this._lastIsLocked = 'Locked' === this._group.locked()),
            this._lastIsLocked
          )
        }
        onVisibilityChanged() {
          return this._onVisibilityChanged
        }
        onLockChanged() {
          return this._onLockChanged
        }
        setVisible(e) {
          this._undoModel
            .lineToolsGroupController()
            .setGroupVisibility(this._group, e)
        }
        setLocked(e) {
          this._undoModel
            .lineToolsGroupController()
            .setGroupLock(this._group, e)
        }
        setName(e) {
          this._undoModel
            .lineToolsGroupController()
            .setGroupName(this._group, e)
        }
        isCopiable() {
          return !1
        }
        isClonable() {
          return !1
        }
        zOrder() {
          return (
            this._group.lineTools().length > 0 &&
              (this._lastActualZOrder = this._group.lineTools()[0].zorder()),
            this._lastActualZOrder
          )
        }
        remove() {
          this._undoModel.lineToolsGroupController().removeGroup(this._group)
        }
        canBeAddedToSelection() {
          const e = this._undoModel.model()
          return this._lineTools.every((t) =>
            e.selection().canBeAddedToSelection(t),
          )
        }
        setAsSelection() {
          this._undoModel.model().selectionMacro((e) => {
            e.clearSelection(),
              this._lineTools.forEach((t) => e.addSourceToSelection(t))
          })
        }
        addToSelection() {
          this._undoModel.model().selectionMacro((e) => {
            this._lineTools.forEach((t) => e.addSourceToSelection(t))
          })
        }
        addSourcesToArray(e) {
          return e.push(...this._lineTools), e
        }
        detachFromParent() {}
        insertSourcesBeforeThis(e) {
          const t = this._insertBeforeTarget()
          this._insertSources(e, (e) => this._undoModel.insertBefore(e, t))
        }
        insertSourcesAfterThis(e) {
          const t = this._insertAfterTarget()
          this._insertSources(e, (e) => this._undoModel.insertAfter(e, t))
        }
        childrenIds() {
          const e = [...this._lineTools]
          return (
            e.sort((e, t) => t.zorder() - e.zorder()),
            new Set(e.map((e) => s(e.id(), e.instanceId())))
          )
        }
        hasChildren() {
          return !0
        }
        pane() {
          return (0, o.ensureDefined)(
            this._undoModel
              .model()
              .panes()
              .find((e) => e.id() === this._paneId),
          )
        }
        allowsMovingbetweenPanes() {
          return !1
        }
        canBeAddedToGroup() {
          return !1
        }
        canInsertBeforeThis(e) {
          return this._canInsertBeforeOrAfter(e)
        }
        canInsertAfterThis(e) {
          return this._canInsertBeforeOrAfter(e)
        }
        canBeSyncedInLayout() {
          return (
            this._lineTools.length > 0 && this._lineTools[0].isSynchronizable()
          )
        }
        onSyncStateChanged() {
          return this._syncStateChanged
        }
        setDrawingSyncState(e) {
          if (this.canBeSyncedInLayout())
            switch (e) {
              case 0:
                const e = this._lineTools.filter(
                  (e) => null !== e.linkKey().value(),
                )
                e.length > 0 && this._undoModel.unlinkLines(e)
                break
              case 1:
                const t = this._lineTools.filter(
                  (e) => null === e.linkKey().value(),
                )
                t.length > 0 && this._undoModel.shareLineTools(t, 1)
            }
        }
        getDrawingSyncState() {
          var e
          if (!this.canBeSyncedInLayout()) return null
          if (P) {
            const t =
              null === (e = this._lineTools[0]) || void 0 === e
                ? void 0
                : e.sharingMode().value()
            if (void 0 === t) return null
            let n = t
            if (0 !== n)
              for (const e of this._lineTools)
                if (e.sharingMode().value() !== n) {
                  n = 0
                  break
                }
            return V(n)
          }
          return this._lineTools.every((e) => null !== e.linkKey().value())
            ? 1
            : 0
        }
        doNotAffectChartInvalidation() {
          return z
        }
        _linkKeyChanged() {
          this._syncStateChanged.fire(
            (0, o.ensureNotNull)(this.getDrawingSyncState()),
          )
        }
        _canInsertBeforeOrAfter(e) {
          return B(this.pane(), e)
        }
        _insertSources(e, t) {
          this._undoModel.beginUndoMacro(x)
          const n = e.reduce((e, t) => t.addSourcesToArray(e), [])
          e.forEach((e) => e.detachFromParent()),
            t(n),
            this._undoModel.endUndoMacro()
        }
        _insertBeforeTarget() {
          return (0, o.ensureNotNull)(
            this._lineTools.reduce(
              (e, t) => (null === e ? t : e.zorder() < t.zorder() ? e : t),
              null,
            ),
          )
        }
        _insertAfterTarget() {
          return (0, o.ensureNotNull)(
            this._lineTools.reduce(
              (e, t) => (null === e ? t : e.zorder() > t.zorder() ? e : t),
              null,
            ),
          )
        }
        _unsubscribeFromAllLineTools() {
          this._lineTools.forEach((e) => {
            e.properties().visible.listeners().unsubscribeAll(this),
              e.properties().frozen.listeners().unsubscribeAll(this),
              e.onIsActualIntervalChange().unsubscribeAll(this),
              e.linkKey().unsubscribe(this._linkKeyChangedBound),
              e.sharingMode().unsubscribe(this._linkKeyChangedBound)
          })
        }
      }
      class U {
        constructor(e) {
          ;(this._hoveredObjectChanged = new i.Delegate()),
            (this._entitiesCache = new Map()),
            (this._undoModel = e),
            this._undoModel
              .model()
              .hoveredSourceChanged()
              .subscribe(this, this._onModelHoveredSourceChanged)
        }
        destroy() {
          for (const e of this._entitiesCache.values()) null == e || e.destroy()
          this._undoModel
            .model()
            .hoveredSourceChanged()
            .unsubscribe(this, this._onModelHoveredSourceChanged)
        }
        getObjectById(e) {
          if (this._entitiesCache.has(e))
            return (0, o.ensureDefined)(this._entitiesCache.get(e))
          const t = this._createObjectById(e)
          return this._entitiesCache.set(e, t), t
        }
        invalidateCache(e) {
          Array.from(this._entitiesCache.keys()).forEach((t) => {
            var n
            e.has(t) ||
              (null === (n = this._entitiesCache.get(t)) ||
                void 0 === n ||
                n.destroy(),
              this._entitiesCache.delete(t))
          })
        }
        canBeGroupped(e) {
          if (0 === e.length || (1 === e.length && e[0].hasChildren()))
            return !1
          const t = []
          if (
            (e.forEach((e) => e.addSourcesToArray(t)),
            t.some((e) => !(0, v.isLineTool)(e) || !e.boundToSymbol()))
          )
            return !1
          const n = this._undoModel.model(),
            o = t.map((e) => n.paneForSource(e))
          if (new Set(o).size > 1) return !1
          if (!P) return !0
          const i = t.map((e) => e.sharingMode().value())
          return 1 === new Set(i).size
        }
        contextMenuActions(e, t, n) {
          const o = new y.ActionsProvider(e, n),
            i = []
          return (
            t.forEach((e) => e.addSourcesToArray(i)),
            o.contextMenuActionsForSources(i)
          )
        }
        insertBefore(e, t) {
          t.insertSourcesAfterThis(e)
        }
        insertAfter(e, t) {
          t.insertSourcesBeforeThis(e)
        }
        setHoveredObject(e) {
          const t = this._undoModel.model()
          if (null === e) return void t.setHoveredSource(null, null)
          const n = t.dataSourceForId(e)
          null !== n && t.setHoveredSource(n, null)
        }
        hoveredObjectId() {
          return G(this._undoModel.model().hoveredSource())
        }
        hoveredObjectChanged() {
          return this._hoveredObjectChanged
        }
        _onModelHoveredSourceChanged(e) {
          this._hoveredObjectChanged.fire(G(e))
        }
        _createObjectById(e) {
          const t = l(e).persistentId,
            n = this._undoModel.model(),
            o = n.dataSourceForId(t)
          if (null !== o) return new H(this._undoModel, o)
          const i = n.lineToolsGroupModel().groupForId(t)
          return null !== i ? new W(this._undoModel, i) : null
        }
      }
      var K = n(888740),
        Z = (n(247465), n(289789)),
        Y = n(779959),
        q = n(462056),
        $ = n(973602),
        Q = n(180185),
        J = n(6835),
        X = n(397874),
        ee = n(902872),
        te = n(484959),
        ne = n(191730),
        oe = n(133055),
        ie = n(535149),
        re = n(80465),
        se = n(786129)
      const le = (0, J.getLogger)('Platform.GUI.ObjectTree')
      const ae = new p.TranslatedString(
          'move objects',
          h.t(null, void 0, n(340566)),
        ),
        ce = new p.TranslatedString(
          'lock objects',
          h.t(null, void 0, n(168163)),
        ),
        ue = new p.TranslatedString(
          'unlock objects',
          h.t(null, void 0, n(766824)),
        ),
        de = new p.TranslatedString(
          'show objects',
          h.t(null, void 0, n(963549)),
        ),
        he = new p.TranslatedString(
          'hide objects',
          h.t(null, void 0, n(928506)),
        ),
        pe = new p.TranslatedString(
          'remove objects',
          h.t(null, void 0, n(857428)),
        )
      class ge {
        constructor(e) {
          ;(this._nodes = {}),
            (this._onChange = new i.Delegate()),
            (this._onGroupCreated = new i.Delegate()),
            (this._subscriptions = []),
            (this._removeSourcesPromise = null),
            (this._timeout = null),
            (this._objects = []),
            (this._options = {
              general: !0,
              mainSeries: !0,
              mainSeriesTrade: !0,
              esdStudies: !0,
              fundamentals: !0,
              studies: !0,
              lineTools: !0,
              publishedCharts: !0,
              ordersAndPositions: !0,
              alerts: !1,
              chartEvents: !0,
              objectTree: !1,
              gotoLineTool: !0,
            }),
            (this._isContextMenuOpened = new b.WatchedValue(!1)),
            (this._getObjectsToModify = (e) => {
              const t = this.selection().selected()
              return t.find((t) => t === e)
                ? t.map(this._ensuredEntity)
                : [this._ensuredEntity(e)]
            }),
            (this._onActiveChartChanged = () => {
              this._cleanup(), this._init()
            }),
            (this._cleanup = () => {
              null !== this._timeout &&
                (clearTimeout(this._timeout), (this._timeout = null)),
                this._subscriptions.forEach((e) => {
                  e.unsubscribeAll(this)
                }),
                this._selection.destroy(),
                this._chart.unsubscribe(this._onActiveChartChanged),
                null !== this._removeSourcesPromise &&
                  this._removeSourcesPromise.cancel(),
                this._facade.destroy()
            }),
            (this._init = () => {
              const e = this._chart.value()
              e.hasModel() &&
                ((this._controller = e.model()),
                (this._groupController =
                  this._controller.lineToolsGroupController()),
                (this._model = this._controller.model()),
                (this._groupModel = this._model.lineToolsGroupModel()),
                (this._facade = new U(this._controller)),
                (this._subscriptions = [
                  this._model.mainSeries().onStyleChanged(),
                  this._model.mainSeries().dataEvents().symbolResolved(),
                  this._model.mainSeries().onIntervalChanged(),
                  this._model.panesCollectionChanged(),
                  this._model.dataSourceCollectionChanged(),
                  this._groupModel.onChanged(),
                ]),
                this._subscriptions.forEach((e) => {
                  e.subscribe(this, this._update)
                }),
                this._chart.subscribe(this._onActiveChartChanged),
                (this._selection = new c(this._model)),
                this._update())
            }),
            (this._update = () => {
              null === this._timeout &&
                (this._timeout = setTimeout(() => {
                  this._recalculateTree(),
                    this._onChange.fire(),
                    (this._timeout = null)
                }))
            }),
            (this._ensuredEntity = (e) =>
              (0, o.ensureNotNull)(this._getEntityById(e))),
            (this._chart = e),
            this._init()
        }
        destroy() {
          this._cleanup()
        }
        getState() {
          return {
            nodes: Object.values(this._nodes),
            selection: this._selection.selected(),
          }
        }
        getChartId() {
          return this._chart.value().id()
        }
        insertSelection(e, t) {
          const n = this._facade,
            o = this.selection().selected().map(this._ensuredEntity),
            [i, r] = this._normalizeTargetAndDropType(e, t)
          this._controller.withMacro(ae, () => {
            switch (r) {
              case 'before':
                n.insertBefore(o, i)
                break
              case 'after':
                n.insertAfter(o, i)
            }
          }),
            this._update()
        }
        entity(e) {
          return this._facade.getObjectById(e)
        }
        isMain(e) {
          return l(e.id()).persistentId === this._controller.mainSeries().id()
        }
        selection() {
          return this._selection
        }
        setIsLocked(e, t) {
          const n = this._getObjectsToModify(e),
            o = n.every((e) => e.doNotAffectChartInvalidation()),
            i = t ? ce : ue
          this._controller.withMacro(
            i,
            () => {
              for (const e of n) e.setLocked(t)
            },
            o,
          ),
            (0, Z.trackObjectTreeEvent)('Lock', (0, Z.getGaAction)(n))
        }
        setIsVisible(e, t) {
          const n = this._getObjectsToModify(e),
            o = n.every((e) => e.doNotAffectChartInvalidation()),
            i = t ? de : he
          this._controller.withMacro(
            i,
            () => {
              for (const e of n) e.setVisible(t)
            },
            o,
          ),
            (0, Z.trackObjectTreeEvent)('Hide', (0, Z.getGaAction)(n))
        }
        remove(e) {
          const t = () => {
              const e = n.every((e) => e.doNotAffectChartInvalidation())
              this._controller.withMacro(
                pe,
                () => {
                  for (const e of n) e.remove()
                },
                e,
              ),
                (0, Z.trackObjectTreeEvent)('Delete', (0, Z.getGaAction)(n)),
                this._update()
            },
            n = this._getObjectsToModify(e)
          t()
        }
        canSelectionBeGrouped() {
          const e = this._getSelectedEntities()
          return this._facade.canBeGroupped(e)
        }
        createGroupFromSelection() {
          const e = this._groupController.createGroupFromSelection()
          ;(0, Z.trackObjectTreeEvent)('Create Group')
          const t = s(e.id, e.instanceId())
          this.selection().set([this._ensuredEntity(t)]),
            this._onGroupCreated.fire(t),
            this._update()
        }
        isSelectionDropable(e, t) {
          const n = this.selection().selected().map(this._ensuredEntity),
            [o, i] = this._normalizeTargetAndDropType(e, t)
          switch (i) {
            case 'after':
              return o.canInsertAfterThis(n)
            case 'before':
              return o.canInsertBeforeThis(n)
          }
        }
        onChange() {
          return this._onChange
        }
        onGroupCreated() {
          return this._onGroupCreated
        }
        isSelectionCloneable() {
          const e = this._getSelectedEntities()
          return e.length > 0 && e.every((e) => e.isClonable())
        }
        isSelectionCopiable() {
          const e = this._getSelectedEntities()
          return e.length > 0 && e.every((e) => e.isCopiable())
        }
        openProperties(e, t) {
          const n = this._model.dataSourceForId(l(e.id()).persistentId)
          this.selection().selected().length > 1 &&
          this.selection().selected().includes(e.id())
            ? this._chart.value().showSelectedSourcesProperties(t)
            : (this.selection().set([e]),
              null !== n
                ? this._controller.mainSeries() === n
                  ? this._chart
                      .value()
                      .showGeneralChartProperties(void 0, {
                        shouldReturnFocus: !0,
                      })
                  : ((0, v.isLineTool)(n) || (0, m.isStudy)(n)) &&
                    this._chart
                      .value()
                      .showChartPropertiesForSource(n, t, {
                        shouldReturnFocus: !0,
                      })
                : this._chart
                    .value()
                    .showChartPropertiesForSources({
                      sources: this._chart
                        .value()
                        .model()
                        .selection()
                        .lineDataSources(),
                      title: e.title().value(),
                      tabName: t,
                      renamable: !0,
                    }))
        }
        canSelectionBeUnmerged() {
          const e = this._getSelectedEntities()
          return (
            1 === e.length &&
            this.canNodeWithIdBeUnmerged(l(e[0].id()).persistentId)
          )
        }
        canNodeWithIdBeUnmerged(e) {
          const t = this._model.dataSourceForId(e)
          return (
            null !== t &&
            (0, Y.isPriceDataSource)(t) &&
            this._model.isUnmergeAvailableForSource(t)
          )
        }
        unmergeSelectionUp() {
          this._unmergeSelection(0)
        }
        unmergeSelectionDown() {
          this._unmergeSelection(1)
        }
        copySelection() {
          const e = this._getSelectedEntities(),
            t = e.map((e) =>
              (0, o.ensureNotNull)(
                this._model.dataSourceForId(l(e.id()).persistentId),
              ),
            )
          this._chart
            .value()
            .chartWidgetCollection()
            .clipboard.uiRequestCopy(t),
            (0, Z.trackObjectTreeEvent)('Copy', (0, Z.getGaAction)(e))
        }
        cloneSelection() {
          const e = this._getSelectedEntities(),
            t = e.map((e) =>
              (0, o.ensureNotNull)(
                this._model.dataSourceForId(l(e.id()).persistentId),
              ),
            )
          t.every(v.isLineTool) &&
            (this._controller.cloneLineTools([...t], !1),
            (0, Z.trackObjectTreeEvent)('Clone', (0, Z.getGaAction)(e)))
        }
        rename(e, t) {
          const n = this._getObjectsToModify(e.id())
          1 === n.length &&
            n.some((e) => e.canBeRenamed()) &&
            (t(), (0, Z.trackObjectTreeEvent)('Rename', (0, Z.getGaAction)(n)))
        }
        async openContextMenu(e, t, n) {
          var o
          this._objects = this._getObjectsToModify(e.id())
          const i = this._facade.canBeGroupped(this._objects)
          let r
          if (this._objects.some((e) => e.hasChildren()))
            r = this._getActionsForGroupItem(e, t, i)
          else {
            const e = await this._facade.contextMenuActions(
              this._chart.value(),
              this._objects,
              this._options,
            )
            if (
              ((r = Array.from(e).filter(
                (e, t, n) =>
                  'separator' !== e.type ||
                  !n[t + 1] ||
                  'separator' !== n[t + 1].type,
              )),
              1 === this._objects.length && this._objects[0].canBeRenamed())
            ) {
              const e = r.findIndex((e) => 'Copy' === e.id)
              r.splice(-1 === e ? r.length : e + 1, 0, this._getRenameAction(t))
            }
            if (i) {
              const e = r.findIndex((e) => 'Clone' === e.id)
              r.splice(-1 === e ? 0 : e, 0, this._getGroupAction())
            }
          }
          if (r.length > 0) {
            this._chart.value().updateActions()
            const t = l(e.id()).persistentId,
              i = this._model.dataSourceForId(t),
              s = i instanceof se.Series,
              a = 0 !== e.childrenIds().size
            let c
            ;(c = s
              ? {
                  menuName: 'ObjectTreeContextMenu',
                  detail: { type: 'series', id: i.instanceId() },
                }
              : (0, v.isLineTool)(i)
                ? {
                    menuName: 'ObjectTreeContextMenu',
                    detail: {
                      type: 'shape',
                      id:
                        null !== (o = null == i ? void 0 : i.id()) &&
                        void 0 !== o
                          ? o
                          : null,
                    },
                  }
                : a
                  ? {
                      menuName: 'ObjectTreeContextMenu',
                      detail: { type: 'groupOfShapes', id: t || null },
                    }
                  : {
                      menuName: 'ObjectTreeContextMenu',
                      detail: {
                        type: 'study',
                        id: (null == i ? void 0 : i.id()) || null,
                      },
                    }),
              q.ContextMenuManager.showMenu(
                r,
                n,
                {
                  takeFocus: !0,
                  returnFocus: !0,
                },
                c,
                () => {
                  this._isContextMenuOpened.setValue(!1)
                },
              ).then(() => {
                this._isContextMenuOpened.setValue(!0)
              })
          }
        }
        setHoveredObject(e) {
          this._facade.setHoveredObject(e)
        }
        hoveredObjectChanged() {
          return this._facade.hoveredObjectChanged()
        }
        getNextNodeIdAfterRemove(e) {
          var t
          const { nodes: n } = this.getState(),
            i = l(e).persistentId,
            r = n.find((t) => t.id === e),
            s = this.entity(e)
          if (!(r && r.parentId && s && s.canBeRemoved())) return null
          if (
            (null === (t = s.pane().mainDataSource()) || void 0 === t
              ? void 0
              : t.id()) === i &&
            !this.canNodeWithIdBeUnmerged(i)
          ) {
            const e = n.filter((e) => 0 === e.level).map((e) => e.id),
              t = this._takeNextOrPrevElement(e, r.parentId)
            return (0, o.ensureDefined)(n.find((e) => e.id === t)).children[0]
          }
          const a = (0, o.ensureDefined)(
            n.find((e) => e.id === r.parentId),
          ).children
          return 1 === a.length
            ? this.getNextNodeIdAfterRemove(r.parentId)
            : this._takeNextOrPrevElement(a, e)
        }
        isContextMenuOpened() {
          return this._isContextMenuOpened.readonly()
        }
        getChartLayout() {
          return this._chart.value().chartWidgetCollection().layout
        }
        _takeNextOrPrevElement(e, t) {
          const n = e.indexOf(t)
          return e[n === e.length - 1 ? n - 1 : n + 1]
        }
        _getGroupAction() {
          return new $.Action({
            actionId: 'ObjectsTree.CreateGroup',
            options: {
              label: K.createGroupTitle,
              icon: re,
              onExecute: () => {
                this.createGroupFromSelection()
              },
            },
          })
        }
        _getRenameAction(e) {
          return new $.Action({
            actionId: 'ObjectsTree.RenameItem',
            options: {
              label: K.renameTitle,
              icon: oe,
              onExecute: () => {
                e(),
                  (0, Z.trackObjectTreeEvent)(
                    'Context menu rename',
                    (0, Z.getGaAction)(this._objects),
                  )
              },
            },
          })
        }
        _getActionsForGroupItem(e, t, n) {
          const o = []
          this._objects.forEach((e) => e.addSourcesToArray(o))
          const i = []
          1 === this._objects.length &&
            i.unshift(this._getRenameAction(t), new $.Separator()),
            n && i.unshift(this._getGroupAction(), new $.Separator())
          const r = (0, y.createSyncDrawingActions)(
            this._chart.value(),
            o.filter(v.isLineTool),
          )
          r.length && (r.shift(), r.push(new $.Separator()), i.push(...r))
          const s = this._chart.value().actions().format.getState()
          return (
            i.push(
              new $.Action({
                actionId: 'ObjectsTree.ToggleItemLocked',
                options: {
                  label: e.isLocked() ? K.unlockTitle : K.lockTitle,
                  icon: e.isLocked() ? X : ee,
                  onExecute: () => this.setIsLocked(e.id(), !e.isLocked()),
                },
              }),
              new $.Action({
                actionId: 'ObjectsTree.ToggleItemVisibility',
                options: {
                  label: e.isVisible() ? K.hideTitle : K.showTitle,
                  icon: e.isVisible() ? te : ne,
                  onExecute: () => this.setIsVisible(e.id(), !e.isVisible()),
                },
              }),
              new $.Action({
                actionId: 'ObjectsTree.RemoveItem',
                options: {
                  label: K.removeTitle,
                  icon: ie,
                  onExecute: () => this.remove(e.id()),
                  hotkeyHash: Q.isMacKeyboard ? 8 : 46,
                },
              }),
              new $.Separator(),
              new $.Action({
                actionId: s.actionId,
                options: {
                  label: s.label,
                  icon: s.icon,
                  onExecute: () => this.openProperties(e),
                },
              }),
            ),
            i
          )
        }
        _unmergeSelection(e) {
          const t = this._getSelectedEntities()
          if (1 !== t.length) throw new Error('Only one object can be unmerged')
          const n = t[0],
            i = (0, o.ensureNotNull)(
              this._model.dataSourceForId(l(n.id()).persistentId),
            )
          if (!(0, Y.isPriceDataSource)(i))
            throw new Error('Entity is not IPriceDataSource')
          ;(0 === e
            ? this._controller.unmergeSourceUp
            : this._controller.unmergeSourceDown
          ).call(this._controller, i)
          const r = 0 === e ? 'New pane above' : 'New pane below'
          ;(0, Z.trackObjectTreeEvent)(r, (0, Z.getGaAction)([n]))
        }
        _recalculateTree() {
          const e = new u(this._controller, this._facade)
          this._nodes = e.buildTree()
        }
        _normalizeTargetAndDropType(e, t) {
          let n = this._ensuredEntity(e)
          return (
            'inside' === t &&
              ((t = 'before'),
              (n = (0, o.ensureNotNull)(
                this.entity([...n.childrenIds()].shift() || ''),
              ))),
            [n, t]
          )
        }
        _getSelectedEntities() {
          const { selected: e, removed: t } = this._selection.selected().reduce(
            (e, t) => {
              const n = this._getEntityById(t)
              return n ? (e.selected.push(n), e) : (e.removed.push(t), e)
            },
            { selected: [], removed: [] },
          )
          return (
            t.length &&
              le.logWarn(
                `Detected dangling sources in selection. They will be ignored: ${JSON.stringify(t)}`,
              ),
            e
          )
        }
        _getEntityById(e) {
          return this._facade.getObjectById(e)
        }
      }
    },
    330344: (e, t, n) => {
      n.d(t, { useDimensions: () => r })
      var o = n(50959),
        i = n(664332)
      function r(e) {
        const [t, n] = (0, o.useState)(null),
          r = (0, o.useCallback)(
            ([e]) => {
              const o = e.target.getBoundingClientRect()
              ;(o.width === (null == t ? void 0 : t.width) &&
                o.height === t.height) ||
                n(o)
            },
            [t],
          )
        return [(0, i.useResizeObserver)({ callback: r, ref: e }), t]
      }
    },
    585938: (e, t, n) => {
      n.d(t, { useForceUpdate: () => o.useForceUpdate })
      var o = n(813550)
    },
    179807: (e, t, n) => {
      n.d(t, {
        focusFirstMenuItem: () => c,
        handleAccessibleMenuFocus: () => l,
        handleAccessibleMenuKeyDown: () => a,
        queryMenuElements: () => h,
      })
      var o = n(892932),
        i = n(27164),
        r = n(180185)
      const s = [37, 39, 38, 40]
      function l(e, t) {
        e.target &&
          o.PLATFORM_ACCESSIBILITY_ENABLED &&
          e.relatedTarget === t.current &&
          c(e.target)
      }
      function a(e) {
        var t
        if (!o.PLATFORM_ACCESSIBILITY_ENABLED) return
        if (e.defaultPrevented) return
        const n = (0, r.hashFromEvent)(e)
        if (!s.includes(n)) return
        const l = document.activeElement
        if (!(document.activeElement instanceof HTMLElement)) return
        const a = h(e.currentTarget).sort(o.navigationOrderComparator)
        if (0 === a.length) return
        const c =
          document.activeElement.closest('[data-role="menuitem"]') ||
          (null === (t = document.activeElement.parentElement) || void 0 === t
            ? void 0
            : t.querySelector('[data-role="menuitem"]'))
        if (!(c instanceof HTMLElement)) return
        const g = a.indexOf(c)
        if (-1 === g) return
        const _ = p(c),
          b = _.indexOf(document.activeElement),
          v = -1 !== b,
          m = (e) => {
            l && (0, i.becomeSecondaryElement)(l),
              (0, i.becomeMainElement)(e),
              e.focus()
          }
        switch ((0, o.mapKeyCodeToDirection)(n)) {
          case 'inlinePrev':
            if (!_.length) return
            e.preventDefault(),
              m(0 === b ? a[g] : v ? u(_, b, -1) : _[_.length - 1])
            break
          case 'inlineNext':
            if (!_.length) return
            e.preventDefault(),
              b === _.length - 1 ? m(a[g]) : m(v ? u(_, b, 1) : _[0])
            break
          case 'blockPrev': {
            e.preventDefault()
            const t = u(a, g, -1)
            if (v) {
              const e = d(t, b)
              m(e || t)
              break
            }
            m(t)
            break
          }
          case 'blockNext': {
            e.preventDefault()
            const t = u(a, g, 1)
            if (v) {
              const e = d(t, b)
              m(e || t)
              break
            }
            m(t)
          }
        }
      }
      function c(e) {
        const [t] = h(e)
        t && ((0, i.becomeMainElement)(t), t.focus())
      }
      function u(e, t, n) {
        return e[(t + e.length + n) % e.length]
      }
      function d(e, t) {
        const n = p(e)
        return n.length ? n[(t + n.length) % n.length] : null
      }
      function h(e) {
        return Array.from(
          e.querySelectorAll(
            '[data-role="menuitem"]:not([disabled]):not([aria-disabled])',
          ),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
      function p(e) {
        return Array.from(
          e.querySelectorAll('[tabindex]:not([disabled]):not([aria-disabled])'),
        ).filter((0, o.createScopedVisibleElementFilter)(e))
      }
    },
    332913: (e, t, n) => {
      n.d(t, { ToolbarIconButton: () => l })
      var o = n(50959),
        i = n(865266),
        r = n(892932),
        s = n(395907)
      const l = (0, o.forwardRef)((e, t) => {
        const { tooltip: n, ...l } = e,
          [a, c] = (0, i.useRovingTabindexElement)(t)
        return o.createElement(s.ToolWidgetIconButton, {
          'aria-label': r.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
          ...l,
          tag: r.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
          ref: a,
          tabIndex: c,
          'data-tooltip': n,
        })
      })
    },
    53431: (e, t, n) => {
      n.d(t, { ToolbarMenuButton: () => u })
      var o = n(50959),
        i = n(718736),
        r = n(518799),
        s = n(865266),
        l = n(892932),
        a = n(869194),
        c = n(179807)
      const u = (0, o.forwardRef)((e, t) => {
        const { tooltip: n, menuReference: u = null, ...d } = e,
          [h, p] = (0, s.useRovingTabindexElement)(null),
          g = (0, i.useFunctionalRefObject)(u)
        return (
          (0, a.useMouseClickAutoBlur)(g),
          o.createElement(r.ToolWidgetMenu, {
            'aria-label': l.PLATFORM_ACCESSIBILITY_ENABLED ? n : void 0,
            ...d,
            ref: t,
            tag: l.PLATFORM_ACCESSIBILITY_ENABLED ? 'button' : 'div',
            reference: h,
            tabIndex: p,
            'data-tooltip': n,
            menuReference: g,
            onMenuKeyDown: c.handleAccessibleMenuKeyDown,
            onMenuFocus: (e) => (0, c.handleAccessibleMenuFocus)(e, h),
          })
        )
      })
    },
    671641: (e, t, n) => {
      var o
      n.d(t, { IconType: () => o }),
        ((e) => {
          e.Svg = 'svg'
        })(o || (o = {}))
    },
    57674: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 11.5v8a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-8m-17 0v-4a1 1 0 0 1 1-1h4l2 2h9a1 1 0 0 1 1 1v2m-17 0h17"/></svg>'
    },
    80465: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.5 6C4.67 6 4 6.67 4 7.5V20.5c0 .83.67 1.5 1.5 1.5H16v-1H5.5a.5.5 0 0 1-.5-.5V12h16v1h1V9.5c0-.83-.67-1.5-1.5-1.5h-8.8L9.86 6.15 9.71 6H5.5zM21 11H5V7.5c0-.28.22-.5.5-.5h3.8l1.85 1.85.14.15h9.21c.28 0 .5.22.5.5V11zm1 11v-3h3v-1h-3v-3h-1v3h-3v1h3v3h1z"/></svg>'
    },
    94007: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M2.448 10.124a10.82 10.82 0 0 1-.336-.609L2.105 9.5l.007-.015a12.159 12.159 0 0 1 1.686-2.466C5.002 5.665 6.752 4.373 9.05 4.373c2.297 0 4.047 1.292 5.25 2.646a12.166 12.166 0 0 1 1.687 2.466l.007.015-.007.015a12.163 12.163 0 0 1-1.686 2.466c-1.204 1.354-2.954 2.646-5.251 2.646-2.298 0-4.048-1.292-5.252-2.646a12.16 12.16 0 0 1-1.35-1.857zm14.558-.827l-.456.203.456.203v.002l-.003.005-.006.015-.025.052a11.813 11.813 0 0 1-.461.857 13.163 13.163 0 0 1-1.463 2.011c-1.296 1.46-3.296 2.982-5.998 2.982-2.703 0-4.703-1.522-6-2.982a13.162 13.162 0 0 1-1.83-2.677 7.883 7.883 0 0 1-.118-.243l-.007-.015-.002-.005v-.001l.456-.204-.456-.203v-.002l.002-.005.007-.015a4.66 4.66 0 0 1 .119-.243 13.158 13.158 0 0 1 1.83-2.677c1.296-1.46 3.296-2.982 5.999-2.982 2.702 0 4.702 1.522 5.998 2.981a13.158 13.158 0 0 1 1.83 2.678 8.097 8.097 0 0 1 .119.243l.006.015.003.005v.001zm-.456.203l.456-.203.09.203-.09.203-.456-.203zM1.092 9.297l.457.203-.457.203-.09-.203.09-.203zm9.958.203c0 1.164-.917 2.07-2 2.07-1.084 0-2-.906-2-2.07 0-1.164.916-2.07 2-2.07 1.083 0 2 .906 2 2.07zm1 0c0 1.695-1.344 3.07-3 3.07-1.657 0-3-1.375-3-3.07 0-1.695 1.343-3.07 3-3.07 1.656 0 3 1.375 3 3.07z"/></svg>'
    },
    52870: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7 5.5a2.5 2.5 0 0 1 5 0V7H7V5.5zM6 7V5.5a3.5 3.5 0 1 1 7 0V7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm8 2a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9zm-3 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>'
    },
    274059: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M21.106 12.5H6.894a.5.5 0 0 1-.318-.886L14 5.5l7.424 6.114a.5.5 0 0 1-.318.886zM21.106 16.5H6.894a.5.5 0 0 0-.318.886L14 23.5l7.424-6.114a.5.5 0 0 0-.318-.886z"/></svg>'
    },
    191730: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4.605 14.089A10.052 10.052 0 0 1 4.56 14l.046-.089a17.18 17.18 0 0 1 2.329-3.327C8.58 8.758 10.954 7 14 7c3.046 0 5.421 1.757 7.066 3.585A17.18 17.18 0 0 1 23.44 14l-.046.089a17.18 17.18 0 0 1-2.329 3.327C19.42 19.242 17.046 21 14 21c-3.046 0-5.421-1.757-7.066-3.584a17.18 17.18 0 0 1-2.329-3.327zm19.848-.3L24 14l.453.212-.001.002-.003.005-.009.02a16.32 16.32 0 0 1-.662 1.195c-.44.72-1.1 1.684-1.969 2.65C20.08 20.008 17.454 22 14 22c-3.454 0-6.079-1.993-7.81-3.916a18.185 18.185 0 0 1-2.469-3.528 10.636 10.636 0 0 1-.161-.318l-.01-.019-.002-.005v-.002L4 14a55.06 55.06 0 0 1-.453-.212l.001-.002.003-.005.009-.02.033-.067a16.293 16.293 0 0 1 .629-1.126c.44-.723 1.1-1.686 1.969-2.652C7.92 7.993 10.546 6 14 6c3.454 0 6.079 1.993 7.81 3.916a18.183 18.183 0 0 1 2.469 3.528 10.588 10.588 0 0 1 .161.318l.01.019.002.005v.002zM24 14l.453-.211.099.211-.099.211L24 14zm-20.453-.211L4 14l-.453.211L3.448 14l.099-.211zM11 14a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>'
    },
    607295: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M4.5 12.5l4.59-4.59a2 2 0 0 1 2.83 0l3.17 3.17a2 2 0 0 0 2.83 0L22.5 6.5m-8 9.5v5.5M12 19l2.5 2.5L17 19m4.5 3v-5.5M19 19l2.5-2.5L24 19"/></svg>'
    },
    728824: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>'
    },
    582e3: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path fill="currentColor" fill-rule="evenodd" d="M6.18 9.99A.8.8 0 0 1 6 10a.8.8 0 0 1-.18-.01l-.02-.01c-.05-.05-.15-.2-.33-.66l-.25-.58c-.3-.72-.6-1.4-.6-2.43L4.63 6h2.74v.31c0 1.03-.28 1.7-.6 2.43l-.24.58a2.08 2.08 0 0 1-.35.67ZM7.24 5H4.76c.17-.88.47-1.71.7-2.32a2.08 2.08 0 0 1 .36-.67A.8.8 0 0 1 6 2l.18.01.02.01c.05.05.15.2.33.66.24.6.54 1.44.7 2.32Zm1.13 1v.31c0 1.26-.38 2.15-.7 2.88l-.2.5-.02.04A4 4 0 0 0 10 6H8.37Zm1.5-1H8.25a14.09 14.09 0 0 0-.78-2.68l-.02-.05A4 4 0 0 1 9.87 5ZM3.75 5c.18-1.06.53-2.03.78-2.68l.02-.05A4 4 0 0 0 2.13 5h1.62ZM2 6a4 4 0 0 0 2.55 3.73l-.02-.05-.2-.49c-.32-.73-.7-1.62-.7-2.88V6H2Zm4-5h-.02a5 5 0 0 0 0 10h.04a5 5 0 0 0 0-10H6Z"/></svg>'
    },
    206672: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path fill="currentColor" d="M5.31 2.58l.93-.94C7 .88 8.74.6 10.07 1.93c1.34 1.33 1.05 3.07.29 3.83l-.94.93-.36.36-.1.1-.03.03v.01l-.34-.33-.33-.33.04-.04.1-.1.36-.36.94-.94c.4-.39.68-1.53-.29-2.5s-2.11-.68-2.5-.29l-.94.94-.36.36-.1.1-.03.03h-.01v.01l-.33-.33-.33-.33v-.01l.03-.03.11-.1.36-.36zM3.08 4.8l.33.34.33.33-.04.04-.1.1-.36.36-.94.94c-.4.39-.68 1.53.29 2.5s2.11.68 2.5.29l.94-.94.36-.36.1-.1.03-.03h.01v-.01l.33.33.33.33v.01l-.03.03-.11.1-.36.36-.93.94c-.76.76-2.5 1.05-3.83-.29C.59 8.74.88 7 1.64 6.24l.94-.93.36-.36.1-.1.03-.03V4.8z"/><path fill="currentColor" d="M7.1 4.23L4.24 7.11l.66.66 2.88-2.88-.66-.66z"/></svg>'
    },
    749756: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.5 4A2.5 2.5 0 0 0 7 5.5V7h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V5.5a3.5 3.5 0 0 1 6.231-2.19c-.231.19-.73.69-.73.69zM13 8H6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-2 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>'
    },
    962766: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.692 3.012l-12 12.277.715.699 12-12.277-.715-.699zM9.05 15.627a7.042 7.042 0 0 1-3.144-.741l.742-.76c.72.311 1.52.5 2.402.5 2.297 0 4.047-1.29 5.25-2.645a12.168 12.168 0 0 0 1.687-2.466l.007-.015-.007-.015A12.166 12.166 0 0 0 14.3 7.019c-.11-.124-.225-.247-.344-.37l.699-.715c.137.14.268.28.392.42a13.16 13.16 0 0 1 1.83 2.678 8.117 8.117 0 0 1 .119.243l.006.015.003.005v.001l-.456.204.456.203v.002l-.003.005-.006.015-.025.052a11.762 11.762 0 0 1-.461.857 13.158 13.158 0 0 1-1.463 2.011c-1.296 1.46-3.296 2.982-5.998 2.982zm7.5-6.127l.456-.203.09.203-.09.203-.456-.203zm-7.5 3.07c-.27 0-.53-.037-.778-.105l.879-.899c.999-.052 1.833-.872 1.895-1.938l.902-.923c.066.253.102.52.102.795 0 1.695-1.344 3.07-3 3.07zM6.15 10.294l.902-.923c.063-1.066.896-1.886 1.895-1.938l.879-.9a2.94 2.94 0 0 0-.777-.103c-1.657 0-3 1.374-3 3.069 0 .275.035.541.101.795zM9.05 4.373c.88 0 1.68.19 2.4.5l.743-.759a7.043 7.043 0 0 0-3.143-.74c-2.703 0-4.703 1.521-6 2.98a13.159 13.159 0 0 0-1.83 2.678 7.886 7.886 0 0 0-.118.243l-.007.015-.002.005v.001l.456.204-.457-.203-.09.203.09.203.457-.203-.456.203v.002l.002.005.007.015a4.5 4.5 0 0 0 .119.243 13.152 13.152 0 0 0 1.83 2.677c.124.14.255.28.392.42l.7-.715c-.12-.122-.235-.245-.345-.369a12.156 12.156 0 0 1-1.686-2.466L2.105 9.5l.007-.015a12.158 12.158 0 0 1 1.686-2.466C5.002 5.665 6.752 4.373 9.05 4.373z"/></svg>'
    },
    598129: (e) => {
      e.exports = {
        ar: ['استنساخ ، نسخ'],
        ca_ES: ['Clona, Copia'],
        cs: 'Clone, Copy',
        de: ['Klonen, Kopieren'],
        el: 'Clone, Copy',
        en: 'Clone, Copy',
        es: ['Clonar, Copiar'],
        fa: 'Clone, Copy',
        fr: ['Cloner, Copier'],
        he_IL: ['שכפל, העתק'],
        hu_HU: 'Clone, Copy',
        id_ID: ['Duplikat, Salin'],
        it: ['Clona, copia'],
        ja: ['複製、コピー'],
        ko: ['클론, 카피'],
        ms_MY: ['Klon, Salin'],
        nl_NL: 'Clone, Copy',
        pl: ['Klonuj, Kopiuj'],
        pt: ['Clonar, Copiar'],
        ro: 'Clone, Copy',
        ru: ['Клонировать, копировать'],
        sv: ['Klon, kopiera'],
        th: ['โคลน, ก๊อปปี้'],
        tr: ['Klonla, Kopyala'],
        vi: ['Nhân bản, Sao chép'],
        zh: ['克隆，复制'],
        zh_TW: ['克隆，複製'],
      }
    },
    391073: (e) => {
      e.exports = {
        ar: ['أنشئ مجموعة من الرسومات'],
        ca_ES: ['Creeu un grup de gràfics'],
        cs: 'Create a group of drawings',
        de: ['Erstellen Sie eine Gruppe von Zeichnungen'],
        el: 'Create a group of drawings',
        en: 'Create a group of drawings',
        es: ['Cree un grupo de graficos'],
        fa: 'Create a group of drawings',
        fr: ['Créer un groupe de dessins'],
        he_IL: ['צור קבוצת שרטוטים'],
        hu_HU: 'Create a group of drawings',
        id_ID: ['Buat kelompok untuk gambar'],
        it: ['Crea un gruppo di disegni'],
        ja: ['描画のグループを作成'],
        ko: ['드로잉 그룹 만들기'],
        ms_MY: ['Cipta kumpulan untuk lukisan'],
        nl_NL: 'Create a group of drawings',
        pl: ['Utwórz grupę obiektów rysowania'],
        pt: ['Criar um grupo de desenhos'],
        ro: 'Create a group of drawings',
        ru: ['Создать группу объектов рисования'],
        sv: ['Skapa en grup ritningar'],
        th: ['สร้างกรุ๊ปของการวาด'],
        tr: ['Bir grup çizim oluşturun'],
        vi: ['Tạo nhóm các hình vẽ'],
        zh: ['建立一组绘图'],
        zh_TW: ['建立一組繪圖'],
      }
    },
    438207: (e) => {
      e.exports = {
        ar: ['المجموعة مخفية في الفاصل الزمني الحالي'],
        ca_ES: ["El grup està ocult a l'interval actual"],
        cs: 'Group is hidden on current interval',
        de: ['Gruppe ist im aktuellen Intervall verborgen'],
        el: 'Group is hidden on current interval',
        en: 'Group is hidden on current interval',
        es: ['El grupo está oculto en el intervalo actual'],
        fa: 'Group is hidden on current interval',
        fr: ["Le groupe est caché sur l'intervalle actuel"],
        he_IL: ['הקבוצה מוסתרת באינטרוול הנוכחי'],
        hu_HU: 'Group is hidden on current interval',
        id_ID: ['Grup disembunyikan pada interval saat ini'],
        it: ['Il gruppo è nascosto nel timeframe corrente'],
        ja: ['グループは現在の時間足で非表示です'],
        ko: ['현재 인터벌에 대해 그룹이 감춰져 있습니다'],
        ms_MY: ['Kumpulan disembunyikan pada selang masa sekarang'],
        nl_NL: 'Group is hidden on current interval',
        pl: ['Grupa jest ukryta na bieżącym interwale'],
        pt: ['O grupo está oculto no intervalo atual'],
        ro: 'Group is hidden on current interval',
        ru: ['Группа скрыта на текущем интервале'],
        sv: ['Gruppen är dold i det aktuella intervallet'],
        th: ['กรุ๊ปถูกซ่อนบนช่วงเวลาปัจจุบัน'],
        tr: ['Grup şu anki aralıkta gizli'],
        vi: ['Nhóm được ẩn trong chế độ hiện tại'],
        zh: ['该组在当前时间间隔内隐藏'],
        zh_TW: ['該組隱藏在當前的時間間隔內'],
      }
    },
    839781: (e) => {
      e.exports = {
        ar: ['الرسم مخفي على الفاصل الزمني الحالي'],
        ca_ES: ["El dibuix està ocult a l'interval actual"],
        cs: 'Drawing is hidden on current interval',
        de: ['Zeichnung ist für das aktuelle Intervall ausgeblendet'],
        el: 'Drawing is hidden on current interval',
        en: 'Drawing is hidden on current interval',
        es: ['El dibujo está oculto en el intervalo actual'],
        fa: 'Drawing is hidden on current interval',
        fr: ["Le dessin est caché sur l'intervalle actuel"],
        he_IL: ['הציור מוסתר באינטרוול הנוכחי'],
        hu_HU: 'Drawing is hidden on current interval',
        id_ID: ['Gambar disembunyikan pada interval saat ini'],
        it: ['Il disegno è nascosto sul timeframe corrente'],
        ja: ['描画は現在の時間足で非表示です'],
        ko: ['커런트 인터벌에서는 드로잉이 숨겨져 있습니다'],
        ms_MY: ['Lukisan disembunyikan pada selang masa terkini'],
        nl_NL: 'Drawing is hidden on current interval',
        pl: ['Rysunek jest ukryty na bieżącym interwale'],
        pt: ['O desenho está oculto no intervalo atual'],
        ro: 'Drawing is hidden on current interval',
        ru: ['Объект рисования скрыт на этом интервале'],
        sv: ['Ritning är dold på aktuellt intervall'],
        th: ['การวาดถูกซ่อนไว้สำหรับช่วงเวลาปัจจุบัน'],
        tr: ['Çizim, geçerli aralıkta gizlendi'],
        vi: ['Bản vẽ bị ẩn trong khoảng thời gian hiện tại'],
        zh: ['在当前时间周期内隐藏绘图'],
        zh_TW: ['在當前時間周期內隱藏繪圖'],
      }
    },
    831095: (e) => {
      e.exports = {
        ar: ['شجرة الكائنات'],
        ca_ES: ["Arbre d'objectes"],
        cs: 'Object tree',
        de: ['Objektbaum'],
        el: 'Object tree',
        en: 'Object tree',
        es: ['Árbol de objetos'],
        fa: 'Object tree',
        fr: ['Arborescence des objets'],
        he_IL: ['אובייקט עץ'],
        hu_HU: 'Object tree',
        id_ID: ['Pohon objek'],
        it: ['Albero oggetti'],
        ja: ['オブジェクトツリー'],
        ko: ['오브젝트 트리'],
        ms_MY: ['Salasilah Objek'],
        nl_NL: 'Object tree',
        pl: ['Drzewo obiektów'],
        pt: ['Árvore de objetos'],
        ro: 'Object tree',
        ru: ['Дерево объектов'],
        sv: ['Objektträd'],
        th: ['แผนผังวัตถุ'],
        tr: ['Nesne ağacı'],
        vi: ['Danh sách đối tượng'],
        zh: ['对象树'],
        zh_TW: ['物件樹'],
      }
    },
    72357: (e) => {
      e.exports = {
        ar: ['إدارة رسومات التنسيق'],
        ca_ES: ['Gestiona els dibuixos dels dissenys'],
        cs: 'Manage layout drawings',
        de: ['Zeichnungen des Layouts verwalten'],
        el: 'Manage layout drawings',
        en: 'Manage layout drawings',
        es: ['Gestionar los dibujos de los diseños'],
        fa: 'Manage layout drawings',
        fr: ['Gérer les dessins de mise en page'],
        he_IL: ['נהל שרטוטי פריסה'],
        hu_HU: 'Manage layout drawings',
        id_ID: ['Kelola layout gambar'],
        it: ['Gestisci disegni del layout'],
        ja: ['レイアウトの描画を管理'],
        ko: ['레이아웃 드로잉 관리'],
        ms_MY: ['Urus susun atur lukisan'],
        nl_NL: 'Manage layout drawings',
        pl: ['Zarządzaj rysunkami układu'],
        pt: ['Administre seu layout de desenhos'],
        ro: 'Manage layout drawings',
        ru: ['Настройки объектов рисования графика'],
        sv: ['Hantera layoutritningar'],
        th: ['จัดการการวาดเลย์เอาท์'],
        tr: ['Yerleşim çizimlerini yönet'],
        vi: ['Quản lý bố cục hình vẽ'],
        zh: ['管理布局绘图'],
        zh_TW: ['管理版面繪圖'],
      }
    },
    435038: (e) => {
      e.exports = {
        ar: ['تغيير الأسم'],
        ca_ES: ['Reanomenar'],
        cs: 'Rename',
        de: ['Umbenennen'],
        el: 'Rename',
        en: 'Rename',
        es: ['Renombrar.'],
        fa: 'Rename',
        fr: ['Renommer'],
        he_IL: ['שנה שם'],
        hu_HU: ['Átnevezés'],
        id_ID: ['Mengganti Nama'],
        it: ['Rinomina'],
        ja: ['名前の変更'],
        ko: ['이름 바꾸기'],
        ms_MY: ['Namakan semula'],
        nl_NL: 'Rename',
        pl: ['Zmień nazwę'],
        pt: ['Renomear'],
        ro: 'Rename',
        ru: ['Переименовать'],
        sv: ['Döp om'],
        th: ['เปลี่ยนชื่อ'],
        tr: ['Yeni Ad Ver'],
        vi: ['Đổi tên'],
        zh: ['重命名'],
        zh_TW: ['重新命名'],
      }
    },
    328065: (e) => {
      e.exports = {
        ar: ['غيّر عنوان {sourceTitle} إلى {newSourceTitle}'],
        ca_ES: ['canvia el títol {sourceTitle} per {newSourceTitle}'],
        cs: 'change {sourceTitle} title to {newSourceTitle}',
        de: ['{sourceTitle} zu {newSourceTitle} ändern'],
        el: 'change {sourceTitle} title to {newSourceTitle}',
        en: 'change {sourceTitle} title to {newSourceTitle}',
        es: ['cambiar el título {sourceTitle} por {newSourceTitle}'],
        fa: 'change {sourceTitle} title to {newSourceTitle}',
        fr: ['Remplacer le titre {sourceTitle} par {newSourceTitle}'],
        he_IL: ['שנה את {sourceTitle} כותרת ל- {newSourceTitle}'],
        hu_HU: 'change {sourceTitle} title to {newSourceTitle}',
        id_ID: ['Ubah judul {sourceTitle} menjadi {newSourceTitle}'],
        it: ['Cambia titolo da {sourceTitle} a {newSourceTitle}'],
        ja: ['{sourceTitle}のタイトルを{newSourceTitle}に変更'],
        ko: ['{sourceTitle} 타이틀을 {newSourceTitle} 으로 바꾸기'],
        ms_MY: ['Tukar tajuk {sourceTitle} kepada {newSourceTitle}'],
        nl_NL: 'change {sourceTitle} title to {newSourceTitle}',
        pl: ['Zmień tytuł {sourceTitle} na {newSourceTitle}.'],
        pt: ['Mudar {sourceTitle} título para {newSourceTitle}'],
        ro: ['Change {sourceTitle} title to {newSourceTitle}'],
        ru: ['изменение названия {sourceTitle} на {newSourceTitle}'],
        sv: ['Ändra {sourceTitle} titel till {newSourceTitle}'],
        th: ['เปลี่ยนชื่อ {sourceTitle} ไปเป็น {newSourceTitle}'],
        tr: ['{sourceTitle} başlığını {newSourceTitle} olarak değiştirin'],
        vi: ['Thay đổi {sourceTitle} tiêu đề sang {newSourceTitle}'],
        zh: ['将{sourceTitle}标题更改为{newSourceTitle}'],
        zh_TW: ['將{sourceTitle}標題更改為{newSourceTitle}'],
      }
    },
    928506: (e) => {
      e.exports = {
        ar: ['إخفاء العناصر'],
        ca_ES: ['amaga objectes'],
        cs: 'hide objects',
        de: ['Objekte ausblenden'],
        el: 'hide objects',
        en: 'hide objects',
        es: ['ocultar objetos'],
        fa: 'hide objects',
        fr: ['masquer les objets'],
        he_IL: ['הסתר אובייקטים'],
        hu_HU: 'hide objects',
        id_ID: ['sembunyikan objek'],
        it: ['nascondi oggetti'],
        ja: ['オブジェクトの非表示'],
        ko: ['오브젝트 숨기기'],
        ms_MY: ['sembunyi objek'],
        nl_NL: 'hide objects',
        pl: ['ukryj obiekty'],
        pt: ['ocultar objetos'],
        ro: 'hide objects',
        ru: ['скрытие объектов'],
        sv: ['dölj objekt'],
        th: ['ซ่อนออบเจ็กต์'],
        tr: ['nesneleri gizle'],
        vi: ['ẩn đối tượng'],
        zh: ['隐藏对象'],
        zh_TW: ['隱藏物件'],
      }
    },
    8343: (e) => {
      e.exports = {
        ar: ['أدخل المصدر (المصادر) بعد ذلك'],
        ca_ES: ['introdueix font(s) després'],
        cs: 'insert source(s) after',
        de: ['Quelle(n) einfügen nach'],
        el: 'insert source(s) after',
        en: 'insert source(s) after',
        es: ['introducir fuente(s) después'],
        fa: 'insert source(s) after',
        fr: ['insérer la/les source(s) après'],
        he_IL: ['הכנס מקור(ות) לאחר מכן'],
        hu_HU: 'insert source(s) after',
        id_ID: ['masukkan sumber setelah'],
        it: ['inserimento fonti'],
        ja: ['後にソースを挿入'],
        ko: ['~뒤에 소스 넣기'],
        ms_MY: ['masukkan sumber(s) selepas'],
        nl_NL: 'insert source(s) after',
        pl: ['wstaw źródła po'],
        pt: ['inserir fonte(s) depois'],
        ro: 'insert source(s) after',
        ru: ['вставку объекта(ов) после'],
        sv: ['infoga källa(källor) efter'],
        th: ['แทรกแหล่งที่มาหลังจาก'],
        tr: ['kaynağ(ı) ardına ekle'],
        vi: ['chèn (các) nguồn sau đó'],
        zh: ['插入源到后面'],
        zh_TW: ['插入源到後面'],
      }
    },
    340566: (e) => {
      e.exports = {
        ar: ['تحريك العناصر'],
        ca_ES: ['mou objectes'],
        cs: 'move objects',
        de: ['Objekte Bewegen'],
        el: 'move objects',
        en: 'move objects',
        es: ['mover objetos'],
        fa: 'move objects',
        fr: ['Déplacer les objets'],
        he_IL: ['הזז אובייקטים'],
        hu_HU: 'move objects',
        id_ID: ['Pindahkan objek'],
        it: ['Sposta oggetti'],
        ja: ['オブジェクトを移動'],
        ko: ['오브젝트 옮기기'],
        ms_MY: ['Pindahkan objek'],
        nl_NL: 'move objects',
        pl: ['Przenieś obiekty'],
        pt: ['Mover objetos'],
        ro: ['Move objects'],
        ru: ['перемещение объектов'],
        sv: ['Flytta objekt'],
        th: ['ย้ายวัตถุ'],
        tr: ['nesneleri taşı'],
        vi: ['Chuyển đối tượng'],
        zh: ['移动对象'],
        zh_TW: ['移動物件'],
      }
    },
    787358: (e) => {
      e.exports = {
        ar: ['عرض ‎{title}‎'],
        ca_ES: ['mostra {title}'],
        cs: 'show {title}',
        de: ['{title} anzeigen'],
        el: 'show {title}',
        en: 'show {title}',
        es: ['mostrar {title}'],
        fa: 'show {title}',
        fr: ['afficher {title}'],
        he_IL: ['הצג ‎{title}‎'],
        hu_HU: 'show {title}',
        id_ID: ['tampilkan {title}'],
        it: ['mostra {title}'],
        ja: ['{title}の表示'],
        ko: ['{title} 보이기'],
        ms_MY: ['tunjuk {title}'],
        nl_NL: 'show {title}',
        pl: ['pokaż {title}'],
        pt: ['exibir {title}'],
        ro: 'show {title}',
        ru: ['отображение: {title}'],
        sv: ['visa {title}'],
        th: ['แสดง {title}'],
        tr: ['{title} göster'],
        vi: ['hiện {title}'],
        zh: ['显示{title}'],
        zh_TW: ['顯示{title}'],
      }
    },
    963549: (e) => {
      e.exports = {
        ar: ['إظهار العناصر'],
        ca_ES: ['mostra objectes'],
        cs: 'show objects',
        de: ['Objekte einblenden'],
        el: 'show objects',
        en: 'show objects',
        es: ['mostrar objetos'],
        fa: 'show objects',
        fr: ['afficher les objets'],
        he_IL: ['הצג אובייקטים'],
        hu_HU: 'show objects',
        id_ID: ['tampilkan objek'],
        it: ['mostra oggetti'],
        ja: ['オブジェクトの表示'],
        ko: ['오브젝트 보이기'],
        ms_MY: ['tunjuk objek'],
        nl_NL: 'show objects',
        pl: ['pokaż obiekty'],
        pt: ['exibir objetos'],
        ro: 'show objects',
        ru: ['отображение объектов'],
        sv: ['visa objekt'],
        th: ['แสดงออบเจ็กต์'],
        tr: ['nesneleri göster'],
        vi: ['hiển thị đối tượng'],
        zh: ['显示对象'],
        zh_TW: ['顯示物件'],
      }
    },
    857428: (e) => {
      e.exports = {
        ar: ['إزالة العناصر'],
        ca_ES: ['elimina objectes'],
        cs: 'remove objects',
        de: ['Objekte entfernen'],
        el: 'remove objects',
        en: 'remove objects',
        es: ['eliminar objetos'],
        fa: 'remove objects',
        fr: ['supprimer les objets'],
        he_IL: ['הסר אובייקטים'],
        hu_HU: 'remove objects',
        id_ID: ['Hilangkan objek'],
        it: ['rimuovi oggetti'],
        ja: ['オブジェクトの削除'],
        ko: ['오브젝트 없애기'],
        ms_MY: ['buang objek'],
        nl_NL: 'remove objects',
        pl: ['usuń obiekty'],
        pt: ['remover objetos'],
        ro: 'remove objects',
        ru: ['удаление объектов'],
        sv: ['Ta bort objekt'],
        th: ['ลบออบเจ็กต์'],
        tr: ['nesneleri kaldır'],
        vi: ['di chuyển đối tượng'],
        zh: ['移除对象'],
        zh_TW: ['移除物件'],
      }
    },
  },
])
