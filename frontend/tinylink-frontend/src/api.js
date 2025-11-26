const BASE ='https://bitly-short-link-project.onrender.com';

async function request(path, opts = {}) {
  const url = `${BASE}${path}`;
  const r = await fetch(url, opts);
  const text = await r.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null } catch(e) { body = text }
  return { status: r.status, ok: r.ok, body };
}

export const listLinks = () => request('/api/links');
export const createLink = (payload) => request('/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
export const getLink = (code) => request(`/api/links/${encodeURIComponent(code)}`);
export const deleteLink = (code) => request(`/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
