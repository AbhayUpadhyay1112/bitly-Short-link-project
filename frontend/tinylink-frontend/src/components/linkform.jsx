import React, { useState } from 'react'

export default function LinkForm({ onCreate }) {
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const payload = { url }
    if (code.trim()) payload.code = code.trim()
    const res = await onCreate(payload)
    setBusy(false)
    if (res.ok) {
      setMsg({ type:'success', text:'Link created' })
      setUrl('')
      setCode('')
    } else {
      setMsg({ type:'error', text: res.body?.error || 'Failed' })
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:8}}>
      <div>
        <label className="small">Target URL</label><br/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" style={{width:'100%', padding:8, borderRadius:6}} required/>
      </div>
      <div>
        <label className="small">Custom code (optional, 6-8 alphanum)</label><br/>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="abc123" style={{width:220, padding:8, borderRadius:6}} />
      </div>
      <div style={{marginTop:6}}>
        <button disabled={busy}>{busy ? 'Creating...' : 'Create Short Link'}</button>
      </div>
      {msg && <div style={{marginTop:8, color: msg.type === 'error' ? 'crimson' : 'green'}}>{msg.text}</div>}
    </form>
  )
}
