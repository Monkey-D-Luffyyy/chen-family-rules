import { reactive } from "vue";

export const STORAGE_KEY = "chen-family-rules-v1";
export const APP_VERSION = "20260805.1";

const BUILTIN_SYNC = {
  url: "https://fzgrxauidtcjxvpyvnjn.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Z3J4YXVpZHRjanh2cHl2bmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MjY2OTIsImV4cCI6MjEwMTQwMjY5Mn0.QrDv5PvtfrZeAibUCe3zecAxc1H1K5w54S7LWKkkopc",
  syncId: "chen-family-520",
  passphrase: "chen520home2026"
};

export const QUESTIONS = ["q1", "q2", "q3"];
export const QUESTION_META = {
  q1: { emoji: "😢", label: "有没有让老婆不开心" },
  q2: { emoji: "😡", label: "有没有让老婆生气" },
  q3: { emoji: "😭", label: "有没有让老婆哭" }
};

const DEFAULT_ARTICLES = [
  { id: "a1", text: "第一条、不允许欺骗双方，真诚至上。", penalty: "\\" },
  { id: "a2", text: "第二条、双方矛盾需及时解决，禁止生隔夜气。", penalty: "\\" },
  { id: "a3", text: "第三条、吵架不许提分手，不许说狠话，不许说反话。", penalty: "罪者称之为甲方，即甲方对乙方说狠话，则乙方需向甲方支付5.2。" },
  { id: "a4", text: "第四条、禁止半小时不回信息，或长时间不回消息而未报备。", penalty: "罚以十条语音陈述罪过，并受对方回复“哦、嗯”之刑。" },
  { id: "a5", text: "第五条、禁止不承认已说之话。", penalty: "罚一百字口头检讨。" },
  { id: "a6", text: "第六条、禁止沉默寡言。", penalty: "处以对方挂电话之刑，罪者还需主动拨回电话。" },
  { id: "a7", text: "第七条、一月内至少且至多写一封信给对方，无论多忙；当月内若有特殊时日，允许宽限当月之信数量。（打字信、口述信与手写信具有同等效应）", penalty: "情况之一，罪者当月未曾写信，第二月需双倍奉还；情况之二，罪者当月超额写信，罪者称之为甲方，超出几封，称之x封，则需纵容乙方为甲方写信的数量上限为x封，同时需答应乙方提出x个小要求，如甲方曾不答应乙方的要求。" },
  { id: "a8", text: "第八条、其一、温度达到二十五度以上；其二、身体无不适且不在特殊时期。同时满足以上两个条件方可斟酌吃冰淇淋。", penalty: "需将王权交由另一方之手一日，且一月内不允许再吃冰淇淋，同时需承受被另一方抛弃一天。" },
  { id: "a9", text: "第九条、禁止说谢谢，禁止说对不起。", penalty: "罪者称之为甲方，即甲方对乙方说之如上，则下次见面前，甲方需为此次见面完成规划。" },
  { id: "a10", text: "第十条、禁止穿着暴露，如短裙、吊带等。", penalty: "罪者称之为甲方，在乙方未允许的情况下，甲方需承受被乙方抛弃一天。" }
];

function defaultData() {
  return {
    names: { jia: "甲方", yi: "乙方" },
    articles: DEFAULT_ARTICLES.map(a => ({ ...a })),
    mistakes: [],
    daily: {},
    deleted: [],
    updatedAt: 0
  };
}

export function normalizeRec(rec) {
  const out = {};
  QUESTIONS.forEach(q => {
    const v = rec ? rec[q] : null;
    out[q] = v && typeof v === "object"
      ? { r: v.r || null, why: v.why || "", next: v.next || "" }
      : { r: v ? "bad" : null, why: "", next: "" };
  });
  return out;
}

function normalizeDaily(daily) {
  const out = {};
  Object.keys(daily || {}).forEach(k => {
    const rec = normalizeRec(daily[k]);
    rec.updatedAt = (daily[k] && daily[k].updatedAt) || 0;
    out[k] = rec;
  });
  return out;
}

export const state = reactive({
  data: defaultData(),
  syncStatus: "云端同步已内置，正在自动连接…",
  syncClass: ""
});

loadData();

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const d = defaultData();
    state.data = {
      names: { ...d.names, ...(parsed.names || {}) },
      articles: Array.isArray(parsed.articles) && parsed.articles.length ? parsed.articles : d.articles,
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      daily: normalizeDaily(parsed.daily),
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      updatedAt: parsed.updatedAt || 0
    };
  } catch (e) {
    // keep defaults
  }
}

let suppressAutoSync = false;
let syncTimer = null;
let syncing = false;

export function saveData() {
  state.data.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  if (!suppressAutoSync) scheduleSync();
}

export function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { syncNow(); }, 4000);
}

export function setSyncStatus(text, cls) {
  state.syncStatus = text;
  state.syncClass = cls || "";
}

function uid() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function dateKey(dt) {
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
}

export function fmtDate(iso) {
  if (!iso) return "";
  const p = iso.split("-");
  if (p.length !== 3) return iso;
  return p[0] + "年" + parseInt(p[1], 10) + "月" + parseInt(p[2], 10) + "日";
}

export function addMistake({ date, culprit, articleId, note, penalty }) {
  state.data.mistakes.push({
    id: uid(),
    date,
    culprit,
    articleId: articleId || null,
    note,
    penalty,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  saveData();
}

export function toggleMistake(id) {
  const m = state.data.mistakes.find(x => x.id === id);
  if (!m) return;
  m.status = m.status === "done" ? "pending" : "done";
  m.updatedAt = Date.now();
  saveData();
}

export function deleteMistake(id) {
  addTombstone("m", id);
  state.data.mistakes = state.data.mistakes.filter(x => x.id !== id);
  saveData();
}

export function addArticle(text, penalty) {
  state.data.articles.push({ id: uid(), text, penalty: penalty || "\\", updatedAt: Date.now() });
  saveData();
}

export function updateArticle(id, text, penalty) {
  const a = state.data.articles.find(x => x.id === id);
  if (!a) return;
  a.text = text;
  a.penalty = penalty || "\\";
  a.updatedAt = Date.now();
  saveData();
}

export function deleteArticle(id) {
  addTombstone("a", id);
  state.data.articles = state.data.articles.filter(a => a.id !== id);
  saveData();
}

function addTombstone(kind, id) {
  state.data.deleted.push({ k: kind, id, at: Date.now() });
  if (state.data.deleted.length > 300) {
    state.data.deleted = state.data.deleted.slice(-300);
  }
}

export function setDailyAnswer(date, q, ans) {
  const rec = normalizeRec(state.data.daily[date]);
  rec[q].r = rec[q].r === ans ? null : ans;
  if (rec[q].r !== "bad") {
    rec[q].why = "";
    rec[q].next = "";
  }
  rec.updatedAt = Date.now();
  state.data.daily[date] = rec;
  saveData();
}

export function setDailyNote(date, q, field, value) {
  const rec = normalizeRec(state.data.daily[date]);
  rec[q][field] = value;
  rec.updatedAt = Date.now();
  state.data.daily[date] = rec;
  saveData();
}

export function updateNames(jia, yi) {
  state.data.names.jia = jia || "甲方";
  state.data.names.yi = yi || "乙方";
  saveData();
}

export function resetData() {
  state.data = defaultData();
  saveData();
}

/* ---------- crypto & sync ---------- */

function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBuf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPayload(obj, passphrase) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
  return { v: 1, s: bufToB64(salt), i: bufToB64(iv), c: bufToB64(cipher) };
}

export async function decryptPayload(payload, passphrase) {
  if (!payload || !payload.s || !payload.i || !payload.c) throw new Error("云端数据格式不正确");
  const salt = b64ToBuf(payload.s);
  const iv = b64ToBuf(payload.i);
  const key = await deriveKey(passphrase, salt);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, b64ToBuf(payload.c));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (e) {
    throw new Error("解密失败：同步口令可能不正确");
  }
}

export function getSyncConfig() {
  const cfg = { ...BUILTIN_SYNC };
  try {
    const p = new URLSearchParams(location.search);
    if (p.get("syncId")) cfg.syncId = p.get("syncId");
    if (p.get("passphrase")) cfg.passphrase = p.get("passphrase");
    if (p.get("url")) cfg.url = p.get("url");
    if (p.get("key")) cfg.anonKey = p.get("key");
  } catch (e) {
    // ignore
  }
  return cfg;
}

function mergeDaily(A, B) {
  const out = {};
  QUESTIONS.forEach(q => {
    const x = A && A[q] && typeof A[q] === "object" ? A[q] : {};
    const y = B && B[q] && typeof B[q] === "object" ? B[q] : {};
    const r = x.r || y.r || null;
    out[q] = {
      r,
      why: r === "bad" ? (x.why || y.why || "") : "",
      next: r === "bad" ? (x.next || y.next || "") : ""
    };
  });
  return out;
}

export function mergeData(a, b) {
  const out = {};
  out.names = (b.updatedAt || 0) > (a.updatedAt || 0) ? { ...(b.names || {}) } : { ...(a.names || {}) };

  const tmap = new Map();
  [...(a.deleted || []), ...(b.deleted || [])].forEach(t => {
    const cur = tmap.get(t.k + "|" + t.id);
    if (!cur || (t.at || 0) > (cur.at || 0)) tmap.set(t.k + "|" + t.id, t);
  });
  out.deleted = [...tmap.values()].slice(-300);

  const amap = new Map();
  [...(a.articles || []), ...(b.articles || [])].forEach(ar => {
    const cur = amap.get(ar.id);
    if (!cur || (ar.updatedAt || 0) > (cur.updatedAt || 0)) amap.set(ar.id, ar);
  });
  out.articles = [...amap.values()].filter(ar => !tmap.has("a|" + ar.id));
  const mmap = new Map();
  [...(a.mistakes || []), ...(b.mistakes || [])].forEach(m => {
    const cur = mmap.get(m.id);
    if (!cur || (m.updatedAt || 0) > (cur.updatedAt || 0)) mmap.set(m.id, m);
  });
  out.mistakes = [...mmap.values()].filter(m => !tmap.has("m|" + m.id));
  const dates = new Set([...Object.keys(a.daily || {}), ...Object.keys(b.daily || {})]);
  out.daily = {};
  dates.forEach(d => {
    out.daily[d] = mergeDaily((a.daily || {})[d], (b.daily || {})[d]);
  });
  out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0, Date.now());
  return out;
}

async function supabaseGet(cfg) {
  const base = cfg.url.replace(/\/+$/, "");
  const res = await fetch(base + "/rest/v1/family_data?select=id,data,updated_at&id=eq." + encodeURIComponent(cfg.syncId), {
    headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey }
  });
  if (!res.ok) throw new Error("读取云端失败（HTTP " + res.status + "）");
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  try {
    return JSON.parse(rows[0].data);
  } catch (e) {
    throw new Error("云端数据损坏");
  }
}

async function supabaseUpsert(cfg, payload) {
  const base = cfg.url.replace(/\/+$/, "");
  const res = await fetch(base + "/rest/v1/family_data", {
    method: "POST",
    headers: {
      apikey: cfg.anonKey,
      Authorization: "Bearer " + cfg.anonKey,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify([{ id: cfg.syncId, data: JSON.stringify(payload), updated_at: new Date().toISOString() }])
  });
  if (!res.ok) throw new Error("上传云端失败（HTTP " + res.status + "）");
}

export async function pushToCloud() {
  const cfg = getSyncConfig();
  const payload = await encryptPayload(state.data, cfg.passphrase);
  await supabaseUpsert(cfg, payload);
}

export async function syncNow() {
  if (syncing) return { ok: false, reason: "busy" };
  syncing = true;
  suppressAutoSync = true;
  try {
    const cfg = getSyncConfig();
    setSyncStatus("正在与云端同步…", "");
    try {
      const remote = await supabaseGet(cfg);
      if (!remote) {
        await pushToCloud();
      } else {
        const remoteData = await decryptPayload(remote, cfg.passphrase);
        state.data = mergeData(state.data, remoteData);
        saveData();
        await pushToCloud();
      }
      const now = new Date();
      setSyncStatus(
        "已同步 ✓ 本地记录 " + (state.data.mistakes || []).length + " 条 · 上次同步 " + now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0"),
        "ok"
      );
      return { ok: true };
    } catch (e) {
      setSyncStatus("同步失败：" + e.message, "err");
      return { ok: false, reason: e.message };
    }
  } finally {
    syncing = false;
    suppressAutoSync = false;
  }
}

/* expose for testing */
window.__chenFamily = {
  state,
  mergeData,
  encryptPayload,
  decryptPayload,
  getSyncConfig,
  pushToCloud,
  syncNow,
  saveData,
  deleteMistake,
  deleteArticle,
  setDailyAnswer
};
