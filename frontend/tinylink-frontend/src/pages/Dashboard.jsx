import React, {useEffect, useState} from 'react'
import LinkForm from '../components/LinkForm'
import LinkTable from '../components/LinkTable'
import { listLinks, createLink, deleteLink } from '../api'

export default function Dashboard(){
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchLinks(){
    setLoading(true)
    setError(null)
    const res = await listLinks()
    setLoading(false)
    if (res.ok) setLinks(res.body)
    else setError(res.body?.error || 'Failed to load')
  }

  useEffect(()=>{ fetchLinks() }, [])

  async function onCreate(payload){
    const res = await createLink(payload)
    if (res.status === 201) {
      await fetchLinks()
      return { ok: true, body: res.body }
    } else {
      return { ok:false, body: res.body }
    }
  }

  async function onDelete(code){
    if (!confirm(`Delete ${code}?`)) return
    const res = await deleteLink(code)
    if (res.ok) fetchLinks()
    else alert(res.body?.error || 'Delete failed')
  }

  return (
    <div>
      <h2 style={{marginTop:0}}>Create a short link</h2>
      <LinkForm onCreate={onCreate} />
      <h3 style={{marginTop:18}}>Your links</h3>
      {loading ? <div>Loading...</div> : error ? <div className="small">{error}</div> : <LinkTable links={links} onDelete={onDelete} />}
    </div>
  )
}
