import React from 'react'
import { Link } from 'react-router-dom'

export default function LinkTable({ links, onDelete }) {
  if (!links?.length) return <div className="small">No links yet</div>
  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Target</th><th>Clicks</th><th>Last Clicked</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {links.map(l => (
          <tr key={l.code}>
            <td><a href={`${import.meta.env.VITE_API_BASE || 'https://bitly-short-link-project.onrender.com/'}/${l.code}`} target="_blank" rel="noreferrer">{l.code}</a></td>
            <td style={{maxWidth:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}} title={l.url}>{l.url}</td>
            <td>{l.clicks}</td>
            <td>{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : '-'}</td>
            <td className="actions">
              <button onClick={()=>onDelete(l.code)} style={{background:'#e02424'}}>Delete</button>
              <Link to={`/code/${l.code}`} style={{marginLeft:8}}>Stats</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
