import React from 'react'

export default function TextPreview({ loading, result }) {
  const text = result?.extractedText || ''

  return (
    <div className="panel">
      <h2>Extracted Text</h2>
      {loading ? (
        <p className="placeholder">Analyzing...</p>
      ) : text ? (
        <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{text}</pre>
      ) : (
        <p className="placeholder">No text yet</p>
      )}
    </div>
  )
}