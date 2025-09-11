;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7129, 5565],
  {
    98653: (e, t, i) => {
      i.r(t),
        i.d(t, {
          SavingLineToolsError: () => o,
          SavingLineToolsLibraryError: () => s,
        })
      class o extends Error {
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
    40076: (e, t, i) => {
      i.r(t), i.d(t, { LineToolsSynchronizer: () => V })
      var o = i(90484),
        s = i(18573),
        n = i(66711),
        r = i(54404),
        a = i(56052),
        l = n.default ? n.default.isConcatSpreadable : void 0
      const d = (e) =>
        (0, a.default)(e) || (0, r.default)(e) || !!(l && e && e[l])
      const h = function e(t, i, o, n, r) {
        var a = -1,
          l = t.length
        for (o || (o = d), r || (r = []); ++a < l; ) {
          var h = t[a]
          i > 0 && o(h)
            ? i > 1
              ? e(h, i - 1, o, n, r)
              : (0, s.default)(r, h)
            : n || (r[r.length] = h)
        }
        return r
      }
      const u = (e) => ((null == e ? 0 : e.length) ? h(e, 1) : [])
      var c = i(50151),
        _ = i(9343),
        g = i(19334),
        S = i(32755),
        p = i(98653),
        T = i(23024),
        v = i(37265),
        y = i(14426)
      const f = (0, _.getLogger)('Chart.LinkKeyResolver')
      class m {
        constructor(e, t, i) {
          ;(this._pendingRequests = new Map()),
            (this._startRequestingDebounced = (0, o.default)(
              () => this._startNextRequest(),
              500,
            )),
            (this._layoutId = e),
            (this._chartId = t),
            (this._ownerSourceId = i)
        }
        resolveLinkKey(e, t, i) {
          const o = ((e, t) => JSON.stringify([e, t]))(e, i),
            s = this._pendingRequests.get(o) ?? new Map()
          if (s.has(t)) return s.get(t).promise
          const n = (0, y.createDeferredPromise)()
          return (
            s.set(t, n),
            this._pendingRequests.set(o, s),
            this._startRequestingDebounced(),
            n.promise
          )
        }
        async _startNextRequest() {
          if (0 === this._pendingRequests.size) return
          const e = await (0, T.getChartStorage)(),
            t = this._pendingRequests.entries().next().value,
            { symbol: i, brokerName: o } = ((e) => {
              const t = JSON.parse(e)
              return { symbol: t[0], brokerName: t[1] }
            })(t[0]),
            s = t[1],
            n = {
              requestType: 'mainSeriesLineTools',
              seriesSourceId: this._ownerSourceId,
              symbol: i,
              brokerName: o,
              sharingMode: 0,
            }
          try {
            const t = await e.loadLineToolsAndGroups(
              this._layoutId,
              this._chartId,
              n,
              i,
            )
            null !== t &&
              null !== t.sources &&
              (t.sources.forEach((e, t) => {
                if (null === e) return
                const i = e.state.linkKey
                if (!i) return
                const o = s.get(i)
                o?.resolve(e.id), s.delete(i)
              }),
              t.serverRequestId &&
                console.log(`PROCESSED:${t.serverRequestId}`))
          } catch (e) {
            f.logError(`Error requesting line tools: ${e}`)
          }
          s.forEach((e) => {
            e.resolve(null)
          }),
            this._pendingRequests.delete(t[0]),
            await this._startNextRequest()
        }
      }
      var L = i(74174),
        M = i(70618),
        b = i(64147),
        I = i(21239)
      function A(e) {
        return e instanceof w
      }
      class w extends I.StudyStub {
        constructor(e, t, i) {
          super(e, { ...t, ownFirstValue: null }, i),
            (this._linkKey = new b.WatchedValue(t.linkKey ?? null))
        }
        linkKey() {
          return this._linkKey
        }
      }
      class C extends b.WatchedValue {
        constructor(e, t) {
          super(((e, t) => t)(0, t))
        }
        destroy() {
          super.destroy()
        }
      }
      var E = i(14051),
        O = i(15764)
      const k = [0, 1, 2],
        G = (0, _.getLogger)('LineToolsSynchronizer')
      function D(e, t) {
        return {
          id: e.id,
          name: e.name().value(),
          symbol: e.symbol(),
          currencyId: e.currencyId(),
          unitId: e.unitId(),
        }
      }
      function N(e, t, i) {
        const o = new Map(),
          s = new Set(i?.keys())
        return (
          e.forEach((e, n) => {
            const r = !i || i.has(n)
            ;(e.timestamp > t || !r) && (o.set(n, e), s.delete(n))
          }),
          { stillInvalidated: o, validated: Array.from(s) }
        )
      }
      var R
      function q(e) {
        return (0, S.isLineTool)(e) || A(e)
      }
      !((e) => {
        ;(e[(e.AutosaveDebounce = 500)] = 'AutosaveDebounce'),
          (e[(e.BanCoolingTimeout = 3e5)] = 'BanCoolingTimeout')
      })(R || (R = {}))
      const F = /(\w+)\/(\w+)\/(\w+)/
      class V {
        constructor(e, t, i, s) {
          ;(this._invalidatedLineToolsAndStudyStubs = new Map()),
            (this._allLineToolsAndStudyStubs = new Map()),
            (this._originalLineToolSharingMode = new Map()),
            (this._invalidatedLineToolGroups = new Map()),
            (this._originalLineToolGroupsSharingMode = new Map()),
            (this._ignoreInvalidatingEventsDepth = 0),
            (this._saveChartService = null),
            (this._debouncedSave = (0, o.default)(
              () => this._saveInvalidatedIfRequired(!1),
              500,
            )),
            (this._currentlyLoadedSymbol = new Map()),
            (this._linkKeyResolver = null),
            (this._brokerName = ''),
            (this._lastBanTime = null),
            (this._invalidateViaSync = 0),
            (this._savingAbortControllersBySharingMode = new Map()),
            (this._onChangeAutosave = (e) => {
              e && this._debouncedSave()
            }),
            (this._origin = e),
            (this._chartModel = t),
            (this._options = i),
            (this._hasChanges = s),
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
            (this._linkKeyResolver = new m(
              e.layoutId,
              e.chartId,
              t.mainSeries().id(),
            )),
            (this._brokerIdSession = new C('broker_id_session', !1)),
            k.forEach((e) => {
              0 === e && this._loadAndMergeLineToolsOnStudies(e, !1),
                this._loadAndMergeLineToolsWithoutSymbol(e, !1)
            })
        }
        destroy() {
          this._brokerIdSession.destroy(),
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
              .unsubscribeAll(this),
            this._saveChartService
              ?.autoSaveEnabled()
              .unsubscribe(this._onChangeAutosave)
        }
        reloadAllLineTools() {
          this._currentlyLoadedSymbol.clear(),
            k.forEach((e) => {
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
            k.forEach((i) => {
              t.set(i, this._prepareDTOItem(e, i))
            }),
            t
          )
        }
        getDTO(e = 0, t = !1, i = !1) {
          return i && this.invalidateAll(), this._prepareDTOItem(t, e, i)
        }
        async applyDTO(e, t = 0) {
          this.resetInvalidated(Date.now().valueOf(), e, t),
            await this._applyLineToolsAndGroupsDTO(e, t)
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
        resetInvalidated(e, t, i, o) {
          const s = (e, t, o, s) => {
            if (!o.has(s) || o.get(s)) o.has(s) && t(s, i)
            else {
              const o = e.get(s)
              o && (o === i ? t(s, null) : 0 === i && t(s, o))
            }
          }
          if (null === t.sources) return
          const {
              groups: n,
              sources: r,
              lineToolsToValidate: a,
              groupsToValidate: l,
            } = t,
            d = N(
              this._invalidatedLineToolsAndStudyStubs,
              e,
              new Set(a ?? r.keys()),
            )
          ;(this._invalidatedLineToolsAndStudyStubs = d.stillInvalidated),
            d.validated.forEach(
              s.bind(
                this,
                this._originalLineToolSharingMode,
                this._setOriginalLineToolSharingMode.bind(this),
                r,
              ),
            )
          const h = N(
            this._invalidatedLineToolGroups,
            e,
            new Set(l ?? n.keys()),
          )
          d.validated.forEach(
            s.bind(
              this,
              this._originalLineToolGroupsSharingMode,
              this._setOriginalLineToolGroupsSharingMode.bind(this),
              n,
            ),
          ),
            (this._invalidatedLineToolGroups = h.stillInvalidated),
            Array.from(r.keys()).forEach((e) => {
              const t = this._chartModel.dataSourceForId(e)
              t &&
                (void 0 !== o
                  ? t.setServerUpdateTime(o)
                  : null === t.serverUpdateTime() &&
                    t.setServerUpdateTime(new Date().valueOf()))
            }),
            this._recalculateHasChanges()
        }
        applyLineToolUpdateNotification(e, t) {
          const i = ((e) => {
            const t = F.exec(e)
            return 4 === t?.length
              ? { layoutId: t[1], chartId: t[2], clientId: t[3] }
              : { layoutId: '', chartId: '', clientId: e }
          })(e.clientId ?? '')
          ;(i.clientId === this._origin.clientId &&
            i.chartId === this._origin.chartId) ||
            (void 0 !== e.symbol && null === e.sources
              ? this._withoutInvalidating(() => {
                  const i = this._chartModel
                    .dataSources()
                    .filter(S.isLineTool)
                    .filter(
                      (i) =>
                        i.sharingMode().value() === t &&
                        i.symbol() === e.symbol,
                    )
                  i.length > 0 &&
                    this._chartModel.undoModel().removeSources(i, !0, null)
                })
              : this._applyLineToolsAndGroupsDTO(e, t, i))
        }
        startApplyingLineToolUpdateNotification() {
          this._ignoreInvalidatingEventsDepth++
        }
        endApplyingLineToolUpdateNotification() {
          this._ignoreInvalidatingEventsDepth--,
            this._ignoreInvalidatingEventsDepth < 0 &&
              (G.logError(
                'Logic error, startApplyingLineToolUpdateNotification/endApplyingLineToolUpdateNotification mismatch, autofixing',
              ),
              (this._ignoreInvalidatingEventsDepth = 0))
        }
        applyAlertIdByExternalSource(e, t) {
          this._withoutInvalidating(() => {
            const i = this._chartModel.dataSourceForId(e)
            i && (0, S.isLineTool)(i) && i.setAlert(t)
          })
        }
        deleteAlertByExternalSource(e) {
          this._withoutInvalidating(() => {
            const t = this._chartModel.dataSourceForId(e)
            t && (0, S.isLineTool)(t) && t.removeAlert()
          })
        }
        async markSyncedLineToolAsDeleted(e, t) {
          if (this._linkKeyResolver) {
            const i = await this._linkKeyResolver.resolveLinkKey(
              t,
              e,
              this._brokerName,
            )
            if (null !== i) {
              const t = this._chartModel.lineToolByLinkKey(e)
              null === t
                ? this._invalidateLineToolOrStudyStub(i, performance.now())
                : this._withoutInvalidating(() => {
                    const e = (0, c.ensureNotNull)(
                        this._chartModel.paneForSource(t),
                      ),
                      i =
                        this._allLineToolsAndStudyStubs.get(e.id()) || new Map()
                    t.detachAlert(),
                      this._chartModel.removeSource(t),
                      i.delete(t.id())
                  }),
                this._debouncedSave()
            }
            return i
          }
          return null
        }
        invalidateAll() {
          const e = performance.now()
          this._allLineToolsAndStudyStubs.forEach((t) => {
            t.forEach((t, i) => {
              this._invalidateLineToolOrStudyStub(i, e)
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
                .filter(q)
                .map((e) => [e.id(), e.linkKey().value()]),
              i = new Map(t)
            this._allLineToolsAndStudyStubs.set(e.id(), i)
          })
        }
        _processPropertiesChanged(e, t) {
          q(t) && this._invalidateLineToolOrStudyStub(t.id(), performance.now())
        }
        _processLineToolsGroupModelChanged(e, t) {
          const i = performance.now()
          this._invalidateLineToolGroup(e, i),
            t &&
              (t.affectedLineTools || []).forEach((e) =>
                this._invalidateLineToolOrStudyStub(e, i),
              )
        }
        _processPanesCollectionChanged(e) {
          const t = e.map((e) => e.id()),
            i = new Set(t),
            o = performance.now()
          Array.from(this._allLineToolsAndStudyStubs.keys())
            .filter((e) => !i.has(e))
            .forEach((e) => {
              Array.from(
                (0, c.ensureDefined)(
                  this._allLineToolsAndStudyStubs.get(e),
                ).keys(),
              ).forEach((e) => {
                this._invalidateLineToolOrStudyStub(e, o)
              })
            }),
            e
              .filter((e) => !this._allLineToolsAndStudyStubs.has(e.id()))
              .forEach((e) => {
                e.dataSources()
                  .filter(q)
                  .forEach((e) =>
                    this._invalidateLineToolOrStudyStub(e.id(), o),
                  )
              }),
            this._assignAllLineTools(e)
        }
        _processDataSourceCollectionChanged(e) {
          const t = e.dataSources().filter(q),
            i = t.map((e) => [e.id(), e.linkKey().value()]),
            o = new Map(i)
          let s
          const n = performance.now()
          if (this._allLineToolsAndStudyStubs.has(e.id())) {
            const i = (0, c.ensureDefined)(
              this._allLineToolsAndStudyStubs.get(e.id()),
            )
            ;(s = t.filter((e) => !i.has(e.id()))),
              s.forEach((e) => this._invalidateLineToolOrStudyStub(e.id(), n)),
              Array.from(i.entries())
                .filter((e) => !o.has(e[0]))
                .forEach((e) => {
                  null !== e[1] && this._debouncedSave(),
                    this._invalidateLineToolOrStudyStub(e[0], n)
                })
          } else
            (s = t),
              t.forEach((e) => this._invalidateLineToolOrStudyStub(e.id(), n))
          s.forEach((e) => {
            if ((0, S.isLineTool)(e)) {
              this._setOriginalLineToolSharingMode(
                e.id(),
                e.sharingMode().value(),
              )
              const t = this._chartModel
                .lineToolsGroupModel()
                .groupForLineTool(e)
              t &&
                this._setOriginalLineToolGroupsSharingMode(
                  t.id,
                  e.sharingMode().value(),
                )
            }
          }),
            this._allLineToolsAndStudyStubs.set(e.id(), o)
        }
        _unloadLineTools(e, t, i) {
          const o = e
            .filter((e) => !this._invalidatedLineToolsAndStudyStubs.has(e))
            .map((e) => this._chartModel.dataSourceForId(e))
            .filter(S.isLineTool)
            .filter(v.notNull)
            .filter((e) => e.sharingMode().value() === i)
            .filter(t)
            .filter((e) => {
              const t = this._chartModel
                .lineToolsGroupModel()
                .groupForLineTool(e)
              return null === t || !this._invalidatedLineToolGroups.has(t.id)
            })
          this._withoutInvalidating(() => {
            this._chartModel.bulkActionMacro(() => {
              o.forEach((e) => {
                e.hasAlert().value() && e.detachAlert()
                const t = (0, c.ensureNotNull)(
                  this._chartModel.paneForSource(e),
                )
                this._chartModel.removeSource(e)
                ;(
                  this._allLineToolsAndStudyStubs.get(t.id()) ?? new Map()
                ).delete(e.id())
              }),
                this._chartModel.lineToolsGroupModel().removeLineTools(o)
            })
          })
        }
        _unloadLinesOnSeries(e, t, i) {
          const o = this._chartModel.mainSeries()
          if (!i?.size) return
          const s = Array.from(i.keys()).filter((t) => !e(t))
          this._unloadLineTools(
            s,
            (e) => e.boundToSymbol() && e.ownerSource() === o,
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
          const o = this.prepareDTO(e),
            s = k
              .map((e) => {
                const t = o.get(e)
                if (!t || null === t.sources) return null
                const s = t.lineToolsToValidate ?? Array.from(t.sources.keys()),
                  n = t.groupsToValidate ?? Array.from(t.groups.keys())
                if (0 === s.length && 0 === n.length) return null
                const r = performance.now()
                if (t.sources.size || t.groups.size) {
                  const o = this._savingAbortControllersBySharingMode.get(e)
                  o && o.abort()
                  const s = new AbortController()
                  return (
                    this._savingAbortControllersBySharingMode.set(e, s),
                    t.sources.forEach((t, i) => {
                      t && this._setOriginalLineToolSharingMode(i, e)
                    }),
                    (0, c.ensureNotNull)(this._saveChartService)
                      .saveChartLineTools(this._origin.chartId, t, e, s.signal)
                      .then(({ serverUpdateTime: i }) => {
                        this.resetInvalidated(r, t, e, i)
                      })
                      .catch(async (t) => {
                        t instanceof p.SavingLineToolsError &&
                          t.shouldBeCooled &&
                          (this._lastBanTime = performance.now())
                        {
                          const { SavingLineToolsLibraryError: e } =
                            await Promise.resolve().then(i.bind(i, 98653))
                          if (t instanceof e && t.safe) return
                        }
                        if (!(0, E.isAbortError)(t)) throw t
                        G.logDebug(
                          `Save request has been aborted. ChartId: ${this._origin.chartId} sharingMode: ${e}`,
                        )
                      })
                  )
                }
                return this.resetInvalidated(r, t, e), null
              })
              .filter(v.notNull)
          return s.length ? Promise.all(s).then(() => {}) : void 0
        }
        async _savePromise(e, t) {
          return this._isAutosaveEnabled()
            ? (this._debouncedSave?.flush() ?? Promise.resolve())
            : this._saveInvalidatedIfRequired(e, t)
        }
        _seriesLineToolsUnloader(e, t, i) {
          const o = this._chartModel.mainSeries()
          'mainSeriesLineTools' === e.requestType &&
            o.symbolSameAsCurrent(e.symbol) &&
            (this._unloadLinesOnSeries(i, e.sharingMode, t),
            this._currentlyLoadedSymbol.set(e.sharingMode, e.symbol))
        }
        _mainPaneLineToolsAndStubs() {
          const e = this._chartModel.mainSeries(),
            t = (0, c.ensureNotNull)(this._chartModel.paneForSource(e))
          return new Map(this._allLineToolsAndStudyStubs.get(t.id()))
        }
        _onSymbolResolved(e) {
          const t = k.map((t) => {
            const i = {
                requestType: 'mainSeriesLineTools',
                seriesSourceId: this._chartModel.mainSeries().id(),
                symbol: e.pro_name,
                brokerName: '',
                sharingMode: t,
              },
              o = this._seriesLineToolsUnloader.bind(
                this,
                i,
                this._mainPaneLineToolsAndStubs(),
              )
            return this._makeLoadRequestAndMerge(
              i,
              o,
              e.pro_name || e.ticker || e.full_name,
            )
          })
          Promise.all(t).then(() => {
            this._withoutInvalidating(() => {
              this._chartModel
                .dataSources()
                .filter(S.isLineTool)
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
                      this._invalidateLineToolGroup(t.id, performance.now(), !0)
                  }
                })
            })
          })
        }
        async _makeLoadRequestAndMerge(e, t, i) {
          const o = this._chartModel.mainSeries(),
            s = this._currentlyLoadedSymbol.get(e.sharingMode) ?? ''
          if (!!o.symbolSameAsCurrent(s)) return
          this._currentlyLoadedSymbol.delete(e.sharingMode)
          const n = await (0, T.getChartStorage)()
          return this._savePromise('mainSeriesLineTools' === e.requestType)
            .catch(() => {})
            .then(() =>
              n.loadLineToolsAndGroups(
                this._origin.layoutId,
                this._origin.chartId,
                e,
                i,
              ),
            )
            .catch(() => null)
            .then(async (i) => {
              if (null !== i && null !== i.sources) {
                const o = i.sources
                t((e) => o.has(e)),
                  await this._applyLineToolsAndGroupsDTO(i, e.sharingMode),
                  i.serverRequestId &&
                    console.log(`PROCESSED:${i.serverRequestId}`)
              }
            })
        }
        _restoreGroups(e, t, i, o) {
          const s = new Map()
          return (
            (t.groups || new Map()).forEach((t, n) => {
              const r = this._chartModel.lineToolsGroupModel().groupForId(n)
              if (null === t) {
                if (r) {
                  const e =
                    o &&
                    o.layoutId === this._origin.layoutId &&
                    o.chartId === this._origin.chartId
                  r.lineTools()[0].sharingMode().value() === i &&
                    ((e && 0 !== i) ||
                      (new M.ExcludeLineToolsFromGroupUndoCommand(
                        this._chartModel,
                        r,
                        r.lineTools(),
                      ).redo(),
                      this._setOriginalLineToolGroupsSharingMode(n, null)))
                }
              } else {
                if (r && t.serverUpdateTime) {
                  const i = (0, c.ensureDefined)(t.serverUpdateTime)
                  if (null !== e && e >= i) return
                  r.setName(t.name)
                } else s.set(n, t)
                this._setOriginalLineToolGroupsSharingMode(n, i)
              }
            }),
            s
          )
        }
        _createNewLineTool(e) {
          const t = this._chartModel.dataSourceForId(e.ownerSource)
          if (null === t) return null
          const i = (0, c.ensureNotNull)(this._chartModel.paneForSource(t)),
            o = this._chartModel.panes().indexOf(i),
            s = this._chartModel.restoreSource(!1, o, null, e.state, null)
          if (null !== s) {
            const e = this._allLineToolsAndStudyStubs.get(i.id()) || new Map()
            e.set(s.id(), s.linkKey().value()),
              this._allLineToolsAndStudyStubs.set(i.id(), e)
          }
          return s
        }
        _migrateStateFromMetainfo(e) {
          const t = void 0 !== e.symbol && e.symbol !== e.state.state.symbol
          t && (e.state.state.symbol = e.symbol)
          const i =
            void 0 !== e.currencyId && e.currencyId !== e.state.state.currencyId
          i && (e.state.state.currencyId = e.currencyId)
          const o = void 0 !== e.unitId && e.unitId !== e.state.state.unitId
          return o && (e.state.state.unitId = e.unitId), t || i || o
        }
        _restoreLineTool(e, t, i, o) {
          if ((t.state.points ?? []).some((e) => !(0, v.isNumber)(e.time_t)))
            return null
          let s = this._chartModel.dataSourceForId(t.id)
          if (
            (null === s &&
              t.state.linkKey &&
              (s = this._chartModel.lineToolByLinkKey(t.state.linkKey)),
            null !== s && !(0, S.isLineTool)(s))
          )
            return null
          if (this._origin.clientId === o?.clientId && !s) return null
          if (s && t.serverUpdateTime) {
            const n = t.serverUpdateTime,
              r = s.serverUpdateTime()
            if ((null !== e && e >= n) || (null !== r && r >= n))
              return (
                0 !== i &&
                  (s.share(i), this._setOriginalLineToolSharingMode(s.id(), i)),
                this._restoreLineToolAlert(s, t.state.alertId),
                null
              )
            this._origin.clientId !== o?.clientId &&
              (this._chartModel.restoreLineToolState(s, t.state, !1),
              s.sharingMode().value() !== i &&
                (s.share(i), this._setOriginalLineToolSharingMode(s.id(), i)),
              s.calcIsActualSymbol())
          }
          0 !== i &&
            ((t.ownerSource = this._chartModel.mainSeries().id()),
            (t.state.ownerSource = this._chartModel.mainSeries().id()))
          const n = this._migrateStateFromMetainfo(t)
          let r = s || this._createNewLineTool(t)
          if (
            r &&
            (n &&
              this._invalidateLineToolOrStudyStub(t.id, performance.now(), !0),
            t.serverUpdateTime && r.setServerUpdateTime(t.serverUpdateTime),
            this._restoreLineToolAlert(r, t.state.alertId),
            0 !== i && r.share(i),
            void 0 === o && (0, S.isEditableTextLineTool)(r))
          ) {
            this._removeTextLineToolIfEmpty(r) && (r = null)
          }
          return r
        }
        _restoreLineToolAlert(e, t) {
          t
            ? e.restoreAlert(+t, { syncFocusFromAlert: !0 }).catch((e) => {
                G.logError(`Failed to restore lineTool alert: ${(Error, e)}`)
              })
            : e.detachAlert()
        }
        _removeLineTool(e) {
          const t = this._chartModel.dataSourceForId(e)
          null !== t &&
            new L.RemoveSourcesUndoCommand(this._chartModel, [t], null).redo()
        }
        _removeTextLineToolIfEmpty(e) {
          return (
            !(
              !e.removeIfEditableTextIsEmpty() ||
              0 !== e.editableTextProperties().text.value().length
            ) &&
            (this._chartModel.removeSource(e),
            this._invalidateLineToolOrStudyStub(e.id(), performance.now(), !0),
            !0)
          )
        }
        _restoreLineDTO(e, t, i, o, s, n) {
          if (!this._invalidatedLineToolsAndStudyStubs.get(t))
            if (null === e) {
              const e = this._chartModel.dataSourceForId(t)
              if (!e) return
              if (!(0, S.isLineTool)(e)) return
              e.sharingMode().value() === s &&
                this._origin.clientId !== n?.clientId &&
                (this._removeLineTool(t),
                this._setOriginalLineToolSharingMode(t, null))
            } else {
              const r = this._restoreLineTool(o, e, s, n)
              if (r) {
                if (e.groupId) {
                  const t = this._chartModel
                      .lineToolsGroupModel()
                      .groupForLineTool(r),
                    o = this._chartModel
                      .lineToolsGroupModel()
                      .groupForId(e.groupId)
                  if (null !== t && o === t) return
                  if (
                    (null !== t &&
                      (t.excludeLineTool(r),
                      0 === t.lineTools().length &&
                        this._chartModel.lineToolsGroupModel().removeGroup(t)),
                    o && !o.containsLineTool(r))
                  )
                    o.addLineTools([r])
                  else if (!o && i.has(e.groupId)) {
                    const t = (0, c.ensureDefined)(i.get(e.groupId))
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
                void 0 === this._originalLineToolSharingMode.get(t) &&
                  this._setOriginalLineToolSharingMode(t, s),
                  this._setOriginalLineToolSharingMode(t, s)
              }
            }
        }
        async _applyLineToolsAndGroupsDTO(e, t, i) {
          const o = this._chartModel.chartSaveTime(),
            s = this._withoutInvalidating(() =>
              this._restoreGroups(o, e, t, i),
            ),
            n = `ChartStorage.Synchronizer.ApplyingDTO.${`${this._origin.layoutId}.${this._origin.chartId}`}`,
            r = new Set()
          return (
            (e.sources || new Map()).forEach((e) => {
              e && r.add(e.state.type)
            }),
            await Promise.all(Array.from(r).map((e) => (0, S.initLineTool)(e))),
            (0, g.perfMeasureOperation)(n, () =>
              this._withoutInvalidating(() => {
                this._chartModel.bulkActionMacro(() => {
                  ;(e.sources || new Map()).forEach((e, n) => {
                    try {
                      if (e && (0, O.isMtpPredictorToolName)(e.state.type))
                        return void G.logWarn(
                          `No longer supported tool ${e.state.type} is skipped while restoring state`,
                        )
                      this._restoreLineDTO(e, n, s, o, t, i)
                    } catch (t) {
                      G.logError(
                        `Error restoring line tool ${n} (${e?.state.type}): ${t}`,
                      ),
                        e?.state.type &&
                          !r.has(e.state.type) &&
                          G.logError(
                            `Line tool ${e.state.type} may need to be initialised first`,
                          )
                    }
                  }),
                    (e.groups || new Map()).forEach((e, t) => {
                      this._invalidatedLineToolGroups.delete(t)
                    }),
                    this._recalculateHasChanges()
                })
              }),
            )
          )
        }
        _withoutInvalidating(e) {
          try {
            return this._ignoreInvalidatingEventsDepth++, e()
          } finally {
            this._ignoreInvalidatingEventsDepth--
          }
        }
        _invalidateLineToolOrStudyStub(e, t, i) {
          if (this._ignoreInvalidatingEventsDepth > 0 && !i) return
          const o =
              this._invalidatedLineToolsAndStudyStubs.get(
                e,
              )?.invalidatedViaSyncOnly,
            s = (void 0 === o || o) && this.invalidateViaSync()
          this._invalidatedLineToolsAndStudyStubs.set(e, {
            timestamp: t,
            invalidatedViaSyncOnly: s,
          }),
            this._hasChanges.setValue(!0),
            this._debouncedSave()
        }
        _invalidateLineToolGroup(e, t, i) {
          ;(this._ignoreInvalidatingEventsDepth > 0 && !i) ||
            (this._invalidatedLineToolGroups.set(e, {
              timestamp: t,
              invalidatedViaSyncOnly: this.invalidateViaSync(),
            }),
            this._hasChanges.setValue(!0),
            this._debouncedSave())
        }
        _prepareDTOItem(e, t, i = !1) {
          const o = new Map(),
            s = new Map(),
            n = [],
            r = []
          return (
            this._invalidatedLineToolsAndStudyStubs.forEach((r, a) => {
              if (0 !== t && r.invalidatedViaSyncOnly) return void n.push(a)
              const l = this._chartModel.dataSourceForId(a)
              if (!A(l))
                if (null === l) {
                  ;(this._originalLineToolSharingMode.get(a) === t || i) &&
                    o.set(a, null)
                } else {
                  if (
                    l === this._chartModel.lineBeingCreated() ||
                    l === this._chartModel.lineBeingEdited() ||
                    !l.isSavedInChart()
                  )
                    return
                  const n = l.ownerSource() === this._chartModel.mainSeries(),
                    r = !e || n,
                    d = l.sharingMode().value() === t || i
                  if (r) {
                    const e = this._chartModel
                      .lineToolsGroupModel()
                      .groupForLineTool(l)
                    if (d)
                      o.set(
                        a,
                        ((e, t) => {
                          const i = t.lineToolsGroupModel().groupForLineTool(e),
                            o = {
                              id: e.id(),
                              ownerSource: (0, c.ensureNotNull)(
                                e.ownerSource(),
                              ).id(),
                              state: e.state(!1),
                            }
                          return (
                            e.boundToSymbol() && (o.symbol = e.symbol()),
                            (o.currencyId = e
                              .properties()
                              .childs()
                              .currencyId.value()),
                            (o.unitId = e.properties().childs().unitId.value()),
                            null !== i && (o.groupId = i.id),
                            o
                          )
                        })(l, this._chartModel),
                      ),
                        null !== e && s.set(e.id, D(e, this._chartModel))
                    else {
                      const i = this._originalLineToolSharingMode.get(a)
                      i === t && o.set(a, null),
                        null !== e && i === t && s.set(e.id, null)
                    }
                  }
                }
            }),
            this._invalidatedLineToolGroups.forEach((e, i) => {
              if (0 !== t && e.invalidatedViaSyncOnly) r.push(i)
              else if (!s.has(i)) {
                const e = this._chartModel.lineToolsGroupModel().groupForId(i)
                if (null === e) {
                  this._originalLineToolGroupsSharingMode.get(i) === t &&
                    s.set(i, null)
                } else
                  e.sharingMode().value() === t &&
                    s.set(i, D(e, this._chartModel))
              }
            }),
            {
              sources: o,
              groups: s,
              clientId: this._generateOrigin(),
              lineToolsToValidate: Array.from(o.keys()).concat(n),
              groupsToValidate: Array.from(s.keys()).concat(r),
            }
          )
        }
        _setOriginalLineToolSharingMode(e, t) {
          null !== t
            ? this._originalLineToolSharingMode.set(e, t)
            : this._originalLineToolSharingMode.delete(e)
        }
        _setOriginalLineToolGroupsSharingMode(e, t) {
          null !== t
            ? this._originalLineToolGroupsSharingMode.set(e, t)
            : this._originalLineToolGroupsSharingMode.delete(e)
        }
        _loadAndMergeLineToolsOnStudies(e, t) {
          const i = {
              requestType: 'studiesLineTools',
              seriesSourceId: this._chartModel.mainSeries().id(),
              sharingMode: e,
            },
            o = this._chartModel.mainSeries()
          this._makeLoadRequestAndMerge(i, (i) => {
            const s = t
              ? u(
                  Array.from(this._allLineToolsAndStudyStubs.values()).map(
                    (e) => Array.from(e.keys()),
                  ),
                ).filter((e) => !i(e))
              : []
            this._unloadLineTools(s, (e) => e.ownerSource() !== o, e)
          })
        }
        _loadAndMergeLineToolsWithoutSymbol(e, t) {
          const i = {
              requestType: 'lineToolsWithoutSymbol',
              seriesSourceId: this._chartModel.mainSeries().id(),
              sharingMode: e,
            },
            o = this._chartModel.mainSeries(),
            s = (0, c.ensureNotNull)(this._chartModel.paneForSource(o)),
            n = this._allLineToolsAndStudyStubs.get(s.id())
          this._makeLoadRequestAndMerge(i, (i) => {
            const s = t && n ? Array.from(n.keys()).filter((e) => !i(e)) : []
            this._unloadLineTools(
              s,
              (e) => !e.boundToSymbol() && e.ownerSource() === o,
              e,
            )
          })
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
        _generateOrigin() {
          return `${this._origin.layoutId}/${this._origin.chartId}/${this._origin.clientId}`
        }
      }
    },
  },
])
