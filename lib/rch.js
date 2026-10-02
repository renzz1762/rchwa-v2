// Logika bersama untuk panel (index.js) dan Vercel (api/rch.js)
const API_URL = process.env.RCH_API_URL || "https://apiii-xrina.vercel.app/tools/rch";
const API_KEY = process.env.RCH_API_KEY || "Rin-rch";

async function kirimReaksi(url, reaction) {
  url = String(url || "").trim();
  reaction = String(reaction || "").trim();

  if (!url) return { code: 400, body: { status: false, message: "Masukkan link channel dulu!" } };
  if (!/^https?:\/\/(www\.)?whatsapp\.com\/channel\//i.test(url))
    return { code: 400, body: { status: false, message: "Link harus berformat https://whatsapp.com/channel/xxx/123" } };
  if (!reaction || reaction.length > 8)
    return { code: 400, body: { status: false, message: "Reaction tidak valid" } };

  const target = `${API_URL}?url=${encodeURIComponent(url)}&reaction=${encodeURIComponent(reaction)}&apikey=${encodeURIComponent(API_KEY)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);

  try {
    const res = await fetch(target, { signal: ctrl.signal });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { status: false, message: "Respon API bukan JSON: " + text.slice(0, 200) }; }
    return { code: 200, body: data };
  } catch (e) {
    const msg = e.name === "AbortError" ? "API terlalu lama merespon (timeout)" : "Tidak bisa menghubungi API: " + e.message;
    return { code: 502, body: { status: false, message: msg } };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { kirimReaksi };
