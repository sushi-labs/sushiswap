var e,
  t,
  i,
  o,
  r,
  n,
  a,
  s,
  l,
  c,
  h,
  d,
  g,
  u,
  C,
  S,
  p,
  m,
  _,
  y,
  T,
  b,
  P,
  L,
  f,
  w,
  A,
  I,
  v,
  R,
  O,
  D,
  V,
  k,
  E,
  W,
  F,
  M,
  B,
  N,
  U,
  x,
  H,
  j,
  G,
  z,
  $,
  J,
  K,
  q,
  Z,
  Q,
  Y,
  X,
  ee,
  te,
  ie,
  oe,
  re,
  ne,
  ae,
  se,
  le,
  ce,
  he,
  de,
  ge,
  ue,
  Ce,
  Se,
  pe,
  me,
  _e,
  ye,
  Te,
  be,
  Pe,
  Le,
  fe,
  we,
  Ae,
  Ie,
  ve
function Re(e, t) {
  const i = { ...e }
  for (const o in t)
    'object' != typeof e[o] || null === e[o] || Array.isArray(e[o])
      ? void 0 !== t[o] && (i[o] = t[o])
      : (i[o] = Re(e[o], t[o]))
  return i
}
!((e) => {
  ;(e.UnknownAction = 'UnknownAction'),
    (e.Spinner = 'Spinner'),
    (e.Loading = 'Loading'),
    (e.AlertAdd = 'Alert.Add'),
    (e.AlertEdit = 'Alert.Edit'),
    (e.AlertsClone = 'Alerts.Clone'),
    (e.AlertsRemove = 'Alerts.Remove'),
    (e.AlertsRemoveAll = 'Alerts.RemoveAll'),
    (e.AlertsRemoveFiltered = 'Alerts.RemoveFiltered'),
    (e.AlertsRemoveAllInactive = 'Alerts.RemoveAllInactive'),
    (e.AlertsRemoveAllWatchlistInactive = 'Alerts.RemoveAllWatchlistInactive'),
    (e.AlertsRemoveFires = 'Alerts.RemoveFires'),
    (e.AlertsRestart = 'Alerts.Restart'),
    (e.AlertsRestartAllInactive = 'Alerts.RestartAllInactive'),
    (e.AlertsRestartFilteredInactive = 'Alerts.RestartFilteredInactive'),
    (e.AlertsStop = 'Alerts.Stop'),
    (e.AlertsStopAll = 'Alerts.StopAll'),
    (e.AlertsStopFilteredActive = 'Alerts.StopFilteredActive'),
    (e.AlertsExportFiresToCSV = 'Alerts.ExportFiresToCSV'),
    (e.AlertsLogClear = 'AlertsLog.Clear'),
    (e.ChartAddIndicatorToAllCharts = 'Chart.AddIndicatorToAllCharts'),
    (e.ChartAddSymbolToWatchList = 'Chart.AddSymbolToWatchList'),
    (e.ChartAlertLabelToggleExtendLines = 'Chart.AlertLabel.ToggleExtendLines'),
    (e.ChartApplyIndicatorsToAllCharts = 'Chart.ApplyIndicatorsToAllCharts'),
    (e.ChartIndicatorApplyChildIndicator =
      'Chart.Indicator.ApplyChildIndicator'),
    (e.ChartIndicatorApplyFinancials = 'Chart.Indicator.ApplyFinancials'),
    (e.ChartIndicatorAbout = 'Chart.Indicator.About'),
    (e.ChartIndicatorPineLogs = 'Chart.Indicator.PineLogs'),
    (e.ChartIndicatorPineSource = 'Chart.Indicator.PineSource'),
    (e.ChartIndicatorAddFavorites = 'Chart.Indicator.AddFavorites'),
    (e.ChartChangeTimeZone = 'Chart.ChangeTimeZone'),
    (e.ChartClipboardCopyPrice = 'Chart.Clipboard.CopyPrice'),
    (e.ChartClipboardCopyLineTools = 'Chart.Clipboard.CopyLineTools'),
    (e.ChartClipboardCopySource = 'Chart.Clipboard.CopySource'),
    (e.ChartClipboardPasteSource = 'Chart.Clipboard.PasteSource'),
    (e.ChartCrosshairLockVerticalCursor = 'Chart.Crosshair.LockVerticalCursor'),
    (e.ChartCrosshairPlusButtonDrawHorizontalLine =
      'Chart.Crosshair.PlusButton.DrawHorizontalLine'),
    (e.ChartCustomActionId = 'Chart.CustomActionId'),
    (e.ChartDialogsShowChangeInterval = 'Chart.Dialogs.ShowChangeInterval'),
    (e.ChartDialogsShowChangeSymbol = 'Chart.Dialogs.ShowChangeSymbol'),
    (e.ChartDialogsShowCompareOrAddSymbol =
      'Chart.Dialogs.ShowCompareOrAddSymbol'),
    (e.ChartDialogsShowGeneralSettings = 'Chart.Dialogs.ShowGeneralSettings'),
    (e.ChartDialogsShowGeneralSettingsLegendTab =
      'Chart.Dialogs.ShowGeneralSettings.LegendTab'),
    (e.ChartDialogsShowGeneralSettingsSymbolTab =
      'Chart.Dialogs.ShowGeneralSettings.SymbolTab'),
    (e.ChartDialogsShowGeneralScalesTab =
      'Chart.Dialogs.ShowGeneralSettings.ScalesTab'),
    (e.ChartDialogsShowGeneralSettingsEventsTab =
      'Chart.Dialogs.ShowGeneralSettings.EventsTab'),
    (e.ChartDialogsShowGeneralSettingsAlertsTab =
      'Chart.Dialogs.ShowGeneralSettings.AlertsTab'),
    (e.ChartDialogsShowGoToDate = 'Chart.Dialogs.ShowGoToDate'),
    (e.ChartDialogsShowInsertIndicators = 'Chart.Dialogs.ShowInsertIndicators'),
    (e.ChartDialogsShowInsertFinancials = 'Chart.Dialogs.ShowInsertFinancials'),
    (e.ChartDialogsShowInsertSeasonals = 'Chart.Dialogs.ShowInsertSeasonals'),
    (e.ChartDialogsShowInsertTechnicals = 'Chart.Dialogs.ShowInsertTechnicals'),
    (e.ChartDialogsShowInsertForecast = 'Chart.Dialogs.ShowInsertForecast'),
    (e.ChartDialogsShowInsertOptions = 'Chart.Dialogs.ShowInsertOptions'),
    (e.ChartDetailsMetricsActionId = 'Chart.Dialogs.DetailsMetrics'),
    (e.ChartDialogsShowInsertEconomyIndicators =
      'Chart.Dialogs.ShowInsertEconomyIndicators'),
    (e.ChartDialogsShowSymbolInfo = 'Chart.Dialogs.ShowSymbolInfo'),
    (e.ChartDrawingToolbarToggleVisibility =
      'Chart.DrawingToolbar.ToggleVisibility'),
    (e.ChartExternalActionId = 'Chart.ExternalActionId'),
    (e.ChartFavoriteDrawingToolsToolbarHide =
      'Chart.FavoriteDrawingToolsToolbar.Hide'),
    (e.ChartIndicatorShowSettingsDialog = 'Chart.Indicator.ShowSettingsDialog'),
    (e.ChartLegendToggleLastDayChangeValuesVisibility =
      'Chart.Legend.ToggleLastDayChangeValuesVisibility'),
    (e.ChartLinkingGroupSync = 'Chart.LinkingGroupSync'),
    (e.ChartLinkingGroupSyncChangeGroup = 'Chart.LinkingGroupSync.ChangeGroup'),
    (e.ChartLegendToggleBarChangeValuesVisibility =
      'Chart.Legend.ToggleBarChangeValuesVisibility'),
    (e.ChartLegendTogglePriceSourceVisibility =
      'Chart.Legend.TogglePriceSourceVisibility'),
    (e.ChartLegendToggleIndicatorArgumentsVisibility =
      'Chart.Legend.ToggleIndicatorArgumentsVisibility'),
    (e.ChartLegendToggleIndicatorTitlesVisibility =
      'Chart.Legend.ToggleIndicatorTitlesVisibility'),
    (e.ChartLegendToggleIndicatorValuesVisibility =
      'Chart.Legend.ToggleIndicatorValuesVisibility'),
    (e.ChartLegendToggleOhlcValuesVisibility =
      'Chart.Legend.ToggleOhlcValuesVisibility'),
    (e.ChartLegendToggleOpenMarketStatusVisibility =
      'Chart.Legend.ToggleOpenMarketStatusVisibility'),
    (e.ChartLegendToggleSymbolVisibility =
      'Chart.Legend.ToggleSymbolVisibility'),
    (e.ChartLegendToggleVolumeVisibility =
      'Chart.Legend.ToggleVolumeVisibility'),
    (e.ChartLines = 'Chart.Lines'),
    (e.ChartLinesToggleBidAskLinesVisibility =
      'Chart.Lines.ToggleBidAskLinesVisibility'),
    (e.ChartLinesToggleHighLowLinesVisibility =
      'Chart.Lines.ToggleHighLowLinesVisibility'),
    (e.ChartLinesToggleAverageLineVisibility =
      'Chart.Lines.ToggleAverageLineVisibility'),
    (e.ChartLinesTogglePrePostMarketPriceLineVisibility =
      'Chart.Lines.TogglePrePostMarketPriceLineVisibility'),
    (e.ChartLinesToggleSeriesPrevCloseLineVisibility =
      'Chart.Lines.ToggleSeriesPrevCloseLineVisibility'),
    (e.ChartLinesToggleSeriesPriceLineVisibility =
      'Chart.Lines.ToggleSeriesPriceLineVisibility'),
    (e.ChartLineToolBarsPatternToggleFlipped =
      'Chart.LineTool.BarsPattern.ToggleFlipped'),
    (e.ChartLineToolBarsPatternToggleMirrored =
      'Chart.LineTool.BarsPattern.ToggleMirrored'),
    (e.ChartLineToolRiskRewardReverse = 'Chart.LineTool.RiskReward.Reverse'),
    (e.ChartLineToolClone = 'Chart.LineTool.Clone'),
    (e.ChartLineToolCreateLimitOrderFromState =
      'Chart.LineTool.CreateLimitOrderFromState'),
    (e.ChartLineToolElliotChangeDegreeProperty =
      'Chart.LineTool.Elliot.ChangeDegreeProperty'),
    (e.ChartLineToolNoSync = 'Chart.LineTool.NoSync'),
    (e.ChartLineToolPitchforkChangeTypeToInside =
      'Chart.LineTool.Pitchfork.ChangeTypeToInside'),
    (e.ChartLineToolPitchforkChangeTypeToModifiedSchiff =
      'Chart.LineTool.Pitchfork.ChangeTypeToModifiedSchiff'),
    (e.ChartLineToolPitchforkChangeTypeToOriginal =
      'Chart.LineTool.Pitchfork.ChangeTypeToOriginal'),
    (e.ChartLineToolPitchforkChangeTypeToSchiff =
      'Chart.LineTool.Pitchfork.ChangeTypeToSchiff'),
    (e.ChartLineToolSyncInLayout = 'Chart.LineTool.SyncInLayout'),
    (e.ChartLineToolSyncGlobally = 'Chart.LineTool.SyncGlobally'),
    (e.ChartLineToolTemplates = 'Chart.LineTool.Templates'),
    (e.ChartLineToolTemplatesApply = 'Chart.LineTool.Templates.Apply'),
    (e.ChartLineToolTemplatesApplyDefaults =
      'Chart.LineTool.Templates.ApplyDefaults'),
    (e.ChartLineToolTemplatesSaveAs = 'Chart.LineTool.Templates.SaveAs'),
    (e.ChartLineToolToolbarChangeFontSizeProperty =
      'Chart.LineTool.Toolbar.ChangeFontSizeProperty'),
    (e.ChartLineToolToolbarChangeLineStyleToDashed =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDashed'),
    (e.ChartLineToolToolbarChangeLineStyleToDotted =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDotted'),
    (e.ChartLineToolToolbarChangeLineStyleToSolid =
      'Chart.LineTool.Toolbar.ChangeLineStyleToSolid'),
    (e.ChartMarksToggleVisibility = 'Chart.Marks.ToggleVisibility'),
    (e.ChartMoveChartInLayout = 'Chart.MoveChartInLayout'),
    (e.ChartMoveChartInLayoutBack = 'Chart.MoveChartInLayout.Back'),
    (e.ChartMoveChartInLayoutForward = 'Chart.MoveChartInLayout.Forward'),
    (e.ChartTpoResetAllMergesAndSplits = 'Chart.TPO.ResetAllMergesAndSplits'),
    (e.ChartTpoSplitBlock = 'Chart.TPO.SplitBlock'),
    (e.ChartTpoMergeBlock = 'Chart.TPO.MergeBlock'),
    (e.ChartObjectTreeShow = 'Chart.ObjectTree.Show'),
    (e.ChartDataWindowShow = 'Chart.DataWindow.Show'),
    (e.ChartPaneControlsDeletePane = 'Chart.PaneControls.DeletePane'),
    (e.ChartPaneControlsMaximizePane = 'Chart.PaneControls.MaximizePane'),
    (e.ChartPaneControlsMinimizePane = 'Chart.PaneControls.MinimizePane'),
    (e.ChartPaneControlsMovePaneDown = 'Chart.PaneControls.MovePaneDown'),
    (e.ChartPaneControlsMovePaneUp = 'Chart.PaneControls.MovePaneUp'),
    (e.ChartPaneControlsCollapsePane = 'Chart.PaneControls.CollapsePane'),
    (e.ChartPaneControlsRestorePane = 'Chart.PaneControls.RestorePane'),
    (e.ChartPriceScaleLabels = 'Chart.PriceScale.Labels'),
    (e.ChartPriceScaleLabelsToggleBidAskLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleBidAskLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleHighLowPriceLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleHighLowPriceLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleAveragePriceLabelVisibility =
      'Chart.PriceScale.Labels.ToggleAveragePriceLabelVisibility'),
    (e.ChartPriceScaleLabelsToggleIndicatorsNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsNameLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleIndicatorsValueLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsValueLabelsVisibility'),
    (e.ChartPriceScaleLabelsTogglePrePostMarketLabelsVisibility =
      'Chart.PriceScale.Labels.TogglePrePostMarketLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleNoOverlappingLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleNoOverlappingLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleSeriesLastValueVisibility =
      'Chart.PriceScale.Labels.ToggleSeriesLastValueVisibility'),
    (e.ChartPriceScaleLabelsToggleSymbolNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolNameLabelsVisibility'),
    (e.ChartPriceScaleLabelsToggleSymbolPrevCloseValueVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolPrevCloseValueVisibility'),
    (e.ChartPriceScaleMergeAllScales = 'Chart.PriceScale.MergeAllScales'),
    (e.ChartPriceScaleMergeAllScalesToLeft =
      'Chart.PriceScale.MergeAllScalesToLeft'),
    (e.ChartPriceScaleMergeAllScalesToRight =
      'Chart.PriceScale.MergeAllScalesToRight'),
    (e.ChartPriceScaleMoveToLeft = 'Chart.PriceScale.MoveToLeft'),
    (e.ChartPriceScaleMoveToRight = 'Chart.PriceScale.MoveToRight'),
    (e.ChartPriceScaleReset = 'Chart.PriceScale.Reset'),
    (e.ChartPriceScaleToggleAddOrderPlusButtonVisibility =
      'Chart.PriceScale.ToggleAddOrderPlusButtonVisibility'),
    (e.ChartPriceScaleToggleAutoScale = 'Chart.PriceScale.ToggleAutoScale'),
    (e.ChartPriceScaleToggleAutoScaleSeriesOnly =
      'Chart.PriceScale.ToggleAutoScaleSeriesOnly'),
    (e.ChartPriceScaleToggleCountdownToBarCloseVisibility =
      'Chart.PriceScale.ToggleCountdownToBarCloseVisibility'),
    (e.ChartPriceScaleToggleIndexedTo100 =
      'Chart.PriceScale.ToggleIndexedTo100'),
    (e.ChartPriceScaleToggleInvertScale = 'Chart.PriceScale.ToggleInvertScale'),
    (e.ChartPriceScaleToggleLogarithmic = 'Chart.PriceScale.ToggleLogarithmic'),
    (e.ChartPriceScaleTogglePercentage = 'Chart.PriceScale.TogglePercentage'),
    (e.ChartPriceScaleToggleRegular = 'Chart.PriceScale.ToggleRegular'),
    (e.ChartRedo = 'Chart.Redo'),
    (e.ChartRemoveAllIndicators = 'Chart.RemoveAllIndicators'),
    (e.ChartRemoveAllIndicatorsAndLineTools =
      'Chart.RemoveAllIndicatorsAndLineTools'),
    (e.ChartRemoveAllLineTools = 'Chart.RemoveAllLineTools'),
    (e.ChartScalesReset = 'Chart.Scales.Reset'),
    (e.ChartScalesToggleLockPriceToBarRatio =
      'Chart.Scales.ToggleLockPriceToBarRatio'),
    (e.ChartScrollToLineTool = 'Chart.ScrollToLineTool'),
    (e.ChartSelectedObjectHide = 'Chart.SelectedObject.Hide'),
    (e.ChartSelectedObjectRemove = 'Chart.SelectedObject.Remove'),
    (e.ChartSelectedObjectShow = 'Chart.SelectedObject.Show'),
    (e.ChartSelectedObjectShowSettingsDialog =
      'Chart.SelectedObject.ShowSettingsDialog'),
    (e.ChartSelectedObjectInsertRowTable =
      'Chart.SelectedObject.InsertRowTable'),
    (e.ChartSelectedObjectInsertColumnTable =
      'Chart.SelectedObject.InsertColumnTable'),
    (e.ChartSelectedObjectRemoveRowTable =
      'Chart.SelectedObject.RemoveRowTable'),
    (e.ChartSelectedObjectRemoveColumnTable =
      'Chart.SelectedObject.RemoveColumnTable'),
    (e.ChartSelectedObjectToggleLocked = 'Chart.SelectedObject.ToggleLocked'),
    (e.ChartSelectedObjectToggleAnchored =
      'Chart.SelectedObject.ToggleAnchored'),
    (e.ChartSeriesPriceScaleToggleAutoScale =
      'Chart.Series.PriceScale.ToggleAutoScale'),
    (e.ChartSeriesPriceScaleToggleIndexedTo100 =
      'Chart.Series.PriceScale.ToggleIndexedTo100'),
    (e.ChartSeriesPriceScaleToggleInvertPriceScale =
      'Chart.Series.PriceScale.ToggleInvertPriceScale'),
    (e.ChartSeriesPriceScaleToggleLogarithmic =
      'Chart.Series.PriceScale.ToggleLogarithmic'),
    (e.ChartSeriesPriceScaleTogglePercentage =
      'Chart.Series.PriceScale.TogglePercentage'),
    (e.ChartSeriesPriceScaleToggleRegular =
      'Chart.Series.PriceScale.ToggleRegular'),
    (e.ChartSessionBreaksToggleVisibility =
      'Chart.SessionBreaks.ToggleVisibility'),
    (e.ChartSetSession = 'Chart.SetSession'),
    (e.ChartSourceChangePriceScale = 'Chart.Source.ChangePriceScale'),
    (e.ChartSourceMergeDown = 'Chart.Source.MergeDown'),
    (e.ChartSourceMergeUp = 'Chart.Source.MergeUp'),
    (e.ChartSourceMoveToNoScale = 'Chart.Source.MoveToNoScale'),
    (e.ChartSourceMoveToOtherScale = 'Chart.Source.MoveToOtherScale'),
    (e.ChartSourceMoveToPane = 'Chart.Source.MoveToPane'),
    (e.ChartSourceUnmergeDown = 'Chart.Source.UnmergeDown'),
    (e.ChartSourceUnmergeUp = 'Chart.Source.UnmergeUp'),
    (e.ChartSourceVisualOrder = 'Chart.Source.VisualOrder'),
    (e.ChartSourceVisualOrderBringForward =
      'Chart.Source.VisualOrder.BringForward'),
    (e.ChartSourceVisualOrderBringToFront =
      'Chart.Source.VisualOrder.BringToFront'),
    (e.ChartSourceVisualOrderSendBackward =
      'Chart.Source.VisualOrder.SendBackward'),
    (e.ChartSourceVisualOrderSendToBack =
      'Chart.Source.VisualOrder.SendToBack'),
    (e.ChartSourceResetInputPoints = 'Chart.Source.ResetInputPoints'),
    (e.ChartThemeApply = 'Chart.Theme.Apply'),
    (e.ChartThemeApplyCustom = 'Chart.Theme.Apply.Custom'),
    (e.ChartThemeSaveAs = 'Chart.Theme.SaveAs'),
    (e.ChartTimeScaleReset = 'Chart.TimeScale.Reset'),
    (e.ChartUndo = 'Chart.Undo'),
    (e.ChartShowAllIdeas = 'Chart.ShowAllIdeas'),
    (e.ChartShowIdeasOfFollowedUsers = 'Chart.ShowIdeasOfFollowedUsers'),
    (e.ChartShowMyIdeasOnly = 'Chart.ShowMyIdeasOnly'),
    (e.ChartToggleVisibilityAllLineTools =
      'Chart.ToggleVisibility.AllLineTools'),
    (e.ChartToggleVisibilityContinuousContractSwitch =
      'Chart.ToggleVisibility.ContinuousContractSwitch'),
    (e.ChartToggleVisibilityContractExpiration =
      'Chart.ToggleVisibility.ContractExpiration'),
    (e.ChartToggleVisibilityDividends = 'Chart.ToggleVisibility.Dividends'),
    (e.ChartToggleVisibilityEarnings = 'Chart.ToggleVisibility.Earnings'),
    (e.ChartToggleVisibilityEconomicEvents =
      'Chart.ToggleVisibility.EconomicEvents'),
    (e.ChartToggleVisibilitySplits = 'Chart.ToggleVisibility.Splits'),
    (e.ChartToggleVisibilityLatestNewsAndMinds =
      'Chart.ToggleVisibility.LatestNewsAndMinds'),
    (e.ChartToggleVisibilityKeyFactsToday =
      'Chart.ToggleVisibility.KeyFactsToday'),
    (e.ChartSourceIntervalsVisibility = 'Chart.Source.IntervalsVisibility'),
    (e.ChartSourceIntervalsVisibilityCurrentAndAbove =
      'Chart.Source.IntervalsVisibility.CurrentAndAbove'),
    (e.ChartSourceIntervalsVisibilityCurrentAndBelow =
      'Chart.Source.IntervalsVisibility.CurrentAndBelow'),
    (e.ChartSourceIntervalsVisibilityOnlyCurrent =
      'Chart.Source.IntervalsVisibility.Current'),
    (e.ChartSourceIntervalsVisibilityAll =
      'Chart.Source.IntervalsVisibility.All'),
    (e.NoteCreate = 'Note.Create'),
    (e.NoteEdit = 'Note.Edit'),
    (e.NoteRemove = 'Note.Remove'),
    (e.ObjectsTreeCreateGroup = 'ObjectsTree.CreateGroup'),
    (e.ObjectsTreeRemoveItem = 'ObjectsTree.RemoveItem'),
    (e.ObjectsTreeRenameItem = 'ObjectsTree.RenameItem'),
    (e.ObjectsTreeToggleItemLocked = 'ObjectsTree.ToggleItemLocked'),
    (e.ObjectsTreeToggleItemVisibility = 'ObjectsTree.ToggleItemVisibility'),
    (e.PineEditorConsoleCopyMessage = 'PineEditor.Console.CopyMessage'),
    (e.PineEditorConsoleToggleVisibility =
      'PineEditor.Console.ToggleVisibility'),
    (e.PineEditorConsoleClear = 'PineEditor.Console.Clear'),
    (e.ScreenerColumnRemove = 'Screener.Column.Remove'),
    (e.ScreenerFilterChange = 'Screener.Filter.Change'),
    (e.ScreenerFilterReset = 'Screener.Filter.Reset'),
    (e.ScreenerToggleVisibilityCurrency = 'Screener.ToggleVisibility.Currency'),
    (e.ScreenerToggleVisibilityDescription =
      'Screener.ToggleVisibility.Description'),
    (e.ScreenerToggleVisibilityRating = 'Screener.ToggleVisibility.Rating'),
    (e.ScreenerToggleVisibilitySymbolType =
      'Screener.ToggleVisibility.SymbolType'),
    (e.TradingCancelOrder = 'Trading.CancelOrder'),
    (e.TradingClosePosition = 'Trading.ClosePosition'),
    (e.TradingCustomActionId = 'Trading.CustomActionId'),
    (e.TradingDOMPlaceLimitOrder = 'Trading.DOMPlaceLimitOrder'),
    (e.TradingDOMPlaceMarketOrder = 'Trading.DOMPlaceMarketOrder'),
    (e.TradingDOMPlaceStopLimitOrder = 'Trading.DOMPlaceStopLimitOrder'),
    (e.TradingDOMPlaceStopOrder = 'Trading.DOMPlaceStopOrder'),
    (e.TradingEditOrder = 'Trading.EditOrder'),
    (e.TradingModifyPosition = 'Trading.ModifyPosition'),
    (e.TradingReversePosition = 'Trading.ReversePosition'),
    (e.TradingSellBuyButtonsToggleVisibility =
      'Trading.SellBuyButtonsToggleVisibility'),
    (e.TradingTradeFromChart = 'Trading.TradeFromChart'),
    (e.TradingNoOverlapMode = 'Trading.NoOverlapMode'),
    (e.TradingShowSelectBrokerPanel = 'Trading.ShowSelectBrokerPanel'),
    (e.TradingOrderTitle = 'Trading.OrderTitle'),
    (e.TradingPositionTitle = 'Trading.PositionTitle'),
    (e.WatchlistActions = 'Watchlist.Actions'),
    (e.WatchlistAddSelectedSymbolsToCompare =
      'Watchlist.AddSelectedSymbolsToCompare '),
    (e.WatchlistAddSymbolToCompare = 'Watchlist.AddSymbolToCompare'),
    (e.WatchlistAddSymbolToSection = 'Watchlist.AddSymbolToSection'),
    (e.WatchlistChangeFlaggedGroupColor = 'Watchlist.ChangeFlaggedGroupColor'),
    (e.WatchlistAddSymbol = 'Watchlist.AddSymbol'),
    (e.WatchlistCreate = 'Watchlist.Create'),
    (e.WatchlistAddSelectedSymbols = 'Watchlist.AddSelectedSymbols'),
    (e.WatchlistAddSelectedSymbolsLists = 'Watchlist.AddSelectedSymbols.Lists'),
    (e.WatchlistGetDisplayedTickerDescription =
      'Watchlist.GetDisplayedTickerDescription'),
    (e.WatchlistCreateSection = 'Watchlist.CreateSection'),
    (e.WatchlistFlagSelectedSymbols = 'Watchlist.FlagSelectedSymbols'),
    (e.WatchlistFlagSymbol = 'Watchlist.FlagSymbol'),
    (e.WatchlistOpenSymbolChart = 'Watchlist.OpenSymbolChart'),
    (e.WatchlistOpenSymbolOverview = 'Watchlist.OpenSymbolOverview'),
    (e.WatchlistRemoveSection = 'Watchlist.RemoveSection'),
    (e.WatchlistRemoveSymbol = 'Watchlist.RemoveSymbol'),
    (e.WatchlistRenameSection = 'Watchlist.RenameSection'),
    (e.WatchlistUnflagAllSymbols = 'Watchlist.UnflagAllSymbols'),
    (e.WatchlistUnflagSelectedSymbols = 'Watchlist.UnflagSelectedSymbols'),
    (e.WatchlistUnflagSymbol = 'Watchlist.UnflagSymbol')
})(e || (e = {})),
  ((e) => {
    e.extractErrorReason = (e) => e.params[1]
  })(t || (t = {})),
  ((e) => {
    ;(e.Default = 'default'), (e.FullSingleSession = 'full_single_session')
  })(i || (i = {})),
  ((e) => {
    ;(e.PeriodBack = 'period-back'), (e.TimeRange = 'time-range')
  })(o || (o = {})),
  ((e) => {
    ;(e.PeriodBack = 'period-back'), (e.TimeRange = 'time-range')
  })(r || (r = {})),
  ((e) => {
    ;(e.Open = 'market'),
      (e.Pre = 'pre_market'),
      (e.Post = 'post_market'),
      (e.Close = 'out_of_session'),
      (e.Holiday = 'holiday')
  })(n || (n = {})),
  ((e) => {
    ;(e.Separator = 'separator'), (e.Action = 'action')
  })(a || (a = {})),
  ((e) => {
    ;(e[(e.All = 0)] = 'All'),
      (e[(e.BarMarks = 1)] = 'BarMarks'),
      (e[(e.TimeScaleMarks = 2)] = 'TimeScaleMarks')
  })(s || (s = {})),
  ((e) => {
    ;(e[(e.Line = 0)] = 'Line'),
      (e[(e.Histogram = 1)] = 'Histogram'),
      (e[(e.Cross = 3)] = 'Cross'),
      (e[(e.Area = 4)] = 'Area'),
      (e[(e.Columns = 5)] = 'Columns'),
      (e[(e.Circles = 6)] = 'Circles'),
      (e[(e.LineWithBreaks = 7)] = 'LineWithBreaks'),
      (e[(e.AreaWithBreaks = 8)] = 'AreaWithBreaks'),
      (e[(e.StepLine = 9)] = 'StepLine'),
      (e[(e.StepLineWithDiamonds = 10)] = 'StepLineWithDiamonds'),
      (e[(e.StepLineWithBreaks = 11)] = 'StepLineWithBreaks')
  })(l || (l = {})),
  ((e) => {
    ;(e.Line = 'line'),
      (e.Colorer = 'colorer'),
      (e.BarColorer = 'bar_colorer'),
      (e.BgColorer = 'bg_colorer'),
      (e.TextColorer = 'text_colorer'),
      (e.OhlcColorer = 'ohlc_colorer'),
      (e.CandleWickColorer = 'wick_colorer'),
      (e.CandleBorderColorer = 'border_colorer'),
      (e.UpColorer = 'up_colorer'),
      (e.DownColorer = 'down_colorer'),
      (e.Shapes = 'shapes'),
      (e.Chars = 'chars'),
      (e.Arrows = 'arrows'),
      (e.Data = 'data'),
      (e.DataOffset = 'dataoffset'),
      (e.OhlcOpen = 'ohlc_open'),
      (e.OhlcHigh = 'ohlc_high'),
      (e.OhlcLow = 'ohlc_low'),
      (e.OhlcClose = 'ohlc_close')
  })(c || (c = {})),
  ((e) => {
    e.AlertCondition = 'alertcondition'
  })(h || (h = {})),
  ((e) => {
    ;(e[(e.None = 0)] = 'None'),
      (e[(e.Pane = 1)] = 'Pane'),
      (e[(e.DataWindow = 2)] = 'DataWindow'),
      (e[(e.PriceScale = 4)] = 'PriceScale'),
      (e[(e.StatusLine = 8)] = 'StatusLine'),
      (e[(e.All = 15)] = 'All')
  })(d || (d = {})),
  ((e) => {
    ;(e[(e.None = 0)] = 'None'),
      (e[(e.Pane = 1)] = 'Pane'),
      (e[(e.DataWindow = 2)] = 'DataWindow'),
      (e[(e.PriceScale = 4)] = 'PriceScale'),
      (e[(e.StatusLine = 8)] = 'StatusLine'),
      (e[(e.All = 15)] = 'All')
  })(g || (g = {})),
  ((e) => {
    ;(e.OhlcBars = 'ohlc_bars'), (e.OhlcCandles = 'ohlc_candles')
  })(u || (u = {})),
  ((e) => {
    ;(e.Auto = 'auto'),
      (e.Tiny = 'tiny'),
      (e.Small = 'small'),
      (e.Normal = 'normal'),
      (e.Large = 'large'),
      (e.Huge = 'huge')
  })(C || (C = {})),
  ((e) => {
    ;(e.Integer = 'integer'),
      (e.Float = 'float'),
      (e.Price = 'price'),
      (e.Bool = 'bool'),
      (e.Text = 'text'),
      (e.Symbol = 'symbol'),
      (e.Session = 'session'),
      (e.Source = 'source'),
      (e.Resolution = 'resolution'),
      (e.Time = 'time'),
      (e.BarTime = 'bar_time'),
      (e.Color = 'color'),
      (e.Textarea = 'text_area')
  })(S || (S = {})),
  ((e) => {
    ;(e[(e.None = 0)] = 'None'),
      (e[(e.DataWindow = 2)] = 'DataWindow'),
      (e[(e.StatusLine = 8)] = 'StatusLine'),
      (e[(e.All = 15)] = 'All')
  })(p || (p = {})),
  ((e) => {
    ;(e.InitialCapital = 'initial_capital'),
      (e.Currency = 'currency'),
      (e.DefaultQTYValue = 'default_qty_value'),
      (e.DefaultQTYType = 'default_qty_type'),
      (e.Pyramiding = 'pyramiding'),
      (e.ComissionValue = 'commission_value'),
      (e.ComissionType = 'commission_type'),
      (e.BacktestFillLimitsAssumtion = 'backtest_fill_limits_assumption'),
      (e.Slippage = 'slippage'),
      (e.CalcOnOrderFills = 'calc_on_order_fills'),
      (e.CalcOnEveryTick = 'calc_on_every_tick'),
      (e.MarginLong = 'margin_long'),
      (e.MarginShort = 'margin_short'),
      (e.UseBarMagnifier = 'use_bar_magnifier'),
      (e.ProcessOrdersOnClose = 'process_orders_on_close'),
      (e.FillOrdersOnStandardOHLC = 'fill_orders_on_standard_ohlc')
  })(m || (m = {})),
  ((e) => {
    ;(e.Fixed = 'fixed'),
      (e.CashPerOrder = 'cash_per_order'),
      (e.PercentOfEquity = 'percent_of_equity')
  })(_ || (_ = {})),
  ((e) => {
    ;(e.Percent = 'percent'),
      (e.CashPerContract = 'cash_per_contract'),
      (e.CashPerOrder = 'cash_per_order')
  })(y || (y = {})),
  ((e) => {
    ;(e.FirstBar = 'first_visible_bar_time'),
      (e.LastBar = 'last_visible_bar_time'),
      (e.Realtime = 'subscribeRealtime')
  })(T || (T = {})),
  ((e) => {
    ;(e.FgColor = '__chart_fgcolor'), (e.BgColor = '__chart_bgcolor')
  })(b || (b = {})),
  ((e) => {
    ;(e[(e.Right = 0)] = 'Right'),
      (e[(e.Left = 1)] = 'Left'),
      (e[(e.NoScale = 2)] = 'NoScale')
  })(P || (P = {})),
  ((e) => {
    ;(e[(e.Right = 0)] = 'Right'),
      (e[(e.Left = 1)] = 'Left'),
      (e[(e.None = 2)] = 'None')
  })(L || (L = {})),
  ((e) => {
    ;(e.TypePlots = 'plot_plot'), (e.TypeHlines = 'hline_hline')
  })(f || (f = {})),
  ((e) => {
    ;(e[(e.StopLoss = 0)] = 'StopLoss'),
      (e[(e.TrailingStop = 1)] = 'TrailingStop'),
      (e[(e.GuaranteedStop = 2)] = 'GuaranteedStop')
  })(w || (w = {})),
  ((e) => {
    ;(e.Stocks = 'stocks'),
      (e.Futures = 'futures'),
      (e.Forex = 'forex'),
      (e.Crypto = 'crypto'),
      (e.Others = 'others')
  })(A || (A = {})),
  ((e) => {
    e.Symbol = 'symbol'
  })(I || (I = {})),
  ((e) => {
    ;(e[(e.PopUp = 0)] = 'PopUp'), (e[(e.Notification = 1)] = 'Notification')
  })(v || (v = {})),
  ((e) => {
    ;(e.Quantity = 'qty'),
      (e.OrderSide = 'side'),
      (e.Price = 'price'),
      (e.Duration = 'duration'),
      (e.Brackets = 'brackets'),
      (e.StopLossType = 'slType')
  })(R || (R = {})),
  ((e) => {
    ;(e[(e.CONNECTED = 1)] = 'CONNECTED'),
      (e[(e.CONNECTING = 2)] = 'CONNECTING'),
      (e[(e.DISCONNECTED = 3)] = 'DISCONNECTED'),
      (e[(e.ERROR = 4)] = 'ERROR')
  })(O || (O = {})),
  ((e) => {
    ;(e[(e.Connected = 1)] = 'Connected'),
      (e[(e.Connecting = 2)] = 'Connecting'),
      (e[(e.Disconnected = 3)] = 'Disconnected'),
      (e[(e.Error = 4)] = 'Error')
  })(D || (D = {})),
  ((e) => {
    ;(e[(e.LIMIT = 1)] = 'LIMIT'),
      (e[(e.MARKET = 2)] = 'MARKET'),
      (e[(e.STOP = 3)] = 'STOP'),
      (e[(e.STOPLIMIT = 4)] = 'STOPLIMIT')
  })(V || (V = {})),
  ((e) => {
    ;(e[(e.Limit = 1)] = 'Limit'),
      (e[(e.Market = 2)] = 'Market'),
      (e[(e.Stop = 3)] = 'Stop'),
      (e[(e.StopLimit = 4)] = 'StopLimit')
  })(k || (k = {})),
  ((e) => {
    ;(e[(e.BUY = 1)] = 'BUY'), (e[(e.SELL = -1)] = 'SELL')
  })(E || (E = {})),
  ((e) => {
    ;(e[(e.Buy = 1)] = 'Buy'), (e[(e.Sell = -1)] = 'Sell')
  })(W || (W = {})),
  ((e) => {
    ;(e[(e.CANCELED = 1)] = 'CANCELED'),
      (e[(e.FILLED = 2)] = 'FILLED'),
      (e[(e.INACTIVE = 3)] = 'INACTIVE'),
      (e[(e.PLACING = 4)] = 'PLACING'),
      (e[(e.REJECTED = 5)] = 'REJECTED'),
      (e[(e.WORKING = 6)] = 'WORKING')
  })(F || (F = {})),
  ((e) => {
    ;(e[(e.ALL = 0)] = 'ALL'),
      (e[(e.CANCELED = 1)] = 'CANCELED'),
      (e[(e.FILLED = 2)] = 'FILLED'),
      (e[(e.INACTIVE = 3)] = 'INACTIVE'),
      (e[(e.REJECTED = 5)] = 'REJECTED'),
      (e[(e.WORKING = 6)] = 'WORKING')
  })(M || (M = {})),
  ((e) => {
    ;(e[(e.Canceled = 1)] = 'Canceled'),
      (e[(e.Filled = 2)] = 'Filled'),
      (e[(e.Inactive = 3)] = 'Inactive'),
      (e[(e.Placing = 4)] = 'Placing'),
      (e[(e.Rejected = 5)] = 'Rejected'),
      (e[(e.Working = 6)] = 'Working')
  })(B || (B = {})),
  ((e) => {
    ;(e[(e.All = 0)] = 'All'),
      (e[(e.Canceled = 1)] = 'Canceled'),
      (e[(e.Filled = 2)] = 'Filled'),
      (e[(e.Inactive = 3)] = 'Inactive'),
      (e[(e.Rejected = 5)] = 'Rejected'),
      (e[(e.Working = 6)] = 'Working')
  })(N || (N = {})),
  ((e) => {
    ;(e[(e.Order = 1)] = 'Order'), (e[(e.Position = 2)] = 'Position')
  })(U || (U = {})),
  ((e) => {
    ;(e[(e.ORDER = 1)] = 'ORDER'), (e[(e.POSITION = 2)] = 'POSITION')
  })(x || (x = {})),
  ((e) => {
    ;(e[(e.Order = 1)] = 'Order'),
      (e[(e.Position = 2)] = 'Position'),
      (e[(e.IndividualPosition = 3)] = 'IndividualPosition')
  })(H || (H = {})),
  ((e) => {
    ;(e[(e.StopLoss = 0)] = 'StopLoss'),
      (e[(e.TakeProfit = 1)] = 'TakeProfit'),
      (e[(e.TrailingStop = 2)] = 'TrailingStop'),
      (e[(e.GuaranteedStop = 3)] = 'GuaranteedStop')
  })(j || (j = {})),
  ((e) => {
    ;(e[(e.LIMITPRICE = 1)] = 'LIMITPRICE'),
      (e[(e.STOPPRICE = 2)] = 'STOPPRICE'),
      (e[(e.TAKEPROFIT = 3)] = 'TAKEPROFIT'),
      (e[(e.STOPLOSS = 4)] = 'STOPLOSS')
  })(G || (G = {})),
  ((e) => {
    ;(e[(e.LimitPrice = 1)] = 'LimitPrice'),
      (e[(e.StopPrice = 2)] = 'StopPrice'),
      (e[(e.TakeProfit = 3)] = 'TakeProfit'),
      (e[(e.StopLoss = 4)] = 'StopLoss'),
      (e[(e.Quantity = 5)] = 'Quantity')
  })(z || (z = {})),
  ((e) => {
    ;(e[(e.ERROR = 0)] = 'ERROR'), (e[(e.SUCCESS = 1)] = 'SUCCESS')
  })($ || ($ = {})),
  ((e) => {
    ;(e[(e.Error = 0)] = 'Error'), (e[(e.Success = 1)] = 'Success')
  })(J || (J = {})),
  ((e) => {
    ;(e[(e.Demo = 1)] = 'Demo'), (e[(e.Real = 0)] = 'Real')
  })(K || (K = {})),
  ((e) => {
    ;(e.Information = 'information'),
      (e.Warning = 'warning'),
      (e.Error = 'error')
  })(q || (q = {})),
  ((e) => {
    ;(e.Demo = 'demo'), (e.Live = 'live')
  })(Z || (Z = {})),
  ((e) => {
    ;(e[(e.LogOut = 0)] = 'LogOut'),
      (e[(e.FailedRestoring = 1)] = 'FailedRestoring'),
      (e[(e.Offline = 2)] = 'Offline'),
      (e[(e.APIError = 3)] = 'APIError'),
      (e[(e.TwoFactorRequired = 4)] = 'TwoFactorRequired'),
      (e[(e.CancelAuthorization = 5)] = 'CancelAuthorization'),
      (e[(e.TimeOutForAuthorization = 6)] = 'TimeOutForAuthorization'),
      (e[(e.OauthError = 7)] = 'OauthError'),
      (e[(e.BrokenConnection = 8)] = 'BrokenConnection'),
      (e[(e.Reconnect = 9)] = 'Reconnect'),
      (e[(e.FailedSignIn = 10)] = 'FailedSignIn')
  })(Q || (Q = {})),
  ((e) => {
    ;(e[(e.None = 0)] = 'None'),
      (e[(e.Pips = 1)] = 'Pips'),
      (e[(e.Ticks = 2)] = 'Ticks')
  })(Y || (Y = {})),
  ((e) => {
    ;(e.Halted = 'HALTED'),
      (e.NotShortable = 'NOT-SHORTABLE'),
      (e.HardToBorrow = 'HARD-TO-BORROW')
  })(X || (X = {})),
  ((e) => {
    ;(e[(e.Limit = 1)] = 'Limit'), (e[(e.Stop = 2)] = 'Stop')
  })(ee || (ee = {})),
  ((e) => {
    ;(e.Disallowed = 'disallowed'),
      (e.Allowed = 'allowed'),
      (e.AllowedWithWarning = 'allowed_with_warning')
  })(te || (te = {})),
  ((e) => {
    ;(e.PlaceOrder = 'place_order'),
      (e.ModifyOrder = 'modify_order'),
      (e.CancelOrder = 'cancel_order'),
      (e.ModifyPosition = 'modify_position'),
      (e.ClosePosition = 'close_position'),
      (e.ModifyIndividualPosition = 'modify_individual_position'),
      (e.CloseIndividualPosition = 'close_individual_position'),
      (e.CloseNetPosition = 'close_net_position')
  })(ie || (ie = {})),
  ((e) => {
    ;(e.Date = 'date'),
      (e.DateOrDateTime = 'dateOrDateTime'),
      (e.Default = 'default'),
      (e.Fixed = 'fixed'),
      (e.FixedInCurrency = 'fixedInCurrency'),
      (e.VariablePrecision = 'variablePrecision'),
      (e.FormatQuantity = 'formatQuantity'),
      (e.FormatPrice = 'formatPrice'),
      (e.FormatPriceForexSup = 'formatPriceForexSup'),
      (e.FormatPriceInCurrency = 'formatPriceInCurrency'),
      (e.IntegerSeparated = 'integerSeparated'),
      (e.LocalDate = 'localDate'),
      (e.LocalDateOrDateTime = 'localDateOrDateTime'),
      (e.Percentage = 'percentage'),
      (e.Pips = 'pips'),
      (e.Profit = 'profit'),
      (e.ProfitInInstrumentCurrency = 'profitInInstrumentCurrency'),
      (e.Side = 'side'),
      (e.PositionSide = 'positionSide'),
      (e.Status = 'status'),
      (e.Symbol = 'symbol'),
      (e.Text = 'text'),
      (e.Type = 'type'),
      (e.MarginPercent = 'marginPercent'),
      (e.Empty = 'empty')
  })(oe || (oe = {})),
  ((e) => {
    ;(e[(e.LastPriceAndPercentageValue = 0)] = 'LastPriceAndPercentageValue'),
      (e[(e.LastValueAccordingToScale = 1)] = 'LastValueAccordingToScale')
  })(re || (re = {})),
  ((e) => {
    ;(e[(e.Solid = 0)] = 'Solid'),
      (e[(e.Dotted = 1)] = 'Dotted'),
      (e[(e.Dashed = 2)] = 'Dashed')
  })(ne || (ne = {})),
  ((e) => {
    ;(e[(e.Offline = 0)] = 'Offline'),
      (e[(e.Resolving = 1)] = 'Resolving'),
      (e[(e.Loading = 2)] = 'Loading'),
      (e[(e.Ready = 3)] = 'Ready'),
      (e[(e.InvalidSymbol = 4)] = 'InvalidSymbol'),
      (e[(e.Snapshot = 5)] = 'Snapshot'),
      (e[(e.EOD = 6)] = 'EOD'),
      (e[(e.Pulse = 7)] = 'Pulse'),
      (e[(e.Delayed = 8)] = 'Delayed'),
      (e[(e.DelayedSteaming = 9)] = 'DelayedSteaming'),
      (e[(e.NoBars = 10)] = 'NoBars'),
      (e[(e.Replay = 11)] = 'Replay'),
      (e[(e.Error = 12)] = 'Error'),
      (e[(e.CalculationError = 13)] = 'CalculationError'),
      (e[(e.UnsupportedResolution = 14)] = 'UnsupportedResolution')
  })(ae || (ae = {})),
  ((e) => {
    ;(e[(e.Markers = 0)] = 'Markers'),
      (e[(e.Stepline = 1)] = 'Stepline'),
      (e[(e.Simple = 2)] = 'Simple')
  })(se || (se = {})),
  ((e) => {
    ;(e[(e.Bar = 0)] = 'Bar'),
      (e[(e.Candle = 1)] = 'Candle'),
      (e[(e.Line = 2)] = 'Line'),
      (e[(e.Area = 3)] = 'Area'),
      (e[(e.Renko = 4)] = 'Renko'),
      (e[(e.Kagi = 5)] = 'Kagi'),
      (e[(e.PnF = 6)] = 'PnF'),
      (e[(e.LineBreak = 7)] = 'LineBreak'),
      (e[(e.HeikinAshi = 8)] = 'HeikinAshi'),
      (e[(e.HollowCandle = 9)] = 'HollowCandle'),
      (e[(e.Baseline = 10)] = 'Baseline'),
      (e[(e.Range = 11)] = 'Range'),
      (e[(e.HiLo = 12)] = 'HiLo'),
      (e[(e.Column = 13)] = 'Column'),
      (e[(e.LineWithMarkers = 14)] = 'LineWithMarkers'),
      (e[(e.Stepline = 15)] = 'Stepline'),
      (e[(e.HLCArea = 16)] = 'HLCArea'),
      (e[(e.VolFootprint = 17)] = 'VolFootprint'),
      (e[(e.TPO = 18)] = 'TPO'),
      (e[(e.VolCandle = 19)] = 'VolCandle'),
      (e[(e.SVP = 20)] = 'SVP'),
      (e[(e.HLCBars = 21)] = 'HLCBars')
  })(le || (le = {})),
  ((e) => {
    ;(e.TwentyFourHours = '24-hours'), (e.TwelveHours = '12-hours')
  })(ce || (ce = {})),
  ((e) => {
    ;(e[(e.Initial = 2)] = 'Initial'),
      (e[(e.SeriesZOrderIsAlwaysZero = 3)] = 'SeriesZOrderIsAlwaysZero'),
      (e[(e.Current = 3)] = 'Current')
  })(he || (he = {})),
  ((e) => {
    ;(e[(e.Money = 0)] = 'Money'),
      (e[(e.Pips = 1)] = 'Pips'),
      (e[(e.Percentage = 2)] = 'Percentage')
  })(de || (de = {})),
  ((e) => {
    ;(e[(e.Left = 0)] = 'Left'),
      (e[(e.Center = 1)] = 'Center'),
      (e[(e.Right = 2)] = 'Right')
  })(ge || (ge = {})),
  de.Money,
  de.Money,
  ge.Right,
  ((e) => {
    ;(e[(e.Background = 0)] = 'Background'),
      (e[(e.Foreground = 1)] = 'Foreground'),
      (e[(e.Topmost = 2)] = 'Topmost')
  })(ue || (ue = {})),
  ((e) => {
    ;(e[(e.Unavailable = 0)] = 'Unavailable'),
      (e[(e.AvailableReadonlyAlwaysDisabled = 1)] =
        'AvailableReadonlyAlwaysDisabled'),
      (e[(e.AvailableReadonlyAlwaysEnabled = 2)] =
        'AvailableReadonlyAlwaysEnabled'),
      (e[(e.Available = 3)] = 'Available')
  })(Ce || (Ce = {})),
  ((e) => {
    ;(e[(e.ViewportChangeUserAction = 0)] = 'ViewportChangeUserAction'),
      (e[(e.DataUpdate = 1)] = 'DataUpdate'),
      (e[(e.SeriesRestart = 2)] = 'SeriesRestart'),
      (e[(e.SeriesCompleted = 3)] = 'SeriesCompleted'),
      (e[(e.StudyCreation = 4)] = 'StudyCreation')
  })(Se || (Se = {})),
  ((e) => {
    e[(e.Chart = 0)] = 'Chart'
  })(pe || (pe = {})),
  ((e) => {
    ;(e.AlwaysOn = 'alwaysOn'),
      (e.VisibleOnMouseOver = 'visibleOnMouseOver'),
      (e.AlwaysOff = 'alwaysOff')
  })(me || (me = {})),
  ((e) => {
    ;(e[(e.Normal = 0)] = 'Normal'),
      (e[(e.Log = 1)] = 'Log'),
      (e[(e.Percentage = 2)] = 'Percentage'),
      (e[(e.IndexedTo100 = 3)] = 'IndexedTo100')
  })(_e || (_e = {})),
  ((e) => {
    ;(e[(e.Bars = 0)] = 'Bars'),
      (e[(e.Candles = 1)] = 'Candles'),
      (e[(e.Line = 2)] = 'Line'),
      (e[(e.Area = 3)] = 'Area'),
      (e[(e.HeikenAshi = 8)] = 'HeikenAshi'),
      (e[(e.HollowCandles = 9)] = 'HollowCandles'),
      (e[(e.Baseline = 10)] = 'Baseline'),
      (e[(e.HiLo = 12)] = 'HiLo'),
      (e[(e.Column = 13)] = 'Column'),
      (e[(e.LineWithMarkers = 14)] = 'LineWithMarkers'),
      (e[(e.Stepline = 15)] = 'Stepline'),
      (e[(e.HLCArea = 16)] = 'HLCArea'),
      (e[(e.VolCandle = 19)] = 'VolCandle'),
      (e[(e.HLCBars = 21)] = 'HLCBars'),
      (e[(e.Renko = 4)] = 'Renko'),
      (e[(e.Kagi = 5)] = 'Kagi'),
      (e[(e.PointAndFigure = 6)] = 'PointAndFigure'),
      (e[(e.LineBreak = 7)] = 'LineBreak')
  })(ye || (ye = {})),
  ((e) => {
    e.Value = '_seriesId'
  })(Te || (Te = {})),
  ((e) => {
    ;(e[(e.InvalidSymbol = 0)] = 'InvalidSymbol'),
      (e[(e.ReplayUnsupported = 1)] = 'ReplayUnsupported'),
      (e[(e.UnsupportedDepth = 2)] = 'UnsupportedDepth'),
      (e[(e.UnsupportedIntradyReplay = 3)] = 'UnsupportedIntradyReplay')
  })(be || (be = {})),
  ((e) => {
    ;(e.LeftToRight = 'left_to_right'), (e.RightToLeft = 'right_to_left')
  })(Pe || (Pe = {})),
  ((e) => {
    ;(e.Relative = 'relative'), (e.Absolute = 'absolute')
  })(Le || (Le = {})),
  ((e) => {
    ;(e.UpDown = 'Up/Down'), (e.Total = 'Total'), (e.Delta = 'Delta')
  })(fe || (fe = {})),
  ((e) => {
    ;(e.AboveBar = 'AboveBar'),
      (e.BelowBar = 'BelowBar'),
      (e.Top = 'Top'),
      (e.Bottom = 'Bottom'),
      (e.Right = 'Right'),
      (e.Left = 'Left'),
      (e.Absolute = 'Absolute'),
      (e.AbsoluteUp = 'AbsoluteUp'),
      (e.AbsoluteDown = 'AbsoluteDown')
  })(we || (we = {})),
  ((e) => {
    ;(e.Left = 'left'), (e.Center = 'center'), (e.Right = 'right')
  })(Ae || (Ae = {})),
  ((e) => {
    ;(e.Top = 'top'), (e.Middle = 'middle'), (e.Bottom = 'bottom')
  })(Ie || (Ie = {})),
  ((e) => {
    ;(e[(e.Solid = 0)] = 'Solid'),
      (e[(e.Dotted = 1)] = 'Dotted'),
      (e[(e.Dashed = 2)] = 'Dashed')
  })(ve || (ve = {}))
const Oe = {
    width: 800,
    height: 500,
    interval: '1D',
    timezone: 'Etc/UTC',
    container: '',
    library_path: '',
    locale: 'en',
    widgetbar: {
      details: !1,
      watchlist: !1,
      news: !1,
      datawindow: !1,
      watchlist_settings: { default_symbols: [] },
    },
    overrides: { 'mainSeriesProperties.showCountdown': !1 },
    studies_overrides: {},
    trading_customization: { position: {}, order: {} },
    brokerConfig: { configFlags: {} },
    fullscreen: !1,
    autosize: !1,
    disabled_features: [],
    enabled_features: [],
    debug: !1,
    logo: {},
    time_frames: [
      { text: '5y', resolution: '1W' },
      { text: '1y', resolution: '1W' },
      { text: '6m', resolution: '120' },
      { text: '3m', resolution: '60' },
      { text: '1m', resolution: '30' },
      { text: '5d', resolution: '5' },
      { text: '1d', resolution: '1' },
    ],
    client_id: '0',
    user_id: '0',
    charts_storage_api_version: '1.0',
    favorites: {
      intervals: [],
      chartTypes: [],
      indicators: [],
      drawingTools: [],
    },
  },
  De = JSON.parse(
    '[{"iso":"ar","dir":"rtl","language":"ar"},{"iso":"pt","dir":"ltr","language":"pt"},{"iso":"ca","dir":"ltr","language":"ca_ES"},{"iso":"cs","dir":"ltr","language":"cs"},{"iso":"de","dir":"ltr","language":"de"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"es","dir":"ltr","language":"es"},{"iso":"fr","dir":"ltr","language":"fr"},{"iso":"he","dir":"rtl","language":"he_IL"},{"iso":"hu","dir":"ltr","language":"hu_HU"},{"iso":"id","dir":"ltr","language":"id_ID"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"it","dir":"ltr","language":"it"},{"iso":"ja","dir":"ltr","language":"ja"},{"iso":"ko","dir":"ltr","language":"ko"},{"iso":"ms","dir":"ltr","language":"ms_MY"},{"iso":"pl","dir":"ltr","language":"pl"},{"iso":"ru","dir":"ltr","language":"ru"},{"iso":"sv","dir":"ltr","language":"sv"},{"iso":"th","dir":"ltr","language":"th"},{"iso":"tr","dir":"ltr","language":"tr"},{"iso":"vi","dir":"ltr","language":"vi"},{"iso":"zh-Hans","dir":"ltr","language":"zh"},{"iso":"zh-Hant","dir":"ltr","language":"zh_TW"},{"iso":"el","dir":"ltr","language":"el"},{"iso":"nl","dir":"ltr","language":"nl_NL"},{"iso":"ro","dir":"ltr","language":"ro"}]',
  )
let Ve = !1
function ke() {
  return 'CL v29.3.0 (internal id 600f67b870c88a89c46e6ef27f17e88ca7fba741 @ 2025-05-08T13:32:24.827Z)'
}
const Ee = class {
  constructor(e) {
    if (
      ((this._id = `tradingview_${((1048576 * (1 + Math.random())) | 0).toString(16).substring(1)}`),
      (this._ready = !1),
      (this._readyHandlers = []),
      (this._onWindowResize = this._autoResizeChart.bind(this)),
      !e.datafeed)
    )
      throw new Error('Datafeed is not defined')
    e.overrides?.['mainSeriesProperties.priceAxisProperties.lockScale'] &&
      (console.warn(
        'mainSeriesProperties.priceAxisProperties.lockScale can not be set to true within the widget constructor',
      ),
      delete e.overrides['mainSeriesProperties.priceAxisProperties.lockScale']),
      (this._options = Re(Oe, e))
    'dark' === (this._options.theme ?? 'light').toLowerCase() &&
      void 0 === this._options.loading_screen &&
      (this._options.loading_screen = { backgroundColor: '#131722' }),
      (this._options.debug || this._options.debug_broker) &&
        (Ve ||
          ((Ve = !0),
          console.log(
            'Using CL v29.3.0 (internal id 600f67b870c88a89c46e6ef27f17e88ca7fba741 @ 2025-05-08T13:32:24.827Z)',
          ))),
      (this._innerWindowLoaded = new Promise((e) => {
        this._innerWindowResolver = e
      })),
      this._create()
  }
  setDebugMode(e) {
    this._innerAPI().setDebugMode(e)
  }
  onChartReady(e) {
    this._ready ? e.call(this) : this._readyHandlers.push(e)
  }
  headerReady() {
    return this._innerWindowLoaded.then(() => this._innerWindow().headerReady())
  }
  onGrayedObjectClicked(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.onGrayedObjectClicked(e)
    })
  }
  onShortcut(e, t) {
    this._doWhenInnerWindowLoaded((i) => {
      i.createShortcutAction(e, t)
    })
  }
  subscribe(e, t) {
    this._doWhenInnerApiLoaded((i) => {
      i.subscribe(e, t)
    })
  }
  unsubscribe(e, t) {
    this._doWhenInnerApiLoaded((i) => {
      i.unsubscribe(e, t)
    })
  }
  chart(e) {
    return this._innerAPI().chart(e)
  }
  getLanguage() {
    return this._options.locale
  }
  setSymbol(e, t, i) {
    this._innerAPI().changeSymbol(e, t, i)
  }
  remove() {
    window.removeEventListener('resize', this._onWindowResize),
      this._readyHandlers.splice(0, this._readyHandlers.length),
      delete window[this._id],
      this._iFrame.parentNode &&
        this._iFrame.parentNode.removeChild(this._iFrame)
  }
  closePopupsAndDialogs() {
    this._doWhenInnerApiLoaded((e) => {
      e.closePopupsAndDialogs()
    })
  }
  selectLineTool(e, t) {
    return this._innerAPI().selectLineTool(e, t)
  }
  selectedLineTool() {
    return this._innerAPI().selectedLineTool()
  }
  save(e, t) {
    this._innerAPI().saveChart(e, t)
  }
  async load(e, t) {
    return this._innerAPI().loadChart({ json: e, extendedData: t })
  }
  getSavedCharts(e) {
    this._innerAPI().getSavedCharts(e)
  }
  loadChartFromServer(e) {
    return this._innerAPI().loadChartFromServer(e)
  }
  saveChartToServer(e, t, i) {
    this._innerAPI().saveChartToServer(e, t, i)
  }
  removeChartFromServer(e, t) {
    this._innerAPI().removeChartFromServer(e, t)
  }
  onContextMenu(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.onContextMenu(e)
    })
  }
  createButton(e) {
    return this._innerWindow().createButton(e)
  }
  removeButton(e) {
    this._innerWindow().removeButton(e)
  }
  createDropdown(e) {
    return this._innerWindow().createDropdown(e)
  }
  showNoticeDialog(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.showNoticeDialog(e)
    })
  }
  showConfirmDialog(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.showConfirmDialog(e)
    })
  }
  showLoadChartDialog() {
    this._innerAPI().showLoadChartDialog()
  }
  showSaveAsChartDialog() {
    this._innerAPI().showSaveAsChartDialog()
  }
  symbolInterval() {
    return this._innerAPI().getSymbolInterval()
  }
  mainSeriesPriceFormatter() {
    return this._innerAPI().mainSeriesPriceFormatter()
  }
  getIntervals() {
    return this._innerAPI().getIntervals()
  }
  getStudiesList() {
    return this._innerAPI().getStudiesList()
  }
  getStudyInputs(e) {
    return this._innerAPI().getStudyInputs(e)
  }
  getStudyStyles(e) {
    return this._innerAPI().getStudyStyles(e)
  }
  addCustomCSSFile(e) {
    this._innerWindow().addCustomCSSFile(e)
  }
  applyOverrides(e) {
    ;(this._options = Re(this._options, { overrides: e })),
      this._doWhenInnerWindowLoaded((t) => {
        t.applyOverrides(e)
      })
  }
  applyStudiesOverrides(e) {
    this._doWhenInnerWindowLoaded((t) => {
      t.applyStudiesOverrides(e)
    })
  }
  watchList() {
    return this._innerAPI().watchlist()
  }
  news() {
    return this._innerAPI().news()
  }
  widgetbar() {
    return this._innerAPI().widgetbar()
  }
  activeChart() {
    return this._innerAPI().activeChart()
  }
  activeChartIndex() {
    return this._innerAPI().activeChartIndex()
  }
  setActiveChart(e) {
    return this._innerAPI().setActiveChart(e)
  }
  chartsCount() {
    return this._innerAPI().chartsCount()
  }
  layout() {
    return this._innerAPI().layout()
  }
  setLayout(e) {
    this._innerAPI().setLayout(e)
  }
  layoutName() {
    return this._innerAPI().layoutName()
  }
  resetLayoutSizes(e) {
    this._innerAPI().resetLayoutSizes(e)
  }
  changeTheme(e, t) {
    return this._innerWindow().changeTheme(e, t)
  }
  getTheme() {
    return this._innerWindow().getTheme()
  }
  takeScreenshot() {
    this._doWhenInnerApiLoaded((e) => {
      e.takeScreenshot()
    })
  }
  lockAllDrawingTools() {
    return this._innerAPI().lockAllDrawingTools()
  }
  hideAllDrawingTools() {
    return this._innerAPI().hideAllDrawingTools()
  }
  drawOnAllChartsEnabled() {
    return this._innerAPI().drawOnAllChartsEnabled()
  }
  drawOnAllCharts(e) {
    this._innerAPI().drawOnAllCharts(e)
  }
  magnetEnabled() {
    return this._innerAPI().magnetEnabled()
  }
  magnetMode() {
    return this._innerAPI().magnetMode()
  }
  undoRedoState() {
    return this._innerAPI().undoRedoState()
  }
  setIntervalLinkingEnabled(e) {
    this._innerAPI().setIntervalLinkingEnabled(e)
  }
  setDateRangeLinkingEnabled(e) {
    this._innerAPI().setDateRangeLinkingEnabled(e)
  }
  setTimeFrame(e) {
    this._innerAPI().setTimeFrame(e)
  }
  symbolSync() {
    return this._innerAPI().symbolSync()
  }
  intervalSync() {
    return this._innerAPI().intervalSync()
  }
  crosshairSync() {
    return this._innerAPI().crosshairSync()
  }
  timeSync() {
    return this._innerAPI().timeSync()
  }
  dateRangeSync() {
    return this._innerAPI().dateRangeSync()
  }
  setFeatureEnabled(e, t) {
    this._innerAPI().setFeatureEnabled(e, t)
  }
  getAllFeatures() {
    return this._innerWindow().getAllFeatures()
  }
  clearUndoHistory() {
    return this._innerAPI().clearUndoHistory()
  }
  undo() {
    return this._innerAPI().undo()
  }
  redo() {
    return this._innerAPI().redo()
  }
  startFullscreen() {
    this._innerAPI().startFullscreen()
  }
  exitFullscreen() {
    this._innerAPI().exitFullscreen()
  }
  takeClientScreenshot(e) {
    return this._innerAPI().takeClientScreenshot(e)
  }
  navigationButtonsVisibility() {
    return this._innerWindow().getNavigationButtonsVisibility()
  }
  paneButtonsVisibility() {
    return this._innerWindow().getPaneButtonsVisibility()
  }
  dateFormat() {
    return this._innerWindow().getDateFormat()
  }
  timeHoursFormat() {
    return this._innerWindow().getTimeHoursFormat()
  }
  currencyAndUnitVisibility() {
    return this._innerWindow().getCurrencyAndUnitVisibility()
  }
  supportedChartTypes() {
    return this._innerAPI().supportedChartTypes()
  }
  watermark() {
    return this._innerAPI().watermark()
  }
  customSymbolStatus() {
    return this._innerWindow().customSymbolStatus()
  }
  setCSSCustomProperty(e, t) {
    if (!1 === e.startsWith('--'))
      throw new Error('customPropertyName should begin with a double hyphen')
    this._innerWindow().document.body.style.setProperty(e, t)
  }
  getCSSCustomPropertyValue(e) {
    if (!1 === e.startsWith('--'))
      throw new Error('customPropertyName should begin with a double hyphen')
    const t = this._innerWindow().document.body,
      i = t.style.getPropertyValue(e)
    if (i) return i
    return getComputedStyle(t).getPropertyValue(e)
  }
  unloadUnusedCharts() {
    this._innerAPI().unloadUnusedCharts()
  }
  async customThemes() {
    return this._innerWindow().customThemes()
  }
  resetCache() {
    this._innerAPI().resetCache()
  }
  linking() {
    return this._innerAPI().linking
  }
  _innerAPI() {
    return this._innerWindow().tradingViewApi
  }
  _innerWindow() {
    return this._iFrame.contentWindow
  }
  _doWhenInnerWindowLoaded(e) {
    this._ready
      ? e(this._innerWindow())
      : this._innerWindowLoaded.then(() => {
          e(this._innerWindow())
        })
  }
  _doWhenInnerApiLoaded(e) {
    this._doWhenInnerWindowLoaded((t) => {
      t.doWhenApiIsReady(() => e(this._innerAPI()))
    })
  }
  _autoResizeChart() {
    this._options.fullscreen &&
      ((this._iFrame.style.height = window.innerHeight + 'px'),
      We &&
        setTimeout(() => {
          this._iFrame.style.height = window.innerHeight + 'px'
        }, 30))
  }
  async _create() {
    const e =
        this._options.enabled_features?.includes(
          'iframe_loading_same_origin',
        ) ?? !1,
      t =
        e ||
        (this._options.enabled_features?.includes(
          'iframe_loading_compatibility_mode',
        ) ??
          !1),
      [i, o] = this._render(!t, e),
      r = this._options.container,
      n = 'string' == typeof r ? document.getElementById(r) : r
    if (null === n)
      throw new Error(`There is no such element - #${this._options.container}`)
    ;(n.innerHTML = i), (this._iFrame = n.querySelector(`#${this._id}`))
    const a = this._iFrame
    e && (await this._innerWindowEvent('sameOriginLoad')),
      t &&
        (a.contentWindow
          ? (a.contentWindow.document.open(),
            a.contentWindow.document.write(o),
            a.contentWindow.document.close())
          : console.warn(
              'Unable to locate contentWindow for the created iframe. Please try disabling the `iframe_loading_compatibility_mode` featureset.',
            )),
      this._innerWindow().addEventListener(
        'innerWindowLoad',
        (e) => {
          ;(e.detail.received = !0),
            ((e, t) => {
              if (void 0 === e) throw new Error(`${t} is undefined`)
              return e
            })(this._innerWindowResolver, '_innerWindowResolver')()
        },
        { once: !0 },
      ),
      (this._options.autosize || this._options.fullscreen) &&
        ((a.style.width = '100%'),
        this._options.fullscreen || (a.style.height = '100%')),
      window.addEventListener('resize', this._onWindowResize),
      this._onWindowResize(),
      this._innerWindowLoaded.then(() => {
        try {
          this._innerWindow().widgetReady(() => {
            this._ready = !0
            for (const e of this._readyHandlers)
              try {
                e.call(this)
              } catch (e) {
                console.error(e)
              }
            this._innerWindow().initializationFinished()
          })
        } catch (e) {
          if (
            e instanceof Error &&
            /widgetReady is not a function/.test(e.message)
          )
            throw new Error(
              `There was an error when loading the library. Usually this error means the library failed to load its static files. Check that the library files are available at ${window.location.host}/${this._options.library_path || ''} or correct the library_path option.`,
            )
        }
      })
  }
  _innerWindowEvent(e) {
    return new Promise((t) => {
      this._innerWindow().addEventListener(e, t, { once: !0 })
    })
  }
  _render(e, t) {
    const i = window
    if (
      ((i[this._id] = {
        datafeed: this._options.datafeed,
        customFormatters: this._options.custom_formatters,
        brokerFactory: this._options.broker_factory,
        overrides: this._options.overrides,
        studiesOverrides: this._options.studies_overrides,
        tradingCustomization: this._options.trading_customization,
        disabledFeatures: this._options.disabled_features,
        enabledFeatures: this._options.enabled_features,
        brokerConfig: this._options.broker_config || this._options.brokerConfig,
        restConfig: this._options.restConfig,
        favorites: this._options.favorites,
        logo: this._options.logo,
        numeric_formatting: this._options.numeric_formatting,
        rss_news_feed: this._options.rss_news_feed,
        rss_news_title: this._options.rss_news_title,
        newsProvider: this._options.news_provider,
        loadLastChart: this._options.load_last_chart,
        saveLoadAdapter: this._options.save_load_adapter,
        loading_screen: this._options.loading_screen,
        settingsAdapter: this._options.settings_adapter,
        getCustomIndicators: this._options.custom_indicators_getter,
        additionalSymbolInfoFields: this._options.additional_symbol_info_fields,
        headerWidgetButtonsMode: this._options.header_widget_buttons_mode,
        customTranslateFunction: this._options.custom_translate_function,
        symbolSearchComplete: this._options.symbol_search_complete,
        contextMenu: this._options.context_menu,
        settingsOverrides: this._options.settings_overrides,
        timeframe: this._options.timeframe,
        customTimezones: this._options.custom_timezones,
        customChartDescriptionFunction:
          this._options.custom_chart_description_function,
        customThemes: this._options.custom_themes,
        imageStorageAdapter: this._options.image_storage_adapter,
      }),
      this._options.saved_data)
    )
      (i[this._id].chartContent = { json: this._options.saved_data }),
        this._options.saved_data_meta_info &&
          (i[this._id].chartContentExtendedData =
            this._options.saved_data_meta_info)
    else if (!this._options.load_last_chart && !this._options.symbol)
      throw new Error(
        "Symbol is not defined: either 'symbol' or 'load_last_chart' option must be set",
      )
    if (
      (this._options.library_path &&
        !this._options.library_path.endsWith('/') &&
        console.warn(
          'library_path option should contain a trailing forward slash',
        ),
      this._options.locale)
    ) {
      const e = encodeURIComponent(this._options.locale)
      De.findIndex((t) => t.language === e) >= 0 ||
        (console.warn("locale isn't supported. Using default of `en`."),
        (this._options.locale = 'en'))
    }
    const o = ((e, t) => {
      const i = new URL(`${e || ''}`, location.href).href,
        o = JSON.parse(
          '["bundles/runtime.528f81f7a425983444d8.js","bundles/__LANG__.9488.2f156b47fe84118759c5.js","bundles/1996.25e6f30e7a095ec239f4.css","bundles/207.2e06ffb7ce05936178f2.js","bundles/library.2a35263e52ab75f5729a.js"]',
        ),
        r = encodeURIComponent(t),
        n = De.find((e) => e.language === r) ?? { iso: 'en', dir: 'ltr' },
        a = `lang="${n.iso}" dir="${n.dir}"`,
        s = `\n${((e, t, i) => {
          if (void 0 === e) return ''
          const o = [],
            r = []
          for (const n of e)
            n.endsWith('.js')
              ? o.push(
                  `<script defer crossorigin="anonymous" src="${n.replace('__LANG__', i)}"><\/script>`,
                )
              : n.endsWith('.css') &&
                r.push(
                  `<link type="text/css" href="${t ? n.replace(/\.css$/i, '.rtl.css') : n}" rel="stylesheet"/>`,
                )
          return [...o, ...r].join('\n')
        })(o, 'rtl' === n.dir, r)}\n`
      return `<!DOCTYPE html><html ${(l = { bundles: s, localeLanguage: r, htmlAttrs: a, libraryPath: i }).htmlAttrs}><head><base href="${l.libraryPath}"><meta charset="utf-8"><script>window===window.parent&&(location.href="about:blank")<\/script> ${l.bundles} </head><body class="chart-page unselectable on-widget"><div class="loading-indicator" id="loading-indicator"></div><script>var JSServer={},__initialEnabledFeaturesets=["charting_library"]<\/script><script>(function() {\n\t\twindow.urlParams = (function () {\n\t\t\tvar match,\n\t\t\t\tpl\t = /\\+/g,  // Regex for replacing addition symbol with a space\n\t\t\t\tsearch = /([^&=]+)=?([^&]*)/g,\n\t\t\t\tdecode = function (s) { return decodeURIComponent(s.replace(pl, ' ')).replace(/<\\/?[^>]+(>|$)/g, ''); },\n\t\t\t\tquery = function() {\n\t\t\t\t\t// We don't use hash on the url because: safari 13 throws an error if you attempt this\n\t\t\t\t\t// on a blob, and safari 14 will strip hash from blob urls.\n\t\t\t\t\tif (frameElement && frameElement.dataset.widgetOptions) {\n\t\t\t\t\t\treturn frameElement.dataset.widgetOptions;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthrow "Unexpected use of this page";\n\t\t\t\t\t}\n\t\t\t\t}(),\n\t\t\t\tresult = {};\n\n\t\t\twhile (match = search.exec(query)) {\n\t\t\t\tresult[decode(match[1])] = decode(match[2]);\n\t\t\t}\n\n\t\t\tvar additionalSettingsObject = window.parent[result.uid];\n\n\t\t\tvar customObjectNames = ['datafeed', 'customFormatters', 'brokerFactory', 'save_load_adapter', 'customTranslateFunction', 'contextMenu'];\n\n\t\t\tfor (var p in additionalSettingsObject) {\n\t\t\t\tif (customObjectNames.indexOf(p) === -1) {\n\t\t\t\t\tresult[p] = JSON.stringify(additionalSettingsObject[p]);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn result;\n\t\t})();\n\n\t\twindow.locale = urlParams.locale;\n\t\twindow.language = urlParams.locale; // a very big attention needed here\n\t\twindow.customTranslateFunction = window.parent[urlParams.uid].customTranslateFunction;\n\t\twindow.customChartDescriptionFunction = window.parent[urlParams.uid].customChartDescriptionFunction;\n\n\t\twindow.addCustomCSSFile = function(href) {\n\t\t\tvar link = document.createElement('link');\n\t\t\tlink.setAttribute('type', 'text/css');\n\t\t\tlink.setAttribute('rel', 'stylesheet');\n\t\t\tlink.setAttribute('href', href);\n\t\t\tlink.setAttribute('cross-origin', 'anonymous');\n\n\t\t\twindow.loadedCustomCss = new Promise((resolve) => {\n\t\t\t\tlink.onload = resolve;\n\t\t\t\tlink.onerror = resolve;\n\t\t\t});\n\t\t\tdocument.body.appendChild(link);\n\t\t};\n\n\t\twindow.loadedCustomCss = Promise.resolve();\n\t\tif (!!urlParams.customCSS) {\n\t\t\twindow.addCustomCSSFile(urlParams.customCSS);\n\t\t}\n\n\t\tvar loadingScreenParams = {};\n\n\t\tif (typeof urlParams.loading_screen === 'string') {\n\t\t\ttry {\n\t\t\t\tloadingScreenParams = JSON.parse(urlParams.loading_screen);\n\t\t\t} catch(e) {}\n\t\t}\n\n\t\tvar loadingIndicatorElement = document.getElementById('loading-indicator');\n\n\t\tif (loadingScreenParams.backgroundColor) {\n\t\t\tloadingIndicatorElement.style = 'background-color: ' + loadingScreenParams.backgroundColor;\n\t\t}\n\n\t\t!function(){"use strict";var t,e=new WeakMap;!function(t){t[t.Element=1]="Element",t[t.Document=9]="Document"}(t||(t={}));var n={mini:"xsmall",xxsmall:"xxsmall",xsmall:"xsmall",small:"small",medium:"medium",large:"large"};var s,i,o,r,l=(void 0===r&&(r=""),s='<div class="tv-spinner '.concat(r,'" role="progressbar"></div>'),i=function(t){var n,s;return n=document.documentElement,e&&(s=e.get(n)),s||((s=n.ownerDocument.createRange()).selectNodeContents(n),e&&e.set(n,s)),s.createContextualFragment(t)}(s),null!==(o=i.firstElementChild)&&i.removeChild(o),o),a=function(){function t(t){this._shown=!1,this._el=l.cloneNode(!0),this.setSize(n[t||"large"])}return t.prototype.spin=function(t){return this._el.classList.add("tv-spinner--shown"),void 0===this._container&&(this._container=t,void 0!==t&&t.appendChild(this._el)),this._shown=!0,this},t.prototype.stop=function(t){return t&&void 0!==this._container&&this._container.removeChild(this._el),this._el&&this._el.classList.remove("tv-spinner--shown"),this._shown=!1,this},t.prototype.setStyle=function(t){var e=this;return Object.keys(t).forEach((function(n){var s=t[n];void 0!==s&&e._el.style.setProperty(n,s)})),this},t.prototype.style=function(){return this._el.style},t.prototype.setSize=function(t){var e=void 0!==t?"tv-spinner--size_".concat(t):"";return this._el.className="tv-spinner ".concat(e," ").concat(this._shown?"tv-spinner--shown":""),this},t.prototype.getEl=function(){return this._el},t.prototype.destroy=function(){this.stop(),delete this._el,delete this._container},t}();window.Spinner=a}();\n\n\n\t\tvar spinnerColor = (loadingScreenParams.foregroundColor) ? loadingScreenParams.foregroundColor : undefined;\n\n\t\tvar loadingSpinner = new Spinner('large').setStyle({\n\t\t\t'--tv-spinner-color': spinnerColor,\n\t\t\tzIndex: String(2e9),\n\t\t});\n\t\tloadingSpinner.getEl().classList.add('spinner');\n\t\tloadingSpinner.spin(loadingIndicatorElement);\n\t})();<\/script></body></html>`
      var l
    })(this._options.library_path || '', this._options.locale)
    let r = new URL('about:blank')
    if (e) {
      const e = new Blob([o], { type: 'text/html' }),
        t = URL.createObjectURL(e)
      r = new URL(t)
    } else if (t) {
      const e = this._options.library_path ?? '/'
      r = new URL(e + 'sameorigin.html', location.origin)
    }
    const n =
      'symbol=' +
      encodeURIComponent(this._options.symbol || '') +
      '&interval=' +
      encodeURIComponent(this._options.interval) +
      (this._options.toolbar_bg
        ? '&toolbarbg=' +
          encodeURIComponent(this._options.toolbar_bg.replace('#', ''))
        : '') +
      (this._options.studies_access
        ? '&studiesAccess=' +
          encodeURIComponent(JSON.stringify(this._options.studies_access))
        : '') +
      '&widgetbar=' +
      encodeURIComponent(JSON.stringify(this._options.widgetbar)) +
      (this._options.drawings_access
        ? '&drawingsAccess=' +
          encodeURIComponent(JSON.stringify(this._options.drawings_access))
        : '') +
      '&timeFrames=' +
      encodeURIComponent(JSON.stringify(this._options.time_frames)) +
      '&locale=' +
      encodeURIComponent(this._options.locale) +
      '&uid=' +
      encodeURIComponent(this._id) +
      '&clientId=' +
      encodeURIComponent(String(this._options.client_id)) +
      '&userId=' +
      encodeURIComponent(String(this._options.user_id)) +
      (this._options.charts_storage_url
        ? '&chartsStorageUrl=' +
          encodeURIComponent(this._options.charts_storage_url)
        : '') +
      (this._options.charts_storage_api_version
        ? '&chartsStorageVer=' +
          encodeURIComponent(this._options.charts_storage_api_version)
        : '') +
      (this._options.custom_css_url
        ? '&customCSS=' + encodeURIComponent(this._options.custom_css_url)
        : '') +
      (this._options.custom_font_family
        ? '&customFontFamily=' +
          encodeURIComponent(this._options.custom_font_family)
        : '') +
      (this._options.auto_save_delay
        ? '&autoSaveDelay=' +
          encodeURIComponent(String(this._options.auto_save_delay))
        : '') +
      '&debug=' +
      encodeURIComponent(String(this._options.debug)) +
      (this._options.debug_broker
        ? '&debugBroker=' +
          encodeURIComponent(String(this._options.debug_broker))
        : '') +
      (this._options.snapshot_url
        ? '&snapshotUrl=' + encodeURIComponent(this._options.snapshot_url)
        : '') +
      (this._options.timezone
        ? '&timezone=' + encodeURIComponent(this._options.timezone)
        : '') +
      (this._options.study_count_limit
        ? '&studyCountLimit=' +
          encodeURIComponent(String(this._options.study_count_limit))
        : '') +
      (this._options.symbol_search_request_delay
        ? '&ssreqdelay=' +
          encodeURIComponent(String(this._options.symbol_search_request_delay))
        : '') +
      (this._options.compare_symbols
        ? '&compareSymbols=' +
          encodeURIComponent(JSON.stringify(this._options.compare_symbols))
        : '') +
      (this._options.theme
        ? '&theme=' + encodeURIComponent(String(this._options.theme))
        : '') +
      (this._options.header_widget_buttons_mode
        ? '&header_widget_buttons_mode=' +
          encodeURIComponent(String(this._options.header_widget_buttons_mode))
        : '') +
      (this._options.time_scale
        ? '&time_scale=' +
          encodeURIComponent(JSON.stringify(this._options.time_scale))
        : '')
    return [
      `<iframe\n\t\tversion="CL v29.3.0 (internal id 600f67b870c88a89c46e6ef27f17e88ca7fba741 @ 2025-05-08T13:32:24.827Z)" id="${this._id}" name="${this._id}" src="${r.href}" data-widget-options="${n}"\n\t\t${this._options.autosize || this._options.fullscreen ? '' : `width="${this._options.width}" height="${this._options.height}"`} title="Financial Chart" frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;">\n\t</iframe>`,
      o,
    ]
  }
}
'undefined' != typeof window &&
  ((window.TradingView = window.TradingView || {}),
  (window.TradingView.version = ke))
const We =
  !(
    'undefined' == typeof window ||
    !window.navigator ||
    !window.navigator.userAgent
  ) && window.navigator.userAgent.includes('CriOS')
export {
  e as ActionId,
  le as ChartStyle,
  s as ClearMarksMode,
  D as ConnectionStatus,
  f as FilledAreaType,
  Pe as HHistDirection,
  l as LineStudyPlotStyle,
  ve as LineStyle,
  we as MarkLocation,
  n as MarketStatus,
  a as MenuItemType,
  J as NotificationType,
  u as OhlcStudyPlotStyle,
  q as OrderOrPositionMessageType,
  B as OrderStatus,
  N as OrderStatusFilter,
  z as OrderTicketFocusControl,
  k as OrderType,
  ne as OverrideLineStyle,
  re as OverridePriceAxisLastValueMode,
  H as ParentType,
  de as PlDisplay,
  _e as PriceScaleMode,
  ye as SeriesType,
  W as Side,
  oe as StandardFormatterName,
  S as StudyInputType,
  d as StudyPlotDisplayTarget,
  c as StudyPlotType,
  P as StudyTargetPriceScale,
  o as TimeFrameType,
  ce as TimeHoursFormat,
  ge as TradedGroupHorizontalAlignment,
  me as VisibilityType,
  ke as version,
  Ee as widget,
}
