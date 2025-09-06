;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [620],
  {
    99758: (e, n, t) => {
      t.r(n), t.d(n, { tableActions: () => r })
      var o = t(7029),
        a = t(81199),
        l = t(29023)
      const c = o.t(null, void 0, t(61702)),
        d = o.t(null, void 0, t(80473)),
        s = o.t(null, void 0, t(85069)),
        i = o.t(null, void 0, t(33500))
      function r(e, n) {
        const t = []
        t.push(
          new a.ActionWithStandardIcon({
            actionId: 'Chart.SelectedObject.InsertColumnTable',
            options: {
              label: d,
              statName: 'InsertColumnTableSelectedObject',
              iconId: 'Chart.InsertColumnTable',
              checkable: !1,
              onExecute: () => {
                const t = e.insertCellsUndoCommand(1)
                n.undoHistory().pushUndoCommand(t)
              },
            },
          }),
        ),
          t.push(
            new a.ActionWithStandardIcon({
              actionId: 'Chart.SelectedObject.InsertRowTable',
              options: {
                label: c,
                iconId: 'Chart.InsertRowTable',
                statName: 'InsertRowTableSelectedObject',
                checkable: !1,
                onExecute: () => {
                  const t = e.insertCellsUndoCommand(0)
                  n.undoHistory().pushUndoCommand(t)
                },
              },
            }),
          )
        const [o, r] = e.inplaceEditableCellIndexes()
        return (
          -1 !== o &&
            -1 !== r &&
            (t.length > 0 && t.push(new l.Separator()),
            t.push(
              new a.ActionWithStandardIcon({
                actionId: 'Chart.SelectedObject.RemoveRowTable',
                options: {
                  label: s,
                  statName: 'RemoveRowTableSelectedObject',
                  iconId: 'Chart.RemoveRowTable',
                  checkable: !1,
                  disabled: !e.isRemoveCellsAvailable(0),
                  onExecute: () => {
                    const t = e.removeCellsUndoCommand(0)
                    null !== t && n.undoHistory().pushUndoCommand(t)
                  },
                },
              }),
            ),
            t.push(
              new a.ActionWithStandardIcon({
                actionId: 'Chart.SelectedObject.RemoveColumnTable',
                options: {
                  label: i,
                  statName: 'RemoveColumnTableSelectedObject',
                  iconId: 'Chart.RemoveColumnTable',
                  checkable: !1,
                  disabled: !e.isRemoveCellsAvailable(1),
                  onExecute: () => {
                    const t = e.removeCellsUndoCommand(1)
                    null !== t && n.undoHistory().pushUndoCommand(t)
                  },
                },
              }),
            )),
          t
        )
      }
    },
    91218: (e, n, t) => {
      t.r(n), t.d(n, { showTableContextMenu: () => c })
      var o = t(77788),
        a = t(56657),
        l = t(40443)
      async function c(e, n, t) {
        const c = (0, o.chartWidgetCollectionService)()
        if (null === c)
          throw new Error('ChartWidgetCollection should be defined')
        const d = c.activeChartWidget.value(),
          s = new a.ActionsProvider(d),
          i = await s.contextMenuActionsForSources([e]),
          r = await l.ContextMenuManager.createMenu(
            i,
            {},
            { menuName: 'LineToolTableContextMenu' },
            n,
          )
        return r.show(t), r
      }
    },
  },
])
