;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3746],
  {
    97754: (e, t) => {
      var i
      !(() => {
        var n = {}.hasOwnProperty
        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var i = arguments[t]
            if (i) {
              var s = typeof i
              if ('string' === s || 'number' === s) e.push(i)
              else if (Array.isArray(i) && i.length) {
                var o = r.apply(null, i)
                o && e.push(o)
              } else if ('object' === s)
                for (var l in i) n.call(i, l) && i[l] && e.push(l)
            }
          }
          return e.join(' ')
        }
        e.exports
          ? ((r.default = r), (e.exports = r))
          : void 0 === (i = (() => r).apply(t, [])) || (e.exports = i)
      })()
    },
    4237: (e, t, i) => {
      var n = i(32227)
      ;(t.createRoot = n.createRoot), n.hydrateRoot
    },
    33849: function (e, t, i) {
      ;(e = i.nmd(e)),
        (() => {
          var t,
            i,
            n,
            r,
            s,
            o,
            l,
            a,
            u = [].slice,
            p = {}.hasOwnProperty
          ;(l = () => {}),
            (i = (() => {
              function e() {}
              return (
                (e.prototype.addEventListener = e.prototype.on),
                (e.prototype.on = function (e, t) {
                  return (
                    (this._callbacks = this._callbacks || {}),
                    this._callbacks[e] || (this._callbacks[e] = []),
                    this._callbacks[e].push(t),
                    this
                  )
                }),
                (e.prototype.emit = function () {
                  var e, t, i, n, r
                  if (
                    ((i = arguments[0]),
                    (e = 2 <= arguments.length ? u.call(arguments, 1) : []),
                    (this._callbacks = this._callbacks || {}),
                    (t = this._callbacks[i]))
                  )
                    for (n = 0, r = t.length; n < r; n++) t[n].apply(this, e)
                  return this
                }),
                (e.prototype.removeListener = e.prototype.off),
                (e.prototype.removeAllListeners = e.prototype.off),
                (e.prototype.removeEventListener = e.prototype.off),
                (e.prototype.off = function (e, t) {
                  var i, n, r, s
                  if (!this._callbacks || 0 === arguments.length)
                    return (this._callbacks = {}), this
                  if (!(i = this._callbacks[e])) return this
                  if (1 === arguments.length)
                    return delete this._callbacks[e], this
                  for (n = r = 0, s = i.length; r < s; n = ++r)
                    if (i[n] === t) {
                      i.splice(n, 1)
                      break
                    }
                  return this
                }),
                e
              )
            })()),
            (t = ((e) => {
              var t, n
              function r(e, i) {
                var n, s, o
                if (
                  ((this.element = e),
                  (this.version = r.version),
                  (this.defaultOptions.previewTemplate =
                    this.defaultOptions.previewTemplate.replace(/\n*/g, '')),
                  (this.clickableElements = []),
                  (this.listeners = []),
                  (this.files = []),
                  'string' == typeof this.element &&
                    (this.element = document.querySelector(this.element)),
                  !this.element || null == this.element.nodeType)
                )
                  throw new Error('Invalid dropzone element.')
                if (this.element.dropzone)
                  throw new Error('Dropzone already attached.')
                if (
                  (r.instances.push(this),
                  (this.element.dropzone = this),
                  (n =
                    null != (o = r.optionsForElement(this.element)) ? o : {}),
                  (this.options = t(
                    {},
                    this.defaultOptions,
                    n,
                    null != i ? i : {},
                  )),
                  this.options.forceFallback || !r.isBrowserSupported())
                )
                  return this.options.fallback.call(this)
                if (
                  (null == this.options.url &&
                    (this.options.url = this.element.getAttribute('action')),
                  !this.options.url)
                )
                  throw new Error('No URL provided.')
                if (
                  this.options.acceptedFiles &&
                  this.options.acceptedMimeTypes
                )
                  throw new Error(
                    "You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.",
                  )
                this.options.acceptedMimeTypes &&
                  ((this.options.acceptedFiles =
                    this.options.acceptedMimeTypes),
                  delete this.options.acceptedMimeTypes),
                  (this.options.method = this.options.method.toUpperCase()),
                  (s = this.getExistingFallback()) &&
                    s.parentNode &&
                    s.parentNode.removeChild(s),
                  !1 !== this.options.previewsContainer &&
                    (this.options.previewsContainer
                      ? (this.previewsContainer = r.getElement(
                          this.options.previewsContainer,
                          'previewsContainer',
                        ))
                      : (this.previewsContainer = this.element)),
                  this.options.clickable &&
                    (!0 === this.options.clickable
                      ? (this.clickableElements = [this.element])
                      : (this.clickableElements = r.getElements(
                          this.options.clickable,
                          'clickable',
                        ))),
                  this.init()
              }
              return (
                ((e, t) => {
                  for (var i in t) p.call(t, i) && (e[i] = t[i])
                  function n() {
                    this.constructor = e
                  }
                  ;(n.prototype = t.prototype),
                    (e.prototype = new n()),
                    (e.__super__ = t.prototype)
                })(r, e),
                (r.prototype.Emitter = i),
                (r.prototype.events = [
                  'drop',
                  'dragstart',
                  'dragend',
                  'dragenter',
                  'dragover',
                  'dragleave',
                  'addedfile',
                  'removedfile',
                  'thumbnail',
                  'error',
                  'errormultiple',
                  'processing',
                  'processingmultiple',
                  'uploadprogress',
                  'totaluploadprogress',
                  'sending',
                  'sendingmultiple',
                  'success',
                  'successmultiple',
                  'canceled',
                  'canceledmultiple',
                  'complete',
                  'completemultiple',
                  'reset',
                  'maxfilesexceeded',
                  'maxfilesreached',
                  'queuecomplete',
                ]),
                (r.prototype.defaultOptions = {
                  url: null,
                  method: 'post',
                  withCredentials: !1,
                  parallelUploads: 2,
                  uploadMultiple: !1,
                  maxFilesize: 256,
                  paramName: 'file',
                  createImageThumbnails: !0,
                  maxThumbnailFilesize: 10,
                  thumbnailWidth: 120,
                  thumbnailHeight: 120,
                  filesizeBase: 1e3,
                  maxFiles: null,
                  filesizeBase: 1e3,
                  params: {},
                  clickable: !0,
                  ignoreHiddenFiles: !0,
                  acceptedFiles: null,
                  acceptedMimeTypes: null,
                  autoProcessQueue: !0,
                  autoQueue: !0,
                  addRemoveLinks: !1,
                  previewsContainer: null,
                  capture: null,
                  dictDefaultMessage: 'Drop files here to upload',
                  dictFallbackMessage:
                    "Your browser does not support drag'n'drop file uploads.",
                  dictFallbackText:
                    'Please use the fallback form below to upload your files like in the olden days.',
                  dictFileTooBig:
                    'File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.',
                  dictInvalidFileType: "You can't upload files of this type.",
                  dictResponseError:
                    'Server responded with {{statusCode}} code.',
                  dictCancelUpload: 'Cancel upload',
                  dictCancelUploadConfirmation:
                    'Are you sure you want to cancel this upload?',
                  dictRemoveFile: 'Remove file',
                  dictRemoveFileConfirmation: null,
                  dictMaxFilesExceeded: 'You can not upload any more files.',
                  accept: (e, t) => t(),
                  init: () => l,
                  forceFallback: !1,
                  fallback: function () {
                    var e, t, i, n, s, o
                    for (
                      this.element.className =
                        this.element.className + ' dz-browser-not-supported',
                        n = 0,
                        s = (o = this.element.getElementsByTagName('div'))
                          .length;
                      n < s;
                      n++
                    )
                      (e = o[n]),
                        /(^| )dz-message($| )/.test(e.className) &&
                          ((t = e), (e.className = 'dz-message'))
                    return (
                      t ||
                        ((t = r.createElement(
                          '<div class="dz-message"><span></span></div>',
                        )),
                        this.element.appendChild(t)),
                      (i = t.getElementsByTagName('span')[0]) &&
                        (i.textContent = this.options.dictFallbackMessage),
                      this.element.appendChild(this.getFallbackForm())
                    )
                  },
                  resize: function (e) {
                    var t, i, n
                    return (
                      (t = {
                        srcX: 0,
                        srcY: 0,
                        srcWidth: e.width,
                        srcHeight: e.height,
                      }),
                      (i = e.width / e.height),
                      (t.optWidth = this.options.thumbnailWidth),
                      (t.optHeight = this.options.thumbnailHeight),
                      null == t.optWidth && null == t.optHeight
                        ? ((t.optWidth = t.srcWidth),
                          (t.optHeight = t.srcHeight))
                        : null == t.optWidth
                          ? (t.optWidth = i * t.optHeight)
                          : null == t.optHeight &&
                            (t.optHeight = (1 / i) * t.optWidth),
                      (n = t.optWidth / t.optHeight),
                      e.height < t.optHeight || e.width < t.optWidth
                        ? ((t.trgHeight = t.srcHeight),
                          (t.trgWidth = t.srcWidth))
                        : i > n
                          ? ((t.srcHeight = e.height),
                            (t.srcWidth = t.srcHeight * n))
                          : ((t.srcWidth = e.width),
                            (t.srcHeight = t.srcWidth / n)),
                      (t.srcX = (e.width - t.srcWidth) / 2),
                      (t.srcY = (e.height - t.srcHeight) / 2),
                      t
                    )
                  },
                  drop: function (e) {
                    return this.element.classList.remove('dz-drag-hover')
                  },
                  dragstart: l,
                  dragend: function (e) {
                    return this.element.classList.remove('dz-drag-hover')
                  },
                  dragenter: function (e) {
                    return this.element.classList.add('dz-drag-hover')
                  },
                  dragover: function (e) {
                    return this.element.classList.add('dz-drag-hover')
                  },
                  dragleave: function (e) {
                    return this.element.classList.remove('dz-drag-hover')
                  },
                  paste: l,
                  reset: function () {
                    return this.element.classList.remove('dz-started')
                  },
                  addedfile: function (e) {
                    var t, i, n, s, o, l, a, u, p, d, c, h, m
                    if (
                      (this.element === this.previewsContainer &&
                        this.element.classList.add('dz-started'),
                      this.previewsContainer)
                    ) {
                      for (
                        e.previewElement = r.createElement(
                          this.options.previewTemplate.trim(),
                        ),
                          e.previewTemplate = e.previewElement,
                          this.previewsContainer.appendChild(e.previewElement),
                          n = 0,
                          l = (p =
                            e.previewElement.querySelectorAll('[data-dz-name]'))
                            .length;
                        n < l;
                        n++
                      )
                        p[n].textContent = e.name
                      for (
                        s = 0,
                          a = (d =
                            e.previewElement.querySelectorAll('[data-dz-size]'))
                            .length;
                        s < a;
                        s++
                      )
                        d[s].innerHTML = this.filesize(e.size)
                      for (
                        this.options.addRemoveLinks &&
                          ((e._removeLink = r.createElement(
                            '<a class="dz-remove" href="javascript:undefined;" data-dz-remove>' +
                              this.options.dictRemoveFile +
                              '</a>',
                          )),
                          e.previewElement.appendChild(e._removeLink)),
                          m = this,
                          t = (t) => (
                            t.preventDefault(),
                            t.stopPropagation(),
                            e.status === r.UPLOADING
                              ? r.confirm(
                                  m.options.dictCancelUploadConfirmation,
                                  () => m.removeFile(e),
                                )
                              : m.options.dictRemoveFileConfirmation
                                ? r.confirm(
                                    m.options.dictRemoveFileConfirmation,
                                    () => m.removeFile(e),
                                  )
                                : m.removeFile(e)
                          ),
                          h = [],
                          o = 0,
                          u = (c =
                            e.previewElement.querySelectorAll(
                              '[data-dz-remove]',
                            )).length;
                        o < u;
                        o++
                      )
                        (i = c[o]), h.push(i.addEventListener('click', t))
                      return h
                    }
                  },
                  removedfile: function (e) {
                    var t
                    return (
                      e.previewElement &&
                        null != (t = e.previewElement) &&
                        t.parentNode.removeChild(e.previewElement),
                      this._updateMaxFilesReachedClass()
                    )
                  },
                  thumbnail: (e, t) => {
                    var i, n, r, s
                    if (e.previewElement) {
                      for (
                        e.previewElement.classList.remove('dz-file-preview'),
                          n = 0,
                          r = (s = e.previewElement.querySelectorAll(
                            '[data-dz-thumbnail]',
                          )).length;
                        n < r;
                        n++
                      )
                        ((i = s[n]).alt = e.name), (i.src = t)
                      return setTimeout(
                        () =>
                          e.previewElement.classList.add('dz-image-preview'),
                        1,
                      )
                    }
                  },
                  error: (e, t) => {
                    var i, n, r, s, o
                    if (e.previewElement) {
                      for (
                        e.previewElement.classList.add('dz-error'),
                          'String' != typeof t && t.error && (t = t.error),
                          o = [],
                          n = 0,
                          r = (s = e.previewElement.querySelectorAll(
                            '[data-dz-errormessage]',
                          )).length;
                        n < r;
                        n++
                      )
                        (i = s[n]), o.push((i.textContent = t))
                      return o
                    }
                  },
                  errormultiple: l,
                  processing: function (e) {
                    if (
                      e.previewElement &&
                      (e.previewElement.classList.add('dz-processing'),
                      e._removeLink)
                    )
                      return (e._removeLink.textContent =
                        this.options.dictCancelUpload)
                  },
                  processingmultiple: l,
                  uploadprogress: (e, t, i) => {
                    var n, r, s, o, l
                    if (e.previewElement) {
                      for (
                        l = [],
                          r = 0,
                          s = (o = e.previewElement.querySelectorAll(
                            '[data-dz-uploadprogress]',
                          )).length;
                        r < s;
                        r++
                      )
                        'PROGRESS' === (n = o[r]).nodeName
                          ? l.push((n.value = t))
                          : l.push((n.style.width = t + '%'))
                      return l
                    }
                  },
                  totaluploadprogress: l,
                  sending: l,
                  sendingmultiple: l,
                  success: (e) => {
                    if (e.previewElement)
                      return e.previewElement.classList.add('dz-success')
                  },
                  successmultiple: l,
                  canceled: function (e) {
                    return this.emit('error', e, 'Upload canceled.')
                  },
                  canceledmultiple: l,
                  complete: function (e) {
                    if (
                      (e._removeLink &&
                        (e._removeLink.textContent =
                          this.options.dictRemoveFile),
                      e.previewElement)
                    )
                      return e.previewElement.classList.add('dz-complete')
                  },
                  completemultiple: l,
                  maxfilesexceeded: l,
                  maxfilesreached: l,
                  queuecomplete: l,
                  previewTemplate:
                    '<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>',
                }),
                (t = () => {
                  var e, t, i, n, r, s, o
                  for (
                    n = arguments[0],
                      s = 0,
                      o = (i =
                        2 <= arguments.length ? u.call(arguments, 1) : [])
                        .length;
                    s < o;
                    s++
                  )
                    for (e in (t = i[s])) (r = t[e]), (n[e] = r)
                  return n
                }),
                (r.prototype.getAcceptedFiles = function () {
                  var e, t, i, n, r
                  for (r = [], t = 0, i = (n = this.files).length; t < i; t++)
                    (e = n[t]).accepted && r.push(e)
                  return r
                }),
                (r.prototype.getRejectedFiles = function () {
                  var e, t, i, n, r
                  for (r = [], t = 0, i = (n = this.files).length; t < i; t++)
                    (e = n[t]).accepted || r.push(e)
                  return r
                }),
                (r.prototype.getFilesWithStatus = function (e) {
                  var t, i, n, r, s
                  for (s = [], i = 0, n = (r = this.files).length; i < n; i++)
                    (t = r[i]).status === e && s.push(t)
                  return s
                }),
                (r.prototype.getQueuedFiles = function () {
                  return this.getFilesWithStatus(r.QUEUED)
                }),
                (r.prototype.getUploadingFiles = function () {
                  return this.getFilesWithStatus(r.UPLOADING)
                }),
                (r.prototype.getActiveFiles = function () {
                  var e, t, i, n, s
                  for (s = [], t = 0, i = (n = this.files).length; t < i; t++)
                    ((e = n[t]).status !== r.UPLOADING &&
                      e.status !== r.QUEUED) ||
                      s.push(e)
                  return s
                }),
                (r.prototype.init = function () {
                  var e, t, i, n, s, o, l, a
                  for (
                    'form' === this.element.tagName &&
                      this.element.setAttribute(
                        'enctype',
                        'multipart/form-data',
                      ),
                      this.element.classList.contains('dropzone') &&
                        !this.element.querySelector('.dz-message') &&
                        this.element.appendChild(
                          r.createElement(
                            '<div class="dz-default dz-message"><span>' +
                              this.options.dictDefaultMessage +
                              '</span></div>',
                          ),
                        ),
                      this.clickableElements.length &&
                        ((a = this),
                        (i = () => (
                          a.hiddenFileInput &&
                            document.body.removeChild(a.hiddenFileInput),
                          (a.hiddenFileInput = document.createElement('input')),
                          a.hiddenFileInput.setAttribute('type', 'file'),
                          (null == a.options.maxFiles ||
                            a.options.maxFiles > 1) &&
                            a.hiddenFileInput.setAttribute(
                              'multiple',
                              'multiple',
                            ),
                          (a.hiddenFileInput.className = 'dz-hidden-input'),
                          null != a.options.acceptedFiles &&
                            a.hiddenFileInput.setAttribute(
                              'accept',
                              a.options.acceptedFiles,
                            ),
                          null != a.options.capture &&
                            a.hiddenFileInput.setAttribute(
                              'capture',
                              a.options.capture,
                            ),
                          (a.hiddenFileInput.style.visibility = 'hidden'),
                          (a.hiddenFileInput.style.position = 'absolute'),
                          (a.hiddenFileInput.style.top = '0'),
                          (a.hiddenFileInput.style.left = '0'),
                          (a.hiddenFileInput.style.height = '0'),
                          (a.hiddenFileInput.style.width = '0'),
                          document.body.appendChild(a.hiddenFileInput),
                          a.hiddenFileInput.addEventListener('change', () => {
                            var e, t, n, r
                            if ((t = a.hiddenFileInput.files).length)
                              for (n = 0, r = t.length; n < r; n++)
                                (e = t[n]), a.addFile(e)
                            return i()
                          })
                        )),
                        i()),
                      this.URL =
                        null != (o = window.URL) ? o : window.webkitURL,
                      n = 0,
                      s = (l = this.events).length;
                    n < s;
                    n++
                  )
                    (e = l[n]), this.on(e, this.options[e])
                  return (
                    this.on(
                      'uploadprogress',
                      (
                        (e) => () =>
                          e.updateTotalUploadProgress()
                      )(this),
                    ),
                    this.on(
                      'removedfile',
                      (
                        (e) => () =>
                          e.updateTotalUploadProgress()
                      )(this),
                    ),
                    this.on(
                      'canceled',
                      (
                        (e) => (t) =>
                          e.emit('complete', t)
                      )(this),
                    ),
                    this.on(
                      'complete',
                      ((e) => (t) => {
                        if (
                          0 === e.getUploadingFiles().length &&
                          0 === e.getQueuedFiles().length
                        )
                          return setTimeout(() => e.emit('queuecomplete'), 0)
                      })(this),
                    ),
                    (t = (e) => (
                      e.stopPropagation(),
                      e.preventDefault
                        ? e.preventDefault()
                        : (e.returnValue = !1)
                    )),
                    (this.listeners = [
                      {
                        element: this.element,
                        events: {
                          dragstart: (
                            (e) => (t) =>
                              e.emit('dragstart', t)
                          )(this),
                          dragenter: ((e) => (i) => (
                            t(i), e.emit('dragenter', i)
                          ))(this),
                          dragover: ((e) => (i) => {
                            var n
                            try {
                              n = i.dataTransfer.effectAllowed
                            } catch (e) {}
                            return (
                              (i.dataTransfer.dropEffect =
                                'move' === n || 'linkMove' === n
                                  ? 'move'
                                  : 'copy'),
                              t(i),
                              e.emit('dragover', i)
                            )
                          })(this),
                          dragleave: (
                            (e) => (t) =>
                              e.emit('dragleave', t)
                          )(this),
                          drop: ((e) => (t) => (
                            t.preventDefault
                              ? t.preventDefault()
                              : (t.returnValue = !1),
                            e.drop(t)
                          ))(this),
                          dragend: (
                            (e) => (t) =>
                              e.emit('dragend', t)
                          )(this),
                        },
                      },
                    ]),
                    this.clickableElements.forEach(
                      (
                        (e) => (t) =>
                          e.listeners.push({
                            element: t,
                            events: {
                              click: (i) => {
                                if (
                                  t !== e.element ||
                                  i.target === e.element ||
                                  r.elementInside(
                                    i.target,
                                    e.element.querySelector('.dz-message'),
                                  )
                                )
                                  return e.hiddenFileInput.click()
                              },
                            },
                          })
                      )(this),
                    ),
                    this.enable(),
                    this.options.init.call(this)
                  )
                }),
                (r.prototype.destroy = function () {
                  var e
                  return (
                    this.disable(),
                    this.removeAllFiles(!0),
                    (null != (e = this.hiddenFileInput)
                      ? e.parentNode
                      : void 0) &&
                      (this.hiddenFileInput.parentNode.removeChild(
                        this.hiddenFileInput,
                      ),
                      (this.hiddenFileInput = null)),
                    delete this.element.dropzone,
                    r.instances.splice(r.instances.indexOf(this), 1)
                  )
                }),
                (r.prototype.updateTotalUploadProgress = function () {
                  var e, t, i, n, r, s, o
                  if (((i = 0), (t = 0), this.getActiveFiles().length)) {
                    for (
                      r = 0, s = (o = this.getActiveFiles()).length;
                      r < s;
                      r++
                    )
                      (i += (e = o[r]).upload.bytesSent), (t += e.upload.total)
                    n = (100 * i) / t
                  } else n = 100
                  return this.emit('totaluploadprogress', n, t, i)
                }),
                (r.prototype._getParamName = function (e) {
                  return 'function' == typeof this.options.paramName
                    ? this.options.paramName(e)
                    : this.options.paramName +
                        (this.options.uploadMultiple ? '[' + e + ']' : '')
                }),
                (r.prototype.getFallbackForm = function () {
                  var e, t, i, n
                  return (e = this.getExistingFallback())
                    ? e
                    : ((i = '<div class="dz-fallback">'),
                      this.options.dictFallbackText &&
                        (i += '<p>' + this.options.dictFallbackText + '</p>'),
                      (i +=
                        '<input type="file" name="' +
                        this._getParamName(0) +
                        '" ' +
                        (this.options.uploadMultiple
                          ? 'multiple="multiple"'
                          : void 0) +
                        ' /><input type="submit" value="Upload!"></div>'),
                      (t = r.createElement(i)),
                      'FORM' !== this.element.tagName
                        ? (n = r.createElement(
                            '<form action="' +
                              this.options.url +
                              '" enctype="multipart/form-data" method="' +
                              this.options.method +
                              '"></form>',
                          )).appendChild(t)
                        : (this.element.setAttribute(
                            'enctype',
                            'multipart/form-data',
                          ),
                          this.element.setAttribute(
                            'method',
                            this.options.method,
                          )),
                      null != n ? n : t)
                }),
                (r.prototype.getExistingFallback = function () {
                  var e, t, i, n, r, s
                  for (
                    t = (e) => {
                      var t, i, n
                      for (i = 0, n = e.length; i < n; i++)
                        if (
                          ((t = e[i]), /(^| )fallback($| )/.test(t.className))
                        )
                          return t
                    },
                      n = 0,
                      r = (s = ['div', 'form']).length;
                    n < r;
                    n++
                  )
                    if (
                      ((i = s[n]),
                      (e = t(this.element.getElementsByTagName(i))))
                    )
                      return e
                }),
                (r.prototype.setupEventListeners = function () {
                  var e, t, i, n, r, s, o
                  for (
                    o = [], n = 0, r = (s = this.listeners).length;
                    n < r;
                    n++
                  )
                    (e = s[n]),
                      o.push(
                        (() => {
                          var n, r
                          for (t in ((r = []), (n = e.events)))
                            (i = n[t]),
                              r.push(e.element.addEventListener(t, i, !1))
                          return r
                        })(),
                      )
                  return o
                }),
                (r.prototype.removeEventListeners = function () {
                  var e, t, i, n, r, s, o
                  for (
                    o = [], n = 0, r = (s = this.listeners).length;
                    n < r;
                    n++
                  )
                    (e = s[n]),
                      o.push(
                        (() => {
                          var n, r
                          for (t in ((r = []), (n = e.events)))
                            (i = n[t]),
                              r.push(e.element.removeEventListener(t, i, !1))
                          return r
                        })(),
                      )
                  return o
                }),
                (r.prototype.disable = function () {
                  var e, t, i, n, r
                  for (
                    this.clickableElements.forEach((e) =>
                      e.classList.remove('dz-clickable'),
                    ),
                      this.removeEventListeners(),
                      r = [],
                      t = 0,
                      i = (n = this.files).length;
                    t < i;
                    t++
                  )
                    (e = n[t]), r.push(this.cancelUpload(e))
                  return r
                }),
                (r.prototype.enable = function () {
                  return (
                    this.clickableElements.forEach((e) =>
                      e.classList.add('dz-clickable'),
                    ),
                    this.setupEventListeners()
                  )
                }),
                (r.prototype.filesize = function (e) {
                  var t, i, n, r, s, o, l
                  for (
                    i = n = null,
                      t = o = 0,
                      l = (s = ['TB', 'GB', 'MB', 'KB', 'b']).length;
                    o < l;
                    t = ++o
                  )
                    if (
                      ((r = s[t]),
                      e >= Math.pow(this.options.filesizeBase, 4 - t) / 10)
                    ) {
                      ;(i = e / Math.pow(this.options.filesizeBase, 4 - t)),
                        (n = r)
                      break
                    }
                  return (
                    '<strong>' +
                    (i = Math.round(10 * i) / 10) +
                    '</strong> ' +
                    n
                  )
                }),
                (r.prototype._updateMaxFilesReachedClass = function () {
                  return null != this.options.maxFiles &&
                    this.getAcceptedFiles().length >= this.options.maxFiles
                    ? (this.getAcceptedFiles().length ===
                        this.options.maxFiles &&
                        this.emit('maxfilesreached', this.files),
                      this.element.classList.add('dz-max-files-reached'))
                    : this.element.classList.remove('dz-max-files-reached')
                }),
                (r.prototype.drop = function (e) {
                  var t, i
                  e.dataTransfer &&
                    (this.emit('drop', e),
                    (t = e.dataTransfer.files).length &&
                      ((i = e.dataTransfer.items) &&
                      i.length &&
                      null != i[0].webkitGetAsEntry
                        ? this._addFilesFromItems(i)
                        : this.handleFiles(t)))
                }),
                (r.prototype.paste = function (e) {
                  var t, i
                  if (
                    null !=
                    (null != e && null != (i = e.clipboardData)
                      ? i.items
                      : void 0)
                  )
                    return (
                      this.emit('paste', e),
                      (t = e.clipboardData.items).length
                        ? this._addFilesFromItems(t)
                        : void 0
                    )
                }),
                (r.prototype.handleFiles = function (e) {
                  var t, i, n, r
                  for (r = [], i = 0, n = e.length; i < n; i++)
                    (t = e[i]), r.push(this.addFile(t))
                  return r
                }),
                (r.prototype._addFilesFromItems = function (e) {
                  var t, i, n, r, s
                  for (s = [], n = 0, r = e.length; n < r; n++)
                    null != (i = e[n]).webkitGetAsEntry &&
                    (t = i.webkitGetAsEntry())
                      ? t.isFile
                        ? s.push(this.addFile(i.getAsFile()))
                        : t.isDirectory
                          ? s.push(this._addFilesFromDirectory(t, t.name))
                          : s.push(void 0)
                      : null != i.getAsFile &&
                          (null == i.kind || 'file' === i.kind)
                        ? s.push(this.addFile(i.getAsFile()))
                        : s.push(void 0)
                  return s
                }),
                (r.prototype._addFilesFromDirectory = function (e, t) {
                  var i, n, r
                  return (
                    (i = e.createReader()),
                    (r = this),
                    (n = (e) => {
                      var i, n, s
                      for (n = 0, s = e.length; n < s; n++)
                        (i = e[n]).isFile
                          ? i.file((e) => {
                              if (
                                !r.options.ignoreHiddenFiles ||
                                '.' !== e.name.substring(0, 1)
                              )
                                return (
                                  (e.fullPath = t + '/' + e.name), r.addFile(e)
                                )
                            })
                          : i.isDirectory &&
                            r._addFilesFromDirectory(i, t + '/' + i.name)
                    }),
                    i.readEntries(n, (e) =>
                      'undefined' != typeof console &&
                      null !== console &&
                      'function' == typeof console.log
                        ? console.log(e)
                        : void 0,
                    )
                  )
                }),
                (r.prototype.accept = function (e, t) {
                  return e.size > 1024 * this.options.maxFilesize * 1024
                    ? t(
                        this.options.dictFileTooBig
                          .replace(
                            '{{filesize}}',
                            Math.round(e.size / 1024 / 10.24) / 100,
                          )
                          .replace('{{maxFilesize}}', this.options.maxFilesize),
                      )
                    : r.isValidFile(e, this.options.acceptedFiles)
                      ? null != this.options.maxFiles &&
                        this.getAcceptedFiles().length >= this.options.maxFiles
                        ? (t(
                            this.options.dictMaxFilesExceeded.replace(
                              '{{maxFiles}}',
                              this.options.maxFiles,
                            ),
                          ),
                          this.emit('maxfilesexceeded', e))
                        : this.options.accept.call(this, e, t)
                      : t(this.options.dictInvalidFileType)
                }),
                (r.prototype.addFile = function (e) {
                  return (
                    (e.upload = { progress: 0, total: e.size, bytesSent: 0 }),
                    this.files.push(e),
                    (e.status = r.ADDED),
                    this.emit('addedfile', e),
                    this._enqueueThumbnail(e),
                    this.accept(
                      e,
                      ((t = this),
                      (i) => (
                        i
                          ? ((e.accepted = !1), t._errorProcessing([e], i))
                          : ((e.accepted = !0),
                            t.options.autoQueue && t.enqueueFile(e)),
                        t._updateMaxFilesReachedClass()
                      )),
                    )
                  )
                  var t
                }),
                (r.prototype.enqueueFiles = function (e) {
                  var t, i, n
                  for (i = 0, n = e.length; i < n; i++)
                    (t = e[i]), this.enqueueFile(t)
                  return null
                }),
                (r.prototype.enqueueFile = function (e) {
                  if (e.status !== r.ADDED || !0 !== e.accepted)
                    throw new Error(
                      "This file can't be queued because it has already been processed or was rejected.",
                    )
                  if (((e.status = r.QUEUED), this.options.autoProcessQueue))
                    return setTimeout(((t = this), () => t.processQueue()), 0)
                  var t
                }),
                (r.prototype._thumbnailQueue = []),
                (r.prototype._processingThumbnail = !1),
                (r.prototype._enqueueThumbnail = function (e) {
                  if (
                    this.options.createImageThumbnails &&
                    e.type.match(/image.*/) &&
                    e.size <= 1024 * this.options.maxThumbnailFilesize * 1024
                  )
                    return (
                      this._thumbnailQueue.push(e),
                      setTimeout(
                        ((t = this), () => t._processThumbnailQueue()),
                        0,
                      )
                    )
                  var t
                }),
                (r.prototype._processThumbnailQueue = function () {
                  var e
                  if (
                    !this._processingThumbnail &&
                    0 !== this._thumbnailQueue.length
                  )
                    return (
                      (this._processingThumbnail = !0),
                      this.createThumbnail(
                        this._thumbnailQueue.shift(),
                        ((e = this),
                        () => (
                          (e._processingThumbnail = !1),
                          e._processThumbnailQueue()
                        )),
                      )
                    )
                }),
                (r.prototype.removeFile = function (e) {
                  if (
                    (e.status === r.UPLOADING && this.cancelUpload(e),
                    (this.files = a(this.files, e)),
                    this.emit('removedfile', e),
                    0 === this.files.length)
                  )
                    return this.emit('reset')
                }),
                (r.prototype.removeAllFiles = function (e) {
                  var t, i, n, s
                  for (
                    null == e && (e = !1),
                      i = 0,
                      n = (s = this.files.slice()).length;
                    i < n;
                    i++
                  )
                    ((t = s[i]).status !== r.UPLOADING || e) &&
                      this.removeFile(t)
                  return null
                }),
                (r.prototype.createThumbnail = function (e, t) {
                  var i, n
                  return (
                    ((i = new FileReader()).onload =
                      ((n = this),
                      () =>
                        'image/svg+xml' === e.type
                          ? (n.emit('thumbnail', e, i.result),
                            void (null != t && t()))
                          : n.createThumbnailFromUrl(e, i.result, t))),
                    i.readAsDataURL(e)
                  )
                }),
                (r.prototype.createThumbnailFromUrl = function (e, t, i) {
                  var n, r
                  return (
                    ((n = document.createElement('img')).onload =
                      ((r = this),
                      () => {
                        var t, s, l, a, u, p, d, c
                        if (
                          ((e.width = n.width),
                          (e.height = n.height),
                          null == (l = r.options.resize.call(r, e)).trgWidth &&
                            (l.trgWidth = l.optWidth),
                          null == l.trgHeight && (l.trgHeight = l.optHeight),
                          (s = (t =
                            document.createElement('canvas')).getContext('2d')),
                          (t.width = l.trgWidth),
                          (t.height = l.trgHeight),
                          o(
                            s,
                            n,
                            null != (u = l.srcX) ? u : 0,
                            null != (p = l.srcY) ? p : 0,
                            l.srcWidth,
                            l.srcHeight,
                            null != (d = l.trgX) ? d : 0,
                            null != (c = l.trgY) ? c : 0,
                            l.trgWidth,
                            l.trgHeight,
                          ),
                          (a = t.toDataURL('image/png')),
                          r.emit('thumbnail', e, a),
                          null != i)
                        )
                          return i()
                      })),
                    null != i && (n.onerror = i),
                    (n.src = t)
                  )
                }),
                (r.prototype.processQueue = function () {
                  var e, t, i, n
                  if (
                    ((t = this.options.parallelUploads),
                    (e = i = this.getUploadingFiles().length),
                    !(i >= t) && (n = this.getQueuedFiles()).length > 0)
                  ) {
                    if (this.options.uploadMultiple)
                      return this.processFiles(n.slice(0, t - i))
                    while (e < t) {
                      if (!n.length) return
                      this.processFile(n.shift()), e++
                    }
                  }
                }),
                (r.prototype.processFile = function (e) {
                  return this.processFiles([e])
                }),
                (r.prototype.processFiles = function (e) {
                  var t, i, n
                  for (i = 0, n = e.length; i < n; i++)
                    ((t = e[i]).processing = !0),
                      (t.status = r.UPLOADING),
                      this.emit('processing', t)
                  return (
                    this.options.uploadMultiple &&
                      this.emit('processingmultiple', e),
                    this.uploadFiles(e)
                  )
                }),
                (r.prototype._getFilesWithXhr = function (e) {
                  var t
                  return function () {
                    var i, n, r, s
                    for (s = [], i = 0, n = (r = this.files).length; i < n; i++)
                      (t = r[i]).xhr === e && s.push(t)
                    return s
                  }.call(this)
                }),
                (r.prototype.cancelUpload = function (e) {
                  var t, i, n, s, o, l, a
                  if (e.status === r.UPLOADING) {
                    for (
                      n = 0, o = (i = this._getFilesWithXhr(e.xhr)).length;
                      n < o;
                      n++
                    )
                      (t = i[n]).status = r.CANCELED
                    for (e.xhr.abort(), s = 0, l = i.length; s < l; s++)
                      (t = i[s]), this.emit('canceled', t)
                    this.options.uploadMultiple &&
                      this.emit('canceledmultiple', i)
                  } else
                    ((a = e.status) !== r.ADDED && a !== r.QUEUED) ||
                      ((e.status = r.CANCELED),
                      this.emit('canceled', e),
                      this.options.uploadMultiple &&
                        this.emit('canceledmultiple', [e]))
                  if (this.options.autoProcessQueue) return this.processQueue()
                }),
                (n = function () {
                  var e, t
                  return (
                    (t = arguments[0]),
                    (e = 2 <= arguments.length ? u.call(arguments, 1) : []),
                    'function' == typeof t ? t.apply(this, e) : t
                  )
                }),
                (r.prototype.uploadFile = function (e) {
                  return this.uploadFiles([e])
                }),
                (r.prototype.uploadFiles = function (e) {
                  var i,
                    s,
                    o,
                    l,
                    a,
                    u,
                    p,
                    d,
                    c,
                    h,
                    m,
                    f,
                    g,
                    v,
                    y,
                    F,
                    w,
                    E,
                    b,
                    C,
                    k,
                    z,
                    L,
                    x,
                    A,
                    T,
                    D,
                    S,
                    _,
                    M,
                    U,
                    N,
                    I,
                    R,
                    P
                  for (
                    b = new XMLHttpRequest(), C = 0, x = e.length;
                    C < x;
                    C++
                  )
                    (i = e[C]).xhr = b
                  for (l in ((f = n(this.options.method, e)),
                  (w = n(this.options.url, e)),
                  b.open(f, w, !0),
                  (b.withCredentials = !!this.options.withCredentials),
                  (y = null),
                  (P = this),
                  (o = () => {
                    var t, n, r
                    for (r = [], t = 0, n = e.length; t < n; t++)
                      (i = e[t]),
                        r.push(
                          P._errorProcessing(
                            e,
                            y ||
                              P.options.dictResponseError.replace(
                                '{{statusCode}}',
                                b.status,
                              ),
                            b,
                          ),
                        )
                    return r
                  }),
                  (F = ((t) => (n) => {
                    var r, s, o, l, a, u, p, d, c
                    if (null != n)
                      for (
                        s = (100 * n.loaded) / n.total, o = 0, u = e.length;
                        o < u;
                        o++
                      )
                        (i = e[o]).upload = {
                          progress: s,
                          total: n.total,
                          bytesSent: n.loaded,
                        }
                    else {
                      for (r = !0, s = 100, l = 0, p = e.length; l < p; l++)
                        (100 === (i = e[l]).upload.progress &&
                          i.upload.bytesSent === i.upload.total) ||
                          (r = !1),
                          (i.upload.progress = s),
                          (i.upload.bytesSent = i.upload.total)
                      if (r) return
                    }
                    for (c = [], a = 0, d = e.length; a < d; a++)
                      (i = e[a]),
                        c.push(
                          t.emit('uploadprogress', i, s, i.upload.bytesSent),
                        )
                    return c
                  })(this)),
                  (b.onload = ((t) => (i) => {
                    var n
                    if (e[0].status !== r.CANCELED && 4 === b.readyState) {
                      if (
                        ((y = b.responseText),
                        b.getResponseHeader('content-type') &&
                          ~b
                            .getResponseHeader('content-type')
                            .indexOf('application/json'))
                      )
                        try {
                          y = JSON.parse(y)
                        } catch (e) {
                          ;(i = e), (y = 'Invalid JSON response from server.')
                        }
                      return (
                        F(),
                        200 <= (n = b.status) && n < 300
                          ? t._finished(e, y, i)
                          : o()
                      )
                    }
                  })(this)),
                  (b.onerror = () => {
                    if (e[0].status !== r.CANCELED) return o()
                  }),
                  (v = null != (_ = b.upload) ? _ : b),
                  !1 !== this.options.trackProgress && (v.onprogress = F),
                  (u = {
                    Accept: 'application/json',
                    'Cache-Control': 'no-cache',
                    'X-Requested-With': 'XMLHttpRequest',
                  }),
                  this.options.headers && t(u, this.options.headers),
                  u))
                    void 0 !== (a = u[l]) && b.setRequestHeader(l, a)
                  if (((s = new FormData()), this.options.params))
                    for (m in (M = this.options.params))
                      (E = M[m]), s.append(m, E)
                  for (k = 0, A = e.length; k < A; k++)
                    (i = e[k]), this.emit('sending', i, b, s)
                  if (
                    (this.options.uploadMultiple &&
                      this.emit('sendingmultiple', e, b, s),
                    'FORM' === this.element.tagName)
                  )
                    for (
                      z = 0,
                        T = (U = this.element.querySelectorAll(
                          'input, textarea, select, button',
                        )).length;
                      z < T;
                      z++
                    )
                      if (
                        ((c = (d = U[z]).getAttribute('name')),
                        (h = d.getAttribute('type')),
                        'SELECT' === d.tagName && d.hasAttribute('multiple'))
                      )
                        for (L = 0, D = (N = d.options).length; L < D; L++)
                          (g = N[L]).selected && s.append(c, g.value)
                      else
                        (!h ||
                          ('checkbox' !== (I = h.toLowerCase()) &&
                            'radio' !== I) ||
                          d.checked) &&
                          s.append(c, d.value)
                  for (
                    p = S = 0, R = e.length - 1;
                    0 <= R ? S <= R : S >= R;
                    p = 0 <= R ? ++S : --S
                  )
                    s.append(this._getParamName(p), e[p], e[p].name)
                  return b.send(s)
                }),
                (r.prototype._finished = function (e, t, i) {
                  var n, s, o
                  for (s = 0, o = e.length; s < o; s++)
                    ((n = e[s]).status = r.SUCCESS),
                      this.emit('success', n, t, i),
                      this.emit('complete', n)
                  if (
                    (this.options.uploadMultiple &&
                      (this.emit('successmultiple', e, t, i),
                      this.emit('completemultiple', e)),
                    this.options.autoProcessQueue)
                  )
                    return this.processQueue()
                }),
                (r.prototype._errorProcessing = function (e, t, i) {
                  var n, s, o
                  for (s = 0, o = e.length; s < o; s++)
                    ((n = e[s]).status = r.ERROR),
                      this.emit('error', n, t, i),
                      this.emit('complete', n)
                  if (
                    (this.options.uploadMultiple &&
                      (this.emit('errormultiple', e, t, i),
                      this.emit('completemultiple', e)),
                    this.options.autoProcessQueue)
                  )
                    return this.processQueue()
                }),
                r
              )
            })(i)),
            (t.version = '4.0.1'),
            (t.options = {}),
            (t.optionsForElement = (e) =>
              e.getAttribute('id')
                ? t.options[n(e.getAttribute('id'))]
                : void 0),
            (t.instances = []),
            (t.forElement = (e) => {
              if (
                ('string' == typeof e && (e = document.querySelector(e)),
                null == (null != e ? e.dropzone : void 0))
              )
                throw new Error(
                  "No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.",
                )
              return e.dropzone
            }),
            (t.autoDiscover = !0),
            (t.discover = () => {
              var e, i, n, r, s, o
              for (
                document.querySelectorAll
                  ? (n = document.querySelectorAll('.dropzone'))
                  : ((n = []),
                    (e = (e) => {
                      var t, i, r, s
                      for (s = [], i = 0, r = e.length; i < r; i++)
                        (t = e[i]),
                          /(^| )dropzone($| )/.test(t.className)
                            ? s.push(n.push(t))
                            : s.push(void 0)
                      return s
                    }),
                    e(document.getElementsByTagName('div')),
                    e(document.getElementsByTagName('form'))),
                  o = [],
                  r = 0,
                  s = n.length;
                r < s;
                r++
              )
                (i = n[r]),
                  !1 !== t.optionsForElement(i)
                    ? o.push(new t(i))
                    : o.push(void 0)
              return o
            }),
            (t.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i]),
            (t.isBrowserSupported = () => {
              var e, i, n, r
              if (
                ((e = !0),
                window.File &&
                  window.FileReader &&
                  window.FileList &&
                  window.Blob &&
                  window.FormData &&
                  document.querySelector)
              )
                if ('classList' in document.createElement('a'))
                  for (
                    i = 0, n = (r = t.blacklistedBrowsers).length;
                    i < n;
                    i++
                  )
                    r[i].test(navigator.userAgent) && (e = !1)
                else e = !1
              else e = !1
              return e
            }),
            (a = (e, t) => {
              var i, n, r, s
              for (s = [], n = 0, r = e.length; n < r; n++)
                (i = e[n]) !== t && s.push(i)
              return s
            }),
            (n = (e) =>
              e.replace(/[\-_](\w)/g, (e) => e.charAt(1).toUpperCase())),
            (t.createElement = (e) => {
              var t
              return (
                ((t = document.createElement('div')).innerHTML = e),
                t.childNodes[0]
              )
            }),
            (t.elementInside = (e, t) => {
              if (e === t) return !0
              while ((e = e.parentNode)) if (e === t) return !0
              return !1
            }),
            (t.getElement = (e, t) => {
              var i
              if (
                ('string' == typeof e
                  ? (i = document.querySelector(e))
                  : null != e.nodeType && (i = e),
                null == i)
              )
                throw new Error(
                  'Invalid `' +
                    t +
                    '` option provided. Please provide a CSS selector or a plain HTML element.',
                )
              return i
            }),
            (t.getElements = function (e, t) {
              var i, n, r, s, o, l, a
              if (e instanceof Array) {
                n = []
                try {
                  for (r = 0, o = e.length; r < o; r++)
                    (i = e[r]), n.push(this.getElement(i, t))
                } catch (e) {
                  n = null
                }
              } else if ('string' == typeof e)
                for (
                  n = [], s = 0, l = (a = document.querySelectorAll(e)).length;
                  s < l;
                  s++
                )
                  (i = a[s]), n.push(i)
              else null != e.nodeType && (n = [e])
              if (null == n || !n.length)
                throw new Error(
                  'Invalid `' +
                    t +
                    '` option provided. Please provide a CSS selector, a plain HTML element or a list of those.',
                )
              return n
            }),
            (t.confirm = (e, t, i) =>
              window.confirm(e) ? t() : null != i ? i() : void 0),
            (t.isValidFile = (e, t) => {
              var i, n, r, s, o
              if (!t) return !0
              for (
                t = t.split(','),
                  i = (n = e.type).replace(/\/.*$/, ''),
                  s = 0,
                  o = t.length;
                s < o;
                s++
              )
                if ('.' === (r = (r = t[s]).trim()).charAt(0)) {
                  if (
                    -1 !==
                    e.name
                      .toLowerCase()
                      .indexOf(r.toLowerCase(), e.name.length - r.length)
                  )
                    return !0
                } else if (/\/\*$/.test(r)) {
                  if (i === r.replace(/\/.*$/, '')) return !0
                } else if (n === r) return !0
              return !1
            }),
            null !== e ? (e.exports = t) : (window.Dropzone = t),
            (t.ADDED = 'added'),
            (t.QUEUED = 'queued'),
            (t.ACCEPTED = t.QUEUED),
            (t.UPLOADING = 'uploading'),
            (t.PROCESSING = t.UPLOADING),
            (t.CANCELED = 'canceled'),
            (t.ERROR = 'error'),
            (t.SUCCESS = 'success'),
            (s = (e) => {
              var t, i, n, r, s, o, l, a
              for (
                e.naturalWidth,
                  s = e.naturalHeight,
                  (t = document.createElement('canvas')).width = 1,
                  t.height = s,
                  (i = t.getContext('2d')).drawImage(e, 0, 0),
                  n = i.getImageData(0, 0, 1, s).data,
                  a = 0,
                  r = s,
                  o = s;
                o > a;
              )
                0 === n[4 * (o - 1) + 3] ? (r = o) : (a = o), (o = (r + a) >> 1)
              return 0 === (l = o / s) ? 1 : l
            }),
            (o = (e, t, i, n, r, o, l, a, u, p) => {
              var d
              return (d = s(t)), e.drawImage(t, i, n, r, o, l, a, u, p / d)
            }),
            (r = (e, t) => {
              var i, n, r, s, o, l, a, u, p
              if (
                ((r = !1),
                (p = !0),
                (n = e.document),
                (u = n.documentElement),
                (i = n.addEventListener ? 'addEventListener' : 'attachEvent'),
                (a = n.addEventListener
                  ? 'removeEventListener'
                  : 'detachEvent'),
                (l = n.addEventListener ? '' : 'on'),
                (s = (i) => {
                  if (
                    'readystatechange' !== i.type ||
                    'complete' === n.readyState
                  )
                    return (
                      ('load' === i.type ? e : n)[a](l + i.type, s, !1),
                      !r && (r = !0) ? t.call(e, i.type || i) : void 0
                    )
                }),
                (o = () => {
                  try {
                    u.doScroll('left')
                  } catch (e) {
                    return void setTimeout(o, 50)
                  }
                  return s('poll')
                }),
                'complete' !== n.readyState)
              ) {
                if (n.createEventObject && u.doScroll) {
                  try {
                    p = !e.frameElement
                  } catch (e) {}
                  p && o()
                }
                return (
                  n[i](l + 'DOMContentLoaded', s, !1),
                  n[i](l + 'readystatechange', s, !1),
                  e[i](l + 'load', s, !1)
                )
              }
            }),
            (t._autoDiscoverFunction = () => {
              if (t.autoDiscover) return t.discover()
            }),
            r(window, t._autoDiscoverFunction)
        }).call(this)
    },
    55698: (e, t, i) => {
      i.d(t, { nanoid: () => n })
      const n = (e = 21) =>
        crypto
          .getRandomValues(new Uint8Array(e))
          .reduce(
            (e, t) =>
              (e +=
                (t &= 63) < 36
                  ? t.toString(36)
                  : t < 62
                    ? (t - 26).toString(36).toUpperCase()
                    : t > 62
                      ? '-'
                      : '_'),
            '',
          )
    },
  },
])
