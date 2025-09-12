var TradingView = ((e) => {
  var t,
    i,
    o,
    r,
    n,
    a,
    s,
    l,
    d,
    c,
    h,
    g,
    u,
    C,
    S,
    p,
    m,
    y,
    T,
    _,
    b,
    P,
    L,
    w,
    A,
    f,
    v,
    I,
    O,
    R,
    D,
    k,
    V,
    F,
    E,
    W,
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
    de,
    ce,
    he,
    ge,
    ue,
    Ce,
    Se,
    pe,
    me,
    ye,
    Te,
    _e,
    be,
    Pe,
    Le,
    we,
    Ae,
    fe,
    ve,
    Ie,
    Oe
  function Re(e, t) {
    const i = { ...e }
    for (const o in t)
      'object' != typeof e[o] || null === e[o] || Array.isArray(e[o])
        ? void 0 !== t[o] && (i[o] = t[o])
        : (i[o] = Re(e[o], t[o]))
    return i
  }
  ;(e.ActionId = void 0),
    ((t = e.ActionId || (e.ActionId = {})).UnknownAction = 'UnknownAction'),
    (t.Spinner = 'Spinner'),
    (t.Loading = 'Loading'),
    (t.AlertAdd = 'Alert.Add'),
    (t.AlertEdit = 'Alert.Edit'),
    (t.AlertsClone = 'Alerts.Clone'),
    (t.AlertsRemove = 'Alerts.Remove'),
    (t.AlertsRemoveAll = 'Alerts.RemoveAll'),
    (t.AlertsRemoveFiltered = 'Alerts.RemoveFiltered'),
    (t.AlertsRemoveAllInactive = 'Alerts.RemoveAllInactive'),
    (t.AlertsRemoveAllWatchlistInactive = 'Alerts.RemoveAllWatchlistInactive'),
    (t.AlertsRemoveFires = 'Alerts.RemoveFires'),
    (t.AlertsRestart = 'Alerts.Restart'),
    (t.AlertsRestartAllInactive = 'Alerts.RestartAllInactive'),
    (t.AlertsRestartFilteredInactive = 'Alerts.RestartFilteredInactive'),
    (t.AlertsStop = 'Alerts.Stop'),
    (t.AlertsStopAll = 'Alerts.StopAll'),
    (t.AlertsStopFilteredActive = 'Alerts.StopFilteredActive'),
    (t.AlertsExportFiresToCSV = 'Alerts.ExportFiresToCSV'),
    (t.AlertsLogClear = 'AlertsLog.Clear'),
    (t.ChartAddIndicatorToAllCharts = 'Chart.AddIndicatorToAllCharts'),
    (t.ChartAddSymbolToWatchList = 'Chart.AddSymbolToWatchList'),
    (t.ChartAlertLabelToggleExtendLines = 'Chart.AlertLabel.ToggleExtendLines'),
    (t.ChartApplyIndicatorsToAllCharts = 'Chart.ApplyIndicatorsToAllCharts'),
    (t.ChartIndicatorApplyChildIndicator =
      'Chart.Indicator.ApplyChildIndicator'),
    (t.ChartIndicatorApplyFinancials = 'Chart.Indicator.ApplyFinancials'),
    (t.ChartIndicatorAbout = 'Chart.Indicator.About'),
    (t.ChartIndicatorPineLogs = 'Chart.Indicator.PineLogs'),
    (t.ChartIndicatorPineSource = 'Chart.Indicator.PineSource'),
    (t.ChartIndicatorAddFavorites = 'Chart.Indicator.AddFavorites'),
    (t.ChartChangeTimeZone = 'Chart.ChangeTimeZone'),
    (t.ChartClipboardCopyPrice = 'Chart.Clipboard.CopyPrice'),
    (t.ChartClipboardCopyLineTools = 'Chart.Clipboard.CopyLineTools'),
    (t.ChartClipboardCopySource = 'Chart.Clipboard.CopySource'),
    (t.ChartClipboardPasteSource = 'Chart.Clipboard.PasteSource'),
    (t.ChartCrosshairLockVerticalCursor = 'Chart.Crosshair.LockVerticalCursor'),
    (t.ChartCrosshairPlusButtonDrawHorizontalLine =
      'Chart.Crosshair.PlusButton.DrawHorizontalLine'),
    (t.ChartCustomActionId = 'Chart.CustomActionId'),
    (t.ChartDialogsShowChangeInterval = 'Chart.Dialogs.ShowChangeInterval'),
    (t.ChartDialogsShowChangeSymbol = 'Chart.Dialogs.ShowChangeSymbol'),
    (t.ChartDialogsShowCompareOrAddSymbol =
      'Chart.Dialogs.ShowCompareOrAddSymbol'),
    (t.ChartDialogsShowGeneralSettings = 'Chart.Dialogs.ShowGeneralSettings'),
    (t.ChartDialogsShowGeneralSettingsLegendTab =
      'Chart.Dialogs.ShowGeneralSettings.LegendTab'),
    (t.ChartDialogsShowGeneralSettingsSymbolTab =
      'Chart.Dialogs.ShowGeneralSettings.SymbolTab'),
    (t.ChartDialogsShowGeneralScalesTab =
      'Chart.Dialogs.ShowGeneralSettings.ScalesTab'),
    (t.ChartDialogsShowGeneralSettingsEventsTab =
      'Chart.Dialogs.ShowGeneralSettings.EventsTab'),
    (t.ChartDialogsShowGeneralSettingsAlertsTab =
      'Chart.Dialogs.ShowGeneralSettings.AlertsTab'),
    (t.ChartDialogsShowGoToDate = 'Chart.Dialogs.ShowGoToDate'),
    (t.ChartDialogsShowInsertIndicators = 'Chart.Dialogs.ShowInsertIndicators'),
    (t.ChartDialogsShowInsertFinancials = 'Chart.Dialogs.ShowInsertFinancials'),
    (t.ChartDialogsShowInsertSeasonals = 'Chart.Dialogs.ShowInsertSeasonals'),
    (t.ChartDialogsShowInsertTechnicals = 'Chart.Dialogs.ShowInsertTechnicals'),
    (t.ChartDialogsShowInsertForecast = 'Chart.Dialogs.ShowInsertForecast'),
    (t.ChartDialogsShowInsertOptions = 'Chart.Dialogs.ShowInsertOptions'),
    (t.ChartDetailsMetricsActionId = 'Chart.Dialogs.DetailsMetrics'),
    (t.ChartDialogsShowInsertEconomyIndicators =
      'Chart.Dialogs.ShowInsertEconomyIndicators'),
    (t.ChartDialogsShowSymbolInfo = 'Chart.Dialogs.ShowSymbolInfo'),
    (t.ChartDrawingToolbarToggleVisibility =
      'Chart.DrawingToolbar.ToggleVisibility'),
    (t.ChartExternalActionId = 'Chart.ExternalActionId'),
    (t.ChartFavoriteDrawingToolsToolbarHide =
      'Chart.FavoriteDrawingToolsToolbar.Hide'),
    (t.ChartIndicatorShowSettingsDialog = 'Chart.Indicator.ShowSettingsDialog'),
    (t.ChartLegendToggleLastDayChangeValuesVisibility =
      'Chart.Legend.ToggleLastDayChangeValuesVisibility'),
    (t.ChartLinkingGroupSync = 'Chart.LinkingGroupSync'),
    (t.ChartLinkingGroupSyncChangeGroup = 'Chart.LinkingGroupSync.ChangeGroup'),
    (t.ChartLegendToggleBarChangeValuesVisibility =
      'Chart.Legend.ToggleBarChangeValuesVisibility'),
    (t.ChartLegendTogglePriceSourceVisibility =
      'Chart.Legend.TogglePriceSourceVisibility'),
    (t.ChartLegendToggleIndicatorArgumentsVisibility =
      'Chart.Legend.ToggleIndicatorArgumentsVisibility'),
    (t.ChartLegendToggleIndicatorTitlesVisibility =
      'Chart.Legend.ToggleIndicatorTitlesVisibility'),
    (t.ChartLegendToggleIndicatorValuesVisibility =
      'Chart.Legend.ToggleIndicatorValuesVisibility'),
    (t.ChartLegendToggleOhlcValuesVisibility =
      'Chart.Legend.ToggleOhlcValuesVisibility'),
    (t.ChartLegendToggleOpenMarketStatusVisibility =
      'Chart.Legend.ToggleOpenMarketStatusVisibility'),
    (t.ChartLegendToggleSymbolVisibility =
      'Chart.Legend.ToggleSymbolVisibility'),
    (t.ChartLegendToggleVolumeVisibility =
      'Chart.Legend.ToggleVolumeVisibility'),
    (t.ChartLines = 'Chart.Lines'),
    (t.ChartLinesToggleBidAskLinesVisibility =
      'Chart.Lines.ToggleBidAskLinesVisibility'),
    (t.ChartLinesToggleHighLowLinesVisibility =
      'Chart.Lines.ToggleHighLowLinesVisibility'),
    (t.ChartLinesToggleAverageLineVisibility =
      'Chart.Lines.ToggleAverageLineVisibility'),
    (t.ChartLinesTogglePrePostMarketPriceLineVisibility =
      'Chart.Lines.TogglePrePostMarketPriceLineVisibility'),
    (t.ChartLinesToggleSeriesPrevCloseLineVisibility =
      'Chart.Lines.ToggleSeriesPrevCloseLineVisibility'),
    (t.ChartLinesToggleSeriesPriceLineVisibility =
      'Chart.Lines.ToggleSeriesPriceLineVisibility'),
    (t.ChartLineToolBarsPatternToggleFlipped =
      'Chart.LineTool.BarsPattern.ToggleFlipped'),
    (t.ChartLineToolBarsPatternToggleMirrored =
      'Chart.LineTool.BarsPattern.ToggleMirrored'),
    (t.ChartLineToolRiskRewardReverse = 'Chart.LineTool.RiskReward.Reverse'),
    (t.ChartLineToolClone = 'Chart.LineTool.Clone'),
    (t.ChartLineToolCreateLimitOrderFromState =
      'Chart.LineTool.CreateLimitOrderFromState'),
    (t.ChartLineToolElliotChangeDegreeProperty =
      'Chart.LineTool.Elliot.ChangeDegreeProperty'),
    (t.ChartLineToolNoSync = 'Chart.LineTool.NoSync'),
    (t.ChartLineToolPitchforkChangeTypeToInside =
      'Chart.LineTool.Pitchfork.ChangeTypeToInside'),
    (t.ChartLineToolPitchforkChangeTypeToModifiedSchiff =
      'Chart.LineTool.Pitchfork.ChangeTypeToModifiedSchiff'),
    (t.ChartLineToolPitchforkChangeTypeToOriginal =
      'Chart.LineTool.Pitchfork.ChangeTypeToOriginal'),
    (t.ChartLineToolPitchforkChangeTypeToSchiff =
      'Chart.LineTool.Pitchfork.ChangeTypeToSchiff'),
    (t.ChartLineToolSyncInLayout = 'Chart.LineTool.SyncInLayout'),
    (t.ChartLineToolSyncGlobally = 'Chart.LineTool.SyncGlobally'),
    (t.ChartLineToolTemplates = 'Chart.LineTool.Templates'),
    (t.ChartLineToolTemplatesApply = 'Chart.LineTool.Templates.Apply'),
    (t.ChartLineToolTemplatesApplyDefaults =
      'Chart.LineTool.Templates.ApplyDefaults'),
    (t.ChartLineToolTemplatesSaveAs = 'Chart.LineTool.Templates.SaveAs'),
    (t.ChartLineToolToolbarChangeFontSizeProperty =
      'Chart.LineTool.Toolbar.ChangeFontSizeProperty'),
    (t.ChartLineToolToolbarChangeLineStyleToDashed =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDashed'),
    (t.ChartLineToolToolbarChangeLineStyleToDotted =
      'Chart.LineTool.Toolbar.ChangeLineStyleToDotted'),
    (t.ChartLineToolToolbarChangeLineStyleToSolid =
      'Chart.LineTool.Toolbar.ChangeLineStyleToSolid'),
    (t.ChartMarksToggleVisibility = 'Chart.Marks.ToggleVisibility'),
    (t.ChartMoveChartInLayout = 'Chart.MoveChartInLayout'),
    (t.ChartMoveChartInLayoutBack = 'Chart.MoveChartInLayout.Back'),
    (t.ChartMoveChartInLayoutForward = 'Chart.MoveChartInLayout.Forward'),
    (t.ChartTpoResetAllMergesAndSplits = 'Chart.TPO.ResetAllMergesAndSplits'),
    (t.ChartTpoSplitBlock = 'Chart.TPO.SplitBlock'),
    (t.ChartTpoMergeBlock = 'Chart.TPO.MergeBlock'),
    (t.ChartObjectTreeShow = 'Chart.ObjectTree.Show'),
    (t.ChartDataWindowShow = 'Chart.DataWindow.Show'),
    (t.ChartPaneControlsDeletePane = 'Chart.PaneControls.DeletePane'),
    (t.ChartPaneControlsMaximizePane = 'Chart.PaneControls.MaximizePane'),
    (t.ChartPaneControlsMinimizePane = 'Chart.PaneControls.MinimizePane'),
    (t.ChartPaneControlsMovePaneDown = 'Chart.PaneControls.MovePaneDown'),
    (t.ChartPaneControlsMovePaneUp = 'Chart.PaneControls.MovePaneUp'),
    (t.ChartPaneControlsCollapsePane = 'Chart.PaneControls.CollapsePane'),
    (t.ChartPaneControlsRestorePane = 'Chart.PaneControls.RestorePane'),
    (t.ChartPriceScaleLabels = 'Chart.PriceScale.Labels'),
    (t.ChartPriceScaleLabelsToggleBidAskLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleBidAskLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleHighLowPriceLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleHighLowPriceLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleAveragePriceLabelVisibility =
      'Chart.PriceScale.Labels.ToggleAveragePriceLabelVisibility'),
    (t.ChartPriceScaleLabelsToggleIndicatorsNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsNameLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleIndicatorsValueLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleIndicatorsValueLabelsVisibility'),
    (t.ChartPriceScaleLabelsTogglePrePostMarketLabelsVisibility =
      'Chart.PriceScale.Labels.TogglePrePostMarketLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleNoOverlappingLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleNoOverlappingLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleSeriesLastValueVisibility =
      'Chart.PriceScale.Labels.ToggleSeriesLastValueVisibility'),
    (t.ChartPriceScaleLabelsToggleSymbolNameLabelsVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolNameLabelsVisibility'),
    (t.ChartPriceScaleLabelsToggleSymbolPrevCloseValueVisibility =
      'Chart.PriceScale.Labels.ToggleSymbolPrevCloseValueVisibility'),
    (t.ChartPriceScaleMergeAllScales = 'Chart.PriceScale.MergeAllScales'),
    (t.ChartPriceScaleMergeAllScalesToLeft =
      'Chart.PriceScale.MergeAllScalesToLeft'),
    (t.ChartPriceScaleMergeAllScalesToRight =
      'Chart.PriceScale.MergeAllScalesToRight'),
    (t.ChartPriceScaleMoveToLeft = 'Chart.PriceScale.MoveToLeft'),
    (t.ChartPriceScaleMoveToRight = 'Chart.PriceScale.MoveToRight'),
    (t.ChartPriceScaleReset = 'Chart.PriceScale.Reset'),
    (t.ChartPriceScaleToggleAddOrderPlusButtonVisibility =
      'Chart.PriceScale.ToggleAddOrderPlusButtonVisibility'),
    (t.ChartPriceScaleToggleAutoScale = 'Chart.PriceScale.ToggleAutoScale'),
    (t.ChartPriceScaleToggleAutoScaleSeriesOnly =
      'Chart.PriceScale.ToggleAutoScaleSeriesOnly'),
    (t.ChartPriceScaleToggleCountdownToBarCloseVisibility =
      'Chart.PriceScale.ToggleCountdownToBarCloseVisibility'),
    (t.ChartPriceScaleToggleIndexedTo100 =
      'Chart.PriceScale.ToggleIndexedTo100'),
    (t.ChartPriceScaleToggleInvertScale = 'Chart.PriceScale.ToggleInvertScale'),
    (t.ChartPriceScaleToggleLogarithmic = 'Chart.PriceScale.ToggleLogarithmic'),
    (t.ChartPriceScaleTogglePercentage = 'Chart.PriceScale.TogglePercentage'),
    (t.ChartPriceScaleToggleRegular = 'Chart.PriceScale.ToggleRegular'),
    (t.ChartRedo = 'Chart.Redo'),
    (t.ChartRemoveAllIndicators = 'Chart.RemoveAllIndicators'),
    (t.ChartRemoveAllIndicatorsAndLineTools =
      'Chart.RemoveAllIndicatorsAndLineTools'),
    (t.ChartRemoveAllLineTools = 'Chart.RemoveAllLineTools'),
    (t.ChartScalesReset = 'Chart.Scales.Reset'),
    (t.ChartScalesToggleLockPriceToBarRatio =
      'Chart.Scales.ToggleLockPriceToBarRatio'),
    (t.ChartScrollToLineTool = 'Chart.ScrollToLineTool'),
    (t.ChartSelectedObjectHide = 'Chart.SelectedObject.Hide'),
    (t.ChartSelectedObjectRemove = 'Chart.SelectedObject.Remove'),
    (t.ChartSelectedObjectShow = 'Chart.SelectedObject.Show'),
    (t.ChartSelectedObjectShowSettingsDialog =
      'Chart.SelectedObject.ShowSettingsDialog'),
    (t.ChartSelectedObjectInsertRowTable =
      'Chart.SelectedObject.InsertRowTable'),
    (t.ChartSelectedObjectInsertColumnTable =
      'Chart.SelectedObject.InsertColumnTable'),
    (t.ChartSelectedObjectRemoveRowTable =
      'Chart.SelectedObject.RemoveRowTable'),
    (t.ChartSelectedObjectRemoveColumnTable =
      'Chart.SelectedObject.RemoveColumnTable'),
    (t.ChartSelectedObjectToggleLocked = 'Chart.SelectedObject.ToggleLocked'),
    (t.ChartSelectedObjectToggleAnchored =
      'Chart.SelectedObject.ToggleAnchored'),
    (t.ChartSeriesPriceScaleToggleAutoScale =
      'Chart.Series.PriceScale.ToggleAutoScale'),
    (t.ChartSeriesPriceScaleToggleIndexedTo100 =
      'Chart.Series.PriceScale.ToggleIndexedTo100'),
    (t.ChartSeriesPriceScaleToggleInvertPriceScale =
      'Chart.Series.PriceScale.ToggleInvertPriceScale'),
    (t.ChartSeriesPriceScaleToggleLogarithmic =
      'Chart.Series.PriceScale.ToggleLogarithmic'),
    (t.ChartSeriesPriceScaleTogglePercentage =
      'Chart.Series.PriceScale.TogglePercentage'),
    (t.ChartSeriesPriceScaleToggleRegular =
      'Chart.Series.PriceScale.ToggleRegular'),
    (t.ChartSessionBreaksToggleVisibility =
      'Chart.SessionBreaks.ToggleVisibility'),
    (t.ChartSetSession = 'Chart.SetSession'),
    (t.ChartSourceChangePriceScale = 'Chart.Source.ChangePriceScale'),
    (t.ChartSourceMergeDown = 'Chart.Source.MergeDown'),
    (t.ChartSourceMergeUp = 'Chart.Source.MergeUp'),
    (t.ChartSourceMoveToNoScale = 'Chart.Source.MoveToNoScale'),
    (t.ChartSourceMoveToOtherScale = 'Chart.Source.MoveToOtherScale'),
    (t.ChartSourceMoveToPane = 'Chart.Source.MoveToPane'),
    (t.ChartSourceUnmergeDown = 'Chart.Source.UnmergeDown'),
    (t.ChartSourceUnmergeUp = 'Chart.Source.UnmergeUp'),
    (t.ChartSourceVisualOrder = 'Chart.Source.VisualOrder'),
    (t.ChartSourceVisualOrderBringForward =
      'Chart.Source.VisualOrder.BringForward'),
    (t.ChartSourceVisualOrderBringToFront =
      'Chart.Source.VisualOrder.BringToFront'),
    (t.ChartSourceVisualOrderSendBackward =
      'Chart.Source.VisualOrder.SendBackward'),
    (t.ChartSourceVisualOrderSendToBack =
      'Chart.Source.VisualOrder.SendToBack'),
    (t.ChartSourceResetInputPoints = 'Chart.Source.ResetInputPoints'),
    (t.ChartThemeApply = 'Chart.Theme.Apply'),
    (t.ChartThemeApplyCustom = 'Chart.Theme.Apply.Custom'),
    (t.ChartThemeSaveAs = 'Chart.Theme.SaveAs'),
    (t.ChartTimeScaleReset = 'Chart.TimeScale.Reset'),
    (t.ChartUndo = 'Chart.Undo'),
    (t.ChartShowAllIdeas = 'Chart.ShowAllIdeas'),
    (t.ChartShowIdeasOfFollowedUsers = 'Chart.ShowIdeasOfFollowedUsers'),
    (t.ChartShowMyIdeasOnly = 'Chart.ShowMyIdeasOnly'),
    (t.ChartToggleVisibilityAllLineTools =
      'Chart.ToggleVisibility.AllLineTools'),
    (t.ChartToggleVisibilityContinuousContractSwitch =
      'Chart.ToggleVisibility.ContinuousContractSwitch'),
    (t.ChartToggleVisibilityContractExpiration =
      'Chart.ToggleVisibility.ContractExpiration'),
    (t.ChartToggleVisibilityDividends = 'Chart.ToggleVisibility.Dividends'),
    (t.ChartToggleVisibilityEarnings = 'Chart.ToggleVisibility.Earnings'),
    (t.ChartToggleVisibilityEconomicEvents =
      'Chart.ToggleVisibility.EconomicEvents'),
    (t.ChartToggleVisibilitySplits = 'Chart.ToggleVisibility.Splits'),
    (t.ChartToggleVisibilityLatestNewsAndMinds =
      'Chart.ToggleVisibility.LatestNewsAndMinds'),
    (t.ChartToggleVisibilityKeyFactsToday =
      'Chart.ToggleVisibility.KeyFactsToday'),
    (t.ChartSourceIntervalsVisibility = 'Chart.Source.IntervalsVisibility'),
    (t.ChartSourceIntervalsVisibilityCurrentAndAbove =
      'Chart.Source.IntervalsVisibility.CurrentAndAbove'),
    (t.ChartSourceIntervalsVisibilityCurrentAndBelow =
      'Chart.Source.IntervalsVisibility.CurrentAndBelow'),
    (t.ChartSourceIntervalsVisibilityOnlyCurrent =
      'Chart.Source.IntervalsVisibility.Current'),
    (t.ChartSourceIntervalsVisibilityAll =
      'Chart.Source.IntervalsVisibility.All'),
    (t.NoteCreate = 'Note.Create'),
    (t.NoteEdit = 'Note.Edit'),
    (t.NoteRemove = 'Note.Remove'),
    (t.ObjectsTreeCreateGroup = 'ObjectsTree.CreateGroup'),
    (t.ObjectsTreeRemoveItem = 'ObjectsTree.RemoveItem'),
    (t.ObjectsTreeRenameItem = 'ObjectsTree.RenameItem'),
    (t.ObjectsTreeToggleItemLocked = 'ObjectsTree.ToggleItemLocked'),
    (t.ObjectsTreeToggleItemVisibility = 'ObjectsTree.ToggleItemVisibility'),
    (t.PineEditorConsoleCopyMessage = 'PineEditor.Console.CopyMessage'),
    (t.PineEditorConsoleToggleVisibility =
      'PineEditor.Console.ToggleVisibility'),
    (t.PineEditorConsoleClear = 'PineEditor.Console.Clear'),
    (t.ScreenerColumnRemove = 'Screener.Column.Remove'),
    (t.ScreenerFilterChange = 'Screener.Filter.Change'),
    (t.ScreenerFilterReset = 'Screener.Filter.Reset'),
    (t.ScreenerToggleVisibilityCurrency = 'Screener.ToggleVisibility.Currency'),
    (t.ScreenerToggleVisibilityDescription =
      'Screener.ToggleVisibility.Description'),
    (t.ScreenerToggleVisibilityRating = 'Screener.ToggleVisibility.Rating'),
    (t.ScreenerToggleVisibilitySymbolType =
      'Screener.ToggleVisibility.SymbolType'),
    (t.TradingCancelOrder = 'Trading.CancelOrder'),
    (t.TradingClosePosition = 'Trading.ClosePosition'),
    (t.TradingCustomActionId = 'Trading.CustomActionId'),
    (t.TradingDOMPlaceLimitOrder = 'Trading.DOMPlaceLimitOrder'),
    (t.TradingDOMPlaceMarketOrder = 'Trading.DOMPlaceMarketOrder'),
    (t.TradingDOMPlaceStopLimitOrder = 'Trading.DOMPlaceStopLimitOrder'),
    (t.TradingDOMPlaceStopOrder = 'Trading.DOMPlaceStopOrder'),
    (t.TradingEditOrder = 'Trading.EditOrder'),
    (t.TradingModifyPosition = 'Trading.ModifyPosition'),
    (t.TradingReversePosition = 'Trading.ReversePosition'),
    (t.TradingSellBuyButtonsToggleVisibility =
      'Trading.SellBuyButtonsToggleVisibility'),
    (t.TradingTradeFromChart = 'Trading.TradeFromChart'),
    (t.TradingNoOverlapMode = 'Trading.NoOverlapMode'),
    (t.TradingShowSelectBrokerPanel = 'Trading.ShowSelectBrokerPanel'),
    (t.TradingOrderTitle = 'Trading.OrderTitle'),
    (t.TradingPositionTitle = 'Trading.PositionTitle'),
    (t.WatchlistActions = 'Watchlist.Actions'),
    (t.WatchlistAddSelectedSymbolsToCompare =
      'Watchlist.AddSelectedSymbolsToCompare '),
    (t.WatchlistAddSymbolToCompare = 'Watchlist.AddSymbolToCompare'),
    (t.WatchlistAddSymbolToSection = 'Watchlist.AddSymbolToSection'),
    (t.WatchlistChangeFlaggedGroupColor = 'Watchlist.ChangeFlaggedGroupColor'),
    (t.WatchlistAddSymbol = 'Watchlist.AddSymbol'),
    (t.WatchlistCreate = 'Watchlist.Create'),
    (t.WatchlistAddSelectedSymbols = 'Watchlist.AddSelectedSymbols'),
    (t.WatchlistAddSelectedSymbolsLists = 'Watchlist.AddSelectedSymbols.Lists'),
    (t.WatchlistGetDisplayedTickerDescription =
      'Watchlist.GetDisplayedTickerDescription'),
    (t.WatchlistCreateSection = 'Watchlist.CreateSection'),
    (t.WatchlistFlagSelectedSymbols = 'Watchlist.FlagSelectedSymbols'),
    (t.WatchlistFlagSymbol = 'Watchlist.FlagSymbol'),
    (t.WatchlistOpenSymbolChart = 'Watchlist.OpenSymbolChart'),
    (t.WatchlistOpenSymbolOverview = 'Watchlist.OpenSymbolOverview'),
    (t.WatchlistRemoveSection = 'Watchlist.RemoveSection'),
    (t.WatchlistRemoveSymbol = 'Watchlist.RemoveSymbol'),
    (t.WatchlistRenameSection = 'Watchlist.RenameSection'),
    (t.WatchlistUnflagAllSymbols = 'Watchlist.UnflagAllSymbols'),
    (t.WatchlistUnflagSelectedSymbols = 'Watchlist.UnflagSelectedSymbols'),
    (t.WatchlistUnflagSymbol = 'Watchlist.UnflagSymbol'),
    ((e) => {
      e.extractErrorReason = (e) => e.params[1]
    })(i || (i = {})),
    ((e) => {
      ;(e.Default = 'default'), (e.FullSingleSession = 'full_single_session')
    })(o || (o = {})),
    (e.TimeFrameType = void 0),
    ((r = e.TimeFrameType || (e.TimeFrameType = {})).PeriodBack =
      'period-back'),
    (r.TimeRange = 'time-range'),
    ((e) => {
      ;(e.PeriodBack = 'period-back'), (e.TimeRange = 'time-range')
    })(n || (n = {})),
    (e.MarketStatus = void 0),
    ((a = e.MarketStatus || (e.MarketStatus = {})).Open = 'market'),
    (a.Pre = 'pre_market'),
    (a.Post = 'post_market'),
    (a.Close = 'out_of_session'),
    (a.Holiday = 'holiday'),
    (e.MenuItemType = void 0),
    ((s = e.MenuItemType || (e.MenuItemType = {})).Separator = 'separator'),
    (s.Action = 'action'),
    (e.ClearMarksMode = void 0),
    ((l = e.ClearMarksMode || (e.ClearMarksMode = {}))[(l.All = 0)] = 'All'),
    (l[(l.BarMarks = 1)] = 'BarMarks'),
    (l[(l.TimeScaleMarks = 2)] = 'TimeScaleMarks'),
    (e.LineStudyPlotStyle = void 0),
    ((d = e.LineStudyPlotStyle || (e.LineStudyPlotStyle = {}))[(d.Line = 0)] =
      'Line'),
    (d[(d.Histogram = 1)] = 'Histogram'),
    (d[(d.Cross = 3)] = 'Cross'),
    (d[(d.Area = 4)] = 'Area'),
    (d[(d.Columns = 5)] = 'Columns'),
    (d[(d.Circles = 6)] = 'Circles'),
    (d[(d.LineWithBreaks = 7)] = 'LineWithBreaks'),
    (d[(d.AreaWithBreaks = 8)] = 'AreaWithBreaks'),
    (d[(d.StepLine = 9)] = 'StepLine'),
    (d[(d.StepLineWithDiamonds = 10)] = 'StepLineWithDiamonds'),
    (d[(d.StepLineWithBreaks = 11)] = 'StepLineWithBreaks'),
    (e.StudyPlotType = void 0),
    ((c = e.StudyPlotType || (e.StudyPlotType = {})).Line = 'line'),
    (c.Colorer = 'colorer'),
    (c.BarColorer = 'bar_colorer'),
    (c.BgColorer = 'bg_colorer'),
    (c.TextColorer = 'text_colorer'),
    (c.OhlcColorer = 'ohlc_colorer'),
    (c.CandleWickColorer = 'wick_colorer'),
    (c.CandleBorderColorer = 'border_colorer'),
    (c.UpColorer = 'up_colorer'),
    (c.DownColorer = 'down_colorer'),
    (c.Shapes = 'shapes'),
    (c.Chars = 'chars'),
    (c.Arrows = 'arrows'),
    (c.Data = 'data'),
    (c.DataOffset = 'dataoffset'),
    (c.OhlcOpen = 'ohlc_open'),
    (c.OhlcHigh = 'ohlc_high'),
    (c.OhlcLow = 'ohlc_low'),
    (c.OhlcClose = 'ohlc_close'),
    ((e) => {
      e.AlertCondition = 'alertcondition'
    })(h || (h = {})),
    (e.StudyPlotDisplayTarget = void 0),
    ((g = e.StudyPlotDisplayTarget || (e.StudyPlotDisplayTarget = {}))[
      (g.None = 0)
    ] = 'None'),
    (g[(g.Pane = 1)] = 'Pane'),
    (g[(g.DataWindow = 2)] = 'DataWindow'),
    (g[(g.PriceScale = 4)] = 'PriceScale'),
    (g[(g.StatusLine = 8)] = 'StatusLine'),
    (g[(g.All = 15)] = 'All'),
    ((e) => {
      ;(e[(e.None = 0)] = 'None'),
        (e[(e.Pane = 1)] = 'Pane'),
        (e[(e.DataWindow = 2)] = 'DataWindow'),
        (e[(e.PriceScale = 4)] = 'PriceScale'),
        (e[(e.StatusLine = 8)] = 'StatusLine'),
        (e[(e.All = 15)] = 'All')
    })(u || (u = {})),
    (e.OhlcStudyPlotStyle = void 0),
    ((C = e.OhlcStudyPlotStyle || (e.OhlcStudyPlotStyle = {})).OhlcBars =
      'ohlc_bars'),
    (C.OhlcCandles = 'ohlc_candles'),
    ((e) => {
      ;(e.Auto = 'auto'),
        (e.Tiny = 'tiny'),
        (e.Small = 'small'),
        (e.Normal = 'normal'),
        (e.Large = 'large'),
        (e.Huge = 'huge')
    })(S || (S = {})),
    (e.StudyInputType = void 0),
    ((p = e.StudyInputType || (e.StudyInputType = {})).Integer = 'integer'),
    (p.Float = 'float'),
    (p.Price = 'price'),
    (p.Bool = 'bool'),
    (p.Text = 'text'),
    (p.Symbol = 'symbol'),
    (p.Session = 'session'),
    (p.Source = 'source'),
    (p.Resolution = 'resolution'),
    (p.Time = 'time'),
    (p.BarTime = 'bar_time'),
    (p.Color = 'color'),
    (p.Textarea = 'text_area'),
    ((e) => {
      ;(e[(e.None = 0)] = 'None'),
        (e[(e.DataWindow = 2)] = 'DataWindow'),
        (e[(e.StatusLine = 8)] = 'StatusLine'),
        (e[(e.All = 15)] = 'All')
    })(m || (m = {})),
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
    })(y || (y = {})),
    ((e) => {
      ;(e.Fixed = 'fixed'),
        (e.CashPerOrder = 'cash_per_order'),
        (e.PercentOfEquity = 'percent_of_equity')
    })(T || (T = {})),
    ((e) => {
      ;(e.Percent = 'percent'),
        (e.CashPerContract = 'cash_per_contract'),
        (e.CashPerOrder = 'cash_per_order')
    })(_ || (_ = {})),
    ((e) => {
      ;(e.FirstBar = 'first_visible_bar_time'),
        (e.LastBar = 'last_visible_bar_time'),
        (e.Realtime = 'subscribeRealtime')
    })(b || (b = {})),
    ((e) => {
      ;(e.FgColor = '__chart_fgcolor'), (e.BgColor = '__chart_bgcolor')
    })(P || (P = {})),
    (e.StudyTargetPriceScale = void 0),
    ((L = e.StudyTargetPriceScale || (e.StudyTargetPriceScale = {}))[
      (L.Right = 0)
    ] = 'Right'),
    (L[(L.Left = 1)] = 'Left'),
    (L[(L.NoScale = 2)] = 'NoScale'),
    ((e) => {
      ;(e[(e.Right = 0)] = 'Right'),
        (e[(e.Left = 1)] = 'Left'),
        (e[(e.None = 2)] = 'None')
    })(w || (w = {})),
    (e.FilledAreaType = void 0),
    ((A = e.FilledAreaType || (e.FilledAreaType = {})).TypePlots = 'plot_plot'),
    (A.TypeHlines = 'hline_hline'),
    ((e) => {
      ;(e[(e.StopLoss = 0)] = 'StopLoss'),
        (e[(e.TrailingStop = 1)] = 'TrailingStop'),
        (e[(e.GuaranteedStop = 2)] = 'GuaranteedStop')
    })(f || (f = {})),
    ((e) => {
      ;(e.Stocks = 'stocks'),
        (e.Futures = 'futures'),
        (e.Forex = 'forex'),
        (e.Crypto = 'crypto'),
        (e.Others = 'others')
    })(v || (v = {})),
    ((e) => {
      e.Symbol = 'symbol'
    })(I || (I = {})),
    ((e) => {
      ;(e[(e.PopUp = 0)] = 'PopUp'), (e[(e.Notification = 1)] = 'Notification')
    })(O || (O = {})),
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
    })(D || (D = {})),
    (e.ConnectionStatus = void 0),
    ((k = e.ConnectionStatus || (e.ConnectionStatus = {}))[(k.Connected = 1)] =
      'Connected'),
    (k[(k.Connecting = 2)] = 'Connecting'),
    (k[(k.Disconnected = 3)] = 'Disconnected'),
    (k[(k.Error = 4)] = 'Error'),
    ((e) => {
      ;(e[(e.LIMIT = 1)] = 'LIMIT'),
        (e[(e.MARKET = 2)] = 'MARKET'),
        (e[(e.STOP = 3)] = 'STOP'),
        (e[(e.STOPLIMIT = 4)] = 'STOPLIMIT')
    })(V || (V = {})),
    (e.OrderType = void 0),
    ((F = e.OrderType || (e.OrderType = {}))[(F.Limit = 1)] = 'Limit'),
    (F[(F.Market = 2)] = 'Market'),
    (F[(F.Stop = 3)] = 'Stop'),
    (F[(F.StopLimit = 4)] = 'StopLimit'),
    ((e) => {
      ;(e[(e.BUY = 1)] = 'BUY'), (e[(e.SELL = -1)] = 'SELL')
    })(E || (E = {})),
    (e.Side = void 0),
    ((W = e.Side || (e.Side = {}))[(W.Buy = 1)] = 'Buy'),
    (W[(W.Sell = -1)] = 'Sell'),
    ((e) => {
      ;(e[(e.CANCELED = 1)] = 'CANCELED'),
        (e[(e.FILLED = 2)] = 'FILLED'),
        (e[(e.INACTIVE = 3)] = 'INACTIVE'),
        (e[(e.PLACING = 4)] = 'PLACING'),
        (e[(e.REJECTED = 5)] = 'REJECTED'),
        (e[(e.WORKING = 6)] = 'WORKING')
    })(M || (M = {})),
    ((e) => {
      ;(e[(e.ALL = 0)] = 'ALL'),
        (e[(e.CANCELED = 1)] = 'CANCELED'),
        (e[(e.FILLED = 2)] = 'FILLED'),
        (e[(e.INACTIVE = 3)] = 'INACTIVE'),
        (e[(e.REJECTED = 5)] = 'REJECTED'),
        (e[(e.WORKING = 6)] = 'WORKING')
    })(B || (B = {})),
    (e.OrderStatus = void 0),
    ((N = e.OrderStatus || (e.OrderStatus = {}))[(N.Canceled = 1)] =
      'Canceled'),
    (N[(N.Filled = 2)] = 'Filled'),
    (N[(N.Inactive = 3)] = 'Inactive'),
    (N[(N.Placing = 4)] = 'Placing'),
    (N[(N.Rejected = 5)] = 'Rejected'),
    (N[(N.Working = 6)] = 'Working'),
    (e.OrderStatusFilter = void 0),
    ((U = e.OrderStatusFilter || (e.OrderStatusFilter = {}))[(U.All = 0)] =
      'All'),
    (U[(U.Canceled = 1)] = 'Canceled'),
    (U[(U.Filled = 2)] = 'Filled'),
    (U[(U.Inactive = 3)] = 'Inactive'),
    (U[(U.Rejected = 5)] = 'Rejected'),
    (U[(U.Working = 6)] = 'Working'),
    ((e) => {
      ;(e[(e.Order = 1)] = 'Order'), (e[(e.Position = 2)] = 'Position')
    })(x || (x = {})),
    ((e) => {
      ;(e[(e.ORDER = 1)] = 'ORDER'), (e[(e.POSITION = 2)] = 'POSITION')
    })(H || (H = {})),
    (e.ParentType = void 0),
    ((j = e.ParentType || (e.ParentType = {}))[(j.Order = 1)] = 'Order'),
    (j[(j.Position = 2)] = 'Position'),
    (j[(j.IndividualPosition = 3)] = 'IndividualPosition'),
    ((e) => {
      ;(e[(e.StopLoss = 0)] = 'StopLoss'),
        (e[(e.TakeProfit = 1)] = 'TakeProfit'),
        (e[(e.TrailingStop = 2)] = 'TrailingStop'),
        (e[(e.GuaranteedStop = 3)] = 'GuaranteedStop')
    })(G || (G = {})),
    ((e) => {
      ;(e[(e.LIMITPRICE = 1)] = 'LIMITPRICE'),
        (e[(e.STOPPRICE = 2)] = 'STOPPRICE'),
        (e[(e.TAKEPROFIT = 3)] = 'TAKEPROFIT'),
        (e[(e.STOPLOSS = 4)] = 'STOPLOSS')
    })(z || (z = {})),
    (e.OrderTicketFocusControl = void 0),
    (($ = e.OrderTicketFocusControl || (e.OrderTicketFocusControl = {}))[
      ($.LimitPrice = 1)
    ] = 'LimitPrice'),
    ($[($.StopPrice = 2)] = 'StopPrice'),
    ($[($.TakeProfit = 3)] = 'TakeProfit'),
    ($[($.StopLoss = 4)] = 'StopLoss'),
    ($[($.Quantity = 5)] = 'Quantity'),
    ((e) => {
      ;(e[(e.ERROR = 0)] = 'ERROR'), (e[(e.SUCCESS = 1)] = 'SUCCESS')
    })(J || (J = {})),
    (e.NotificationType = void 0),
    ((K = e.NotificationType || (e.NotificationType = {}))[(K.Error = 0)] =
      'Error'),
    (K[(K.Success = 1)] = 'Success'),
    ((e) => {
      ;(e[(e.Demo = 1)] = 'Demo'), (e[(e.Real = 0)] = 'Real')
    })(q || (q = {})),
    (e.OrderOrPositionMessageType = void 0),
    ((Z =
      e.OrderOrPositionMessageType ||
      (e.OrderOrPositionMessageType = {})).Information = 'information'),
    (Z.Warning = 'warning'),
    (Z.Error = 'error'),
    ((e) => {
      ;(e.Demo = 'demo'), (e.Live = 'live')
    })(Q || (Q = {})),
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
    })(Y || (Y = {})),
    ((e) => {
      ;(e[(e.None = 0)] = 'None'),
        (e[(e.Pips = 1)] = 'Pips'),
        (e[(e.Ticks = 2)] = 'Ticks')
    })(X || (X = {})),
    ((e) => {
      ;(e.Halted = 'HALTED'),
        (e.NotShortable = 'NOT-SHORTABLE'),
        (e.HardToBorrow = 'HARD-TO-BORROW')
    })(ee || (ee = {})),
    ((e) => {
      ;(e[(e.Limit = 1)] = 'Limit'), (e[(e.Stop = 2)] = 'Stop')
    })(te || (te = {})),
    ((e) => {
      ;(e.Disallowed = 'disallowed'),
        (e.Allowed = 'allowed'),
        (e.AllowedWithWarning = 'allowed_with_warning')
    })(ie || (ie = {})),
    ((e) => {
      ;(e.PlaceOrder = 'place_order'),
        (e.ModifyOrder = 'modify_order'),
        (e.CancelOrder = 'cancel_order'),
        (e.ModifyPosition = 'modify_position'),
        (e.ClosePosition = 'close_position'),
        (e.ModifyIndividualPosition = 'modify_individual_position'),
        (e.CloseIndividualPosition = 'close_individual_position'),
        (e.CloseNetPosition = 'close_net_position')
    })(oe || (oe = {})),
    (e.StandardFormatterName = void 0),
    ((re = e.StandardFormatterName || (e.StandardFormatterName = {})).Date =
      'date'),
    (re.DateOrDateTime = 'dateOrDateTime'),
    (re.Default = 'default'),
    (re.Fixed = 'fixed'),
    (re.FixedInCurrency = 'fixedInCurrency'),
    (re.VariablePrecision = 'variablePrecision'),
    (re.FormatQuantity = 'formatQuantity'),
    (re.FormatPrice = 'formatPrice'),
    (re.FormatPriceForexSup = 'formatPriceForexSup'),
    (re.FormatPriceInCurrency = 'formatPriceInCurrency'),
    (re.IntegerSeparated = 'integerSeparated'),
    (re.LocalDate = 'localDate'),
    (re.LocalDateOrDateTime = 'localDateOrDateTime'),
    (re.Percentage = 'percentage'),
    (re.Pips = 'pips'),
    (re.Profit = 'profit'),
    (re.ProfitInInstrumentCurrency = 'profitInInstrumentCurrency'),
    (re.Side = 'side'),
    (re.PositionSide = 'positionSide'),
    (re.Status = 'status'),
    (re.Symbol = 'symbol'),
    (re.Text = 'text'),
    (re.Type = 'type'),
    (re.MarginPercent = 'marginPercent'),
    (re.Empty = 'empty'),
    (e.OverridePriceAxisLastValueMode = void 0),
    ((ne =
      e.OverridePriceAxisLastValueMode ||
      (e.OverridePriceAxisLastValueMode = {}))[
      (ne.LastPriceAndPercentageValue = 0)
    ] = 'LastPriceAndPercentageValue'),
    (ne[(ne.LastValueAccordingToScale = 1)] = 'LastValueAccordingToScale'),
    (e.OverrideLineStyle = void 0),
    ((ae = e.OverrideLineStyle || (e.OverrideLineStyle = {}))[(ae.Solid = 0)] =
      'Solid'),
    (ae[(ae.Dotted = 1)] = 'Dotted'),
    (ae[(ae.Dashed = 2)] = 'Dashed'),
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
    })(se || (se = {})),
    ((e) => {
      ;(e[(e.Markers = 0)] = 'Markers'),
        (e[(e.Stepline = 1)] = 'Stepline'),
        (e[(e.Simple = 2)] = 'Simple')
    })(le || (le = {})),
    (e.ChartStyle = void 0),
    ((de = e.ChartStyle || (e.ChartStyle = {}))[(de.Bar = 0)] = 'Bar'),
    (de[(de.Candle = 1)] = 'Candle'),
    (de[(de.Line = 2)] = 'Line'),
    (de[(de.Area = 3)] = 'Area'),
    (de[(de.Renko = 4)] = 'Renko'),
    (de[(de.Kagi = 5)] = 'Kagi'),
    (de[(de.PnF = 6)] = 'PnF'),
    (de[(de.LineBreak = 7)] = 'LineBreak'),
    (de[(de.HeikinAshi = 8)] = 'HeikinAshi'),
    (de[(de.HollowCandle = 9)] = 'HollowCandle'),
    (de[(de.Baseline = 10)] = 'Baseline'),
    (de[(de.Range = 11)] = 'Range'),
    (de[(de.HiLo = 12)] = 'HiLo'),
    (de[(de.Column = 13)] = 'Column'),
    (de[(de.LineWithMarkers = 14)] = 'LineWithMarkers'),
    (de[(de.Stepline = 15)] = 'Stepline'),
    (de[(de.HLCArea = 16)] = 'HLCArea'),
    (de[(de.VolFootprint = 17)] = 'VolFootprint'),
    (de[(de.TPO = 18)] = 'TPO'),
    (de[(de.VolCandle = 19)] = 'VolCandle'),
    (de[(de.SVP = 20)] = 'SVP'),
    (de[(de.HLCBars = 21)] = 'HLCBars'),
    (e.TimeHoursFormat = void 0),
    ((ce = e.TimeHoursFormat || (e.TimeHoursFormat = {})).TwentyFourHours =
      '24-hours'),
    (ce.TwelveHours = '12-hours'),
    ((e) => {
      ;(e[(e.Initial = 2)] = 'Initial'),
        (e[(e.SeriesZOrderIsAlwaysZero = 3)] = 'SeriesZOrderIsAlwaysZero'),
        (e[(e.Current = 3)] = 'Current')
    })(he || (he = {})),
    (e.PlDisplay = void 0),
    ((ge = e.PlDisplay || (e.PlDisplay = {}))[(ge.Money = 0)] = 'Money'),
    (ge[(ge.Pips = 1)] = 'Pips'),
    (ge[(ge.Percentage = 2)] = 'Percentage'),
    (e.TradedGroupHorizontalAlignment = void 0),
    ((ue =
      e.TradedGroupHorizontalAlignment ||
      (e.TradedGroupHorizontalAlignment = {}))[(ue.Left = 0)] = 'Left'),
    (ue[(ue.Center = 1)] = 'Center'),
    (ue[(ue.Right = 2)] = 'Right'),
    e.PlDisplay.Money,
    e.PlDisplay.Money,
    e.TradedGroupHorizontalAlignment.Right,
    ((e) => {
      ;(e[(e.Background = 0)] = 'Background'),
        (e[(e.Foreground = 1)] = 'Foreground'),
        (e[(e.Topmost = 2)] = 'Topmost')
    })(Ce || (Ce = {})),
    ((e) => {
      ;(e[(e.Unavailable = 0)] = 'Unavailable'),
        (e[(e.AvailableReadonlyAlwaysDisabled = 1)] =
          'AvailableReadonlyAlwaysDisabled'),
        (e[(e.AvailableReadonlyAlwaysEnabled = 2)] =
          'AvailableReadonlyAlwaysEnabled'),
        (e[(e.Available = 3)] = 'Available')
    })(Se || (Se = {})),
    ((e) => {
      ;(e[(e.ViewportChangeUserAction = 0)] = 'ViewportChangeUserAction'),
        (e[(e.DataUpdate = 1)] = 'DataUpdate'),
        (e[(e.SeriesRestart = 2)] = 'SeriesRestart'),
        (e[(e.SeriesCompleted = 3)] = 'SeriesCompleted'),
        (e[(e.StudyCreation = 4)] = 'StudyCreation')
    })(pe || (pe = {})),
    ((e) => {
      e[(e.Chart = 0)] = 'Chart'
    })(me || (me = {})),
    (e.VisibilityType = void 0),
    ((ye = e.VisibilityType || (e.VisibilityType = {})).AlwaysOn = 'alwaysOn'),
    (ye.VisibleOnMouseOver = 'visibleOnMouseOver'),
    (ye.AlwaysOff = 'alwaysOff'),
    (e.PriceScaleMode = void 0),
    ((Te = e.PriceScaleMode || (e.PriceScaleMode = {}))[(Te.Normal = 0)] =
      'Normal'),
    (Te[(Te.Log = 1)] = 'Log'),
    (Te[(Te.Percentage = 2)] = 'Percentage'),
    (Te[(Te.IndexedTo100 = 3)] = 'IndexedTo100'),
    (e.SeriesType = void 0),
    ((_e = e.SeriesType || (e.SeriesType = {}))[(_e.Bars = 0)] = 'Bars'),
    (_e[(_e.Candles = 1)] = 'Candles'),
    (_e[(_e.Line = 2)] = 'Line'),
    (_e[(_e.Area = 3)] = 'Area'),
    (_e[(_e.HeikenAshi = 8)] = 'HeikenAshi'),
    (_e[(_e.HollowCandles = 9)] = 'HollowCandles'),
    (_e[(_e.Baseline = 10)] = 'Baseline'),
    (_e[(_e.HiLo = 12)] = 'HiLo'),
    (_e[(_e.Column = 13)] = 'Column'),
    (_e[(_e.LineWithMarkers = 14)] = 'LineWithMarkers'),
    (_e[(_e.Stepline = 15)] = 'Stepline'),
    (_e[(_e.HLCArea = 16)] = 'HLCArea'),
    (_e[(_e.VolCandle = 19)] = 'VolCandle'),
    (_e[(_e.HLCBars = 21)] = 'HLCBars'),
    (_e[(_e.Renko = 4)] = 'Renko'),
    (_e[(_e.Kagi = 5)] = 'Kagi'),
    (_e[(_e.PointAndFigure = 6)] = 'PointAndFigure'),
    (_e[(_e.LineBreak = 7)] = 'LineBreak'),
    ((e) => {
      e.Value = '_seriesId'
    })(be || (be = {})),
    ((e) => {
      ;(e[(e.InvalidSymbol = 0)] = 'InvalidSymbol'),
        (e[(e.ReplayUnsupported = 1)] = 'ReplayUnsupported'),
        (e[(e.UnsupportedDepth = 2)] = 'UnsupportedDepth'),
        (e[(e.UnsupportedIntradyReplay = 3)] = 'UnsupportedIntradyReplay')
    })(Pe || (Pe = {})),
    (e.HHistDirection = void 0),
    ((Le = e.HHistDirection || (e.HHistDirection = {})).LeftToRight =
      'left_to_right'),
    (Le.RightToLeft = 'right_to_left'),
    ((e) => {
      ;(e.Relative = 'relative'), (e.Absolute = 'absolute')
    })(we || (we = {})),
    ((e) => {
      ;(e.UpDown = 'Up/Down'), (e.Total = 'Total'), (e.Delta = 'Delta')
    })(Ae || (Ae = {})),
    (e.MarkLocation = void 0),
    ((fe = e.MarkLocation || (e.MarkLocation = {})).AboveBar = 'AboveBar'),
    (fe.BelowBar = 'BelowBar'),
    (fe.Top = 'Top'),
    (fe.Bottom = 'Bottom'),
    (fe.Right = 'Right'),
    (fe.Left = 'Left'),
    (fe.Absolute = 'Absolute'),
    (fe.AbsoluteUp = 'AbsoluteUp'),
    (fe.AbsoluteDown = 'AbsoluteDown'),
    ((e) => {
      ;(e.Left = 'left'), (e.Center = 'center'), (e.Right = 'right')
    })(ve || (ve = {})),
    ((e) => {
      ;(e.Top = 'top'), (e.Middle = 'middle'), (e.Bottom = 'bottom')
    })(Ie || (Ie = {})),
    (e.LineStyle = void 0),
    ((Oe = e.LineStyle || (e.LineStyle = {}))[(Oe.Solid = 0)] = 'Solid'),
    (Oe[(Oe.Dotted = 1)] = 'Dotted'),
    (Oe[(Oe.Dashed = 2)] = 'Dashed')
  const De = {
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
    ke = JSON.parse(
      '[{"iso":"ar","dir":"rtl","language":"ar"},{"iso":"pt","dir":"ltr","language":"pt"},{"iso":"ca","dir":"ltr","language":"ca_ES"},{"iso":"cs","dir":"ltr","language":"cs"},{"iso":"de","dir":"ltr","language":"de"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"es","dir":"ltr","language":"es"},{"iso":"fr","dir":"ltr","language":"fr"},{"iso":"he","dir":"rtl","language":"he_IL"},{"iso":"hu","dir":"ltr","language":"hu_HU"},{"iso":"id","dir":"ltr","language":"id_ID"},{"iso":"en","dir":"ltr","language":"en"},{"iso":"it","dir":"ltr","language":"it"},{"iso":"ja","dir":"ltr","language":"ja"},{"iso":"ko","dir":"ltr","language":"ko"},{"iso":"ms","dir":"ltr","language":"ms_MY"},{"iso":"pl","dir":"ltr","language":"pl"},{"iso":"ru","dir":"ltr","language":"ru"},{"iso":"sv","dir":"ltr","language":"sv"},{"iso":"th","dir":"ltr","language":"th"},{"iso":"tr","dir":"ltr","language":"tr"},{"iso":"vi","dir":"ltr","language":"vi"},{"iso":"zh-Hans","dir":"ltr","language":"zh"},{"iso":"zh-Hant","dir":"ltr","language":"zh_TW"},{"iso":"el","dir":"ltr","language":"el"},{"iso":"nl","dir":"ltr","language":"nl_NL"},{"iso":"ro","dir":"ltr","language":"ro"}]',
    )
  let Ve = !1
  function Fe() {
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
        delete e.overrides[
          'mainSeriesProperties.priceAxisProperties.lockScale'
        ]),
        (this._options = Re(De, e))
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
      return this._innerWindowLoaded.then(() =>
        this._innerWindow().headerReady(),
      )
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
        throw new Error(
          `There is no such element - #${this._options.container}`,
        )
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
          brokerConfig:
            this._options.broker_config || this._options.brokerConfig,
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
          additionalSymbolInfoFields:
            this._options.additional_symbol_info_fields,
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
        ke.findIndex((t) => t.language === e) >= 0 ||
          (console.warn("locale isn't supported. Using default of `en`."),
          (this._options.locale = 'en'))
      }
      const o = ((e, t) => {
        const i = new URL(`${e || ''}`, location.href).href,
          o = JSON.parse(
            '["bundles/runtime.528f81f7a425983444d8.js","bundles/__LANG__.9488.2f156b47fe84118759c5.js","bundles/1996.25e6f30e7a095ec239f4.css","bundles/207.2e06ffb7ce05936178f2.js","bundles/library.2a35263e52ab75f5729a.js"]',
          ),
          r = encodeURIComponent(t),
          n = ke.find((e) => e.language === r) ?? { iso: 'en', dir: 'ltr' },
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
            encodeURIComponent(
              String(this._options.symbol_search_request_delay),
            )
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
    (window.TradingView.version = Fe))
  const We =
    !(
      'undefined' == typeof window ||
      !window.navigator ||
      !window.navigator.userAgent
    ) && window.navigator.userAgent.includes('CriOS')
  return (e.version = Fe), (e.widget = Ee), e
})({})
