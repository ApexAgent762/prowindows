with open('public/index.html','r') as f:
    h = f.read()

old = "function save() { try { localStorage.setItem('pw_v1', JSON.stringify(S)); } catch(e) {} }\nfunction load() {\n  try { const d = localStorage.getItem('pw_v1'); if (d) S = JSON.parse(d); } catch(e) {}\n  if (!S.status) S.status = {};\n}"

new = """async function save() {
  try { await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(S) }); }
  catch(e) { console.error('Save failed:', e); }
}

async function load() {
  try { const r = await fetch('/api/data'); S = await r.json(); if (!S.status) S.status = {}; }
  catch(e) { if (!S.status) S.status = {}; }
}"""

h = h.replace(old, new)
h = h.replace("load();\nrenderAll();", "load().then(() => renderAll());")

with open('public/index.html','w') as f:
    f.write(h)
print('Done' if new[:20] in h else 'ERROR: replacement failed')
