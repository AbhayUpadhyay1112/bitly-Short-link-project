import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="container">
      <header>
        <h1><Link to="/" style={{textDecoration:'none', color:'inherit'}}>TinyLink</Link></h1>
        <div className="small">A tiny URL shortener</div>
      </header>

      <div className="card">
        <Outlet />
      </div>

      <footer style={{marginTop:16, textAlign:'center'}} className="small">
        Built with Node + React — Backend must run at <code>{import.meta.env.VITE_API_BASE || 'http://localhost:4000'}</code>
      </footer>
    </div>
  )
}
