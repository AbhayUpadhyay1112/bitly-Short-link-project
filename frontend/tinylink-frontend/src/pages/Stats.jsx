import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { getLink } from '../api'

export default function Stats(){
  const { code } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    (async ()=>{
      setLoading(true)
      const res = await getLink(code)
      setLoading(false)
      if (res.ok) setData(res.body)
      else setData({ error: res.body?.error || 'Not found' })
    })()
  }, [code])

  if (loading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>
  if (data.error) return <div className="small">{data.error}</div>

  return (
    <div>
      <h2>Stats for {data.code}</h2>
      <p>URL: <a href={data.url} target="_blank" rel="noreferrer">{data.url}</a></p>
      <p>Clicks: {data.clicks}</p>
      <p>Last clicked: {data.last_clicked || '-'}</p>
      <p>Created: {new Date(data.created_at).toLocaleString()}</p>
    </div>
  )
}
