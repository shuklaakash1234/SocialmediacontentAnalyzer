import React from 'react'

export default function AnalysisPanel({ result }) {
  if (!result) {
    return (
      <div className="panel">
        <h2>Analysis</h2>
        <p className="placeholder">No analysis yet</p>
      </div>
    )
  }

  const analysis = result.analysis || {}

  return (
    <div className="panel">
      <h2>Analysis</h2>
      <p><strong>Sentiment:</strong> {analysis.sentiment || '-'}</p>
      <p><strong>Keywords:</strong> {(analysis.keywords || []).join(', ')}</p>
      <p><strong>Suggestions:</strong></p>
      <ul>
        {(analysis.suggestions || []).map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      {analysis.hashtags?.length ? (
        <p><strong>Hashtags:</strong> {(analysis.hashtags || []).map(h => `#${h.replace(/^#/,'')}`).join(' ')}</p>
      ) : null}

      {analysis.topics?.length ? (
        <p><strong>Topics:</strong> {(analysis.topics || []).join(', ')}</p>
      ) : null}

      {analysis.entities?.length ? (
        <div>
          <p><strong>Entities:</strong></p>
          <ul>
            {analysis.entities.map((e, i) => (
              <li key={i}>{e.type}: {e.text}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {analysis.summary ? (
        <div>
          <p><strong>Summary:</strong> {analysis.summary}</p>
        </div>
      ) : null}

      {result.reportUrl && (
        <p><a href={result.reportUrl} target="_blank" rel="noreferrer">Download report (PDF)</a></p>
      )}
    </div>
  )
}
