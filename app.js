'use strict';
/* SnapCal — GitHub Pages + Supabase + in-browser model.
   Storage: Supabase (email/password login). With no config.js values it
   falls back to this-browser-only localStorage so the site still demos. */

/* ---------- i18n ---------- */
const ZH = (navigator.language || 'en').toLowerCase().startsWith('zh');
const T = ZH ? {
  today:'今天', photo:'拍照', scan:'扫码', weight:'体重', foods:'食物', settings:'设置',
  kcal:'千卡', of:'/ 目标', protein:'蛋白质', fat:'脂肪', carbs:'碳水',
  meals:'今日记录', addFood:'＋ 添加食物', quick:'快速添加：',
  week:'近 7 天摄入（千卡）', grams:'克', per100:'每100克', add:'添加', cancel:'取消',
  search:'搜索食物（中文 / English / 日本語 / 한국어）…',
  wTitle:'今日身体数据', wKg:'体重 (kg)', wMus:'肌肉量 (kg)', wFatPct:'体脂率 (%)', save:'保存',
  wChart:'体重趋势（近 60 天）', wEmpty:'还没有记录。今天记录第一条吧。', wRecent:'最近记录',
  legendW:'体重', legendM:'肌肉量', goal:'目标',
  sTitle:'每日目标', sKcal:'热量目标（千卡）', sPro:'蛋白质目标（克）', sGoal:'目标体重 (kg)',
  cfTitle:'＋ 自定义食物', cfName:'名称', cfPor:'常见份量（克）',
  saved:'已保存', added:'已添加', deleted:'已删除', del:'删除',
  online:'✓ 数据保存在你自己的 Supabase 数据库。', local:'⚠ 未配置 Supabase——数据仅保存在此浏览器。',
  login:'登录', register:'注册', loginHint:'登录后你的数据会在线保存，任何设备可访问。', logout:'退出登录', badLogin:'邮箱或密码不正确。',
  toReg:'新用户？点这里注册', toLogin:'已有账号？点这里登录', welcome:'邮箱已确认，欢迎使用 SnapCal！', checkEmail:'注册成功——请到邮箱点击确认链接后再登录。', regFail:'注册失败：',
  photoHint:'拍摄你的餐食', shoot:'拍照识别', analyzing:'识别中…', notThese:'都不是——去搜索',
  modelIdle:'首次使用会下载识别模型（约 33MB），之后缓存在本地。', modelLoading:'正在加载模型…',
  modelReady:'模型已就绪——在设备上离线识别，照片不会上传。', camDenied:'需要相机权限。请在浏览器设置中允许。',
  scanHint:'将条形码对准相机', scanNote:'扫码后自动查询 Open Food Facts。', notFound:'未找到该商品，请用搜索添加。',
  noResults:'没有找到，试试别的关键词，或添加自定义食物。',
} : {
  today:'Today', photo:'Photo', scan:'Scan', weight:'Weight', foods:'Foods', settings:'Settings',
  kcal:'kcal', of:'/ target', protein:'Protein', fat:'Fat', carbs:'Carbs',
  meals:'Logged today', addFood:'＋ Add food', quick:'Quick add:',
  week:'Last 7 days (kcal)', grams:'g', per100:'per 100 g', add:'Add', cancel:'Cancel',
  search:'Search foods (English / 中文 / 日本語 / 한국어)…',
  wTitle:'Today’s body stats', wKg:'Weight (kg)', wMus:'Muscle mass (kg)', wFatPct:'Body fat (%)', save:'Save',
  wChart:'Weight trend (last 60 days)', wEmpty:'No records yet — log your first one today.', wRecent:'Recent',
  legendW:'Weight', legendM:'Muscle', goal:'goal',
  sTitle:'Daily targets', sKcal:'Calorie target (kcal)', sPro:'Protein target (g)', sGoal:'Goal weight (kg)',
  cfTitle:'＋ Custom food', cfName:'Name', cfPor:'Typical portion (g)',
  saved:'Saved', added:'Added', deleted:'Deleted', del:'Delete',
  online:'✓ Data lives in your own Supabase database.', local:'⚠ Supabase not configured — data stays in this browser only.',
  login:'Sign in', register:'Create account', loginHint:'Sign in and your data is stored online, reachable from any device.', logout:'Sign out', badLogin:'Wrong email or password.',
  toReg:'New here? Create an account', toLogin:'Have an account? Sign in', welcome:'Email confirmed — welcome to SnapCal!', checkEmail:'Account created — click the confirmation link in your email, then sign in.', regFail:'Sign-up failed: ',
  photoHint:'Photograph your meal', shoot:'Identify', analyzing:'Analyzing…', notThese:'None of these — search instead',
  modelIdle:'First use downloads the recognition model (~33 MB); it is cached after that.', modelLoading:'Loading model…',
  modelReady:'Model ready — runs on your device, photos never leave it.', camDenied:'Camera permission needed — allow it in your browser settings.',
  scanHint:'Point the camera at a barcode', scanNote:'Barcodes are looked up in Open Food Facts.', notFound:'Product not found — add it via search.',
  noResults:'No match — try another word, or add a custom food.',
};

/* ---------- state & utils ---------- */
const S = {
  foods: [], custom: [], entries: [], weights: [],
  targets: { kcal: 2000, protein: 120, goal: null },
  date: todayISO(), view: 'today', sheetFood: null,
  sb: null, session: null, deviceId: null,
  ortSession: null, modelMeta: null, camStream: null, zxReader: null,
};
const $ = (id) => document.getElementById(id);
function todayISO(off = 0) {
  const d = new Date(); d.setDate(d.getDate() + off);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function fmtDate(iso) { return iso === todayISO() ? T.today : iso.slice(5).replace('-', '/'); }
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast._h); toast._h = setTimeout(() => t.hidden = true, 1800); }
function nameOf(f) { return (ZH ? (f.zh || f.en) : (f.en || f.zh)) || f.ja || f.ko || f.id; }
function altOf(f) { const a = ZH ? f.en : f.zh; return a && a !== nameOf(f) ? a : (f.ja || f.ko || ''); }
function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
function r1(x) { return Math.round((x || 0) * 10) / 10; }
const LOCAL = !(window.PS_CONFIG && PS_CONFIG.SUPABASE_URL && PS_CONFIG.SUPABASE_ANON_KEY);
const LS_KEY = 'plate-scale-local';
function lsLoad() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } }
function lsSave() { try { localStorage.setItem(LS_KEY, JSON.stringify({ entries: S.entries, weights: S.weights, custom: S.custom, targets: S.targets })); } catch {} }
function deviceId() {
  if (S.deviceId) return S.deviceId;
  try {
    let id = localStorage.getItem('ps-device');
    if (!id) { id = 'web-' + Math.random().toString(36).slice(2, 10); localStorage.setItem('ps-device', id); }
    S.deviceId = id;
  } catch { S.deviceId = 'web-session'; }
  return S.deviceId;
}

/* ---------- storage layer ---------- */
async function loadAll() {
  if (LOCAL) {
    const l = lsLoad();
    S.entries = l.entries || []; S.weights = l.weights || []; S.custom = l.custom || [];
    if (l.targets) S.targets = l.targets;
    return;
  }
  const sb = S.sb;
  const [e, w, c, t] = await Promise.all([
    sb.from('entries').select('*').eq('deleted', false).order('created_at', { ascending: false }).limit(2000),
    sb.from('weights').select('*').order('date', { ascending: false }).limit(400),
    sb.from('foods_custom').select('*').order('id', { ascending: false }).limit(500),
    sb.from('settings').select('*').maybeSingle(),
  ]);
  S.entries = (e.data || []).map(r => ({ ...r, _key: r.device_id + '/' + r.local_id }));
  S.weights = w.data || [];
  S.custom = c.data || [];
  if (t.data) S.targets = { kcal: t.data.kcal ?? 2000, protein: t.data.protein ?? 120, goal: t.data.goal };
}
async function addEntry(e) {
  if (LOCAL) { S.entries.unshift({ _key: 'l' + Date.now(), ...e }); lsSave(); }
  else {
    const row = { device_id: deviceId(), local_id: Date.now(), deleted: false, ...e };
    const { error } = await S.sb.from('entries').insert(row);
    if (error) return toast(error.message);
    S.entries.unshift({ ...row, _key: row.device_id + '/' + row.local_id });
  }
  toast(T.added); renderToday();
}
async function removeEntry(key) {
  if (LOCAL) { S.entries = S.entries.filter(x => x._key !== key); lsSave(); }
  else {
    const [d, l] = key.split('/');
    const { error } = await S.sb.from('entries').update({ deleted: true }).eq('device_id', d).eq('local_id', +l);
    if (error) return toast(error.message);
    S.entries = S.entries.filter(x => x._key !== key);
  }
  toast(T.deleted); renderToday();
}
async function saveWeight(w) {
  if (LOCAL) { S.weights = S.weights.filter(x => x.date !== w.date); S.weights.push(w); lsSave(); }
  else {
    const { error } = await S.sb.from('weights').upsert(w, { onConflict: 'user_id,date' });
    if (error) return toast(error.message);
    S.weights = S.weights.filter(x => x.date !== w.date); S.weights.push(w);
  }
  toast(T.saved); renderWeight();
}
async function saveTargets() {
  if (LOCAL) lsSave();
  else {
    const { error } = await S.sb.from('settings').upsert({ ...S.targets }, { onConflict: 'user_id' });
    if (error) return toast(error.message);
  }
  toast(T.saved); renderToday(); renderWeight();
}
async function addCustom(f) {
  if (LOCAL) { S.custom.unshift(f); lsSave(); }
  else {
    const { error } = await S.sb.from('foods_custom').insert(f);
    if (error) return toast(error.message);
    S.custom.unshift(f);
  }
  toast(T.saved); renderResults();
}

/* ---------- boot & auth ---------- */
init();
async function init() {
  buildStatic();
  fetch('foods.json').then(r => r.json()).then(j => {
    const c = j.cols;
    S.foods = j.rows.map(r => Object.fromEntries(c.map((k, i) => [k, r[i]])));
    renderQuick(); renderResults();
  }).catch(() => {});
  $('storageNote').textContent = LOCAL ? T.local : T.online;
  if (LOCAL) { showApp(); return; }
  S.sb = supabase.createClient(PS_CONFIG.SUPABASE_URL, PS_CONFIG.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  const fromEmail = /access_token=|type=signup/.test(location.hash);
  const { data } = await S.sb.auth.getSession();
  if (fromEmail) {
    history.replaceState(null, '', location.pathname + location.search);
    setTimeout(() => { if (S.session) toast(T.welcome); }, 800);
  }
  if (data.session) { S.session = data.session; showApp(); }
  else showLogin();
  S.sb.auth.onAuthStateChange((_ev, session) => {
    if (session && !S.session) { S.session = session; showApp(); }
  });
}
function showLogin() {
  $('login').hidden = false; $('appRoot').hidden = true;
  S.authMode = S.authMode || 'login';
  paintAuthMode();
}
function paintAuthMode() {
  $('loginHint').textContent = T.loginHint;
  $('loginBtn').textContent = S.authMode === 'register' ? T.register : T.login;
  $('modeToggle').textContent = S.authMode === 'register' ? T.toLogin : T.toReg;
  $('pw').autocomplete = S.authMode === 'register' ? 'new-password' : 'current-password';
  $('loginErr').textContent = '';
}
async function showApp() {
  $('login').hidden = true; $('appRoot').hidden = false;
  await loadAll().catch(err => toast(err.message || 'load error'));
  $('sKcal').value = S.targets.kcal || ''; $('sPro').value = S.targets.protein || ''; $('sGoal').value = S.targets.goal || '';
  renderToday(); renderWeight(); renderResults();
}

/* ---------- static UI ---------- */
function buildStatic() {
  $('hdrDate').textContent = todayISO();
  try { $('email').value = localStorage.getItem('ps-email') || ''; } catch {}
  $('modeToggle').addEventListener('click', () => {
    S.authMode = S.authMode === 'login' ? 'register' : 'login';
    paintAuthMode();
  });
  $('loginForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('loginErr').textContent = '';
    const email = $('email').value.trim(), password = $('pw').value;
    try { localStorage.setItem('ps-email', email); } catch {}
    if (S.authMode === 'register') {
      const { data, error } = await S.sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
      if (error) { $('loginErr').textContent = T.regFail + error.message; return; }
      if (!data.session) $('loginErr').textContent = T.checkEmail; // email confirmation is on
    } else {
      const { error } = await S.sb.auth.signInWithPassword({ email, password });
      if (error) $('loginErr').textContent = T.badLogin;
    }
  });
  const tabs = [['today', T.today], ['photo', T.photo], ['scan', T.scan], ['weight', T.weight], ['foods', T.foods], ['settings', T.settings]];
  $('tabs').innerHTML = tabs.map(([k, l]) => `<button role="tab" data-v="${k}" aria-selected="${k === S.view}">${l}</button>`).join('');
  $('tabs').addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    setView(b.dataset.v);
  });
  $('weekTitle').textContent = T.week; $('mealsTitle').textContent = T.meals;
  $('openAdd').textContent = T.addFood;
  $('openAdd').addEventListener('click', () => { setView('foods'); $('q').focus(); });
  $('dPrev').addEventListener('click', () => shiftDate(-1));
  $('dNext').addEventListener('click', () => shiftDate(1));
  $('photoHint').textContent = T.photoHint; $('photoShoot').textContent = T.shoot;
  $('modelNote').textContent = T.modelIdle;
  $('photoShoot').addEventListener('click', classifyPhoto);
  $('scanHint').textContent = T.scanHint; $('scanNote').textContent = T.scanNote;
  $('wTitle').textContent = T.wTitle; $('wKgL').textContent = T.wKg; $('wMusL').textContent = T.wMus;
  $('wFatL').textContent = T.wFatPct; $('wSave').textContent = T.save; $('wChartTitle').textContent = T.wChart;
  $('wEmpty').textContent = T.wEmpty; $('wRecentTitle').textContent = T.wRecent;
  $('wSave').addEventListener('click', () => {
    const kg = parseFloat($('wKg').value); if (!(kg > 0)) return;
    const w = { date: todayISO(), weight: kg, created_at: Date.now() };
    const m = parseFloat($('wMus').value); if (m > 0) w.muscle = m;
    const f = parseFloat($('wFat').value); if (f > 0) w.body_fat = f;
    saveWeight(w);
  });
  $('q').placeholder = T.search;
  $('q').addEventListener('input', renderResults);
  $('cfTitle').textContent = T.cfTitle; $('cfNameL').textContent = T.cfName;
  $('cfProL').textContent = T.protein + ' (g)'; $('cfFatL').textContent = T.fat + ' (g)';
  $('cfCarbL').textContent = T.carbs + ' (g)'; $('cfPorL').textContent = T.cfPor;
  $('cfSave').textContent = T.save;
  $('cfSave').addEventListener('click', () => {
    const name = $('cfName').value.trim(); const kcal = parseFloat($('cfKcal').value);
    if (!name || !(kcal >= 0)) return;
    addCustom({ name, kcal, protein: parseFloat($('cfPro').value) || 0, fat: parseFloat($('cfFat').value) || 0,
      carbs: parseFloat($('cfCarb').value) || 0, portion: parseFloat($('cfPor').value) || 100 });
    ['cfName', 'cfKcal', 'cfPro', 'cfFat', 'cfCarb'].forEach(i => $(i).value = '');
  });
  $('sTitle').textContent = T.sTitle; $('sKcalL').textContent = T.sKcal;
  $('sProL').textContent = T.sPro; $('sGoalL').textContent = T.sGoal; $('sSave').textContent = T.save;
  $('sSave').addEventListener('click', () => {
    S.targets = { kcal: parseFloat($('sKcal').value) || 2000, protein: parseFloat($('sPro').value) || 0,
      goal: parseFloat($('sGoal').value) || null };
    saveTargets();
  });
  $('logout').textContent = T.logout;
  $('logout').hidden = LOCAL;
  $('logout').addEventListener('click', async () => { await S.sb.auth.signOut(); location.reload(); });
  $('shGramsL').textContent = T.grams; $('shAdd').textContent = T.add; $('shCancel').textContent = T.cancel;
  $('shCancel').addEventListener('click', closeSheet);
  $('sheet').addEventListener('click', ev => { if (ev.target === $('sheet')) closeSheet(); });
  $('shGrams').addEventListener('input', sheetKcal);
  $('shAdd').addEventListener('click', () => {
    const f = S.sheetFood; const g = parseFloat($('shGrams').value);
    if (!f || !(g > 0)) return;
    addEntry({ date: S.date, name: f._name, grams: g,
      kcal: f.kcal * g / 100, protein: (f.protein || 0) * g / 100, fat: (f.fat || 0) * g / 100,
      carbs: (f.carbs || 0) * g / 100, source: f.source || 'custom', created_at: Date.now() });
    closeSheet(); setView('today');
  });
}
function setView(v) {
  S.view = v;
  document.querySelectorAll('#tabs button').forEach(x => x.setAttribute('aria-selected', x.dataset.v === v));
  ['today', 'photo', 'scan', 'weight', 'foods', 'settings'].forEach(k => $('view-' + k).hidden = k !== v);
  stopCam();
  if (v === 'photo') startPhoto();
  if (v === 'scan') startScan();
}
function shiftDate(n) {
  const d = new Date(S.date + 'T12:00:00'); d.setDate(d.getDate() + n);
  S.date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  renderToday();
}

/* ---------- camera: photo recognition ---------- */
async function startCam(videoEl) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    S.camStream = stream; videoEl.srcObject = stream; await videoEl.play();
    return true;
  } catch { toast(T.camDenied); return false; }
}
function stopCam() {
  if (S.zxReader) { try { S.zxReader.reset(); } catch {} S.zxReader = null; }
  if (S.camStream) { S.camStream.getTracks().forEach(t => t.stop()); S.camStream = null; }
  $('photoVideo').srcObject = null; $('scanVideo').srcObject = null;
  $('guessList').hidden = true; $('photoShoot').hidden = false;
}
async function startPhoto() { await startCam($('photoVideo')); ensureModel(); }
async function ensureModel() {
  if (S.ortSession || ensureModel._loading) return;
  ensureModel._loading = true;
  $('modelNote').textContent = T.modelLoading;
  try {
    ort.env.wasm.numThreads = 1;
    const [meta, session] = await Promise.all([
      fetch('model/model-meta.json').then(r => r.json()),
      ort.InferenceSession.create('model/food.onnx', { executionProviders: ['wasm'] }),
    ]);
    S.modelMeta = meta; S.ortSession = session;
    $('modelNote').textContent = T.modelReady;
  } catch (e) {
    $('modelNote').textContent = 'model load failed: ' + (e.message || e);
  }
  ensureModel._loading = false;
}
async function classifyPhoto() {
  const video = $('photoVideo');
  if (!video.videoWidth) return;
  await ensureModel();
  if (!S.ortSession) return;
  $('photoShoot').textContent = T.analyzing;
  try {
    const size = S.modelMeta.inputSize, mean = S.modelMeta.mean, std = S.modelMeta.std;
    const c = document.createElement('canvas'); c.width = size; c.height = size;
    const g = c.getContext('2d');
    const vw = video.videoWidth, vh = video.videoHeight, side = Math.min(vw, vh);
    g.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, size, size);
    const px = g.getImageData(0, 0, size, size).data;
    const n = size * size;
    const data = new Float32Array(3 * n);
    for (let i = 0; i < n; i++) {
      data[i] = (px[i * 4] / 255 - mean[0]) / std[0];
      data[n + i] = (px[i * 4 + 1] / 255 - mean[1]) / std[1];
      data[2 * n + i] = (px[i * 4 + 2] / 255 - mean[2]) / std[2];
    }
    const out = await S.ortSession.run({ image: new ort.Tensor('float32', data, [1, 3, size, size]) });
    const probs = out.probs.data;
    const idx = [...probs.keys()].sort((a, b) => probs[b] - probs[a]).slice(0, 3);
    showGuesses(idx.map(i => ({ label: S.modelMeta.classes[i], prob: probs[i] })));
  } finally {
    $('photoShoot').textContent = T.shoot;
  }
}
function labelToTerm(label) {
  const name = label.includes(':') ? label.split(':').slice(1).join(':') : label;
  return name.replace(/_/g, ' ').trim();
}
function showGuesses(gs) {
  const box = $('guessList');
  box.innerHTML = gs.map((g, i) =>
    `<button data-i="${i}">${esc(labelToTerm(g.label))} · ${Math.round(g.prob * 100)}%</button>`).join('') +
    `<button class="none">${T.notThese}</button>`;
  box.hidden = false; $('photoShoot').hidden = true;
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    box.hidden = true; $('photoShoot').hidden = false;
    if (b.classList.contains('none')) { setView('foods'); $('q').focus(); return; }
    const term = labelToTerm(gs[+b.dataset.i].label).toLowerCase();
    const hit = S.foods.filter(f =>
      (f.en && f.en.toLowerCase().includes(term)) || (f.zh && f.zh.includes(term)))
      .sort((a, b) => (a.source === 'seed' ? 0 : 1) - (b.source === 'seed' ? 0 : 1) || (a.en || '').length - (b.en || '').length)[0];
    if (hit) openSheet({ ...hit, _name: nameOf(hit) });
    else { setView('foods'); $('q').value = term; renderResults(); }
  }));
}

/* ---------- camera: barcode ---------- */
async function startScan() {
  try {
    S.zxReader = new ZXing.BrowserMultiFormatReader();
    const cb = (result) => { if (result) onBarcode(result.getText()); };
    if (typeof S.zxReader.decodeFromConstraints === 'function') {
      await S.zxReader.decodeFromConstraints({ video: { facingMode: 'environment' }, audio: false }, $('scanVideo'), cb);
    } else {
      await S.zxReader.decodeFromVideoDevice(undefined, $('scanVideo'), cb);
    }
  } catch (e) { toast(T.camDenied); $('scanNote').textContent = T.scanNote + ' (' + (e.message || e) + ')'; }
}
let scanBusy = false;
async function onBarcode(code) {
  if (scanBusy || !$('sheet').hidden) return;
  scanBusy = true;
  try {
    const fields = 'product_name,product_name_zh,brands,serving_quantity,nutriments';
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`);
    const j = await res.json();
    const p = j.product;
    const kcal = p && p.nutriments && p.nutriments['energy-kcal_100g'];
    if (j.status !== 1 || typeof kcal !== 'number') { toast(T.notFound); return; }
    const name = (ZH && p.product_name_zh) || p.product_name || code;
    openSheet({
      _name: name + (p.brands ? ` (${p.brands})` : ''),
      kcal, protein: p.nutriments.proteins_100g || 0, fat: p.nutriments.fat_100g || 0,
      carbs: p.nutriments.carbohydrates_100g || 0,
      portion: Number(p.serving_quantity) > 0 ? Number(p.serving_quantity) : 100,
      source: 'off',
    });
  } catch { toast(T.notFound); }
  finally { setTimeout(() => scanBusy = false, 1500); }
}

/* ---------- add sheet ---------- */
function openSheet(f) {
  S.sheetFood = f;
  $('shName').textContent = f._name;
  $('shPer100').textContent = `${Math.round(f.kcal)} ${T.kcal} · ${T.protein} ${r1(f.protein)}g · ${T.fat} ${r1(f.fat)}g · ${T.carbs} ${r1(f.carbs)}g (${T.per100})`;
  $('shGrams').value = f.portion || 100;
  $('shMult').innerHTML = [0.5, 1, 1.5, 2].map(m => `<button data-m="${m}">${m}×</button>`).join('');
  $('shMult').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    $('shGrams').value = Math.round((f.portion || 100) * parseFloat(b.dataset.m)); sheetKcal();
  }));
  sheetKcal();
  $('sheet').hidden = false;
}
function closeSheet() { $('sheet').hidden = true; }
function sheetKcal() {
  const f = S.sheetFood; if (!f) return;
  const g = parseFloat($('shGrams').value) || 0;
  $('shKcal').textContent = Math.round(f.kcal * g / 100) + ' ' + T.kcal;
}

/* ---------- render: today ---------- */
function renderToday() {
  $('dLabel').textContent = fmtDate(S.date);
  const es = S.entries.filter(e => e.date === S.date);
  const tot = es.reduce((a, e) => ({ kcal: a.kcal + e.kcal, protein: a.protein + e.protein, fat: a.fat + e.fat, carbs: a.carbs + e.carbs }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  $('kcalNow').textContent = Math.round(tot.kcal);
  $('kcalTarget').textContent = `${T.of} ${Math.round(S.targets.kcal)} ${T.kcal}`;
  const pct = Math.min(100, tot.kcal / (S.targets.kcal || 1) * 100);
  const bar = $('kcalBar'); bar.style.width = pct + '%'; bar.className = tot.kcal > S.targets.kcal ? 'over' : '';
  const mt = [['pro', T.protein, tot.protein, S.targets.protein], ['fat', T.fat, tot.fat, null], ['carb', T.carbs, tot.carbs, null]];
  $('macroRow').innerHTML = mt.map(([c, l, v, tgt]) => `
    <div class="macro">
      <div class="lbl"><span class="dot" style="background:var(--${c})"></span>${l}</div>
      <div class="val num">${Math.round(v)}g${tgt ? `<span class="muted small"> /${Math.round(tgt)}</span>` : ''}</div>
      ${tgt ? `<div class="bar"><i style="width:${Math.min(100, v / tgt * 100)}%;background:var(--${c})"></i></div>` : ''}
    </div>`).join('');
  $('entryList').innerHTML = es.map(e => `
    <div class="entry">
      <div class="grow"><div class="name">${esc(e.name)}</div>
      <div class="sub num">${Math.round(e.grams)} ${T.grams} · ${Math.round(e.kcal)} ${T.kcal}</div></div>
      <button class="del" data-k="${e._key}">${T.del}</button>
    </div>`).join('');
  $('entryList').querySelectorAll('.del').forEach(b => b.addEventListener('click', () => removeEntry(b.dataset.k)));
  $('quickChips').hidden = es.length > 0;
  drawWeek();
}
function renderQuick() {
  const ids = ['rice-white', 'egg-boiled', 'banana', 'milk-whole', 'ramen', 'kimchi', 'apple', 'chicken-breast'];
  const picks = ids.map(id => S.foods.find(f => f.id === id)).filter(Boolean);
  if (!picks.length) return;
  $('quickChips').innerHTML = `<span class="muted small">${T.quick}</span>` +
    picks.map((f, i) => `<button data-i="${i}">${esc(nameOf(f))}</button>`).join('');
  $('quickChips').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const f = picks[+b.dataset.i]; openSheet({ ...f, _name: nameOf(f) });
  }));
}

/* ---------- render: search ---------- */
function renderResults() {
  const q = ($('q').value || '').trim().toLowerCase();
  const custom = S.custom
    .filter(c => !q || c.name.toLowerCase().includes(q))
    .map(c => ({ ...c, _name: c.name, _custom: true }));
  let rows;
  if (q) {
    rows = S.foods.filter(f =>
      (f.en && f.en.toLowerCase().includes(q)) || (f.zh && f.zh.toLowerCase().includes(q)) ||
      (f.ja && f.ja.toLowerCase().includes(q)) || (f.ko && f.ko.toLowerCase().includes(q)))
      .sort((a, b) => (a.source === 'seed' ? 0 : 1) - (b.source === 'seed' ? 0 : 1) || nameOf(a).length - nameOf(b).length)
      .slice(0, 50);
  } else {
    rows = S.foods.filter(f => f.source === 'seed').slice(0, 30);
  }
  const all = [...custom.slice(0, 10), ...rows.map(f => ({ ...f, _name: nameOf(f) }))];
  $('results').innerHTML = all.length ? all.map((f, i) => `
    <button class="result" data-i="${i}">
      <span><span class="n">${esc(f._name)}</span>${f._custom ? '' : ` <span class="alt">${esc(altOf(f))}</span>`}</span>
      <span class="k num">${Math.round(f.kcal)} ${T.kcal}/100g</span>
    </button>`).join('') : `<p class="muted small" style="margin-top:10px">${T.noResults}</p>`;
  $('results').querySelectorAll('.result').forEach(b => b.addEventListener('click', () => openSheet(all[+b.dataset.i])));
}

/* ---------- charts ---------- */
const NS = 'http://www.w3.org/2000/svg';
function sv(tag, attrs, parent) {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}
function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
const tip = {
  show(text, x, y) { const t = $('tip'); t.textContent = text; t.hidden = false;
    const w = t.offsetWidth; t.style.left = Math.min(innerWidth - w - 8, Math.max(8, x - w / 2)) + 'px'; t.style.top = (y - 44) + 'px'; },
  hide() { $('tip').hidden = true; } };

function drawWeek() {
  const svg = $('weekChart'); svg.innerHTML = '';
  const W = svg.clientWidth || 480, H = 110, padB = 18, padT = 12;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const days = [...Array(7)].map((_, i) => todayISO(i - 6));
  const totals = days.map(d => S.entries.filter(e => e.date === d).reduce((a, e) => a + e.kcal, 0));
  const target = S.targets.kcal || 0;
  const max = Math.max(target, ...totals, 1) * 1.12;
  const bw = Math.min(34, (W - 20) / 7 - 8);
  days.forEach((d, i) => {
    const x = 10 + (W - 20) * (i + 0.5) / 7 - bw / 2;
    const h = Math.max(2, (H - padB - padT) * totals[i] / max);
    const yy = H - padB - h;
    const r = sv('rect', { x, y: yy, width: bw, height: h, rx: 3, fill: css('--accent'), opacity: d === S.date ? 1 : 0.55 }, svg);
    const label = `${d.slice(5)}  ${Math.round(totals[i])} ${T.kcal}`;
    r.addEventListener('pointermove', ev => tip.show(label, ev.clientX, ev.clientY));
    r.addEventListener('pointerleave', () => tip.hide());
    sv('text', { x: x + bw / 2, y: H - 4, 'text-anchor': 'middle', 'font-size': 10, fill: css('--ink2') }, svg)
      .textContent = ZH ? '日一二三四五六'[new Date(d + 'T12:00:00').getDay()] : ['S','M','T','W','T','F','S'][new Date(d + 'T12:00:00').getDay()];
  });
  if (target > 0) {
    const ty = H - padB - (H - padB - padT) * target / max;
    sv('line', { x1: 10, x2: W - 10, y1: ty, y2: ty, stroke: css('--ink2'), 'stroke-dasharray': '4 4', 'stroke-width': 1 }, svg);
    sv('text', { x: W - 10, y: ty - 4, 'text-anchor': 'end', 'font-size': 10, fill: css('--ink2') }, svg)
      .textContent = `${T.goal} ${Math.round(target)}`;
  }
}

function renderWeight() {
  const list = [...S.weights].sort((a, b) => a.date < b.date ? -1 : 1);
  const recent = [...list].reverse().slice(0, 10);
  $('wRecentCard').hidden = recent.length === 0;
  $('wRecent').innerHTML = recent.map(w => `
    <div class="entry"><div class="grow"><span class="name num">${w.weight} kg</span>
      <span class="sub num">${w.muscle ? ` · ${T.legendM} ${w.muscle}kg` : ''}${w.body_fat ? ` · ${w.body_fat}%` : ''}</span></div>
      <span class="muted small num">${w.date.slice(5)}</span></div>`).join('');
  const t = S.weights.find(w => w.date === todayISO());
  if (t) { $('wKg').value = t.weight; if (t.muscle) $('wMus').value = t.muscle; if (t.body_fat) $('wFat').value = t.body_fat; }
  drawWeightChart(list.slice(-60));
}
function drawWeightChart(pts) {
  const svg = $('wChart'); svg.innerHTML = '';
  $('wEmpty').hidden = pts.length > 0;
  $('wLegend').hidden = true;
  if (!pts.length) return;
  const W = svg.clientWidth || 480, H = 200, L = 34, R = 12, Tp = 14, B = 22;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const hasMus = pts.some(p => p.muscle);
  if (hasMus) {
    $('wLegend').hidden = false;
    $('wLegend').innerHTML = `<span><span class="dot" style="background:var(--carb)"></span>${T.legendW}</span>
      <span><span class="dot" style="background:var(--pro)"></span>${T.legendM}</span>`;
  }
  const vals = pts.flatMap(p => [p.weight, p.muscle].filter(v => v > 0));
  if (S.targets.goal) vals.push(S.targets.goal);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = Math.max(0.5, (hi - lo) * 0.15); lo -= pad; hi += pad;
  const x = i => L + (W - L - R) * (pts.length === 1 ? 0.5 : i / (pts.length - 1));
  const y = v => Tp + (H - Tp - B) * (1 - (v - lo) / (hi - lo));
  for (let g = 0; g < 4; g++) {
    const v = lo + (hi - lo) * g / 3, yy = y(v);
    sv('line', { x1: L, x2: W - R, y1: yy, y2: yy, stroke: css('--grid'), 'stroke-width': 1 }, svg);
    sv('text', { x: L - 5, y: yy + 3, 'text-anchor': 'end', 'font-size': 10, fill: css('--ink2') }, svg).textContent = v.toFixed(1);
  }
  if (S.targets.goal) {
    const gy = y(S.targets.goal);
    sv('line', { x1: L, x2: W - R, y1: gy, y2: gy, stroke: css('--ink2'), 'stroke-dasharray': '4 4' }, svg);
    sv('text', { x: W - R, y: gy - 4, 'text-anchor': 'end', 'font-size': 10, fill: css('--ink2') }, svg)
      .textContent = `${T.goal} ${S.targets.goal}`;
  }
  const line = (get, color) => {
    sv('path', { d: pts.map((pt, i) => get(pt) != null ? `${i === 0 || get(pts[i - 1]) == null ? 'M' : 'L'}${x(i)},${y(get(pt))}` : '').join(''),
      fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
  };
  line(p => p.weight, css('--carb'));
  if (hasMus) line(p => p.muscle ?? null, css('--pro'));
  const last = pts[pts.length - 1];
  sv('circle', { cx: x(pts.length - 1), cy: y(last.weight), r: 4, fill: css('--carb'), stroke: css('--card'), 'stroke-width': 2 }, svg);
  sv('text', { x: Math.min(x(pts.length - 1), W - R - 4), y: y(last.weight) - 8, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: css('--ink') }, svg)
    .textContent = last.weight + 'kg';
  const cross = sv('line', { y1: Tp, y2: H - B, stroke: css('--ink2'), 'stroke-width': 1, opacity: 0 }, svg);
  const hit = sv('rect', { x: L, y: 0, width: W - L - R, height: H, fill: 'transparent' }, svg);
  hit.addEventListener('pointermove', ev => {
    const r = svg.getBoundingClientRect();
    const px = (ev.clientX - r.left) * (W / r.width);
    let best = 0, bd = 1e9;
    pts.forEach((_, i) => { const d = Math.abs(x(i) - px); if (d < bd) { bd = d; best = i; } });
    cross.setAttribute('x1', x(best)); cross.setAttribute('x2', x(best)); cross.setAttribute('opacity', 0.4);
    const p = pts[best];
    tip.show(`${p.date.slice(5)}  ${p.weight}kg${p.muscle ? `  ${T.legendM} ${p.muscle}kg` : ''}${p.body_fat ? `  ${p.body_fat}%` : ''}`, ev.clientX, ev.clientY);
  });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('opacity', 0); tip.hide(); });
}
addEventListener('resize', () => { drawWeek(); renderWeight(); });
