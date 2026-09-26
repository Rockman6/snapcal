'use strict';
/* SnapCal — GitHub Pages + Supabase + in-browser model.
   Storage: Supabase (email/password login). With no config.js values it
   falls back to this-browser-only localStorage so the site still demos. */

/* ---------- i18n ---------- */
const ZH = (navigator.language || 'en').toLowerCase().startsWith('zh');
const T = ZH ? {
  today:'今天', photo:'拍照', scan:'扫码', weight:'身体', foods:'食物', settings:'设置',
  kcal:'千卡', of:'/ 目标', protein:'蛋白质', fat:'脂肪', carbs:'碳水',
  meals:'今日记录', addFood:'＋ 添加食物', quick:'快速添加：',
  week:'近 7 天摄入（千卡）', grams:'克', per100:'每100克', add:'添加', cancel:'取消',
  search:'搜索食物（中文 / English / 日本語 / 한국어）…',
  wTitle:'今日身体数据', wKg:'体重 (kg) ＊必填', wMus:'肌肉量 (kg)', wFatPct:'体脂率 (%)', save:'保存', wMore:'更多身体成分（可选）', needHeight:'请先在设置中填写身高', needWeight:'请填写体重',
  pTitle:'个人资料', pSex:'性别', pSexM:'男', pSexF:'女', pDob:'出生日期', pHeight:'身高 (cm) ＊必填', pAge:'年龄',
  wChart:'体重趋势（近 60 天）', wEmpty:'还没有记录。今天记录第一条吧。', wRecent:'最近记录',
  legendW:'体重', legendM:'肌肉量', goal:'目标',
  sTitle:'每日目标', sKcal:'热量目标（千卡）', sPro:'蛋白质目标（克）', sGoal:'目标体重 (kg)',
  cfTitle:'＋ 自定义食物', cfName:'名称', cfPor:'常见份量（克）',
  saved:'已保存', added:'已添加', deleted:'已删除', del:'删除',
  online:'✓ 数据保存在你自己的 Supabase 数据库。', local:'⚠ 未配置 Supabase——数据仅保存在此浏览器。',
  login:'登录', register:'注册', loginHint:'登录后你的数据会在线保存，任何设备可访问。', logout:'退出登录', badLogin:'邮箱或密码不正确。',
  toReg:'新用户？点这里注册', toLogin:'已有账号？点这里登录', welcome:'邮箱已确认，欢迎使用 SnapCal！',
  sgTitle:'下一餐建议', sgBtn:'换一批', sgRemain:'今日剩余', sgDone:'今天的目标已完成 🎉', sgP:'蛋白质', checkEmail:'注册成功——请到邮箱点击确认链接后再登录。', regFail:'注册失败：',
  photoHint:'拍摄你的餐食', shoot:'拍照识别', analyzing:'识别中…', notThese:'都不是——去搜索',
  modelIdle:'首次使用会下载识别模型（约 33MB），之后缓存在本地。', modelLoading:'正在加载模型…',
  modelReady:'模型已就绪——在设备上离线识别，照片不会上传。', camDenied:'需要相机权限。请在浏览器设置中允许。',
  scanHint:'将条形码对准相机', scanNote:'扫码后自动查询 Open Food Facts。', notFound:'未找到该商品，请用搜索添加。',
  noResults:'没有找到，试试别的关键词，或添加自定义食物。', online:'🌐 在线查找并学习',
  onlineBusy:'在线查找中…', onlineNone:'在线没有找到。', learned:'已学习并存入公共数据库 ✓',
  ai:'🧠 本地 AI 估算', aiLoad:'首次使用需下载本地 AI 模型（约 1GB，只下载一次，永久缓存）', aiBusy:'AI 思考中…', aiNoGpu:'此浏览器不支持 WebGPU，无法运行本地 AI（试试较新的 iPhone/Chrome/Safari）', aiTag:'AI 估算·仅供参考',
} : {
  today:'Today', photo:'Photo', scan:'Scan', weight:'Body', foods:'Foods', settings:'Settings',
  kcal:'kcal', of:'/ target', protein:'Protein', fat:'Fat', carbs:'Carbs',
  meals:'Logged today', addFood:'＋ Add food', quick:'Quick add:',
  week:'Last 7 days (kcal)', grams:'g', per100:'per 100 g', add:'Add', cancel:'Cancel',
  search:'Search foods (English / 中文 / 日本語 / 한국어)…',
  wTitle:'Today’s body stats', wKg:'Weight (kg) ＊required', wMus:'Muscle mass (kg)', wFatPct:'Body fat (%)', save:'Save', wMore:'More body composition (optional)', needHeight:'Set your height in Settings first', needWeight:'Weight is required',
  pTitle:'Profile', pSex:'Sex', pSexM:'Male', pSexF:'Female', pDob:'Date of birth', pHeight:'Height (cm) ＊required', pAge:'Age',
  wChart:'Weight trend (last 60 days)', wEmpty:'No records yet — log your first one today.', wRecent:'Recent',
  legendW:'Weight', legendM:'Muscle', goal:'goal',
  sTitle:'Daily targets', sKcal:'Calorie target (kcal)', sPro:'Protein target (g)', sGoal:'Goal weight (kg)',
  cfTitle:'＋ Custom food', cfName:'Name', cfPor:'Typical portion (g)',
  saved:'Saved', added:'Added', deleted:'Deleted', del:'Delete',
  online:'✓ Data lives in your own Supabase database.', local:'⚠ Supabase not configured — data stays in this browser only.',
  login:'Sign in', register:'Create account', loginHint:'Sign in and your data is stored online, reachable from any device.', logout:'Sign out', badLogin:'Wrong email or password.',
  toReg:'New here? Create an account', toLogin:'Have an account? Sign in', welcome:'Email confirmed — welcome to SnapCal!',
  sgTitle:'Next-meal ideas', sgBtn:'Shuffle', sgRemain:'Remaining today', sgDone:'Targets met for today 🎉', sgP:'protein', checkEmail:'Account created — click the confirmation link in your email, then sign in.', regFail:'Sign-up failed: ',
  photoHint:'Photograph your meal', shoot:'Identify', analyzing:'Analyzing…', notThese:'None of these — search instead',
  modelIdle:'First use downloads the recognition model (~33 MB); it is cached after that.', modelLoading:'Loading model…',
  modelReady:'Model ready — runs on your device, photos never leave it.', camDenied:'Camera permission needed — allow it in your browser settings.',
  scanHint:'Point the camera at a barcode', scanNote:'Barcodes are looked up in Open Food Facts.', notFound:'Product not found — add it via search.',
  noResults:'No match — try another word, or add a custom food.', online:'🌐 Search online & learn it',
  onlineBusy:'Searching online…', onlineNone:'Nothing found online.', learned:'Learned & saved to the shared database ✓',
  ai:'🧠 Local AI estimate', aiLoad:'First use downloads the local AI model (~1 GB, once, cached forever)', aiBusy:'AI thinking…', aiNoGpu:'This browser lacks WebGPU — local AI unavailable (try a recent iPhone/Chrome/Safari)', aiTag:'AI estimate · approximate',
};

/* ---------- body-composition metrics (all optional, saved as JSON) ---------- */
const METRICS = [
  { k:'fat_kg',    zh:'体脂肪 (kg)',     en:'Body fat mass (kg)' },
  { k:'ffm_kg',    zh:'去脂体重 (kg)',   en:'Fat-free mass (kg)' },
  { k:'skm_kg',    zh:'骨骼肌 (kg)',     en:'Skeletal muscle (kg)' },
  { k:'protein_kg',zh:'蛋白质 (kg)',     en:'Protein (kg)' },
  { k:'water_kg',  zh:'总水分 (kg)',     en:'Total body water (kg)' },
  { k:'mineral_kg',zh:'无机盐 (kg)',     en:'Minerals (kg)' },
  { k:'icw_kg',    zh:'细胞内液 (kg)',   en:'Intracellular fluid (kg)' },
  { k:'ecw_kg',    zh:'细胞外液 (kg)',   en:'Extracellular fluid (kg)' },
  { k:'bmr_kcal',  zh:'基础代谢 (kcal/d)', en:'BMR (kcal/d)' },
  { k:'whr',       zh:'腰臀比',          en:'Waist-hip ratio' },
  { k:'visceral',  zh:'内脏脂肪等级',    en:'Visceral fat level' },
  { k:'seg_fat_ra', zh:'脂肪·右上肢 (kg)', en:'Fat · right arm (kg)' },
  { k:'seg_fat_la', zh:'脂肪·左上肢 (kg)', en:'Fat · left arm (kg)' },
  { k:'seg_fat_tr', zh:'脂肪·躯干 (kg)',   en:'Fat · trunk (kg)' },
  { k:'seg_fat_rl', zh:'脂肪·右下肢 (kg)', en:'Fat · right leg (kg)' },
  { k:'seg_fat_ll', zh:'脂肪·左下肢 (kg)', en:'Fat · left leg (kg)' },
  { k:'seg_mus_ra', zh:'肌肉·右上肢 (kg)', en:'Muscle · right arm (kg)' },
  { k:'seg_mus_la', zh:'肌肉·左上肢 (kg)', en:'Muscle · left arm (kg)' },
  { k:'seg_mus_tr', zh:'肌肉·躯干 (kg)',   en:'Muscle · trunk (kg)' },
  { k:'seg_mus_rl', zh:'肌肉·右下肢 (kg)', en:'Muscle · right leg (kg)' },
  { k:'seg_mus_ll', zh:'肌肉·左下肢 (kg)', en:'Muscle · left leg (kg)' },
];

/* ---------- state & utils ---------- */
const S = {
  foods: [], custom: [], learned: [], entries: [], weights: [],
  targets: { kcal: 2000, protein: 120, goal: null },
  profile: { sex: null, dob: null, height_cm: null },
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
function lsSave() { try { localStorage.setItem(LS_KEY, JSON.stringify({ entries: S.entries, weights: S.weights, custom: S.custom, targets: S.targets, profile: S.profile, learned: S.learned })); } catch {} }
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
    if (l.profile) S.profile = l.profile;
    S.learned = l.learned || [];
    return;
  }
  const sb = S.sb;
  const [e, w, c, t, p, ln] = await Promise.all([
    sb.from('entries').select('*').eq('deleted', false).order('created_at', { ascending: false }).limit(2000),
    sb.from('weights').select('*').order('date', { ascending: false }).limit(400),
    sb.from('foods_custom').select('*').order('id', { ascending: false }).limit(500),
    sb.from('settings').select('*').maybeSingle(),
    sb.from('profiles').select('*').maybeSingle(),
    sb.from('foods_learned').select('*').order('id', { ascending: false }).limit(1000),
  ]);
  S.entries = (e.data || []).map(r => ({ ...r, _key: r.device_id + '/' + r.local_id }));
  S.weights = w.data || [];
  S.custom = c.data || [];
  if (t.data) S.targets = { kcal: t.data.kcal ?? 2000, protein: t.data.protein ?? 120, goal: t.data.goal };
  if (p.data) S.profile = p.data;
  S.learned = ln.data || [];
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
async function saveProfile() {
  if (LOCAL) { lsSave(); }
  else {
    const { error } = await S.sb.from('profiles').upsert({ ...S.profile }, { onConflict: 'user_id' });
    if (error) return toast(error.message);
  }
  toast(T.saved); paintProfile(); paintBmi();
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
  paintProfile();
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
  $('sgTitle').textContent = T.sgTitle; $('sgBtn').textContent = T.sgBtn;
  $('sgBtn').addEventListener('click', () => renderSuggest(true));
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
  $('wMoreTitle').textContent = T.wMore;
  $('wExtra').innerHTML = METRICS.map(m =>
    `<div class="field"><label>${ZH ? m.zh : m.en}</label><input id="mx_${m.k}" type="number" step="0.01" inputmode="decimal" placeholder="—"></div>`).join('');
  $('wKg').addEventListener('input', paintBmi);
  $('wSave').addEventListener('click', () => {
    const kg = parseFloat($('wKg').value);
    if (!(kg > 0)) { toast(T.needWeight); return; }
    if (!(S.profile.height_cm > 0)) { toast(T.needHeight); setView('settings'); return; }
    const w = { date: todayISO(), weight: kg, created_at: Date.now() };
    const m = parseFloat($('wMus').value); if (m > 0) w.muscle = m;
    const f = parseFloat($('wFat').value); if (f > 0) w.body_fat = f;
    const metrics = {};
    for (const mc of METRICS) {
      const v = parseFloat($('mx_' + mc.k).value);
      if (v > 0) metrics[mc.k] = v;
    }
    const hM = S.profile.height_cm / 100;
    metrics.bmi = Math.round(kg / (hM * hM) * 10) / 10;
    w.metrics = metrics;
    saveWeight(w);
  });
  // profile card
  $('pTitle').textContent = T.pTitle; $('pSexL').textContent = T.pSex;
  $('pSexM').textContent = T.pSexM; $('pSexF').textContent = T.pSexF;
  $('pDobL').textContent = T.pDob; $('pHeightL').textContent = T.pHeight;
  $('pSave').textContent = T.save;
  $('pDob').addEventListener('change', paintAge);
  $('pSave').addEventListener('click', () => {
    const h = parseFloat($('pHeight').value);
    if (!(h > 0)) { toast(T.needHeight); return; }
    S.profile = { ...S.profile, sex: $('pSex').value || null, dob: $('pDob').value || null, height_cm: h };
    saveProfile();
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
function paintProfile() {
  $('pSex').value = S.profile.sex || '';
  $('pDob').value = S.profile.dob || '';
  $('pHeight').value = S.profile.height_cm || '';
  paintAge(); paintBmi();
}
function paintAge() {
  const dob = $('pDob').value || S.profile.dob;
  if (!dob) { $('pAge').hidden = true; return; }
  const b = new Date(dob), now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--;
  $('pAge').hidden = false;
  $('pAge').textContent = `${T.pAge}: ${age}`;
}
function paintBmi() {
  const kg = parseFloat($('wKg').value);
  const h = (S.profile.height_cm || 0) / 100;
  if (kg > 0 && h > 0) {
    $('bmiLine').hidden = false;
    $('bmiLine').textContent = 'BMI ' + (Math.round(kg / (h * h) * 10) / 10);
  } else $('bmiLine').hidden = true;
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
    const meta = await fetch('model/model-meta.json', { cache: 'no-cache' }).then(r => r.json());
    // Permanent storage: the 38MB model lives in Cache Storage under its version;
    // it re-downloads ONLY when model-meta.json announces a new version.
    const key = 'model/food.onnx?v=' + (meta.version || '0');
    let buf = null;
    try {
      const cache = await caches.open('snapcal-model');
      let hit = await cache.match(key);
      if (!hit) {
        for (const k of await cache.keys()) await cache.delete(k); // drop old versions
        const res = await fetch('model/food.onnx');
        if (res.ok) { await cache.put(key, res.clone()); hit = res; }
      }
      if (hit) buf = await hit.arrayBuffer();
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    } catch {}
    const session = buf
      ? await ort.InferenceSession.create(buf, { executionProviders: ['wasm'] })
      : await ort.InferenceSession.create('model/food.onnx', { executionProviders: ['wasm'] });
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
  let name = label.includes(':') ? label.split(':').slice(1).join(':') : label;
  name = name.replace(/_/g, ' ').trim();
  // "重庆酸辣粉 (Chongqing Hot and Sour Rice Noodles)" -> primary half for search
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? m[1].trim() : name;
}
function labelTerms(label) {
  let name = label.includes(':') ? label.split(':').slice(1).join(':') : label;
  name = name.replace(/_/g, ' ').trim();
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? [m[1].trim(), m[2].trim()] : [name];
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
    const terms = labelTerms(gs[+b.dataset.i].label).map(t => t.toLowerCase());
    let hit = null;
    for (const term of terms) {
      hit = S.foods.filter(f =>
        (f.en && f.en.toLowerCase().includes(term)) || (f.zh && f.zh.includes(term)) ||
        (f.ja && f.ja.toLowerCase().includes(term)) || (f.ko && f.ko.includes(term)))
        .sort((a, b) => (a.source === 'seed' ? 0 : 1) - (b.source === 'seed' ? 0 : 1) || nameOf(a).length - nameOf(b).length)[0];
      if (hit) break;
    }
    if (!hit) { // fuzzy pass over both halves
      let best = null;
      for (const term of terms) {
        for (const f of S.foods) {
          const s = Math.max(fuzzy(f.en, term), fuzzy(f.zh, term), fuzzy(f.ja, term), fuzzy(f.ko, term));
          if (s > 0.55 && (!best || s > best.s)) best = { f, s };
        }
      }
      if (best) hit = best.f;
    }
    if (hit) openSheet({ ...hit, _name: nameOf(hit) });
    else { setView('foods'); $('q').value = terms[0]; renderResults(); }
  }));
}

/* ---------- camera: barcode ---------- */
async function startScan() {
  loadCnPack();
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
// Worldwide barcode pack: millions of OFF products, sharded by 4-digit barcode
// prefix — one ~30 KB fetch per prefix, then cached for the session.
const bcShards = {};
async function bcLookup(code) {
  const prefix = String(code).slice(0, 4);
  if (!/^[0-9]{4}$/.test(prefix)) return null;
  if (!(prefix in bcShards)) {
    try {
      const r = await fetch('bc/' + prefix + '.json');
      bcShards[prefix] = r.ok ? await r.json() : {};
    } catch { bcShards[prefix] = {}; }
  }
  return bcShards[prefix][code] || null;
}
let cnPack = null;
async function loadCnPack() {
  if (cnPack !== null) return;
  try { cnPack = await fetch('barcodes-cn.json').then(r => r.json()); }
  catch { cnPack = {}; }
}
let scanBusy = false;
async function onBarcode(code) {
  if (scanBusy || !$('sheet').hidden) return;
  scanBusy = true;
  try {
    const local = (await bcLookup(code)) || (cnPack && cnPack[code]);
    if (local) {
      const [name, kcal, pro, fat, carbs, serving] = local;
      openSheet({ _name: name, kcal, protein: pro, fat, carbs,
        portion: serving > 0 ? serving : 100, source: 'cnpack' });
      return;
    }
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
  renderSuggest(false);
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

/* ---------- next-meal suggestions (rule-based v1; LLM version later) ---------- */
let sgShuffle = 0;
function renderSuggest(shuffle) {
  if (shuffle) sgShuffle++;
  const es = S.entries.filter(e => e.date === S.date);
  const eaten = es.reduce((a, e) => ({ kcal: a.kcal + e.kcal, protein: a.protein + e.protein }), { kcal: 0, protein: 0 });
  const remK = Math.round((S.targets.kcal || 2000) - eaten.kcal);
  const remP = Math.round((S.targets.protein || 0) - eaten.protein);
  $('sgRemain').textContent = `${T.sgRemain}: ${Math.max(0, remK)} ${T.kcal} · ${T.sgP} ${Math.max(0, remP)}g`;
  const list = $('sgList');
  if (remK <= 80) { list.innerHTML = `<p class="muted small">${T.sgDone}</p>`; return; }
  // candidate pool: curated foods with sane portions + the user's own most-logged names
  const pool = S.foods.filter(f => f.source === 'seed' && f.portion >= 30);
  const freq = {};
  for (const e of S.entries) freq[e.name] = (freq[e.name] || 0) + 1;
  const scored = pool.map(f => {
    // scale the typical portion to fit what's left, between 0.5x and 1.5x
    let scale = Math.min(1.5, Math.max(0.5, (remK * 0.6) / (f.kcal * f.portion / 100)));
    const grams = Math.round(f.portion * scale / 10) * 10;
    const kcal = f.kcal * grams / 100, pro = (f.protein || 0) * grams / 100;
    if (kcal > remK * 1.05) return null;
    const needP = remP > 10;
    let score = kcal / remK; // fill what's left
    score += needP ? Math.min(1.2, pro / Math.max(remP, 1)) * 1.2 : 0;
    score += freq[nameOf(f)] ? 0.35 : 0; // familiar foods first
    score += (hash(f.id + ':' + sgShuffle) % 100) / 260; // shuffle variety
    return { f, grams, kcal, pro, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
  const picks = [];
  for (const s of scored) {
    if (picks.length >= 3) break;
    if (picks.some(p => p.f.id.split('-')[0] === s.f.id.split('-')[0] && Math.abs(p.kcal - s.kcal) < 60)) continue;
    picks.push(s);
  }
  list.innerHTML = picks.map((p, i) => `
    <button class="result" data-i="${i}">
      <span><span class="n">${esc(nameOf(p.f))}</span> <span class="alt num">${p.grams}${T.grams}</span></span>
      <span class="k num">${Math.round(p.kcal)} ${T.kcal} · ${Math.round(p.pro)}g ${T.sgP}</span>
    </button>`).join('');
  list.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const p = picks[+b.dataset.i];
    openSheet({ ...p.f, _name: nameOf(p.f), portion: p.grams });
  }));
}
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

/* ---------- fuzzy matching (typo tolerance, works for CJK via char bigrams) ---------- */
function bigrams(s) {
  const out = new Set();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}
function fuzzy(name, q) {
  if (!name || !q) return 0;
  const n = String(name).toLowerCase();
  if (n.includes(q)) return 1 - Math.min(0.3, n.length / 400); // substring is king
  if (q.length < 3) return 0;
  const a = bigrams(n), b = bigrams(q);
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const g of b) if (a.has(g)) inter++;
  return (2 * inter) / (a.size + b.size); // Dice coefficient
}

/* ---------- online food lookup (USDA FoodData Central + Open Food Facts) ---------- */
async function onlineLookup(q) {
  const found = [];
  try { // USDA generic foods (English)
    const r = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&pageSize=6&dataType=Foundation,SR%20Legacy,Survey%20(FNDDS)&query=${encodeURIComponent(q)}`);
    if (r.ok) {
      const j = await r.json();
      for (const f of j.foods || []) {
        const nut = {};
        for (const n of f.foodNutrients || []) nut[n.nutrientNumber || n.nutrientId] = n.value;
        const kcal = nut['208'] ?? nut[1008];
        if (typeof kcal === 'number') {
          found.push({ name: (f.description || q).toLowerCase(), kcal,
            protein: nut['203'] ?? nut[1003] ?? 0, fat: nut['204'] ?? nut[1004] ?? 0,
            carbs: nut['205'] ?? nut[1005] ?? 0, portion: 100, origin: 'usda' });
        }
      }
    }
  } catch {}
  if (found.length < 3) {
    try { // Open Food Facts products (any language)
      const r = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=6&fields=product_name,nutriments,serving_quantity`);
      if (r.ok) {
        const j = await r.json();
        for (const p of j.products || []) {
          const kcal = p.nutriments && p.nutriments['energy-kcal_100g'];
          if (typeof kcal === 'number' && p.product_name) {
            found.push({ name: p.product_name, kcal,
              protein: p.nutriments.proteins_100g || 0, fat: p.nutriments.fat_100g || 0,
              carbs: p.nutriments.carbohydrates_100g || 0,
              portion: Number(p.serving_quantity) > 0 ? Number(p.serving_quantity) : 100, origin: 'off' });
          }
        }
      }
    } catch {}
  }
  return found.slice(0, 5);
}
async function learnFood(f) {
  const dup = S.learned.find(x => x.name.toLowerCase() === f.name.toLowerCase());
  if (dup) return;
  const row = { name: f.name, kcal: f.kcal, protein: f.protein, fat: f.fat, carbs: f.carbs,
    portion: f.portion, origin: f.origin, created_at: Date.now() };
  if (LOCAL) { S.learned.unshift(row); lsSave(); }
  else {
    const { error } = await S.sb.from('foods_learned').insert(row);
    if (error) { toast(error.message); return; }
    S.learned.unshift(row);
  }
  toast(T.learned);
}

/* ---------- local browser LLM (WebLLM · Qwen2.5-1.5B · WebGPU) ---------- */
let llmEngine = null, llmLoading = null;
async function ensureLLM(onProgress) {
  if (llmEngine) return llmEngine;
  if (!navigator.gpu) throw new Error(T.aiNoGpu);
  if (!llmLoading) {
    llmLoading = (async () => {
      const webllm = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/+esm');
      const engine = await webllm.CreateMLCEngine('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', {
        initProgressCallback: (p) => onProgress && onProgress(p.text || ''),
      });
      llmEngine = engine;
      return engine;
    })();
  }
  return llmLoading;
}
async function aiEstimate(q) {
  const engine = await ensureLLM((t) => { const b = $('goAI'); if (b) b.textContent = T.aiBusy + ' ' + t.slice(0, 40); });
  const reply = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a nutrition database. Answer ONLY with one compact JSON object, no prose.' },
      { role: 'user', content: `Food or drink: "${q}". Give typical values per 100 g (or 100 ml for drinks) and a typical single-serving size in grams. JSON keys exactly: kcal, protein, fat, carbs, portion.` },
    ],
    temperature: 0,
    max_tokens: 120,
  });
  const text = reply.choices[0].message.content;
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no json');
  const j = JSON.parse(m[0]);
  const kcal = parseFloat(j.kcal);
  if (!(kcal >= 0 && kcal < 950)) throw new Error('bad estimate');
  return { name: q, kcal, protein: parseFloat(j.protein) || 0, fat: parseFloat(j.fat) || 0,
    carbs: parseFloat(j.carbs) || 0, portion: parseFloat(j.portion) > 0 ? parseFloat(j.portion) : 100, origin: 'ai' };
}

/* ---------- render: search ---------- */
function renderResults() {
  const q = ($('q').value || '').trim().toLowerCase();
  const mine = [...S.custom, ...S.learned]
    .filter(c => !q || c.name.toLowerCase().includes(q) || fuzzy(c.name, q) > 0.5)
    .map(c => ({ ...c, _name: c.name, _custom: true }));
  let rows;
  if (q) {
    // typo-tolerant: substring first; if thin, fall back to fuzzy over every name
    rows = S.foods
      .map(f => ({ f, s: Math.max(fuzzy(f.en, q), fuzzy(f.zh, q), fuzzy(f.ja, q), fuzzy(f.ko, q)) }))
      .filter(x => x.s > 0.45)
      .sort((a, b) => b.s - a.s ||
        (a.f.source === 'seed' ? 0 : 1) - (b.f.source === 'seed' ? 0 : 1) ||
        nameOf(a.f).length - nameOf(b.f).length)
      .slice(0, 50).map(x => x.f);
  } else {
    rows = S.foods.filter(f => f.source === 'seed').slice(0, 30);
  }
  const all = [...mine.slice(0, 10), ...rows.map(f => ({ ...f, _name: nameOf(f) }))];
  let html = all.map((f, i) => `
    <button class="result" data-i="${i}">
      <span><span class="n">${esc(f._name)}</span>${f._custom ? '' : ` <span class="alt">${esc(altOf(f))}</span>`}</span>
      <span class="k num">${Math.round(f.kcal)} ${T.kcal}/100g</span>
    </button>`).join('');
  if (!all.length) html = `<p class="muted small" style="margin-top:10px">${T.noResults}</p>`;
  if (q.length >= 3 && all.length < 4) {
    html += `<button class="primary" id="goOnline" style="margin-top:10px">${T.online}</button>
      <button class="primary" id="goAI" style="margin-top:8px;background:var(--chip);color:var(--ink)">${T.ai}</button>
      <p class="muted small" id="aiHint">${T.aiLoad}</p><div id="onlineBox"></div>`;
  }
  $('results').innerHTML = html;
  $('results').querySelectorAll('.result').forEach(b => b.addEventListener('click', () => openSheet(all[+b.dataset.i])));
  const goAI = $('goAI');
  if (goAI) goAI.addEventListener('click', async () => {
    goAI.disabled = true; goAI.textContent = T.aiBusy;
    try {
      const h = await aiEstimate(q);
      const box = $('onlineBox');
      box.innerHTML = `<button class="result" id="aiPick">
        <span><span class="n">${esc(h.name)}</span> <span class="alt">${T.aiTag}</span></span>
        <span class="k num">${Math.round(h.kcal)} ${T.kcal}/100g</span></button>` + box.innerHTML;
      $('aiPick').addEventListener('click', async () => {
        await learnFood(h);
        openSheet({ ...h, _name: h.name, source: 'ai' });
        renderResults();
      });
      goAI.hidden = true; const hint = $('aiHint'); if (hint) hint.hidden = true;
    } catch (e) {
      goAI.textContent = (e && e.message) ? e.message.slice(0, 80) : 'AI error';
    }
  });
  const go = $('goOnline');
  if (go) go.addEventListener('click', async () => {
    go.disabled = true; go.textContent = T.onlineBusy;
    const hits = await onlineLookup(q);
    go.hidden = true;
    const box = $('onlineBox');
    if (!hits.length) { box.innerHTML = `<p class="muted small" style="margin-top:8px">${T.onlineNone}</p>`; return; }
    box.innerHTML = hits.map((h, i) => `
      <button class="result" data-i="${i}">
        <span><span class="n">${esc(h.name)}</span> <span class="alt">${h.origin}</span></span>
        <span class="k num">${Math.round(h.kcal)} ${T.kcal}/100g</span>
      </button>`).join('');
    box.querySelectorAll('.result').forEach(b => b.addEventListener('click', async () => {
      const h = hits[+b.dataset.i];
      await learnFood(h);
      openSheet({ ...h, _name: h.name, source: 'learned' });
      renderResults();
    }));
  });
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
