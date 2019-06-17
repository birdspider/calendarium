function s2ab (s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

export function asDownload (payload, name = 'download', mimetype = 'application/octet-stream', isBase64 = true) {
  let raw = s2ab(isBase64 ? atob(payload) : payload)
  let blob = new window.Blob([raw], { type: mimetype })

  if (!document.documentMode && !/Edge/.test(navigator.userAgent)) {
    if (typeof window.File === 'function') {
      blob = new window.File([raw], name, { type: mimetype })
    }
  }

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, name)
  } else {
    const datauri = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    window.document.body.appendChild(a)
    a.target = '_blank'
    a.href = datauri
    a.download = name
    a.click()

    datauri && window.URL.revokeObjectURL(datauri)
    a.parentNode.removeChild(a)
  }
}
