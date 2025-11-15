import React, { useRef } from 'react'

export default function FileUploader({ onAnalyze, loading }) {
  const fileRef = useRef()

  const handleChange = e => {
    const files = Array.from(e.target.files || [])
    if (files.length) onAnalyze(files)
  }

  return (
    <div className="file-uploader" onClick={() => fileRef.current.click()}>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div className="upload-area">
        <div className="emoji">📤</div>
        <div className="title">Click or drag & drop files</div>
        <div className="hint">PDF, PNG, JPG — max few files</div>
        {loading && <div className="loading">Analyzing...</div>}
      </div>
    </div>
  )
}
