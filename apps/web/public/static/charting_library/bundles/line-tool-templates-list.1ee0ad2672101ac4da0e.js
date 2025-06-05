;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3177],
  {
    190266: (e, a, t) => {
      t.d(a, { runOrSignIn: () => l, runOrSignInWithPromo: () => n })
      function l(e, a) {
        e()
      }
      function n(e, a, t) {
        t()
      }
    },
    580384: (e, a, t) => {
      t.r(a), t.d(a, { LinetoolTemplatesList: () => u })
      var l = t(609838),
        n = t(986661),
        o = t(855342),
        r = t(357739),
        i = t(190266),
        m = t(153055),
        s = t(980458)
      const p = t(156963).enabled('drawing_templates')
      class u {
        constructor(e, a) {
          ;(this._toolName = e),
            (this._applyTemplate = a),
            (this._templatesDeferred = p ? this._loadData() : Promise.resolve())
        }
        getData() {
          return n.store.getState().templates[this._toolName]
        }
        templatesLoaded() {
          return this._templatesDeferred
        }
        loadTemplate(e, a) {
          n.store.dispatch(
            (0, o.loadTemplate)(this._toolName, e, (e) => {
              this._applyTemplate(e), null == a || a()
            }),
          )
        }
        removeTemplate(e) {
          n.store.dispatch((0, o.startRemoveTemplate)(this._toolName, e))
        }
        saveTemplate(e, a) {
          const t = (0, r.clean)(e)
          n.store.dispatch((0, o.saveTemplate)(this._toolName, t, a))
        }
        deleteAction(e) {
          ;(0, i.runOrSignIn)(
            () => {
              const a = l.t(null, { replace: { name: e } }, t(774935))
              ;(0, m.showConfirm)({
                text: a,
                onConfirm: (a) => {
                  this.removeTemplate(e), a.dialogClose()
                },
              })
            },
            { source: 'Delete line tool template' },
          )
        }
        showSaveDialog(e) {
          ;(0, i.runOrSignIn)(
            () => {
              ;(0, m.showRename)({
                title: l.t(null, void 0, t(933751)),
                text: l.t(null, void 0, t(350912)) + ':',
                maxLength: 64,
                source: this.getData() || [],
                autocompleteFilter: s.autocompleteFilter,
                onRename: (a) => {
                  if (-1 !== (this.getData() || []).indexOf(a.newValue)) {
                    const n = l.t(
                      null,
                      { replace: { name: a.newValue } },
                      t(571527),
                    )
                    ;(0, m.showConfirm)(
                      {
                        text: n,
                        onConfirm: (t) => {
                          e(a.newValue), t.dialogClose(), a.dialogClose()
                        },
                        onClose: a.focusInput,
                      },
                      a.innerManager,
                    )
                  } else e(a.newValue), a.dialogClose()
                },
              })
            },
            { source: 'Save line tool template', sourceMeta: 'Chart' },
          )
        }
        async _loadData() {
          return new Promise((e) => {
            this.getData()
              ? e()
              : n.store.dispatch((0, o.getTemplates)(this._toolName, e))
          })
        }
      }
    },
    855342: (e, a, t) => {
      t.d(a, {
        addTemplate: () => r,
        getTemplates: () => n,
        loadTemplate: () => p,
        removeTemplate: () => m,
        saveTemplate: () => s,
        setTemplates: () => o,
        startRemoveTemplate: () => i,
      })
      var l = t(765827)
      function n(e, a) {
        return { type: l.GET_TEMPLATES, toolName: e, callback: a }
      }
      function o(e, a) {
        return { type: l.SET_TEMPLATES, templates: a, toolName: e }
      }
      function r(e, a) {
        return { type: l.ADD_TEMPLATE, templateName: a, toolName: e }
      }
      function i(e, a) {
        return { type: l.START_REMOVE_TEMPLATE, templateName: a, toolName: e }
      }
      function m(e, a) {
        return { type: l.REMOVE_TEMPLATE, templateName: a, toolName: e }
      }
      function s(e, a, t) {
        return {
          type: l.SAVE_TEMPLATE,
          templateName: a,
          toolName: e,
          content: t,
        }
      }
      function p(e, a, t) {
        return {
          type: l.LOAD_TEMPLATE,
          toolName: e,
          templateName: a,
          callback: t,
        }
      }
    },
    765827: (e, a, t) => {
      function l(e) {
        return 'LINE_TOOL_TEMPLATE__' + e
      }
      t.d(a, {
        ADD_TEMPLATE: () => s,
        GET_TEMPLATES: () => n,
        LOAD_TEMPLATE: () => p,
        REMOVE_TEMPLATE: () => i,
        SAVE_TEMPLATE: () => m,
        SET_TEMPLATES: () => o,
        START_REMOVE_TEMPLATE: () => r,
      })
      const n = l('GET_TEMPLATES'),
        o = l('SET_TEMPLATES'),
        r = l('START_REMOVE_TEMPLATE'),
        i = l('REMOVE_TEMPLATE'),
        m = l('SAVE_TEMPLATE'),
        s = l('ADD_TEMPLATE'),
        p = l('LOAD_TEMPLATE')
    },
    986661: (e, a, t) => {
      t.d(a, { store: () => A })
      var l = t(691622),
        n = t(254773),
        o = t(336349),
        r = t(650151),
        i = t(765827),
        m = t(6835),
        s = t(855342)
      function p(e, a) {
        return a
      }
      var u = t(362830)
      const d = (0, m.getLogger)('Chart.LineToolTemplatesList')
      function T(e, a) {
        return a
      }
      function* c() {
        for (;;) {
          const {
            toolName: e,
            templateName: a,
            content: t,
          } = T(i.SAVE_TEMPLATE, yield (0, o.take)(i.SAVE_TEMPLATE))
          try {
            yield (0, o.call)(u.backend.saveDrawingTemplate, e, a, t),
              yield (0, o.put)((0, s.addTemplate)(e, a))
          } catch (e) {
            d.logWarn(e)
          }
        }
      }
      function* E() {
        for (;;) {
          const { toolName: e, templateName: a } = T(
            i.START_REMOVE_TEMPLATE,
            yield (0, o.take)(i.START_REMOVE_TEMPLATE),
          )
          try {
            yield (0, o.call)(u.backend.removeDrawingTemplate, e, a),
              yield (0, o.put)((0, s.removeTemplate)(e, a))
          } catch (e) {
            d.logWarn(e)
          }
        }
      }
      function* g() {
        const e = new Map()
        for (;;) {
          const { toolName: t, callback: l } = T(
            i.GET_TEMPLATES,
            yield (0, o.take)(i.GET_TEMPLATES),
          )
          e.has(t)
            ? (0, r.ensureDefined)(e.get(t)).push(l)
            : (e.set(t, [l]), yield (0, o.fork)(a, t))
        }
        function* a(a) {
          try {
            const e = p(
              u.backend.getDrawingTemplates,
              yield (0, o.call)(u.backend.getDrawingTemplates, a),
            )
            yield (0, o.put)((0, s.setTemplates)(a, e))
          } catch (e) {
            d.logWarn(e)
          }
          ;(0, r.ensureDefined)(e.get(a)).forEach((e) =>
            null == e ? void 0 : e(),
          ),
            e.delete(a)
        }
      }
      function* h() {
        for (;;) {
          const {
            toolName: e,
            templateName: a,
            callback: t,
          } = T(i.LOAD_TEMPLATE, yield (0, o.take)(i.LOAD_TEMPLATE))
          try {
            const l = p(
              u.backend.loadDrawingTemplate,
              yield (0, o.call)(u.backend.loadDrawingTemplate, e, a),
            )
            t && t(l)
          } catch (e) {
            d.logWarn(e)
          }
        }
      }
      function* _() {
        yield (0, o.all)([
          (0, o.call)(g),
          (0, o.call)(c),
          (0, o.call)(E),
          (0, o.call)(h),
        ])
      }
      const D = { templates: {} }
      function y(e, a) {
        return e.localeCompare(a, void 0, { numeric: !0 })
      }
      function w(e = D, a) {
        switch (a.type) {
          case i.ADD_TEMPLATE: {
            const { toolName: t, templateName: l } = a
            if (!e.templates[t].includes(l)) {
              const a = [...e.templates[t], l].sort(y)
              return { ...e, templates: { ...e.templates, [t]: a } }
            }
            return e
          }
          case i.SET_TEMPLATES: {
            const { toolName: t, templates: l } = a
            return { ...e, templates: { ...e.templates, [t]: [...l].sort(y) } }
          }
          case i.REMOVE_TEMPLATE: {
            const { toolName: t, templateName: l } = a
            return {
              ...e,
              templates: {
                ...e.templates,
                [t]: e.templates[t].filter((e) => e !== l),
              },
            }
          }
          default:
            return e
        }
      }
      const A = (() => {
        const e = (0, n.default)(),
          a = (0, l.createStore)(w, (0, l.applyMiddleware)(e))
        return e.run(_), a
      })()
    },
    980458: (e, a, t) => {
      function l(e, a) {
        return Boolean(
          '' === e || (e && -1 !== a.toLowerCase().indexOf(e.toLowerCase())),
        )
      }
      t.d(a, { autocompleteFilter: () => l })
    },
    774935: (e) => {
      e.exports = {
        ar: ['هل تريد حقًا حذف قالب الرسم "{name}"؟'],
        ca_ES: ["De debò que voleu eliminar la plantilla de dibuix '{name}'?"],
        cs: "Do you really want to delete Drawing Template '{name}' ?",
        de: ["Möchten Sie die Zeichenvorlage '{name}' wirklich löschen?"],
        el: "Do you really want to delete Drawing Template '{name}' ?",
        en: "Do you really want to delete Drawing Template '{name}' ?",
        es: [
          "¿Está seguro de que desea eliminar la plantilla de dibujo '{name}'?",
        ],
        fa: "Do you really want to delete Drawing Template '{name}' ?",
        fr: [
          'Souhaitez-vous vraiment supprimer le modèle de dessin "{name}" ?',
        ],
        he_IL: ["האם אתה באמת רוצה למחוק את תבנית השרטוט '{name}'?"],
        hu_HU: "Do you really want to delete Drawing Template '{name}' ?",
        id_ID: ["Apakah anda yakin ingin menghapus Template Gambar '{name}'?"],
        it: ["Vuoi davvero eliminare il Modello disegno '{name}' ?"],
        ja: ["本当に描画テンプレート '{name}' を削除しますか？"],
        ko: ["진짜로 '{name}' 드로잉 템플릿을 지우시겠습니까?"],
        ms_MY: ["Adakah anda pasti untuk padamkan Templat Lukisan '{name}' ?"],
        nl_NL: "Do you really want to delete Drawing Template '{name}' ?",
        pl: ["Czy na pewno chcesz usunąć szablon '{name}'?"],
        pt: ["Você quer realmente deletar o Template de Desenho '{name}' ?"],
        ro: "Do you really want to delete Drawing Template '{name}' ?",
        ru: ['Вы действительно хотите удалить шаблон "{name}"?'],
        sv: ["Vill du verkligen radera designmallen '{name}' ?"],
        th: ["คุณต้องการที่จะลบเทมเพลตการวาด '{name}' จริงๆ ใช่ไหม?"],
        tr: ["'{name}' Çizim Şablonunu gerçekten silmek istiyor musunuz?"],
        vi: ['Bạn có thực sự muốn xóa Mẫu Vẽ "{name}"?'],
        zh: ['您是否真的要删除绘图模板“{name}”？'],
        zh_TW: ['您確定要刪除繪圖模板“{name}”？'],
      }
    },
    571527: (e) => {
      e.exports = {
        ar: ['قالب الرسم "{name}" موجود بالفعل. هل تريد حقًا استبداله؟'],
        ca_ES: [
          "La plantilla de dibuix '{name}' ja existeix. De debò que voleu reemplaçar-la?",
        ],
        cs: "Drawing Template '{name}' already exists. Do you really want to replace it?",
        de: [
          "Zeichenvorlage '{name}' existiert bereits. Wollen Sie diese wirklich ersetzen?",
        ],
        el: "Drawing Template '{name}' already exists. Do you really want to replace it?",
        en: "Drawing Template '{name}' already exists. Do you really want to replace it?",
        es: [
          "La plantilla de dibujo '{name}' ya existe. ¿Está seguro de que desea reemplazarla?",
        ],
        fa: "Drawing Template '{name}' already exists. Do you really want to replace it?",
        fr: [
          'Le modèle de dessin "{name}" existe déjà. Voulez-vous vraiment le remplacer?',
        ],
        he_IL: [
          "תבנית השרטוט '{name}' כבר קיימת. האם אתה באמת רוצה להחליף אותה?",
        ],
        hu_HU:
          "Drawing Template '{name}' already exists. Do you really want to replace it?",
        id_ID: [
          "Template Gambar '{name}' telah ada. Apakah anda yakin ingin menggantinya?",
        ],
        it: [
          "Il Modello disegno '{name}' esiste già. Sei sicuro di volerlo rimpiazzare?",
        ],
        ja: [
          "描画テンプレート '{name}' は既に存在しています。本当に置き換えますか？",
        ],
        ko: ["'{name}' 드로잉 템플릿이 이미 있습니다. 바꾸시겠습니까?"],
        ms_MY: [
          "Pencontoh Lukisan '{name}' telah wujud. Adakah anda betul-betuk mahu menggantikannya?",
        ],
        nl_NL:
          "Drawing Template '{name}' already exists. Do you really want to replace it?",
        pl: ["Szablon '{name}' już istnieje. Czy na pewno chcesz go zastąpić?"],
        pt: [
          "O Template de Desenho '{name}' já existe. Você realmente quer substitui-lo?",
        ],
        ro: "Drawing Template '{name}' already exists. Do you really want to replace it?",
        ru: [
          "Шаблон '{name}' уже существует. Вы действительно хотите заменить его?",
        ],
        sv: [
          "Designmallen '{name}' finns redan. Vill du verkligen ersätta den?",
        ],
        th: ["เทมเพลตการวาด '{name}' มีอยู่แล้ว คุณต้องการที่จะแทนที่มันใช่ไหม?"],
        tr: [
          "Çizim Şablonu '{name}' zaten var. Gerçekten değiştirmek istiyor musun?",
        ],
        vi: ["Mẫu Vẽ '{name}' đã có rồi. Bạn có muốn thay thế không?"],
        zh: ['绘图模板“{name}”已存在。您真的要替换它吗？'],
        zh_TW: ['繪圖模板“{name}”已存在。您真的要取代它嗎？'],
      }
    },
    933751: (e) => {
      e.exports = {
        ar: ['حفظ نموذج الرسم بإسم'],
        ca_ES: ['Desa plantilla de dibuix com a'],
        cs: 'Save Drawing Template As',
        de: ['Zeichenvorlage speichern als'],
        el: 'Save Drawing Template As',
        en: 'Save Drawing Template As',
        es: ['Guardar plantilla de dibujo como'],
        fa: 'Save Drawing Template As',
        fr: ['Sauvegarder le Modèle de Dessin Sous'],
        he_IL: ['שמור תבניות שרטוט בשם'],
        hu_HU: ['Rajzsablon Mentése Mint'],
        id_ID: ['Simpan Template Gambar Sebagai'],
        it: ['Salva Modello disegno come'],
        ja: ['名前を付けて描画テンプレートを保存'],
        ko: ['드로잉 템플릿 다른 이름으로 저장'],
        ms_MY: ['Simpan Templat Lukisan Sebagai'],
        nl_NL: 'Save Drawing Template As',
        pl: ['Zapisz Szablon rysowania jako'],
        pt: ['Salvar modelo de desenho como'],
        ro: 'Save Drawing Template As',
        ru: ['Сохранить шаблон как'],
        sv: ['Spara ritmall som'],
        th: ['บันทึก เทมเพลตการวาดภาพเป็น'],
        tr: ['Çizim Şablonu Yeni Adla Sakla'],
        vi: ['Lưu Bản mẫu Vẽ dưới dạng'],
        zh: ['保存模板为'],
        zh_TW: ['儲存繪圖模板為'],
      }
    },
    350912: (e) => {
      e.exports = {
        ar: ['أسم القالب'],
        ca_ES: ['Nom de la plantilla'],
        cs: 'Template name',
        de: ['Name der Vorlage'],
        el: 'Template name',
        en: 'Template name',
        es: ['Nombre de la plantilla'],
        fa: 'Template name',
        fr: ['Nom du modèle'],
        he_IL: ['שם תבנית'],
        hu_HU: ['Sablon neve'],
        id_ID: ['Nama template'],
        it: ['Nome modello'],
        ja: ['テンプレート名'],
        ko: ['템플릿이름'],
        ms_MY: ['Nama templat'],
        nl_NL: 'Template name',
        pl: ['Nazwa Szablonu'],
        pt: ['Nome do modelo'],
        ro: 'Template name',
        ru: ['Имя шаблона'],
        sv: ['Mallnamn'],
        th: ['ชื่อเทมเพลต'],
        tr: ['Şablon adı'],
        vi: ['Tên Mẫu'],
        zh: ['模板名称'],
        zh_TW: ['範本名稱'],
      }
    },
  },
])
