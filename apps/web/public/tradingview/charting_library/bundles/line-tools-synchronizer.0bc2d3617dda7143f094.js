;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7129, 5565],
  {
    98653: (e, t, o) => {
      o.r(t),
        o.d(t, {
          SavingLineToolsError: () => i,
          SavingLineToolsLibraryError: () => s,
        })
      class i extends Error {
        constructor(e, t) {
          super(t), (this.shouldBeCooled = e)
        }
      }
      class s extends Error {
        constructor(e, t = !1) {
          super(e), (this.safe = t), (this.name = 'SavingLineToolsLibraryError')
        }
      }
    },
    40104: (e, t, o) => {
      o.d(t, { retries: () => n, retriesWithDelays: () => r })
      var i = o(45884)
      async function s(e, t, o) {
        let i
        for (let s = 0; s < t; ++s)
          try {
            return await e(i)
          } catch (e) {
            ;(i = e), await o(s)
          }
        throw i
      }
      async function n(e, t) {
        return s(e, t, () => Promise.resolve())
      }
      async function r(e, t) {
        return s(e, t.length + 1, (e) =>
          e < t.length ? (0, i.delay)(null, t[e]) : Promise.resolve(),
        )
      }
    },
    16879: (e, t, o) => {
      o.r(t), o.d(t, { LineToolsSynchronizer: () => B })
      var i = o(12481),
        s = o(20883),
        n = o(3060),
        r = o(53822),
        a = o(54814),
        l = n.default ? n.default.isConcatSpreadable : void 0
      const d = (e) =>
        (0, a.default)(e) || (0, r.default)(e) || !!(l && e && e[l])
      const h = function e(t, o, i, n, r) {
        var a = -1,
          l = t.length
        for (i || (i = d), r || (r = []); ++a < l; ) {
          var h = t[a]
          o > 0 && i(h)
            ? o > 1
              ? e(h, o - 1, i, n, r)
              : (0, s.default)(r, h)
            : n || (r[r.length] = h)
        }
        return r
      }
      const u = (e) => ((null == e ? 0 : e.length) ? h(e, 1) : [])
      var c = o(50151),
        _ = o(59224),
        v = o(19334),
        g = o(92249),
        S = o(98653),
        T = o(14483),
        p = o(23024),
        y = o(1722),
        f = o(51608)
      const L = (0, _.getLogger)('Chart.LinkKeyResolver')
      class M {
        constructor(e, t, o) {
          ;(this._pendingRequests = new Map()),
            (this._startRequestingDebounced = (0, i.default)(
              () => this._startNextRequest(),
              500,
            )),
            (this._layoutId = e),
            (this._chartId = t),
            (this._ownerSourceId = o)
        }
        resolveLinkKey(e, t, o) {
          var i
          const s = ((e, t) => JSON.stringify([e, t]))(e, o),
            n =
              null !== (i = this._pendingRequests.get(s)) && void 0 !== i
                ? i
                : new Map()
          if (n.has(t)) return n.get(t).promise
          const r = (0, f.createDeferredPromise)()
          return (
            n.set(t, r),
            this._pendingRequests.set(s, n),
            this._startRequestingDebounced(),
            r.promise
          )
        }
        async _startNextRequest() {
          if (0 === this._pendingRequests.size) return
          const e = await (0, p.getChartStorage)(),
            t = this._pendingRequests.entries().next().value,
            { symbol: o, brokerName: i } = ((e) => {
              const t = JSON.parse(e)
              return { symbol: t[0], brokerName: t[1] }
            })(t[0]),
            s = t[1],
            n = {
              requestType: 'mainSeriesLineTools',
              seriesSourceId: this._ownerSourceId,
              symbol: o,
              brokerName: i,
              sharingMode: 0,
            }
          try {
            const t = await e.loadLineToolsAndGroups(
              this._layoutId,
              this._chartId,
              n,
              o,
            )
            null !== t &&
              null !== t.sources &&
              (t.sources.forEach((e, t) => {
                if (null === e) return
                const o = e.state.linkKey
                if (!o) return
                const i = s.get(o)
                null == i || i.resolve(e.id), s.delete(o)
              }),
              t.serverRequestId &&
                console.log(`PROCESSED:${t.serverRequestId}`))
          } catch (e) {
            L.logError(`Error requesting line tools: ${e}`)
          }
          s.forEach((e) => {
            e.resolve(null)
          }),
            this._pendingRequests.delete(t[0]),
            await this._startNextRequest()
        }
      }
      var m = o(47513),
        b = o(93562),
        I = o(45884)
      var C = o(97145)
      class w extends C.WatchedValue {
        constructor(e, t) {
          super(((e, t) => t)(0, t))
        }
        destroy() {
          super.destroy()
        }
      }
      var A = o(40104)
      const E = [500, 1e4, 6e4],
        O = new w('disable_retry_load_linetools_from_storage', !1)
      async function N(e, t, o, i, s) {
        const n = async () => e.loadLineToolsAndGroups(t, o, i, s)
        return n().catch(() =>
          O.value()
            ? null
            : (0, A.retriesWithDelays)(
                async () => (
                  await (async (e = null) =>
                    !0 === navigator.onLine || void 0 === navigator.onLine
                      ? Promise.resolve()
                      : (0, I.respectAbort)(
                          e,
                          new Promise((e) => {
                            const t = () => {
                              window.removeEventListener('online', t), e()
                            }
                            window.addEventListener('online', t)
                          }),
                        ))(),
                  n()
                ),
                E,
              ),
        )
      }
      var G = o(52329)
      function k(e) {
        return e instanceof D
      }
      class D extends G.StudyStub {
        constructor(e, t, o) {
          var i
          super(e, { ...t, ownFirstValue: null }, o),
            (this._linkKey = new C.WatchedValue(
              null !== (i = t.linkKey) && void 0 !== i ? i : null,
            ))
        }
        linkKey() {
          return this._linkKey
        }
      }
      var R = o(97906)
      const q = !T.enabled('saveload_separate_drawings_storage'),
        F = !T.enabled('saveload_separate_drawings_storage'),
        V = (0, _.getLogger)('LineToolsSynchronizer')
      function P(e, t) {
        return {
          id: e.id,
          name: e.name().value(),
          symbol: e.symbol(),
          currencyId: e.currencyId(),
          unitId: e.unitId(),
        }
      }
      function U(e) {
        return void 0 === e ? 0 : e
      }
      function K(e, t, o) {
        const i = new Map(),
          s = new Set(null == o ? void 0 : o.keys())
        return (
          e.forEach((e, n) => {
            const r = !o || o.has(n)
            ;(e.timestamp > t || !r) && (i.set(n, e), s.delete(n))
          }),
          { stillInvalidated: i, validated: Array.from(s) }
        )
      }
      function x(e) {
        return (0, g.isLineTool)(e) || k(e)
      }
      const z = /(\w+)\/(\w+)\/(\w+)/
      class B {
        constructor(e, t, o, s, n) {
          ;(this._invalidatedLineToolsAndStudyStubs = new Map()),
            (this._allLineToolsAndStudyStubs = new Map()),
            (this._originalLineToolSharingMode = new Map()),
            (this._invalidatedLineToolGroups = new Map()),
            (this._originalLineToolGroupsSharingMode = new Map()),
            (this._ignoreInvalidatingEventsDepth = 0),
            (this._saveChartService = null),
            (this._debouncedSave = (0, i.default)(
              () => this._saveInvalidatedIfRequired(!1),
              500,
            )),
            (this._currentlyLoadedSymbol = new Map()),
            (this._linkKeyResolver = null),
            (this._brokerName = ''),
            (this._hasChanges = new C.WatchedValue(!1)),
            (this._lastBanTime = null),
            (this._invalidateViaSync = 0),
            (this._savingAbortControllersBySharingMode = new Map()),
            (this._savingExternalChartsAbortControllers = new Map()),
            (this._onChangeAutosave = (e) => {
              e && this._debouncedSave()
            }),
            (this._origin = e),
            (this._chartModel = t),
            (this._options = o),
            (this._duplicateOperationsForSerializedCharts = s),
            (this._deserializedChartsIds = n),
            this._assignAllLineTools(this._chartModel.panes()),
            this._chartModel
              .panesCollectionChanged()
              .subscribe(this, this._processPanesCollectionChanged.bind(this)),
            this._chartModel
              .dataSourceCollectionChanged()
              .subscribe(
                this,
                this._processDataSourceCollectionChanged.bind(this),
              ),
            this._chartModel
              .lineToolsGroupModel()
              .onChanged()
              .subscribe(
                this,
                this._processLineToolsGroupModelChanged.bind(this),
              ),
            this._chartModel
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._onSymbolResolved.bind(this)),
            this._chartModel
              .sourcePropertiesChanged()
              .subscribe(this, this._processPropertiesChanged.bind(this)),
            this._chartModel
              .sourceZOrderChanged()
              .subscribe(this, this._processPropertiesChanged.bind(this)),
            (this._linkKeyResolver = new M(
              e.layoutId,
              e.chartId,
              t.mainSeries().id(),
            )),
            (this._brokerIdSession = new w('broker_id_session', !1)),
            (this._saveSharedLineTools = new w('save_shared_line_tools', F)),
            (this._doNotSaveSharedLineToolsToChartsImpl = new w(
              'do_not_save_shared_line_tools_to_charts',
              q,
            )),
            (this._doNotSaveSharedLineToolsToCharts = (0, R.combine)(
              (e, t) => e && t,
              this._doNotSaveSharedLineToolsToChartsImpl.weakReference(),
              this._saveSharedLineTools.weakReference(),
            )),
            this._sharingModesToUse().forEach((e) => {
              0 === e && this._loadAndMergeLineToolsOnStudies(e, !1),
                this._loadAndMergeLineToolsWithoutSymbol(e, !1)
            })
        }
        destroy() {
          this._brokerIdSession.destroy(),
            this._saveSharedLineTools.destroy(),
            this._doNotSaveSharedLineToolsToChartsImpl.destroy(),
            this._doNotSaveSharedLineToolsToCharts.destroy(),
            this._chartModel
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .unsubscribeAll(this),
            this._chartModel.sourcePropertiesChanged().unsubscribeAll(this),
            this._chartModel.sourceZOrderChanged().unsubscribeAll(this),
            this._chartModel.panesCollectionChanged().unsubscribeAll(this),
            this._chartModel.dataSourceCollectionChanged().unsubscribeAll(this),
            this._chartModel
              .lineToolsGroupModel()
              .onChanged()
              .unsubscribeAll(this)
        }
        reloadAllLineTools() {
          this._currentlyLoadedSymbol.clear(),
            this._sharingModesToUse().forEach((e) => {
              0 === e && this._loadAndMergeLineToolsOnStudies(e, !0),
                this._loadAndMergeLineToolsWithoutSymbol(e, !0)
            })
          const e = this._chartModel.mainSeries().symbolInfo()
          e && this._onSymbolResolved(e)
        }
        hasChanges() {
          return this._hasChanges
        }
        setSaveChartService(e) {
          this._saveChartService &&
            this._saveChartService
              .autoSaveEnabled()
              .unsubscribe(this._onChangeAutosave),
            (this._saveChartService = e),
            this._saveChartService
              .autoSaveEnabled()
              .subscribe(this._onChangeAutosave)
        }
        prepareDTO(e = !1) {
          const t = new Map()
          return (
            this._sharingModesToUse().forEach((o) => {
              t.set(o, this._prepareDTOItem(e, o))
            }),
            t
          )
        }
        getDTO(e = 0, t = !1, o = !1) {
          return o && this.invalidateAll(), this._prepareDTOItem(t, e)
        }
        async applyDTO(e, t = 0) {
          this.resetInvalidated(Date.now().valueOf(), e, t),
            await this._applyLineToolsAndGroupsDTO(e, t)
        }
        deserializedChartsIdsProvider() {
          return this._deserializedChartsIds
        }
        markAsValidatedBecauseOfSavingToContent(e) {
          this._invalidatedLineToolsAndStudyStubs.forEach((t) => {
            t.savedToChartContent = e
          }),
            this._invalidatedLineToolGroups.forEach((t) => {
              t.savedToChartContent = e
            }),
            this._recalculateHasChanges()
        }
        resetInvalidated(e, t, o) {
          const i = (e, t, i, s) => {
            var n, r
            if (!i.has(s) || i.get(s)) {
              if (i.has(s)) {
                const i = e.get(s)
                if (0 === o) {
                  t(s, {
                    sharingMode: this._doNotSaveSharedLineToolsToCharts.value()
                      ? o
                      : null !== (n = null == i ? void 0 : i.sharingMode) &&
                          void 0 !== n
                        ? n
                        : o,
                    duplicatedInChart:
                      !this._doNotSaveSharedLineToolsToCharts.value(),
                  })
                } else
                  t(s, {
                    sharingMode: o,
                    duplicatedInChart:
                      null !== (r = null == i ? void 0 : i.duplicatedInChart) &&
                      void 0 !== r &&
                      r,
                  })
              }
            } else {
              const i = e.get(s)
              i &&
                (i.sharingMode === o
                  ? t(s, null)
                  : 0 === o && t(s, { ...i, duplicatedInChart: !1 }))
            }
          }
          if (null === t.sources) return
          const {
              groups: s,
              sources: n,
              lineToolsToValidate: r,
              groupsToValidate: a,
            } = t,
            l = K(
              this._invalidatedLineToolsAndStudyStubs,
              e,
              new Set(null != r ? r : n.keys()),
            )
          ;(this._invalidatedLineToolsAndStudyStubs = l.stillInvalidated),
            l.validated.forEach(
              i.bind(
                this,
                this._originalLineToolSharingMode,
                this._setOriginalLineToolSharingMode.bind(this),
                n,
              ),
            )
          const d = K(
            this._invalidatedLineToolGroups,
            e,
            new Set(null != a ? a : s.keys()),
          )
          l.validated.forEach(
            i.bind(
              this,
              this._originalLineToolGroupsSharingMode,
              this._setOriginalLineToolGroupsSharingMode.bind(this),
              s,
            ),
          ),
            (this._invalidatedLineToolGroups = d.stillInvalidated),
            this._recalculateHasChanges()
        }
        applyLineToolUpdateNotification(e, t) {
          var o
          const i = ((e) => {
            const t = z.exec(e)
            return 4 === (null == t ? void 0 : t.length)
              ? { layoutId: t[1], chartId: t[2], clientId: t[3] }
              : { layoutId: '', chartId: '', clientId: e }
          })(null !== (o = e.clientId) && void 0 !== o ? o : '')
          ;(i.clientId === this._origin.clientId &&
            i.chartId === this._origin.chartId) ||
            (this._chartModel.dataSources(),
            void 0 !== e.symbol && null === e.sources
              ? this._withoutInvalidating(() => {
                  const o = this._chartModel
                    .dataSources()
                    .filter(g.isLineTool)
                    .filter(
                      (o) =>
                        o.sharingMode().value() === t &&
                        o.symbol() === e.symbol,
                    )
                  o.length > 0 &&
                    this._chartModel.undoModel().removeSources(o, !0, null)
                })
              : this._applyLineToolsAndGroupsDTO(e, t, i))
        }
        startApplyingLineToolUpdateNotification() {
          this._ignoreInvalidatingEventsDepth++
        }
        endApplyingLineToolUpdateNotification() {
          this._ignoreInvalidatingEventsDepth--,
            this._ignoreInvalidatingEventsDepth < 0 &&
              (V.logError(
                'Logic error, startApplyingLineToolUpdateNotification/endApplyingLineToolUpdateNotification mismatch, autofixing',
              ),
              (this._ignoreInvalidatingEventsDepth = 0))
        }
        applyAlertIdByExternalSource(e, t) {
          this._withoutInvalidating(() => {
            const o = this._chartModel.dataSourceForId(e)
            o && (0, g.isLineTool)(o) && o.setAlert(t)
          })
        }
        deleteAlertByExternalSource(e) {
          this._withoutInvalidating(() => {
            const t = this._chartModel.dataSourceForId(e)
            t && (0, g.isLineTool)(t) && t.removeAlert()
          })
        }
        async markSyncedLineToolAsDeleted(e, t) {
          if (this._linkKeyResolver) {
            const o = await this._linkKeyResolver.resolveLinkKey(
              t,
              e,
              this._brokerName,
            )
            if (null !== o) {
              const t = (0, g.lineToolByLinkKey)(this._chartModel, e)
              null === t
                ? this._invalidateLineToolOrStudyStub(o, performance.now())
                : this._withoutInvalidating(() => {
                    const e = (0, c.ensureNotNull)(
                        this._chartModel.paneForSource(t),
                      ),
                      o =
                        this._allLineToolsAndStudyStubs.get(e.id()) || new Map()
                    t.detachAlert(),
                      this._chartModel.removeSource(t),
                      o.delete(t.id())
                  }),
                this._debouncedSave()
            }
            return o
          }
          return null
        }
        invalidateAll() {
          const e = performance.now()
          this._allLineToolsAndStudyStubs.forEach((t) => {
            t.forEach((t, o) => {
              this._invalidateLineToolOrStudyStub(o, e)
            })
          }),
            this._chartModel
              .lineToolsGroupModel()
              .groupsForAllSymbols()
              .forEach((t) => {
                this._invalidateLineToolGroup(t.id, e)
              }),
            this.markAsValidatedBecauseOfSavingToContent(!0)
        }
        executeSyncedAction(e) {
          this._invalidateViaSync += 1
          try {
            e()
          } finally {
            this._invalidateViaSync -= 1
          }
        }
        invalidateViaSync() {
          return this._invalidateViaSync > 0
        }
        flushPendingSavings() {
          return this._invalidatedLineToolGroups.size ||
            this._invalidatedLineToolsAndStudyStubs.size
            ? this._saveInvalidatedIfRequired(!1, !0)
            : null
        }
        _assignAllLineTools(e) {
          e.forEach((e) => {
            const t = e
                .dataSources()
                .filter(x)
                .map((e) => [e.id(), e.linkKey().value()]),
              o = new Map(t)
            this._allLineToolsAndStudyStubs.set(e.id(), o)
          })
        }
        _processPropertiesChanged(e, t) {
          x(t) && this._invalidateLineToolOrStudyStub(t.id(), performance.now())
        }
        _processLineToolsGroupModelChanged(e, t) {
          const o = performance.now()
          this._invalidateLineToolGroup(e, o),
            t &&
              (t.affectedLineTools || []).forEach((e) =>
                this._invalidateLineToolOrStudyStub(e, o),
              )
        }
        _processPanesCollectionChanged(e) {
          const t = e.map((e) => e.id()),
            o = new Set(t),
            i = performance.now()
          Array.from(this._allLineToolsAndStudyStubs.keys())
            .filter((e) => !o.has(e))
            .forEach((e) => {
              Array.from(
                (0, c.ensureDefined)(
                  this._allLineToolsAndStudyStubs.get(e),
                ).keys(),
              ).forEach((e) => {
                this._invalidateLineToolOrStudyStub(e, i)
              })
            }),
            e
              .filter((e) => !this._allLineToolsAndStudyStubs.has(e.id()))
              .forEach((e) => {
                e.dataSources()
                  .filter(x)
                  .forEach((e) =>
                    this._invalidateLineToolOrStudyStub(e.id(), i),
                  )
              }),
            this._assignAllLineTools(e)
        }
        _processDataSourceCollectionChanged(e) {
          const t = e.dataSources().filter(x),
            o = t.map((e) => [e.id(), e.linkKey().value()]),
            i = new Map(o)
          let s
          const n = performance.now()
          if (this._allLineToolsAndStudyStubs.has(e.id())) {
            const o = (0, c.ensureDefined)(
              this._allLineToolsAndStudyStubs.get(e.id()),
            )
            ;(s = t.filter((e) => !o.has(e.id()))),
              s.forEach((e) => this._invalidateLineToolOrStudyStub(e.id(), n)),
              Array.from(o.entries())
                .filter((e) => !i.has(e[0]))
                .forEach((e) => {
                  null !== e[1] && this._debouncedSave(),
                    this._invalidateLineToolOrStudyStub(e[0], n)
                })
          } else
            (s = t),
              t.forEach((e) => this._invalidateLineToolOrStudyStub(e.id(), n))
          s.forEach((e) => {
            if ((0, g.isLineTool)(e)) {
              this._setOriginalLineToolSharingMode(e.id(), {
                sharingMode: e.sharingMode().value(),
                duplicatedInChart: !1,
              })
              const t = this._chartModel
                .lineToolsGroupModel()
                .groupForLineTool(e)
              t &&
                this._setOriginalLineToolGroupsSharingMode(t.id, {
                  sharingMode: e.sharingMode().value(),
                  duplicatedInChart: !1,
                })
            }
          }),
            this._allLineToolsAndStudyStubs.set(e.id(), i)
        }
        _unloadLineTools(e, t, o) {
          const i = e
            .filter((e) => !this._invalidatedLineToolsAndStudyStubs.has(e))
            .map((e) => this._chartModel.dataSourceForId(e))
            .filter(g.isLineTool)
            .filter(y.notNull)
            .filter((e) => e.sharingMode().value() === o)
            .filter(t)
            .filter((e) => {
              const t = this._chartModel
                .lineToolsGroupModel()
                .groupForLineTool(e)
              return null === t || !this._invalidatedLineToolGroups.has(t.id)
            })
          this._withoutInvalidating(() => {
            i.forEach((e) => {
              var t
              e.hasAlert().value() && e.detachAlert()
              const o = (0, c.ensureNotNull)(this._chartModel.paneForSource(e))
              this._chartModel.removeSource(e)
              ;(null !== (t = this._allLineToolsAndStudyStubs.get(o.id())) &&
              void 0 !== t
                ? t
                : new Map()
              ).delete(e.id())
            }),
              this._chartModel.lineToolsGroupModel().removeLineTools(i)
          })
        }
        _unloadLinesOnSeries(e, t, o) {
          const i = this._chartModel.mainSeries()
          if (!(null == o ? void 0 : o.size)) return
          const s = Array.from(o.keys()).filter((t) => !e(t))
          this._unloadLineTools(
            s,
            (e) => e.boundToSymbol() && e.ownerSource() === i,
            t,
          )
        }
        _isAutosaveEnabled() {
          return !1
        }
        async _saveInvalidatedIfRequired(e, t) {
          if (null !== this._lastBanTime) {
            if (!(performance.now() - this._lastBanTime >= 3e5))
              return Promise.resolve()
            this._lastBanTime = null
          }
          if (
            (!this._isAutosaveEnabled() && !t) ||
            this._options.readOnlyMode ||
            '' === this._origin.layoutId
          )
            return
          const i = this.prepareDTO(e),
            s = this._sharingModesToUse()
              .map((e) => {
                var t, s
                const n = i.get(e)
                if (!n || null === n.sources) return null
                const r =
                    null !== (t = n.lineToolsToValidate) && void 0 !== t
                      ? t
                      : Array.from(n.sources.keys()),
                  a =
                    null !== (s = n.groupsToValidate) && void 0 !== s
                      ? s
                      : Array.from(n.groups.keys())
                if (0 === r.length && 0 === a.length) return null
                const l = performance.now()
                if (n.sources.size || n.groups.size) {
                  this._applyToolsAndGroupsDTOToNonDeserializedCharts(n, e)
                  const t = this._savingAbortControllersBySharingMode.get(e)
                  t && t.abort()
                  const i = new AbortController()
                  return (
                    this._savingAbortControllersBySharingMode.set(e, i),
                    n.sources.forEach((t, o) => {
                      t &&
                        this._setOriginalLineToolSharingMode(o, {
                          sharingMode: e,
                          duplicatedInChart: !1,
                        })
                    }),
                    (0, c.ensureNotNull)(this._saveChartService)
                      .saveChartLineTools(this._origin.chartId, n, e, i.signal)
                      .then(() => {
                        this.resetInvalidated(l, n, e)
                      })
                      .catch(async (t) => {
                        t instanceof S.SavingLineToolsError &&
                          t.shouldBeCooled &&
                          (this._lastBanTime = performance.now())
                        {
                          const { SavingLineToolsLibraryError: e } =
                            await Promise.resolve().then(o.bind(o, 98653))
                          if (t instanceof e && t.safe) return
                        }
                        if (!(0, I.isAbortError)(t)) throw t
                        V.logDebug(
                          `Save request has been aborted. ChartId: ${this._origin.chartId} sharingMode: ${e}`,
                        )
                      })
                  )
                }
                return this.resetInvalidated(l, n, e), null
              })
              .filter(y.notNull)
          return s.length ? Promise.all(s).then(() => {}) : void 0
        }
        async _savePromise(e, t) {
          var o, i
          return this._isAutosaveEnabled()
            ? null !==
                (i =
                  null === (o = this._debouncedSave) || void 0 === o
                    ? void 0
                    : o.flush()) && void 0 !== i
              ? i
              : Promise.resolve()
            : this._saveInvalidatedIfRequired(e, t)
        }
        _seriesLineToolsUnloader(e, t, o) {
          const i = this._chartModel.mainSeries()
          'mainSeriesLineTools' === e.requestType &&
            i.symbolSameAsCurrent(e.symbol) &&
            (this._unloadLinesOnSeries(o, e.sharingMode, t),
            this._currentlyLoadedSymbol.set(e.sharingMode, e.symbol))
        }
        _mainPaneLineToolsAndStubs() {
          const e = this._chartModel.mainSeries(),
            t = (0, c.ensureNotNull)(this._chartModel.paneForSource(e))
          return new Map(this._allLineToolsAndStudyStubs.get(t.id()))
        }
        _onSymbolResolved(e) {
          const t = this._sharingModesToUse().map((t) => {
            const o = {
                requestType: 'mainSeriesLineTools',
                seriesSourceId: this._chartModel.mainSeries().id(),
                symbol: e.pro_name,
                brokerName: '',
                sharingMode: t,
              },
              i = this._seriesLineToolsUnloader.bind(
                this,
                o,
                this._mainPaneLineToolsAndStubs(),
              )
            return this._makeLoadRequestAndMerge(
              o,
              i,
              e.pro_name || e.ticker || e.full_name,
            )
          })
          this._saveSharedLineTools.value() &&
            Promise.all(t).then(() => {
              this._withoutInvalidating(() => {
                this._chartModel
                  .dataSources()
                  .filter(g.isLineTool)
                  .filter(
                    (e) => 0 === e.sharingMode().value() && e.linkKey().value(),
                  )
                  .forEach((e) => {
                    if ((e.share(1), this._options.migrateSyncedLineTools)) {
                      this._invalidateLineToolOrStudyStub(
                        e.id(),
                        performance.now(),
                        !0,
                      )
                      const t = this._chartModel
                        .lineToolsGroupModel()
                        .groupForLineTool(e)
                      t &&
                        this._invalidateLineToolGroup(
                          t.id,
                          performance.now(),
                          !0,
                        )
                    }
                  })
              })
            })
        }
        async _makeLoadRequestAndMerge(e, t, o) {
          var i
          const s = this._chartModel.mainSeries(),
            n =
              null !== (i = this._currentlyLoadedSymbol.get(e.sharingMode)) &&
              void 0 !== i
                ? i
                : ''
          if (!!s.symbolSameAsCurrent(n)) return
          this._currentlyLoadedSymbol.delete(e.sharingMode)
          const r = await (0, p.getChartStorage)()
          return this._savePromise('mainSeriesLineTools' === e.requestType)
            .catch(() => {})
            .then(() => N(r, this._origin.layoutId, this._origin.chartId, e, o))
            .then(async (o) => {
              if (null !== o && null !== o.sources) {
                const i = o.sources
                t((e) => i.has(e)),
                  await this._applyLineToolsAndGroupsDTO(o, e.sharingMode),
                  o.serverRequestId &&
                    console.log(`PROCESSED:${o.serverRequestId}`)
              }
            })
        }
        _restoreGroups(e, t, o, i) {
          const s = new Map()
          return (
            (t.groups || new Map()).forEach((t, n) => {
              const r = this._chartModel.lineToolsGroupModel().groupForId(n)
              if (null === t) {
                if (r) {
                  const e =
                    i &&
                    i.layoutId === this._origin.layoutId &&
                    i.chartId === this._origin.chartId
                  ;(r.lineTools()[0].sharingMode().value() === o ||
                    (0 === o &&
                      !this._doNotSaveSharedLineToolsToCharts.value())) &&
                    ((e && 0 !== o) ||
                      (new b.ExcludeLineToolsFromGroupUndoCommand(
                        this._chartModel,
                        r,
                        r.lineTools(),
                      ).redo(),
                      this._setOriginalLineToolGroupsSharingMode(n, null)))
                }
              } else {
                if (r && t.serverUpdateTime) {
                  const o = (0, c.ensureDefined)(t.serverUpdateTime)
                  if (null !== e && e >= o) return
                  r.setName(t.name)
                } else s.set(n, t)
                const i = this._originalLineToolGroupsSharingMode.get(n),
                  a = !(!i || (i.sharingMode === o && !i.duplicatedInChart))
                this._setOriginalLineToolGroupsSharingMode(n, {
                  sharingMode: o,
                  duplicatedInChart: a,
                })
              }
            }),
            s
          )
        }
        _createNewLineTool(e) {
          const t = this._chartModel.dataSourceForId(e.ownerSource)
          if (null === t) return null
          const o = (0, c.ensureNotNull)(this._chartModel.paneForSource(t)),
            i = this._chartModel.panes().indexOf(o),
            s = this._chartModel.restoreSource(!1, i, null, e.state, null)
          if (null !== s) {
            const e = this._allLineToolsAndStudyStubs.get(o.id()) || new Map()
            e.set(s.id(), s.linkKey().value()),
              this._allLineToolsAndStudyStubs.set(o.id(), e)
          }
          return s
        }
        _migrateStateFromMetainfo(e) {
          const t = void 0 !== e.symbol && e.symbol !== e.state.state.symbol
          t && (e.state.state.symbol = e.symbol)
          const o =
            void 0 !== e.currencyId && e.currencyId !== e.state.state.currencyId
          o && (e.state.state.currencyId = e.currencyId)
          const i = void 0 !== e.unitId && e.unitId !== e.state.state.unitId
          return i && (e.state.state.unitId = e.unitId), t || o || i
        }
        _restoreLineTool(e, t, o, i) {
          var s
          if (
            (null !== (s = t.state.points) && void 0 !== s ? s : []).some(
              (e) => !(0, y.isNumber)(e.time_t),
            )
          )
            return null
          let n = this._chartModel.dataSourceForId(t.id)
          if (
            (null === n &&
              t.state.linkKey &&
              (n = (0, g.lineToolByLinkKey)(this._chartModel, t.state.linkKey)),
            null !== n && !(0, g.isLineTool)(n))
          )
            return null
          if (this._origin.clientId === (null == i ? void 0 : i.clientId) && !n)
            return null
          if (n && t.serverUpdateTime) {
            const s = t.serverUpdateTime,
              r = n.serverUpdateTime()
            if ((null !== e && e >= s) || (null !== r && r >= s)) {
              if (this._saveSharedLineTools.value() && 0 !== o) {
                n.share(o)
                const e = this._originalLineToolSharingMode.get(n.id()),
                  t = !(!e || (e.sharingMode === o && !e.duplicatedInChart))
                this._setOriginalLineToolSharingMode(n.id(), {
                  sharingMode: o,
                  duplicatedInChart: t,
                })
              }
              return null
            }
            this._origin.clientId !== (null == i ? void 0 : i.clientId) &&
              (this._chartModel.restoreLineToolState(n, t.state, !1),
              n.calcIsActualSymbol())
          }
          0 !== o &&
            ((t.ownerSource = this._chartModel.mainSeries().id()),
            (t.state.ownerSource = this._chartModel.mainSeries().id()))
          const r = this._migrateStateFromMetainfo(t),
            a = n || this._createNewLineTool(t)
          return (
            a &&
              (r &&
                this._invalidateLineToolOrStudyStub(
                  t.id,
                  performance.now(),
                  !0,
                ),
              t.serverUpdateTime && a.setServerUpdateTime(t.serverUpdateTime),
              t.state.alertId ? a.setAlert(+t.state.alertId) : a.detachAlert(),
              (0 !== o || this._doNotSaveSharedLineToolsToCharts.value()) &&
                a.share(o)),
            a
          )
        }
        _removeLineTool(e) {
          const t = this._chartModel.dataSourceForId(e)
          null !== t &&
            new m.RemoveSourcesUndoCommand(this._chartModel, [t], null).redo()
        }
        _restoreLineDTO(e, t, o, i, s, n) {
          if (!this._invalidatedLineToolsAndStudyStubs.get(t))
            if (null === e) {
              const e = this._chartModel.dataSourceForId(t)
              if (!e) return
              if (!(0, g.isLineTool)(e)) return
              const o =
                n &&
                n.layoutId === this._origin.layoutId &&
                n.chartId === this._origin.chartId
              ;(e.sharingMode().value() === s ||
                (0 === s && !this._doNotSaveSharedLineToolsToCharts.value())) &&
                (0 === s ||
                  this._doNotSaveSharedLineToolsToCharts.value() ||
                  (e.share(0),
                  o ||
                    this._invalidateLineToolOrStudyStub(
                      t,
                      performance.now(),
                      !0,
                    )),
                this._origin.clientId !== (null == n ? void 0 : n.clientId) &&
                  ((o &&
                    0 !== s &&
                    !this._doNotSaveSharedLineToolsToCharts.value()) ||
                    (this._removeLineTool(t),
                    this._setOriginalLineToolSharingMode(t, null))))
            } else {
              const r = this._restoreLineTool(i, e, s, n)
              if (r) {
                if (e.groupId) {
                  const t = this._chartModel
                      .lineToolsGroupModel()
                      .groupForLineTool(r),
                    i = this._chartModel
                      .lineToolsGroupModel()
                      .groupForId(e.groupId)
                  if (null !== t && i === t) return
                  if (
                    (null !== t &&
                      (t.excludeLineTool(r),
                      0 === t.lineTools().length &&
                        this._chartModel.lineToolsGroupModel().removeGroup(t)),
                    i && !i.containsLineTool(r))
                  )
                    i.addLineTools([r])
                  else if (!i && o.has(e.groupId)) {
                    const t = (0, c.ensureDefined)(o.get(e.groupId))
                    this._chartModel
                      .lineToolsGroupModel()
                      .createGroup([r], t.name, t.id)
                  }
                } else {
                  this._chartModel
                    .lineToolsGroupModel()
                    .removeLineTools([r])
                    .forEach((e) => {
                      this._invalidateLineToolGroup(e, performance.now(), !0)
                    })
                }
                const i = this._originalLineToolSharingMode.get(t)
                ;(void 0 === i ||
                  (0 !== s &&
                    !this._doNotSaveSharedLineToolsToCharts.value())) &&
                  this._setOriginalLineToolSharingMode(t, {
                    sharingMode: s,
                    duplicatedInChart: !1,
                  })
                const n = !(!i || (i.sharingMode === s && !i.duplicatedInChart))
                ;(0, c.ensureDefined)(
                  this._originalLineToolSharingMode.get(t),
                ).duplicatedInChart = n
              }
            }
        }
        async _applyLineToolsAndGroupsDTO(e, t, o) {
          const i = this._chartModel.chartSaveTime(),
            s = this._withoutInvalidating(() =>
              this._restoreGroups(i, e, t, o),
            ),
            n = `ChartStorage.Synchronizer.ApplyingDTO.${`${this._origin.layoutId}.${this._origin.chartId}`}`,
            r = new Set()
          ;(e.sources || new Map()).forEach((e) => {
            e && r.add(e.state.type)
          }),
            await Promise.all(Array.from(r).map((e) => (0, g.initLineTool)(e))),
            (0, v.perfMeasureOperation)(n, () =>
              this._withoutInvalidating(() => {
                ;(e.sources || new Map()).forEach((e, n) => {
                  try {
                    this._restoreLineDTO(e, n, s, i, t, o)
                  } catch (e) {
                    V.logError(`Error restoring line tool ${n}: ${e}`)
                  }
                }),
                  (e.groups || new Map()).forEach((e, t) => {
                    this._invalidatedLineToolGroups.delete(t)
                  }),
                  this._recalculateHasChanges()
              }),
            )
        }
        _withoutInvalidating(e) {
          try {
            return this._ignoreInvalidatingEventsDepth++, e()
          } finally {
            this._ignoreInvalidatingEventsDepth--
          }
        }
        _invalidateLineToolOrStudyStub(e, t, o) {
          var i
          if (this._ignoreInvalidatingEventsDepth > 0 && !o) return
          const s =
              null === (i = this._invalidatedLineToolsAndStudyStubs.get(e)) ||
              void 0 === i
                ? void 0
                : i.invalidatedViaSyncOnly,
            n = (void 0 === s || s) && this.invalidateViaSync()
          this._invalidatedLineToolsAndStudyStubs.set(e, {
            timestamp: t,
            invalidatedViaSyncOnly: n,
          }),
            this._hasChanges.setValue(!0),
            this._debouncedSave()
        }
        _invalidateLineToolGroup(e, t, o) {
          ;(this._ignoreInvalidatingEventsDepth > 0 && !o) ||
            (this._invalidatedLineToolGroups.set(e, {
              timestamp: t,
              invalidatedViaSyncOnly: this.invalidateViaSync(),
            }),
            this._hasChanges.setValue(!0),
            this._debouncedSave())
        }
        _prepareDTOItem(e, t) {
          const o = new Map(),
            i = new Map(),
            s = [],
            n = []
          return (
            this._invalidatedLineToolsAndStudyStubs.forEach((n, r) => {
              var a, l
              if (0 !== t && n.invalidatedViaSyncOnly) return void s.push(r)
              const d = this._chartModel.dataSourceForId(r)
              if (k(d)) return
              const h = () => {
                var e
                this._doNotSaveSharedLineToolsToCharts.value() &&
                  0 === t &&
                  (null === (e = this._originalLineToolSharingMode.get(r)) ||
                  void 0 === e
                    ? void 0
                    : e.duplicatedInChart) &&
                  o.set(r, null)
              }
              if (null === d) {
                ;((null === (a = this._originalLineToolSharingMode.get(r)) ||
                void 0 === a
                  ? void 0
                  : a.sharingMode) === t ||
                  (0 === t &&
                    !this._doNotSaveSharedLineToolsToCharts.value())) &&
                  o.set(r, null),
                  h()
              } else {
                if (
                  d === this._chartModel.lineBeingCreated() ||
                  d === this._chartModel.lineBeingEdited() ||
                  !d.isSavedInChart()
                )
                  return
                const s = d.ownerSource() === this._chartModel.mainSeries(),
                  n = !e || s,
                  a =
                    d.sharingMode().value() === t ||
                    (0 === t && !this._doNotSaveSharedLineToolsToCharts.value())
                if (n) {
                  const e = this._chartModel
                    .lineToolsGroupModel()
                    .groupForLineTool(d)
                  if (a)
                    o.set(
                      r,
                      ((e, t) => {
                        const o = t.lineToolsGroupModel().groupForLineTool(e),
                          i = {
                            id: e.id(),
                            ownerSource: (0, c.ensureNotNull)(
                              e.ownerSource(),
                            ).id(),
                            state: e.state(!1),
                          }
                        return (
                          e.boundToSymbol() && (i.symbol = e.symbol()),
                          (i.currencyId = e
                            .properties()
                            .childs()
                            .currencyId.value()),
                          (i.unitId = e.properties().childs().unitId.value()),
                          null !== o && (i.groupId = o.id),
                          i
                        )
                      })(d, this._chartModel),
                    ),
                      null !== e && i.set(e.id, P(e, this._chartModel))
                  else {
                    const s =
                      null === (l = this._originalLineToolSharingMode.get(r)) ||
                      void 0 === l
                        ? void 0
                        : l.sharingMode
                    s === t && o.set(r, null),
                      null !== e && s === t && i.set(e.id, null)
                  }
                }
                0 !== d.sharingMode().value() && h()
              }
            }),
            this._invalidatedLineToolGroups.forEach((e, o) => {
              if (0 !== t && e.invalidatedViaSyncOnly) n.push(o)
              else if (!i.has(o)) {
                const e = this._chartModel.lineToolsGroupModel().groupForId(o)
                if (null === e) i.set(o, null)
                else {
                  ;(e.sharingMode().value() === t ||
                    (0 === t &&
                      !this._doNotSaveSharedLineToolsToCharts.value())) &&
                    i.set(o, P(e, this._chartModel))
                }
              }
            }),
            {
              sources: o,
              groups: i,
              clientId: this._generateOrigin(),
              lineToolsToValidate: Array.from(o.keys()).concat(s),
              groupsToValidate: Array.from(i.keys()).concat(n),
            }
          )
        }
        _setOriginalLineToolSharingMode(e, t) {
          t
            ? this._originalLineToolSharingMode.set(e, t)
            : this._originalLineToolSharingMode.delete(e)
        }
        _setOriginalLineToolGroupsSharingMode(e, t) {
          t
            ? this._originalLineToolGroupsSharingMode.set(e, t)
            : this._originalLineToolGroupsSharingMode.delete(e)
        }
        _sharingModesToUse() {
          return this._saveSharedLineTools.value() ? [0, 1, 2] : [0]
        }
        _loadAndMergeLineToolsOnStudies(e, t) {
          const o = {
              requestType: 'studiesLineTools',
              seriesSourceId: this._chartModel.mainSeries().id(),
              sharingMode: e,
            },
            i = this._chartModel.mainSeries()
          this._makeLoadRequestAndMerge(
            o,
            (o) => {
              const s = t
                ? u(
                    Array.from(this._allLineToolsAndStudyStubs.values()).map(
                      (e) => Array.from(e.keys()),
                    ),
                  ).filter((e) => !o(e))
                : []
              this._unloadLineTools(s, (e) => e.ownerSource() !== i, e)
            },
            void 0,
          )
        }
        _loadAndMergeLineToolsWithoutSymbol(e, t) {
          const o = {
              requestType: 'lineToolsWithoutSymbol',
              seriesSourceId: this._chartModel.mainSeries().id(),
              sharingMode: e,
            },
            i = this._chartModel.mainSeries(),
            s = (0, c.ensureNotNull)(this._chartModel.paneForSource(i)),
            n = this._allLineToolsAndStudyStubs.get(s.id())
          this._makeLoadRequestAndMerge(
            o,
            (o) => {
              const s = t && n ? Array.from(n.keys()).filter((e) => !o(e)) : []
              this._unloadLineTools(
                s,
                (e) => !e.boundToSymbol() && e.ownerSource() === i,
                e,
              )
            },
            void 0,
          )
        }
        _recalculateHasChanges() {
          const e = Array.from(
              this._invalidatedLineToolsAndStudyStubs.values(),
            ).some((e) => !e.savedToChartContent),
            t = Array.from(this._invalidatedLineToolGroups.values()).some(
              (e) => !e.savedToChartContent,
            )
          this._hasChanges.setValue(e || t)
        }
        _applyToolsAndGroupsDTOToNonDeserializedCharts(e, t) {
          var o, i
          if (
            null !== e.sources &&
            0 === t &&
            this._duplicateOperationsForSerializedCharts() &&
            this._deserializedChartsIds().length > 0
          ) {
            const t = new Map()
            for (const [s, n] of e.sources)
              null !== n &&
              '_seriesId' === n.ownerSource &&
              0 !==
                U(
                  null === (o = this._originalLineToolSharingMode.get(s)) ||
                    void 0 === o
                    ? void 0
                    : o.sharingMode,
                ) &&
              0 === U(n.state.sharingMode)
                ? t.set(s, null)
                : ((null === n &&
                    0 !==
                      U(
                        null ===
                          (i = this._originalLineToolSharingMode.get(s)) ||
                          void 0 === i
                          ? void 0
                          : i.sharingMode,
                      )) ||
                    (null !== n &&
                      '_seriesId' === n.ownerSource &&
                      0 !== U(n.state.sharingMode))) &&
                  t.set(s, n)
            if (t.size > 0) {
              const o = { groups: new Map(), sources: t, clientId: e.clientId }
              for (const e of this._deserializedChartsIds()) {
                const t = this._savingExternalChartsAbortControllers.get(e)
                t && t.abort()
                const i = new AbortController()
                this._savingExternalChartsAbortControllers.set(e, i),
                  (0, c.ensureNotNull)(this._saveChartService)
                    .saveChartLineTools(e, o, 0, i.signal)
                    .catch((e) => {})
              }
            }
          }
        }
        _generateOrigin() {
          return `${this._origin.layoutId}/${this._origin.chartId}/${this._origin.clientId}`
        }
      }
    },
  },
])
