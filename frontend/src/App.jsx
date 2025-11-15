import React, { useState } from 'react'
import FileUploader from "./components/FileUploader.jsx";


import AnalysisPanel from './components/AnalysisPanel.jsx';
import TextPreview from './components/TextPreview.jsx';
import './App.css'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const BACKEND_URL = '/api/analyze'

  async function analyzeFiles(selectedFiles) {
    setLoading(true)
    setResult(null)

    const form = new FormData()
    selectedFiles.forEach(f => form.append('files', f))

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Server error: ' + res.status)
      const data = await res.json()
      // Our backend returns { success, extractedText, analysis }
      setResult(data)
    } catch (err) {
      alert('Analyze failed: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setResult(null)
  }

  return (
    <div className="app-container">
      <h1>Social Media Content Analyzer</h1>
      <p className="subtitle">Upload PDF or images — then click Analyze.</p>

      <FileUploader onAnalyze={analyzeFiles} loading={loading} />

      <div className="content-sections">
        <TextPreview loading={loading} result={result} />
        <AnalysisPanel result={result} />
      </div>

      <div className="bottom-actions">
        <button className="clear-btn" onClick={clearAll}>Clear</button>
      </div>
    </div>
  )
}
