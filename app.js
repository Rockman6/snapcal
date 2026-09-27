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
  storedOnline:'✓ 数据保存在你自己的 Supabase 数据库。', local:'⚠ 未配置 Supabase——数据仅保存在此浏览器。',
  login:'登录', register:'注册', loginHint:'登录后你的数据会在线保存，任何设备可访问。', logout:'退出登录', badLogin:'邮箱或密码不正确。',
  toReg:'新用户？点这里注册', toLogin:'已有账号？点这里登录', welcome:'邮箱已确认，欢迎使用 SnapCal！',
  sgTitle:'下一餐建议', sgBtn:'换一批', sgRemain:'今日剩余', sgDone:'今天的目标已完成 🎉', sgP:'蛋白质',
  eb:'能量收支', ebIn:'摄入', ebOut:'消耗', ebNet:'净值', ebEst:'消耗 = 基础代谢(按资料估算)＋手表活动', ebNoW:'（还没有手表数据——见 Apple Watch 接入指南）', ebSteps:'步数', ebSleep:'睡眠', ebRhr:'静息心率', checkEmail:'注册成功——请到邮箱点击确认链接后再登录。', regFail:'注册失败：',
  photoHint:'拍摄你的餐食', shoot:'拍照识别', analyzing:'识别中…', notThese:'都不是——去搜索',
  modelIdle:'首次使用会下载识别模型（约 38MB），之后缓存在本地。', modelLoading:'正在加载模型…',
  pick:'📁 从相册选一张照片', vlmIntroTitle:'智能识别（推荐开启）',
  vlmIntroText:'视觉 AI 会像人一样看照片：找出每一样食物、数清个数、估算克数，热量再按营养数据库计算。在服务器上运行（第三方 AI：智谱 GLM 或 Google Gemini），手机不用下载模型、不耗电。照片仅用于识别，SnapCal 不保存；免费版服务商可能会用提交内容改进模型。',
  vlmEnable:'开启智能识别', vlmLoading:'正在加载视觉 AI…', vlmReady:'智能识别已就绪 · 照片不会离开你的设备',
  vlmDl:'正在下载视觉 AI：{p}%（{l}/{t} MB）· 仅此一次', vlmThinking:'AI 正在仔细看这张照片…',
  vlmFail:'AI 没能给出清楚的结果——可以换个角度再拍，或用搜索添加。', quickGuess:'快速分类器猜测', meal:'这一餐',
  matched:'数据库', aiKcal:'AI 估算热量', noMatch:'数据库里没有——可改名或删除', total:'合计', noItems:'没有识别到食物',
  plateLog:'记录这一餐 · {k} 千卡', plateAdd:'漏了什么？输入名称添加（如：酸奶）',
  wkTitle:'📊 近 7 天', wkKcal:'平均热量', wkPro:'平均蛋白质', wkOn:'达标天数', wkWeight:'体重变化', wkWater:'平均饮水',
  wkNa:'平均钠', wkSleep:'平均睡眠', wkNoData:'记录几天后这里会出现你的每周总结。', wkCoach:'🧠 AI 教练点评', wkCoachBusy:'AI 教练思考中…',
  tdee:'实测维持热量：约 {t} 千卡/天（基于 {d} 天饮食记录、{w} 次称重）', tdeeNeed:'再记录 {d} 天饮食、称重 {w} 次（跨度 ≥10 天），即可算出你真实的维持热量。',
  tdeeUse:'把目标设为 {t} 千卡（{why}）', whyCut:'减脂：维持热量 −500', whyGain:'增重：维持热量 +250', whyKeep:'维持体重',
  sEat:'运动消耗是否加回热量目标', sEat0:'不加', sEat50:'加一半', sEat100:'全部加回', wFromHealth:'{h} 毫升来自 Apple 健康', ebWorkout:'运动',
  dataTitle:'你的数据', exportJson:'⬇️ 下载我的全部数据（JSON）', exportCsv:'⬇️ 下载饮食记录（CSV，可用 Excel 打开）', delOpen:'删除我的账户…',
  delWarn:'这会永久删除你的全部记录和账户，无法恢复。你贡献到公共食物库和条码库的条目会保留（不含个人信息）。输入 DELETE 确认：',
  delGo:'永久删除账户', delDone:'账户已删除', delFail:'删除失败，请稍后再试',
  sodium:'钠', sugar:'糖', usual:'你的常用份量', readLabel:'📷 拍营养成分表读取', labelBusy:'正在读取营养成分表…',
  labelFail:'没读出能量数值——请拍清楚整个营养成分表', labelFood:'扫描的标签', teachLabel:'📷 拍营养成分表自动填写',
  readScale:'📷 从体脂秤截图读取（可多选）', scaleBusy:'正在读取第 {i}/{n} 张截图…', scaleDone:'已填入 {n} 项——核对无误后点保存',
  scaleNone:'没有读到数据——请用体脂秤 App 的原始截图', naLimit:'钠 · 上限 2000 毫克', sugarLimit:'糖 · 建议 ≤50 克',
  water:'💧 饮水', w250:'＋250 毫升 · 一杯', w500:'＋500 毫升 · 一瓶', wCustom:'自定义', wUndo:'撤销上一次',
  wFromDrinks:'其中 {d} 毫升来自饮品', wLeft:'还差 {r} 毫升', wDone:'今日饮水目标已完成 🎉', wName:'水', wAdded:'已记录 💧',
  sWater:'饮水目标（毫升，留空 = 按体重自动）', mealsHint:'点一条记录可修改或删除',
  edTitle:'修改这条记录', edName:'名称', edGrams:'克数（会按比例换算热量）', edKcal:'热量（千卡）', edDate:'日期',
  edSave:'保存修改', edDelete:'删除这条记录', edConfirm:'再点一次确认删除', edit:'修改',
  sVlmCloud:'智能 · 云端（推荐，手机不耗电）', cloudReady:'智能识别（云端）已就绪 · 手机无需下载模型',
  cloudNeedsLogin:'云端识别需要先登录', cloudLimit:'今天的云端识别次数已用完，明天再来（或在设置里改用本地模式）', cloudBusy:'云端 AI 暂时繁忙，请稍后再试',
  sVlmTitle:'拍照 AI', sVlmL:'识别模式', sVlmOff:'快速（仅分类器）', sVlmLite:'智能 Lite · 约 0.85 GB（手机）', sVlmPro:'智能 Pro · 约 1.8 GB（电脑，更准）',
  sVlmNote:'云端：由第三方 AI（智谱 GLM 或 Google Gemini）在服务器识别，最准、手机零负担（免费版服务商可能用提交内容改进模型）。本地 Lite/Pro：在设备上运行 Qwen 视觉模型，照片完全不离开手机，但需下载模型、耗电、准确度较低。',
  modelReady:'模型已就绪——在设备上离线识别，照片不会上传。', camDenied:'需要相机权限。请在浏览器设置中允许。',
  scanHint:'将条形码对准相机', scanNote:'先查本地全球库，再查在线，最后可自己补充。', notFound:'未找到该商品，请用搜索添加。',
  teach:'没有找到——教会它！', teachName:'商品名称', teachSave:'保存到公共条码库', taught:'已保存！所有用户扫这个条码都能直接用了 🎉', teachAI:'🧠 让 AI 按名称估算', gs1:'🔎 到 GS1 官网查此条码',
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
  storedOnline:'✓ Data lives in your own Supabase database.', local:'⚠ Supabase not configured — data stays in this browser only.',
  login:'Sign in', register:'Create account', loginHint:'Sign in and your data is stored online, reachable from any device.', logout:'Sign out', badLogin:'Wrong email or password.',
  toReg:'New here? Create an account', toLogin:'Have an account? Sign in', welcome:'Email confirmed — welcome to SnapCal!',
  sgTitle:'Next-meal ideas', sgBtn:'Shuffle', sgRemain:'Remaining today', sgDone:'Targets met for today 🎉', sgP:'protein',
  eb:'Energy balance', ebIn:'In', ebOut:'Out', ebNet:'Net', ebEst:'Out = BMR (from profile) + Watch activity', ebNoW:'(no Watch data yet — see the Apple Watch guide)', ebSteps:'Steps', ebSleep:'Sleep', ebRhr:'Resting HR', checkEmail:'Account created — click the confirmation link in your email, then sign in.', regFail:'Sign-up failed: ',
  photoHint:'Photograph your meal', shoot:'Identify', analyzing:'Analyzing…', notThese:'None of these — search instead',
  modelIdle:'First use downloads the recognition model (~38 MB); it is cached after that.', modelLoading:'Loading model…',
  pick:'📁 Choose a photo from your library', vlmIntroTitle:'Smart recognition (recommended)',
  vlmIntroText:'A vision AI looks at the photo like a person: finds every item, counts pieces and estimates grams — calories then come from the nutrition database. It runs on the server (a third-party AI: Zhipu GLM or Google Gemini), so your phone downloads nothing and does no AI work. Photos are used only for recognition and SnapCal does not store them; free-tier providers may use submissions to improve their models.',
  vlmEnable:'Turn on smart recognition', vlmLoading:'Loading vision AI…', vlmReady:'Smart recognition ready · photos never leave your device',
  vlmDl:'Downloading vision AI: {p}% ({l}/{t} MB) · one time only', vlmThinking:'AI is looking closely at the photo…',
  vlmFail:'The AI could not give a clear answer — try another angle, or add it via search.', quickGuess:'Quick classifier guess', meal:'Meal',
  matched:'database', aiKcal:'AI calorie estimate', noMatch:'not in the database — rename or remove', total:'Total', noItems:'No food items found',
  plateLog:'Log this meal · {k} kcal', plateAdd:'Missed something? Type a name to add (e.g. yogurt)',
  wkTitle:'📊 Last 7 days', wkKcal:'Avg calories', wkPro:'Avg protein', wkOn:'Days on target', wkWeight:'Weight change', wkWater:'Avg water',
  wkNa:'Avg sodium', wkSleep:'Avg sleep', wkNoData:'Log a few days and your weekly summary appears here.', wkCoach:'🧠 AI coach review', wkCoachBusy:'The AI coach is thinking…',
  tdee:'Measured maintenance: about {t} kcal/day (from {d} logged days and {w} weigh-ins)', tdeeNeed:'Log food on {d} more days and weigh in {w} more times (over 10+ days) to measure your real maintenance calories.',
  tdeeUse:'Set target to {t} kcal ({why})', whyCut:'lose fat: maintenance −500', whyGain:'gain: maintenance +250', whyKeep:'maintain',
  sEat:'Add exercise calories to the target', sEat0:'No', sEat50:'Half', sEat100:'All', wFromHealth:'{h} ml from Apple Health', ebWorkout:'Workout',
  dataTitle:'Your data', exportJson:'⬇️ Download all my data (JSON)', exportCsv:'⬇️ Download my meal log (CSV, opens in Excel)', delOpen:'Delete my account…',
  delWarn:'This permanently deletes all your records and your account; it cannot be undone. Items you contributed to the shared food and barcode catalogs stay (they hold no personal info). Type DELETE to confirm:',
  delGo:'Delete my account permanently', delDone:'Account deleted', delFail:'Delete failed, please try again later',
  sodium:'Sodium', sugar:'Sugar', usual:'your usual portion', readLabel:'📷 Read a nutrition label', labelBusy:'Reading the label…',
  labelFail:'Could not read the energy value — photograph the whole nutrition panel clearly', labelFood:'Scanned label', teachLabel:'📷 Fill in from a photo of the label',
  readScale:'📷 Read from scale screenshots (pick several)', scaleBusy:'Reading screenshot {i} of {n}…', scaleDone:'Filled {n} values — check them, then Save',
  scaleNone:'No values found — use original screenshots from the scale app', naLimit:'Sodium · limit 2,000 mg', sugarLimit:'Sugar · aim ≤50 g',
  water:'💧 Water', w250:'+250 ml · cup', w500:'+500 ml · bottle', wCustom:'Custom', wUndo:'Undo last',
  wFromDrinks:'{d} ml of it from drinks', wLeft:'{r} ml to go', wDone:'Daily water goal reached 🎉', wName:'Water', wAdded:'Logged 💧',
  sWater:'Water target (ml, blank = auto from weight)', mealsHint:'Tap an entry to edit or delete it',
  edTitle:'Edit entry', edName:'Name', edGrams:'Grams (rescales the calories)', edKcal:'Calories (kcal)', edDate:'Date',
  edSave:'Save changes', edDelete:'Delete this entry', edConfirm:'Tap again to delete', edit:'Edit',
  sVlmCloud:'Smart · Cloud (recommended, no phone compute)', cloudReady:'Smart recognition (cloud) ready · nothing to download',
  cloudNeedsLogin:'Cloud recognition needs you to sign in', cloudLimit:'Today\'s cloud photo limit is used up — try tomorrow, or switch to an on-device mode in Settings', cloudBusy:'The cloud AI is busy — try again in a moment',
  sVlmTitle:'Photo AI', sVlmL:'Mode', sVlmOff:'Fast (classifier only)', sVlmLite:'Smart Lite · ~0.85 GB (phones)', sVlmPro:'Smart Pro · ~1.8 GB (computers, more accurate)',
  sVlmNote:'Cloud: a third-party AI (Zhipu GLM or Google Gemini) recognizes the photo on the server — most accurate, zero load on the phone (free-tier providers may use submissions to improve their models). On-device Lite/Pro: a Qwen vision model runs on your device, photos never leave it, but it downloads a model, uses battery and is less accurate.',
  modelReady:'Model ready — runs on your device, photos never leave it.', camDenied:'Camera permission needed — allow it in your browser settings.',
  scanHint:'Point the camera at a barcode', scanNote:'Checked against the local worldwide pack, then online, then you can teach it.', notFound:'Product not found — add it via search.',
  teach:'Not found — teach it!', teachName:'Product name', teachSave:'Save to the shared barcode base', taught:'Saved — every user scanning this code gets it now 🎉', teachAI:'🧠 AI estimate from the name', gs1:'🔎 Look up this code on GS1 China',
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

/* ---------- smart photo AI config (must precede init()) ---------- */
const TJS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.0.0-next.11/+esm';
const VLM_TIERS = {
  lite: { id: 'onnx-community/Qwen3.5-0.8B-ONNX', cls: 'Qwen3_5ForConditionalGeneration', gb: '0.85', side: 448 },
  pro: { id: 'onnx-community/Qwen3-VL-2B-Instruct-ONNX', cls: 'Qwen3VLForConditionalGeneration', gb: '1.8', side: 560 },
};
const IS_MOBILE = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);
// Typical edible weight of ONE piece, used to sanity-check the AI's gram guesses.
const UNIT_G = {
  grape: 5, strawberry: 12, cherry: 8, blueberry: 1.5, 'cherry tomato': 15, lychee: 20, longan: 10,
  peach: 150, apple: 180, banana: 118, orange: 130, mandarin: 80, tangerine: 80, mango: 200, kiwi: 75,
  pear: 180, plum: 60, apricot: 35, persimmon: 150, fig: 50, egg: 50, dumpling: 25, gyoza: 25,
  xiaolongbao: 30, bun: 90, baozi: 100, shumai: 20, sushi: 30, nigiri: 30, nugget: 17, cookie: 12,
  'chicken wing': 45, meatball: 25, shrimp: 12, prawn: 15, 'spring roll': 50, walnut: 5, almond: 1.2,
  macaron: 12, 'slice of bread': 30, 'slice of pizza': 110, 'rice ball': 110, onigiri: 110,
};
const PLATE_PROMPT = `Look carefully at this food photo and answer with ONLY one JSON object.
First fill "seen" with one short sentence describing what is really in the photo, then list the foods.
- Use SPECIFIC food names ("dragon fruit", "banana", "granola", "shrimp", "fried egg"), never vague words like "dessert", "salad", "topping" or "garnish".
- One prepared dish (pizza, burger, sandwich, noodle soup, curry, fried rice) is ONE item, e.g. a bowl of shrimp noodle soup is one item "shrimp noodle soup": do not also list its ingredients.
- Separate foods you can see or count (fruit pieces, sushi, dumplings, side dishes, drinks, toppings on a bowl) are separate items, AND always include the base they sit on (the yogurt under the toppings, the rice under the curry).
- Size guide: a dinner plate is about 26 cm wide, a rice bowl about 12 cm, a cup about 350 ml.
Shape (fill every <...> with your own values):
{"seen":"<one short sentence>","meal":"<overall name in English>","meal_zh":"<中文名称>","items":[{"name":"<specific food in English>","name_zh":"<中文名>","count":<number of pieces>,"grams":<total edible grams of this item>,"kcal_100g":<calories per 100 g>}]}`;
let vlm = null, vlmLoad = null;
// Drinks logged as food also count toward water (tea, coffee, milk, juice, bottled water…).
const DRINK_RE = /\b(water|tea|coffee|americano|latte|cappuccino|espresso|juice|milk|soda|cola|sprite|lemonade|kombucha|smoothie|sparkling)\b|茶|咖啡|饮用水|天然水|山泉水|矿泉水|纯净水|气泡水|苏打水|果汁|牛奶|豆浆|奶茶|可乐|汽水|饮料|ジュース|コーヒー|牛乳|お茶|주스|커피|우유|水$/i;
const NOT_DRINK_RE = /watermelon|chestnut|tea ?cake|milk ?chocolate|奶酪|茶叶蛋|西瓜|水果|水饺|奶糖|奶片|chocolate|cookie|biscuit|cake|bread|powder|粉/i;

/* ---------- state & utils ---------- */
const S = {
  foods: [], custom: [], learned: [], entries: [], weights: [], health: [], portions: {},
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
  const [e, w, c, t, p, ln, hd, pm] = await Promise.all([
    sb.from('entries').select('*').eq('deleted', false).order('created_at', { ascending: false }).limit(2000),
    sb.from('weights').select('*').order('date', { ascending: false }).limit(400),
    sb.from('foods_custom').select('*').order('id', { ascending: false }).limit(500),
    sb.from('settings').select('*').maybeSingle(),
    sb.from('profiles').select('*').maybeSingle(),
    sb.from('foods_learned').select('*').order('id', { ascending: false }).limit(1000),
    sb.from('health_daily').select('*').order('date', { ascending: false }).limit(90),
    sb.from('portion_memory').select('*').limit(2000),
  ]);
  S.entries = (e.data || []).map(r => ({ ...r, _key: r.device_id + '/' + r.local_id }));
  S.weights = w.data || [];
  S.custom = c.data || [];
  if (t.data) S.targets = { kcal: t.data.kcal ?? 2000, protein: t.data.protein ?? 120, goal: t.data.goal, water_ml: t.data.water_ml ?? localWater() };
  else S.targets.water_ml = localWater();
  if (p.data) S.profile = p.data;
  S.learned = ln.data || [];
  S.health = hd.data || [];
  S.portions = {};
  for (const r of pm.data || []) S.portions[r.key] = { grams: r.grams, n: r.n };
  if (pm.error) S.portions = lsPortions(); // table not created yet: device-only memory
  if (t.data) S.targets.eat_back = t.data.eat_back ?? null;
}
// Writes that survive an older database schema: a column the database doesn't have yet
// (e.g. v10 SQL not run) is dropped and the write retried, instead of the save failing.
async function sbSafe(op, row) {
  let r = { ...row };
  for (let i = 0; i < 5; i++) {
    const res = await op(r);
    if (!res.error) return { error: null, row: r };
    const m = /'([a-z_]+)' column|column "?([a-z_]+)"? (?:of relation|does not exist)/i.exec(res.error.message || '');
    const col = m && (m[1] || m[2]);
    if (!col || !(col in r)) return { error: res.error };
    delete r[col];
  }
  return { error: { message: 'schema mismatch' } };
}
async function addEntry(e) {
  if (LOCAL) { S.entries.unshift({ _key: 'l' + Date.now(), ...e }); lsSave(); }
  else {
    const row = { device_id: deviceId(), local_id: Date.now(), deleted: false, ...e };
    const { error } = await sbSafe((r) => S.sb.from('entries').insert(r), row);
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
async function updateEntry(key, patch) {
  const e = S.entries.find((x) => x._key === key);
  if (!e) return;
  if (LOCAL) { Object.assign(e, patch); lsSave(); }
  else {
    const [d, l] = key.split('/');
    const { error } = await sbSafe((r) => S.sb.from('entries').update(r).eq('device_id', d).eq('local_id', +l), patch);
    if (error) return toast(error.message);
    Object.assign(e, patch);
  }
  toast(T.saved); renderToday();
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
function localWater() {
  try { const v = parseFloat(localStorage.getItem('ps-water-target')); return v > 0 ? v : null; } catch { return null; }
}
async function saveTargets() {
  try { localStorage.setItem('ps-water-target', S.targets.water_ml || ''); } catch {}
  if (LOCAL) lsSave();
  else {
    const { error } = await sbSafe((r) => S.sb.from('settings').upsert(r, { onConflict: 'user_id' }), { ...S.targets });
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
  $('storageNote').textContent = LOCAL ? T.local : T.storedOnline;
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
  $('sWater').value = S.targets.water_ml || '';
  $('sEat').value = String(S.targets.eat_back || 0);
  paintTDEE();
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
  $('mealsHint').textContent = T.mealsHint;
  $('dataTitle').textContent = T.dataTitle; $('exportJson').textContent = T.exportJson; $('exportCsv').textContent = T.exportCsv;
  $('delOpen').textContent = T.delOpen; $('delWarn').textContent = T.delWarn; $('delGo').textContent = T.delGo;
  $('exportJson').addEventListener('click', exportJson);
  $('exportCsv').addEventListener('click', exportCsv);
  $('delOpen').hidden = LOCAL;
  $('delOpen').addEventListener('click', () => { $('delBox').hidden = !$('delBox').hidden; });
  $('delGo').addEventListener('click', deleteAccount);
  $('wkCoach').addEventListener('click', runCoach);
  $('sEatL').textContent = T.sEat; $('sEat0').textContent = T.sEat0; $('sEat50').textContent = T.sEat50; $('sEat100').textContent = T.sEat100;
  $('labelPickL').textContent = T.readLabel;
  $('labelFile').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0]; ev.target.value = '';
    if (!file) return;
    $('labelPickL').textContent = T.labelBusy;
    try {
      const f = await readLabel(file);
      const name = f.name || T.labelFood;
      openSheet({ ...f, _name: name, source: 'label' });
      if (f.name) learnFood({ name: f.name, kcal: f.kcal, protein: f.protein, fat: f.fat, carbs: f.carbs, portion: f.portion, origin: 'label' });
    } catch (e) { toast(String((e && e.message) || e).slice(0, 90)); }
    $('labelPickL').textContent = T.readLabel;
  });
  $('scalePickL').textContent = T.readScale;
  $('scaleFiles').addEventListener('change', async (ev) => {
    const files = [...(ev.target.files || [])]; ev.target.value = '';
    if (files.length) await readScaleShots(files.slice(0, 12));
  });
  $('waterTitle').textContent = T.water; $('w250').textContent = T.w250; $('w500').textContent = T.w500;
  $('wCustomBtn').textContent = T.wCustom; $('wUndo').textContent = T.wUndo;
  $('w250').addEventListener('click', () => addWater(250));
  $('w500').addEventListener('click', () => addWater(500));
  $('wCustomBtn').addEventListener('click', () => { $('wCustomRow').hidden = !$('wCustomRow').hidden; $('wCustomMl').focus(); });
  $('wCustomAdd').addEventListener('click', () => { addWater(parseFloat($('wCustomMl').value)); $('wCustomMl').value = ''; $('wCustomRow').hidden = true; });
  $('wUndo').addEventListener('click', undoWater);
  $('sWaterL').textContent = T.sWater;
  $('edTitle').textContent = T.edTitle; $('edNameL').textContent = T.edName; $('edGramsL').textContent = T.edGrams;
  $('edKcalL').textContent = T.edKcal; $('edProL').textContent = T.protein + ' (g)'; $('edFatL').textContent = T.fat + ' (g)';
  $('edCarbL').textContent = T.carbs + ' (g)'; $('edDateL').textContent = T.edDate;
  $('edSave').textContent = T.edSave; $('edCancel').textContent = T.cancel;
  $('edGrams').addEventListener('input', rescaleEdit);
  $('edSave').addEventListener('click', saveEdit);
  $('edDelete').addEventListener('click', deleteEdit);
  $('edCancel').addEventListener('click', () => { $('editSheet').hidden = true; });
  $('editSheet').addEventListener('click', (ev) => { if (ev.target === $('editSheet')) $('editSheet').hidden = true; });
  $('sgTitle').textContent = T.sgTitle; $('sgBtn').textContent = T.sgBtn;
  $('sgBtn').addEventListener('click', () => renderSuggest(true));
  $('openAdd').textContent = T.addFood;
  $('openAdd').addEventListener('click', () => { setView('foods'); $('q').focus(); });
  $('dPrev').addEventListener('click', () => shiftDate(-1));
  $('dNext').addEventListener('click', () => shiftDate(1));
  $('photoHint').textContent = T.photoHint; $('photoShoot').textContent = T.shoot;
  $('modelNote').textContent = T.modelIdle;
  $('photoShoot').addEventListener('click', classifyPhoto);
  $('photoPickL').textContent = T.pick;
  $('photoFile').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    try {
      const bmp = await createImageBitmap(file);
      await analyzeCanvas(frameFrom(bmp, bmp.width, bmp.height));
    } catch (e) { toast(String((e && e.message) || e).slice(0, 80)); }
  });
  $('vlmIntroTitle').textContent = T.vlmIntroTitle; $('vlmEnable').textContent = T.vlmEnable;
  $('vlmEnable').addEventListener('click', () => {
    setVlmTier(LOCAL ? (IS_MOBILE ? 'lite' : 'pro') : 'cloud'); $('sVlm').value = vlmTier();
    paintVlmIntro(); warmVLM();
  });
  $('plateAddName').placeholder = T.plateAdd;
  $('plateAddBtn').addEventListener('click', addPlateItem);
  $('plateAddName').addEventListener('keydown', (e) => { if (e.key === 'Enter') addPlateItem(); });
  $('plateLog').addEventListener('click', logPlate);
  $('sVlmTitle').textContent = T.sVlmTitle; $('sVlmL').textContent = T.sVlmL;
  $('sVlmCloud').textContent = T.sVlmCloud; $('sVlmOff').textContent = T.sVlmOff; $('sVlmLite').textContent = T.sVlmLite; $('sVlmPro').textContent = T.sVlmPro;
  $('sVlmNote').textContent = T.sVlmNote;
  $('sVlm').value = vlmTier();
  $('sVlm').addEventListener('change', () => {
    setVlmTier($('sVlm').value); paintVlmIntro();
    if (vlmTier() === 'off') $('modelNote').textContent = S.ortSession ? T.modelReady : T.modelIdle;
  });
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
    S.targets = { water_ml: parseFloat($('sWater').value) || null, eat_back: parseFloat($('sEat').value) || 0,
      kcal: parseFloat($('sKcal').value) || 2000, protein: parseFloat($('sPro').value) || 0,
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
  $('shAdd').addEventListener('click', logFromSheet);
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
// One camera stream shared by the Photo and Scan tabs. Browsers (iPhone Safari especially)
// may re-ask permission on every getUserMedia call, so ask once and reuse the stream.
let camRelease = null;
async function getCam() {
  const live = S.camStream && S.camStream.getVideoTracks().some((t) => t.readyState === 'live');
  if (live) return S.camStream;
  S.camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  return S.camStream;
}
async function startCam(videoEl) {
  clearTimeout(camRelease);
  try {
    const stream = await getCam();
    if (videoEl.srcObject !== stream) videoEl.srcObject = stream;
    await videoEl.play().catch(() => {});
    return true;
  } catch { toast(T.camDenied); return false; }
}
function releaseCam() {
  clearTimeout(camRelease);
  if (S.camStream) { S.camStream.getTracks().forEach((t) => t.stop()); S.camStream = null; }
}
function stopCam() {
  if (S.zxReader) { try { S.zxReader.reset(); } catch {} S.zxReader = null; }
  $('photoVideo').pause(); $('scanVideo').pause();
  $('guessList').hidden = true; $('photoShoot').hidden = false;
  // Keep the camera briefly so hopping between tabs doesn't trigger a new permission prompt.
  clearTimeout(camRelease);
  if (S.camStream) camRelease = setTimeout(releaseCam, 90000);
}
// Never keep the camera (and its indicator light) on while the app is in the background.
document.addEventListener('visibilitychange', () => { if (document.hidden) releaseCam(); });
async function startPhoto() {
  paintVlmIntro();
  await startCam($('photoVideo'));
  ensureModel();
  if (vlmTier() !== 'off') warmVLM();
}
async function ensureModel() {
  if (S.ortSession || ensureModel._loading) return;
  ensureModel._loading = true;
  if (vlmTier() === 'off') $('modelNote').textContent = T.modelLoading;
  try {
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = new URL('vendor/ort/', location.href).href; // self-hosted: CDNs are unreliable in mainland China
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
    if (vlmTier() === 'off') $('modelNote').textContent = T.modelReady;
  } catch (e) {
    $('modelNote').textContent = 'model load failed: ' + (e.message || e);
  }
  ensureModel._loading = false;
}
function frameFrom(source, w, h) {
  const s = Math.min(1, 1024 / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
  c.getContext('2d').drawImage(source, 0, 0, c.width, c.height);
  return c;
}
async function classifyCanvas(src) {
  await ensureModel();
  if (!S.ortSession) return [];
  const size = S.modelMeta.inputSize, mean = S.modelMeta.mean, std = S.modelMeta.std;
  const c = document.createElement('canvas'); c.width = size; c.height = size;
  const g = c.getContext('2d');
  const side = Math.min(src.width, src.height);
  g.drawImage(src, (src.width - side) / 2, (src.height - side) / 2, side, side, 0, 0, size, size);
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
  return idx.map(i => ({ label: S.modelMeta.classes[i], prob: probs[i] }));
}
async function classifyPhoto() {
  const video = $('photoVideo');
  if (!video.videoWidth) return;
  await analyzeCanvas(frameFrom(video, video.videoWidth, video.videoHeight));
}
async function analyzeCanvas(canvas) {
  $('photoShoot').textContent = T.analyzing;
  try {
    const quick = await classifyCanvas(canvas);
    if (vlmTier() === 'off') { if (quick.length) showGuesses(quick); return; }
    await runSmart(canvas, quick);
  } finally {
    $('photoShoot').textContent = T.shoot;
  }
}

/* ---------- smart photo AI: local vision-language model ---------- */
function vlmChoice() {
  try { const v = localStorage.getItem('ps-vlm'); return v === 'off' || v === 'cloud' || v === 'lite' || v === 'pro' ? v : null; }
  catch { return null; }
}
function vlmTier() { return vlmChoice() || 'off'; }
function setVlmTier(v) {
  try { localStorage.setItem('ps-vlm', v); } catch {}
  if (vlm && vlm.tier !== v) {
    try { vlm.model.dispose && vlm.model.dispose(); } catch {}
    vlm = null;
  }
}
function vlmDtype(tier, f16) {
  if (!f16) return { embed_tokens: 'q4', vision_encoder: 'q4', decoder_model_merged: 'q4' };
  return tier === 'lite'
    ? { embed_tokens: 'q4', vision_encoder: 'fp16', decoder_model_merged: 'q4' }
    : { embed_tokens: 'q4f16', vision_encoder: 'fp16', decoder_model_merged: 'q4f16' };
}
function paintVlmIntro() {
  const show = vlmChoice() === null;
  $('vlmIntro').hidden = !show;
  if (show) {
    const tier = IS_MOBILE ? 'lite' : 'pro';
    $('vlmIntroText').textContent = T.vlmIntroText.replace('{size}', VLM_TIERS[tier].gb + ' GB');
  }
}
function vlmProgress(loaded, total) {
  const pct = Math.min(100, Math.round(loaded / total * 100));
  $('vlmProg').hidden = pct >= 100;
  $('vlmProgBar').style.width = pct + '%';
  $('modelNote').textContent = T.vlmDl.replace('{p}', pct)
    .replace('{l}', Math.round(loaded / 1e6)).replace('{t}', Math.round(total / 1e6));
}
async function ensureVLM() {
  const tier = vlmTier();
  if (tier === 'off' || tier === 'cloud') throw new Error('not a local tier');
  if (vlm && vlm.tier === tier) return vlm;
  if (!navigator.gpu) throw new Error(T.aiNoGpu);
  if (vlmLoad && vlmLoad.tier === tier) return vlmLoad.p;
  const p = (async () => {
    const tjs = await import(TJS_URL);
    let f16 = false;
    try { const ad = await navigator.gpu.requestAdapter(); f16 = !!(ad && ad.features.has('shader-f16')); } catch {}
    const cfg = VLM_TIERS[tier];
    const files = {};
    const progress_callback = (e) => {
      if (!e || e.status !== 'progress' || !e.file || !e.total) return;
      files[e.file] = [e.loaded || 0, e.total];
      let l = 0, t = 0;
      for (const [a, b] of Object.values(files)) { l += a; t += b; }
      vlmProgress(l, t);
    };
    const processor = await tjs.AutoProcessor.from_pretrained(cfg.id, { progress_callback });
    const model = await tjs[cfg.cls].from_pretrained(cfg.id, {
      dtype: vlmDtype(tier, f16), device: 'webgpu', progress_callback,
    });
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    return { tier, tjs, processor, model };
  })();
  vlmLoad = { tier, p };
  try { vlm = await p; return vlm; }
  finally { vlmLoad = null; $('vlmProg').hidden = true; }
}
async function warmVLM() {
  if (vlmTier() === 'off') return;
  if (vlmTier() === 'cloud') { $('modelNote').textContent = T.cloudReady; return; }
  if (!navigator.gpu) { $('modelNote').textContent = T.aiNoGpu; return; }
  if (vlm && vlm.tier === vlmTier()) { $('modelNote').textContent = T.vlmReady; return; }
  $('modelNote').textContent = T.vlmLoading;
  try {
    await ensureVLM();
    $('modelNote').textContent = T.vlmReady;
  } catch (e) {
    $('modelNote').textContent = String((e && e.message) || e).slice(0, 160);
  }
}
function canvasB64(canvas, maxSide, quality) {
  const k = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  const c = document.createElement('canvas');
  c.width = Math.round(canvas.width * k); c.height = Math.round(canvas.height * k);
  c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', quality || 0.85).split(',')[1];
}
async function cloudCall(body) {
  if (LOCAL || !S.sb) throw new Error(T.cloudNeedsLogin);
  const { data } = await S.sb.auth.getSession();
  const token = data && data.session && data.session.access_token;
  if (!token) throw new Error(T.cloudNeedsLogin);
  const r = await fetch(PS_CONFIG.SUPABASE_URL + '/functions/v1/analyze-meal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', Authorization: 'Bearer ' + token,
      apikey: PS_CONFIG.SUPABASE_ANON_KEY, 'x-region': 'ap-northeast-1', // Tokyo: next to the database and close to Zhipu's servers
    },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (j.error === 'daily_limit') throw new Error(T.cloudLimit);
    if (j.error === 'sign_in_required') throw new Error(T.cloudNeedsLogin);
    throw new Error(T.cloudBusy + (j.error ? ` (${j.error})` : ''));
  }
  return String(j.text || '');
}
async function cloudAnalyze(canvas, hint) {
  return parsePlate(await cloudCall({ task: 'meal', image: canvasB64(canvas, 768), hint: hint || '' }));
}
// First complete JSON object in a model reply (models sometimes add text after it).
function firstJson(text) {
  const t = String(text || '');
  const i = t.indexOf('{');
  if (i < 0) return null;
  let depth = 0, inStr = false, escp = false;
  for (let k = i; k < t.length; k++) {
    const ch = t[k];
    if (inStr) { if (escp) escp = false; else if (ch === '\\') escp = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) {
      try { return JSON.parse(t.slice(i, k + 1).replace(/,\s*([}\]])/g, '$1')); } catch { return null; }
    }
  }
  return null;
}
function numOrNull(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : null; }
async function fileCanvas(file) {
  const bmp = await createImageBitmap(file);
  return frameFrom(bmp, bmp.width, bmp.height);
}

/* ---------- nutrition label reading (cloud) ---------- */
function labelTo100(j) {
  const n = (v) => { const x = numOrNull(v); return x !== null && x >= 0 ? x : 0; };
  const kcal = n(j.energy_kcal) || n(j.energy_kj) / 4.184;
  const f = { name: String(j.name || '').trim(), kcal, protein: n(j.protein), fat: n(j.fat), carbs: n(j.carbs),
    sugar: n(j.sugar), na: n(j.sodium_mg) || (n(j.salt_g) ? n(j.salt_g) / 2.54 * 1000 : 0) };
  const serving = n(j.serving_g);
  if (String(j.basis || '').toLowerCase() === 'serving' && serving > 0) {
    const k = 100 / serving;
    for (const key of ['kcal', 'protein', 'fat', 'carbs', 'sugar', 'na']) f[key] *= k;
  }
  for (const key of ['kcal', 'protein', 'fat', 'carbs', 'sugar']) f[key] = r1(f[key]);
  f.na = Math.round(f.na);
  f.portion = serving > 0 ? serving : 100;
  return f;
}
async function readLabel(file) {
  const canvas = await fileCanvas(file);
  const j = firstJson(await cloudCall({ task: 'label', image: canvasB64(canvas, 1600, 0.88) }));
  if (!j || !(numOrNull(j.energy_kcal) > 0 || numOrNull(j.energy_kj) > 0)) throw new Error(T.labelFail);
  return labelTo100(j);
}

/* ---------- scale screenshot reading (cloud) ---------- */
const SCALE_TO_FIELD = {
  weight_kg: 'wKg', body_fat_pct: 'wFat', muscle_kg: 'wMus',
  fat_kg: 'mx_fat_kg', ffm_kg: 'mx_ffm_kg', skm_kg: 'mx_skm_kg', protein_kg: 'mx_protein_kg', water_kg: 'mx_water_kg',
  mineral_kg: 'mx_mineral_kg', icw_kg: 'mx_icw_kg', ecw_kg: 'mx_ecw_kg', bmr_kcal: 'mx_bmr_kcal', whr: 'mx_whr', visceral: 'mx_visceral',
};
async function readScaleShots(files) {
  let filled = 0;
  for (let i = 0; i < files.length; i++) {
    $('scaleNote').textContent = T.scaleBusy.replace('{i}', i + 1).replace('{n}', files.length);
    let j = null;
    try { j = firstJson(await cloudCall({ task: 'scale', image: canvasB64(await fileCanvas(files[i]), 1600, 0.88) })); }
    catch (e) { toast(String((e && e.message) || e).slice(0, 90)); }
    if (!j) continue;
    for (const [k, id] of Object.entries(SCALE_TO_FIELD)) {
      const v = numOrNull(j[k]);
      if (v !== null && v > 0 && $(id)) { $(id).value = v; filled++; }
    }
    const seg = ['ra', 'la', 'tr', 'rl', 'll'].map((p) => numOrNull(j['seg_' + p]));
    if (seg.some((v) => v !== null && v > 0)) {
      // Which table is it? An adult's trunk muscle is ~15-35 kg; trunk fat is far lower.
      const tr = seg[2];
      let table = String(j.seg_table || '').toLowerCase().includes('mus') ? 'mus' : 'fat';
      if (tr !== null && tr >= 14) table = 'mus';
      else if (tr !== null && tr < 12) table = 'fat';
      ['ra', 'la', 'tr', 'rl', 'll'].forEach((p, idx) => {
        if (seg[idx] !== null && seg[idx] > 0 && $(`mx_seg_${table}_${p}`)) { $(`mx_seg_${table}_${p}`).value = seg[idx]; filled++; }
      });
    }
  }
  $('wMore').open = true; paintBmi();
  $('scaleNote').textContent = filled ? T.scaleDone.replace('{n}', filled) : T.scaleNone;
}

async function vlmAnalyze(m, canvas, hint, onText) {
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
  let img = await m.tjs.RawImage.fromBlob(blob);
  const s = VLM_TIERS[m.tier].side / Math.max(img.width, img.height);
  const r28 = (v) => Math.max(56, Math.round(v * s / 28) * 28);
  img = await img.resize(r28(img.width), r28(img.height));
  const prompt = hint
    ? PLATE_PROMPT + `\nHint from a fast classifier that only knows single dishes (it may be wrong): "${hint}".`
    : PLATE_PROMPT;
  const conversation = [{ role: 'user', content: [{ type: 'image' }, { type: 'text', text: prompt }] }];
  const text = m.processor.apply_chat_template(conversation, { add_generation_prompt: true, enable_thinking: false });
  const inputs = await m.processor(text, img);
  let streamed = '';
  const streamer = new m.tjs.TextStreamer(m.processor.tokenizer, {
    skip_prompt: true, skip_special_tokens: true,
    callback_function: (t) => { streamed += t; if (onText) onText(streamed); },
  });
  const out = await m.model.generate({ ...inputs, max_new_tokens: 420, do_sample: false, repetition_penalty: 1.1, streamer });
  let decoded = streamed;
  try {
    decoded = m.processor.batch_decode(out.slice(null, [inputs.input_ids.dims.at(-1), null]),
      { skip_special_tokens: true })[0] || streamed;
  } catch {}
  return parsePlate(decoded);
}
function parsePlate(text) {
  const t = String(text || '').replace(/<\/?think>/g, '');
  let start = t.search(/\{\s*"(seen|meal)"/);
  if (start < 0) start = t.indexOf('{');
  if (start < 0) return null;
  let depth = 0, inStr = false, escp = false, end = -1;
  for (let j = start; j < t.length; j++) {
    const ch = t[j];
    if (inStr) { if (escp) escp = false; else if (ch === '\\') escp = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) { end = j; break; }
  }
  const tryParse = (x) => { try { return JSON.parse(x.replace(/,\s*([}\]])/g, '$1')); } catch { return null; } };
  let obj = end > 0 ? tryParse(t.slice(start, end + 1)) : null;
  if (!obj) { // output cut off mid-way: keep the complete items only
    const cut = t.slice(start, t.lastIndexOf('}') + 1);
    obj = tryParse(cut + ']}') || tryParse(cut + '}');
  }
  if (!obj) return null;
  const num = (v, lo, hi) => { const n = parseFloat(v); return Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
  const items = (Array.isArray(obj.items) ? obj.items : []).map((it) => ({
    name: String(it.name || it.name_zh || '').trim().slice(0, 60),
    name_zh: String(it.name_zh || '').trim().slice(0, 40),
    count: Math.round(num(it.count, 1, 200) || 1),
    grams: num(it.grams, 1, 3000),
    kcal_100g: num(it.kcal_100g, 0, 900),
    sodium_mg_100g: num(it.sodium_mg_100g, 0, 10000),
    sugar_g_100g: num(it.sugar_g_100g, 0, 100),
  })).filter((it) => it.name);
  return {
    meal: String(obj.meal || '').slice(0, 60),
    meal_zh: String(obj.meal_zh || '').slice(0, 40),
    items,
    reasoning: String(obj.seen || '').slice(0, 240) || t.slice(0, start).replace(/```(json)?/g, '').trim(),
  };
}
function unitWeight(name) {
  const n = String(name || '').toLowerCase().replace(/\(.*?\)/g, '').trim();
  let best = null;
  for (const k in UNIT_G) {
    const forms = [k, k + 's', k + 'es', k.replace(/y$/, 'ies')];
    if (forms.some((f) => n === f || n.endsWith(' ' + f)) && (!best || k.length > best.length)) best = k;
  }
  return best ? UNIT_G[best] : null;
}
const PROCESSED = /\b(juice|nectar|syrup|canned|pie|babyfood|dried|frozen|jam|jelly|sauce|drink|flavou?red|candied|tea|coffee|latte|soda|smoothie|wine|beer|liquor|mix|powder|instant|dehydrated|substitute|imitation|analog)\b/i;
// Category words the AI sometimes uses: never force these onto a specific database row.
const DIET = /\b(nonfat|non-fat|fat free|low ?fat|lowfat|reduced fat|light|lite|skim|diet|sugar free|unsweetened)\b/i;
const GENERIC = /^(dessert|desserts|salad|meal|dish|dishes|food|snack|snacks|fruit|fruits|vegetable|vegetables|greens|soup|sauce|topping|toppings|dressing|garnish|side)$/i;
function matchPlateFood(it) {
  if (GENERIC.test(String(it.name || '').trim())) return null;
  const base = [it.name, it.name_zh].filter(Boolean).map((s) => s.toLowerCase().trim());
  const qs = [...new Set(base.flatMap((q) => [q, q.replace(/ies$/, 'y'), q.replace(/y$/, 'ies'),
    q.replace(/(es|s)$/, ''), q + 's', q + 'es']))].filter((q) => q.length >= 2);
  const wantsProcessed = qs.some((q) => PROCESSED.test(q));
  const wantsDiet = qs.some((q) => DIET.test(q));
  let best = null;
  const stem = (w) => w.replace(/ies$/, 'y').replace(/(es|s)$/, '');
  const qWords = base.length ? base[0].split(/[^a-z]+/).filter((w) => w.length >= 3).map(stem) : [];
  const consider = (f, bonus) => {
    if (f.source === 'tw-fda' || f.source === 'off') return; // branded products: for barcode/search, not photo items
    let s = 0;
    if (qWords.length >= 2 && f.en) { // every query word present, any order: "granola cereal" ~ "cereals, granola"
      const fw = new Set(f.en.toLowerCase().split(/[^a-z]+/).filter(Boolean).map(stem));
      if (qWords.every((w) => fw.has(w))) s = 0.86 - Math.min(0.1, fw.size / 100);
    }
    for (const q of qs) {
      s = Math.max(s, fuzzy(f.en, q), fuzzy(f.zh, q));
      const en = f.en && f.en.toLowerCase();
      if (en && en.length >= 4 && q.includes(en)) s = Math.max(s, 0.8);
    }
    if (s < 0.72) return; // substring & word-overlap matches score >=0.75; weaker letter-pair look-alikes (e.g. "diced red fruit" vs "fried rice") are rejected
    s += bonus;
    if (f.source === 'seed') s += 0.06;
    if (f.en && /\braw\b/i.test(f.en)) s += 0.05;
    if (!wantsProcessed && f.en && PROCESSED.test(f.en)) s -= 0.06;
    if (!wantsDiet && f.en && DIET.test(f.en)) s -= 0.05;
    if (f.en && /\b[A-Z]{4,}\b/.test(f.en)) s -= 0.07; // USDA brand names are ALL CAPS (CHOBANI, SILK…)
    if (!best || s > best.s) best = { f, s };
  };
  for (const f of S.foods) consider(f, 0);
  for (const c of [...S.learned, ...S.custom]) {
    consider({ en: c.name, kcal: c.kcal, protein: c.protein, fat: c.fat, carbs: c.carbs, portion: c.portion, source: 'learned' }, 0.02);
  }
  return best ? best.f : null;
}
function buildPlateItem(it) {
  const unit = unitWeight(it.name);
  let g = it.grams;
  const usual = usualPortion('piece', it.name);
  if (usual) { g = usual * it.count; it.usual = true; } // your remembered portion beats the AI's guess
  if (unit && !it.usual) {
    const est = unit * it.count;
    if (!g || g > est * 3 || g < est / 3) g = est;
  }
  const food = matchPlateFood(it);
  if (!g && food && food.portion) g = food.portion * it.count;
  const k100 = food ? food.kcal : it.kcal_100g;
  if (k100 > 350) g = Math.min(g || 100, 100); // granola, nuts, cheese, chocolate: rarely >100 g per meal
  g = Math.round(Math.min(g || 100, 1500));
  return {
    ...it, grams: g, per: g / Math.max(1, it.count), food,
    k100: food ? food.kcal : it.kcal_100g,
    p100: food ? (food.protein || 0) : 0, f100: food ? (food.fat || 0) : 0, c100: food ? (food.carbs || 0) : 0,
    na100: food && per100(food.na) !== null ? food.na : it.sodium_mg_100g ?? null,
    s100: food && per100(food.sugar) !== null ? food.sugar : it.sugar_g_100g ?? null,
  };
}
async function runSmart(canvas, quick) {
  $('guessList').hidden = true; $('photoShoot').hidden = false;
  const card = $('plateCard'); card.hidden = false;
  $('plateTitle').textContent = T.vlmThinking;
  $('plateItems').innerHTML = ''; $('plateTotals').innerHTML = '';
  $('plateLog').hidden = true; $('plateAddRow').hidden = true;
  const top = quick && quick[0];
  $('plateStatus').textContent = top ? `${T.quickGuess}: ${labelToTerm(top.label)} · ${Math.round(top.prob * 100)}%` : '';
  const think = $('plateThink'); think.hidden = false; think.textContent = '…';
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  let res = null, err = null;
  const hint = top && top.prob >= 0.5 ? labelToTerm(top.label) : null;
  try {
    if (vlmTier() === 'cloud') {
      res = await cloudAnalyze(canvas, hint);
    } else {
      const m = await ensureVLM();
      $('modelNote').textContent = T.vlmReady;
      res = await vlmAnalyze(m, canvas, hint, (txt) => { think.textContent = txt; });
    }
  } catch (e) { err = e; }
  if (!res || !res.items.length) {
    $('plateTitle').textContent = T.vlmFail;
    if (err) think.textContent = String((err && err.message) || err).slice(0, 300);
    if (quick && quick.length) showGuesses(quick);
    return;
  }
  think.textContent = res.reasoning || think.textContent;
  const merged = [];
  for (const it of res.items) {
    const same = merged.find((m) => m.name.toLowerCase() === it.name.toLowerCase());
    if (same) { same.count += it.count; same.grams = (same.grams || 0) + (it.grams || 0) || null; }
    else merged.push({ ...it });
  }
  const real = merged.filter((it) => !GENERIC.test(it.name.trim()));
  S.plate = { meal: res.meal, meal_zh: res.meal_zh, items: (real.length ? real : res.items).map(buildPlateItem) };
  renderPlate();
}
function plateTotals(items) {
  return items.reduce((a, it) => {
    const f = it.grams / 100;
    return { k: a.k + (it.k100 || 0) * f, p: a.p + it.p100 * f, fa: a.fa + it.f100 * f, c: a.c + it.c100 * f, g: a.g + it.grams,
      na: a.na + (it.na100 || 0) * f, su: a.su + (it.s100 || 0) * f, hasNa: a.hasNa || it.na100 != null, hasSu: a.hasSu || it.s100 != null };
  }, { k: 0, p: 0, fa: 0, c: 0, g: 0, na: 0, su: 0, hasNa: false, hasSu: false });
}
function plateMealName(P) { return (ZH ? (P.meal_zh || P.meal) : (P.meal || P.meal_zh)) || T.meal; }
function renderPlate() {
  const P = S.plate; if (!P) return;
  $('plateTitle').textContent = plateMealName(P);
  $('plateItems').innerHTML = P.items.map((it, i) => {
    const nm = ZH ? (it.name_zh || it.name) : it.name;
    const alt = ZH ? it.name : it.name_zh;
    const kcal = it.k100 != null ? Math.round(it.k100 * it.grams / 100) : null;
    const src = (it.usual ? `${T.usual} · ` : '') + (it.food ? `${T.matched}: ${esc(nameOf(it.food))}` : (it.k100 != null ? T.aiKcal : T.noMatch));
    return `<div class="plate-row" data-i="${i}">
      <div class="name">${esc(nm)}${alt && alt !== nm ? ` <span class="muted small">${esc(alt)}</span>` : ''}</div>
      <div class="muted small">${src}${it.k100 != null ? ` · ${Math.round(it.k100)} ${T.kcal}/100g` : ''}</div>
      <div class="plate-ctl">
        <span class="stepper"><button data-a="dec" aria-label="fewer">−</button><span class="num">${it.count}</span><button data-a="inc" aria-label="more">＋</button></span>
        <input data-a="g" type="number" inputmode="decimal" value="${it.grams}" aria-label="grams"><span class="muted small">${T.grams}</span>
        <span class="plate-kcal num">${kcal != null ? kcal + ' ' + T.kcal : '?'}</span>
        <button class="plate-x" data-a="rm" aria-label="remove">×</button>
      </div>
    </div>`;
  }).join('') || `<p class="muted small">${T.noItems}</p>`;
  $('plateItems').querySelectorAll('.plate-row').forEach((row) => {
    const it = P.items[+row.dataset.i];
    row.querySelector('[data-a="dec"]').onclick = () => {
      if (it.count > 1) { it.count--; it.grams = Math.round(it.per * it.count); it.edited = true; renderPlate(); }
    };
    row.querySelector('[data-a="inc"]').onclick = () => { it.count++; it.grams = Math.round(it.per * it.count); it.edited = true; renderPlate(); };
    row.querySelector('[data-a="g"]').onchange = (e) => {
      const g = parseFloat(e.target.value);
      if (g > 0) { it.grams = Math.round(g); it.per = g / it.count; it.edited = true; }
      renderPlate();
    };
    row.querySelector('[data-a="rm"]').onclick = () => { P.items.splice(P.items.indexOf(it), 1); renderPlate(); };
  });
  const tot = plateTotals(P.items);
  $('plateTotals').innerHTML = [
    ['', T.total, Math.round(tot.k) + ' ' + T.kcal], ['pro', T.protein, Math.round(tot.p) + 'g'],
    ['fat', T.fat, Math.round(tot.fa) + 'g'], ['carb', T.carbs, Math.round(tot.c) + 'g'],
  ].map(([c, l, v]) => `<div class="macro"><div class="lbl">${c ? `<span class="dot" style="background:var(--${c})"></span>` : ''}${l}</div><div class="val num">${v}</div></div>`).join('');
  $('plateAddRow').hidden = false;
  $('plateLog').hidden = !P.items.length;
  $('plateLog').textContent = T.plateLog.replace('{k}', Math.round(tot.k));
}
function logPlate() {
  const P = S.plate; if (!P || !P.items.length) return;
  const parts = P.items.map((it) => {
    const nm = ZH ? (it.name_zh || it.name) : it.name;
    return it.count > 1 ? `${nm}×${it.count}` : nm;
  });
  const tot = plateTotals(P.items);
  addEntry({
    date: S.date, name: `${plateMealName(P)}: ${parts.join(', ')}`.slice(0, 140), grams: Math.round(tot.g),
    kcal: tot.k, protein: tot.p, fat: tot.fa, carbs: tot.c, source: 'vlm', created_at: Date.now(),
    sodium_mg: tot.hasNa ? Math.round(tot.na) : null, sugar_g: tot.hasSu ? r1(tot.su) : null,
  });
  for (const it of P.items) if (it.edited) rememberPortion('piece:' + it.name, it.per);
  S.plate = null; $('plateCard').hidden = true;
  setView('today');
}
function addPlateItem() {
  const name = $('plateAddName').value.trim();
  if (!name || !S.plate) return;
  const it = buildPlateItem({ name, name_zh: '', count: 1, grams: null, kcal_100g: null });
  if (it.food && it.food.portion > 0 && it.grams < it.food.portion) { it.grams = Math.round(it.food.portion); it.per = it.grams; }
  S.plate.items.push(it);
  $('plateAddName').value = '';
  renderPlate();
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
  loadCnPack(); loadBcLearned();
  if (!(await startCam($('scanVideo')))) return;
  try {
    S.zxReader = new ZXing.BrowserMultiFormatReader();
    const cb = (result) => { if (result) onBarcode(result.getText()); };
    // A clone of the shared stream: the scanner's reset() then stops only its own copy.
    await S.zxReader.decodeFromStream(S.camStream.clone(), $('scanVideo'), cb);
  } catch (e) { $('scanNote').textContent = T.scanNote + ' (' + (e.message || e) + ')'; }
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
let bcLearned = null;
async function loadBcLearned() {
  if (bcLearned !== null || LOCAL) { bcLearned = bcLearned || {}; return; }
  bcLearned = {};
  try {
    const { data } = await S.sb.from('barcodes_learned').select('*').limit(5000);
    for (const r of data || []) bcLearned[r.code] = [r.name, r.kcal, r.protein, r.fat, r.carbs, r.portion];
  } catch {}
}
async function teachBarcode(code, f) {
  if (LOCAL) return;
  const row = { code, name: f.name, kcal: f.kcal, protein: f.protein || 0, fat: f.fat || 0,
    carbs: f.carbs || 0, portion: f.portion || 100, origin: f.origin || 'user', created_at: Date.now() };
  const { error } = await S.sb.from('barcodes_learned').insert(row);
  if (!error) { bcLearned[code] = [row.name, row.kcal, row.protein, row.fat, row.carbs, row.portion]; toast(T.taught); }
  else toast(error.message);
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
    const local = (await bcLookup(code)) || (bcLearned && bcLearned[code]) || (cnPack && cnPack[code]);
    if (local) {
      const [name, kcal, pro, fat, carbs, serving, na, sugar] = local;
      openSheet({ _name: name, kcal, protein: pro, fat, carbs, na: na >= 0 ? na : null, sugar: sugar >= 0 ? sugar : null,
        portion: serving > 0 ? serving : 100, source: 'barcode' });
      return;
    }
    const fields = 'product_name,product_name_zh,brands,serving_quantity,nutriments';
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`);
    const j = await res.json();
    const p = j.product;
    const kcal = p && p.nutriments && p.nutriments['energy-kcal_100g'];
    if (j.status !== 1 || typeof kcal !== 'number') { openTeach(code); return; }
    const name = (ZH && p.product_name_zh) || p.product_name || code;
    openSheet({
      _name: name + (p.brands ? ` (${p.brands})` : ''),
      kcal, protein: p.nutriments.proteins_100g || 0, fat: p.nutriments.fat_100g || 0,
      carbs: p.nutriments.carbohydrates_100g || 0,
      na: typeof p.nutriments.sodium_100g === 'number' ? p.nutriments.sodium_100g * 1000 : null,
      sugar: typeof p.nutriments.sugars_100g === 'number' ? p.nutriments.sugars_100g : null,
      portion: Number(p.serving_quantity) > 0 ? Number(p.serving_quantity) : 100,
      source: 'off',
    });
  } catch { openTeach(code); }
  finally { setTimeout(() => scanBusy = false, 1500); }
}

/* ---------- teach-a-barcode sheet ---------- */
function openTeach(code) {
  if (LOCAL) { toast(T.notFound); return; }
  const wrap = $('sheet');
  S.sheetFood = null;
  $('shName').textContent = T.teach + '  ·  ' + code;
  $('shPer100').innerHTML = `<input id="tName" placeholder="${T.teachName}" style="width:100%;margin-top:6px">
    <div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
      <input id="tK" type="number" inputmode="decimal" placeholder="kcal/100g" style="width:110px">
      <input id="tP" type="number" inputmode="decimal" placeholder="${T.protein}g" style="width:90px">
      <input id="tF" type="number" inputmode="decimal" placeholder="${T.fat}g" style="width:90px">
      <input id="tC" type="number" inputmode="decimal" placeholder="${T.carbs}g" style="width:90px">
    </div>
    <label for="tLabelFile" class="primary" id="tLabelL" style="display:block;text-align:center;cursor:pointer;margin-top:8px;background:var(--chip);color:var(--ink)">${T.teachLabel}</label>
    <input type="file" id="tLabelFile" accept="image/*" hidden>
    <button class="primary" id="tAI" style="margin-top:8px;background:var(--chip);color:var(--ink)">${T.teachAI}</button>
    <a href="https://www.gds.org.cn/#/barcodeList/index?type=barcode&keyword=${encodeURIComponent(code)}" target="_blank" rel="noopener"
       style="display:block;text-align:center;margin-top:8px;color:var(--accent);font-size:13px">${T.gs1}</a>`;
  $('shGrams').value = 100; sheetTeachMode(code);
  wrap.hidden = false;
  $('tLabelFile').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0]; ev.target.value = '';
    if (!file) return;
    $('tLabelL').textContent = T.labelBusy;
    try {
      const f = await readLabel(file);
      if (!$('tName').value.trim() && f.name) $('tName').value = f.name;
      $('tK').value = f.kcal; $('tP').value = f.protein; $('tF').value = f.fat; $('tC').value = f.carbs;
      $('shGrams').value = f.portion;
    } catch (e) { toast(String((e && e.message) || e).slice(0, 90)); }
    $('tLabelL').textContent = T.teachLabel;
  });
  $('tAI').addEventListener('click', async () => {
    const name = $('tName').value.trim(); if (!name) return;
    $('tAI').disabled = true; $('tAI').textContent = T.aiBusy;
    try {
      const h = await aiEstimate(name);
      $('tK').value = h.kcal; $('tP').value = h.protein; $('tF').value = h.fat; $('tC').value = h.carbs;
      $('shGrams').value = h.portion;
    } catch (e) { toast((e && e.message || 'AI error').slice(0, 60)); }
    $('tAI').disabled = false; $('tAI').textContent = T.teachAI;
  });
}
function sheetTeachMode(code) {
  const add = $('shAdd');
  add.textContent = T.teachSave;
  const fresh = add.cloneNode(true); add.replaceWith(fresh); // drop old listeners
  fresh.addEventListener('click', async () => {
    const name = $('tName').value.trim(); const kcal = parseFloat($('tK').value);
    if (!name || !(kcal >= 0)) return;
    const f = { name, kcal, protein: parseFloat($('tP').value) || 0, fat: parseFloat($('tF').value) || 0,
      carbs: parseFloat($('tC').value) || 0, portion: parseFloat($('shGrams').value) || 100, origin: 'user' };
    await teachBarcode(code, f);
    $('sheet').hidden = true;
    openSheet({ ...f, _name: name, source: 'user' });
    resetSheetAdd();
  });
}
function resetSheetAdd() {
  const add = $('shAdd');
  const fresh = add.cloneNode(true); add.replaceWith(fresh);
  fresh.textContent = T.add;
  fresh.addEventListener('click', logFromSheet);
}

/* ---------- building entries (sodium & sugar travel with every food) ---------- */
function per100(v) { const n = parseFloat(v); return Number.isFinite(n) && n >= 0 ? n : null; }
function entryFromFood(f, g) {
  const na = per100(f.na), sug = per100(f.sugar);
  return {
    date: S.date, name: f._name, grams: g,
    kcal: f.kcal * g / 100, protein: (f.protein || 0) * g / 100, fat: (f.fat || 0) * g / 100,
    carbs: (f.carbs || 0) * g / 100,
    sodium_mg: na === null ? null : Math.round(na * g / 100), sugar_g: sug === null ? null : r1(sug * g / 100),
    source: f.source || 'custom', created_at: Date.now(),
  };
}
function logFromSheet() {
  const f = S.sheetFood; const g = parseFloat($('shGrams').value);
  if (!f || !(g > 0)) return;
  if (Math.abs(g - (S.sheetDefault || g)) / (S.sheetDefault || g) > 0.1) rememberPortion('serv:' + f._name, g);
  addEntry(entryFromFood(f, g));
  closeSheet(); setView('today');
}

/* ---------- "your usual portions" memory ---------- */
function pkey(name) {
  return String(name || '').toLowerCase().replace(/\(.*?\)|（.*?）/g, '').replace(/[^\p{L}\p{N} ]/gu, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, 80);
}
function lsPortions() { try { return JSON.parse(localStorage.getItem('ps-portions')) || {}; } catch { return {}; } }
function usualPortion(kind, name) {
  const m = S.portions[kind + ':' + pkey(name)];
  return m && m.grams > 0 ? m.grams : null;
}
async function rememberPortion(kindName, grams) {
  const [kind, ...rest] = kindName.split(':');
  const name = rest.join(':');
  if (!(grams > 0) || !name || /[:：]/.test(name)) return; // skip composite meal names
  const key = kind + ':' + pkey(name);
  const old = S.portions[key];
  const n = old ? Math.min(old.n, 4) : 0; // recent corrections weigh most
  const avg = old ? (old.grams * n + grams) / (n + 1) : grams;
  S.portions[key] = { grams: Math.round(avg * 10) / 10, n: (old ? old.n : 0) + 1 };
  try { localStorage.setItem('ps-portions', JSON.stringify(S.portions)); } catch {}
  if (!LOCAL && S.sb) {
    await S.sb.from('portion_memory').upsert({ key, grams: S.portions[key].grams, n: S.portions[key].n,
      updated_at: Date.now() }, { onConflict: 'user_id,key' });
  }
}

/* ---------- add sheet ---------- */
function openSheet(f) {
  S.sheetFood = f;
  $('shName').textContent = f._name;
  const extra = [per100(f.na) !== null ? `${T.sodium} ${Math.round(f.na)}mg` : '', per100(f.sugar) !== null ? `${T.sugar} ${r1(f.sugar)}g` : '']
    .filter(Boolean).join(' · ');
  const usual = usualPortion('serv', f._name);
  $('shPer100').textContent = `${Math.round(f.kcal)} ${T.kcal} · ${T.protein} ${r1(f.protein)}g · ${T.fat} ${r1(f.fat)}g · ${T.carbs} ${r1(f.carbs)}g${extra ? ' · ' + extra : ''} (${T.per100})`
    + (usual ? ` · ${T.usual}` : '');
  S.sheetDefault = usual || f.portion || 100;
  $('shGrams').value = S.sheetDefault;
  $('shMult').innerHTML = [0.5, 1, 1.5, 2].map(m => `<button data-m="${m}">${m}×</button>`).join('');
  $('shMult').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    $('shGrams').value = Math.round((f.portion || 100) * parseFloat(b.dataset.m)); sheetKcal();
  }));
  sheetKcal();
  $('sheet').hidden = false;
}
function closeSheet() { $('sheet').hidden = true; resetSheetAdd(); }
function sheetKcal() {
  const f = S.sheetFood; if (!f) return;
  const g = parseFloat($('shGrams').value) || 0;
  $('shKcal').textContent = Math.round(f.kcal * g / 100) + ' ' + T.kcal;
}

/* ---------- daily calorie target (+ optional exercise eat-back from Apple Watch) ---------- */
function dayTarget(date) {
  const base = S.targets.kcal || 2000;
  const hd = S.health.find((h) => h.date === date);
  const back = parseFloat(S.targets.eat_back) || 0;
  return Math.round(base + (hd && hd.active_kcal ? hd.active_kcal * back : 0));
}

/* ---------- energy balance (Mifflin-St Jeor BMR + Watch activity) ---------- */
function bmrEstimate() {
  const p = S.profile;
  const w = [...S.weights].sort((a, b) => a.date < b.date ? 1 : -1)[0];
  if (!p.height_cm || !p.dob || !p.sex || !w) return null;
  const age = Math.max(10, Math.floor((Date.now() - new Date(p.dob).getTime()) / 3.15576e10));
  const base = 10 * w.weight + 6.25 * p.height_cm - 5 * age;
  return Math.round(p.sex === 'male' ? base + 5 : base - 161);
}
function renderEnergy(eatenKcal) {
  $('ebTitle').textContent = T.eb;
  const hd = S.health.find(h => h.date === S.date);
  const bmr = bmrEstimate();
  if (!bmr) { $('ebCard').hidden = true; return; }
  $('ebCard').hidden = false;
  const out = bmr + (hd && hd.active_kcal ? hd.active_kcal : 0);
  const net = Math.round(eatenKcal - out);
  $('ebRow').innerHTML = [
    [T.ebIn, Math.round(eatenKcal) + ' ' + T.kcal, ''],
    [T.ebOut, Math.round(out) + ' ' + T.kcal, ''],
    [T.ebNet, (net > 0 ? '+' : '') + net + ' ' + T.kcal, net > 0 ? 'color:var(--fat)' : 'color:var(--pro)'],
  ].map(([l, v, style]) => `
    <div class="macro"><div class="lbl">${l}</div><div class="val num" style="${style}">${v}</div></div>`).join('');
  let sub = T.ebEst;
  if (hd) {
    const bits = [];
    if (hd.steps) bits.push(`${T.ebSteps} ${Math.round(hd.steps).toLocaleString()}`);
    if (hd.sleep_hours) bits.push(`${T.ebSleep} ${hd.sleep_hours.toFixed(1)}h`);
    if (hd.resting_hr) bits.push(`${T.ebRhr} ${Math.round(hd.resting_hr)}`);
    if (hd.workout_min) bits.push(`${T.ebWorkout} ${Math.round(hd.workout_min)} min`);
    if (bits.length) sub += ' · ' + bits.join(' · ');
  } else sub += ' ' + T.ebNoW;
  $('ebSub').textContent = sub;
}

/* ---------- render: today ---------- */
function renderToday() {
  $('dLabel').textContent = fmtDate(S.date);
  const es = S.entries.filter(e => e.date === S.date);
  const tot = es.reduce((a, e) => ({ kcal: a.kcal + e.kcal, protein: a.protein + e.protein, fat: a.fat + e.fat, carbs: a.carbs + e.carbs }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  $('kcalNow').textContent = Math.round(tot.kcal);
  const target = dayTarget(S.date);
  $('kcalTarget').textContent = `${T.of} ${target} ${T.kcal}`;
  const pct = Math.min(100, tot.kcal / (target || 1) * 100);
  const bar = $('kcalBar'); bar.style.width = pct + '%'; bar.className = tot.kcal > target ? 'over' : '';
  const mt = [['pro', T.protein, tot.protein, S.targets.protein], ['fat', T.fat, tot.fat, null], ['carb', T.carbs, tot.carbs, null]];
  $('macroRow').innerHTML = mt.map(([c, l, v, tgt]) => `
    <div class="macro">
      <div class="lbl"><span class="dot" style="background:var(--${c})"></span>${l}</div>
      <div class="val num">${Math.round(v)}g${tgt ? `<span class="muted small"> /${Math.round(tgt)}</span>` : ''}</div>
      ${tgt ? `<div class="bar"><i style="width:${Math.min(100, v / tgt * 100)}%;background:var(--${c})"></i></div>` : ''}
    </div>`).join('');
  const meals = es.filter((e) => e.source !== 'water');
  const withNa = meals.filter((e) => e.sodium_mg != null), withSu = meals.filter((e) => e.sugar_g != null);
  const na = withNa.reduce((a, e) => a + e.sodium_mg, 0), su = withSu.reduce((a, e) => a + e.sugar_g, 0);
  const lim = [['fat', T.naLimit, withNa.length ? Math.round(na).toLocaleString() + ' mg' : '—', na / 2000],
    ['carb', T.sugarLimit, withSu.length ? Math.round(su) + ' g' : '—', su / 50]];
  $('limitRow').innerHTML = lim.map(([c, l, v, frac]) => `
    <div class="macro">
      <div class="lbl">${l}</div>
      <div class="val num" style="${frac > 1 ? 'color:var(--danger)' : ''}">${v}</div>
      <div class="bar"><i style="width:${Math.min(100, frac * 100)}%;background:${frac > 1 ? 'var(--danger)' : `var(--${c})`}"></i></div>
    </div>`).join('');
  $('mealsHint').hidden = !meals.length;
  $('entryList').innerHTML = meals.map(e => `
    <div class="entry" data-k="${e._key}">
      <div class="grow"><div class="name">${esc(e.name)}</div>
      <div class="sub num">${Math.round(e.grams)} ${T.grams} · ${Math.round(e.kcal)} ${T.kcal}</div></div>
      <button class="edit">${T.edit}</button>
    </div>`).join('');
  $('entryList').querySelectorAll('.entry').forEach((row) => {
    const open = () => openEdit(row.dataset.k);
    row.querySelector('.grow').addEventListener('click', open);
    row.querySelector('.edit').addEventListener('click', open);
  });
  $('quickChips').hidden = meals.length > 0;
  renderWater(es);
  renderEnergy(tot.kcal);
  renderWeek();
  renderSuggest(false);
  drawWeek();
}
/* ---------- adaptive maintenance calories (intake vs. weight trend) ---------- */
function lastDays(n) { return [...Array(n)].map((_, i) => todayISO(i - n + 1)); }
function dayKcal(date) {
  return S.entries.filter((e) => e.date === date && e.source !== 'water').reduce((a, e) => a + e.kcal, 0);
}
function adaptiveTDEE() {
  const days = lastDays(28);
  const logged = days.map((d) => dayKcal(d)).filter((k) => k >= 800); // skip days that clearly weren't fully logged
  const ws = S.weights.filter((w) => days.includes(w.date)).map((w) => ({ x: days.indexOf(w.date), y: w.weight }));
  const span = ws.length ? Math.max(...ws.map((w) => w.x)) - Math.min(...ws.map((w) => w.x)) : 0;
  if (logged.length < 10 || ws.length < 3 || span < 10) {
    return { ok: false, needDays: Math.max(0, 10 - logged.length), needWeighs: Math.max(0, 3 - ws.length) };
  }
  const mx = ws.reduce((a, w) => a + w.x, 0) / ws.length, my = ws.reduce((a, w) => a + w.y, 0) / ws.length;
  const slope = ws.reduce((a, w) => a + (w.x - mx) * (w.y - my), 0) / ws.reduce((a, w) => a + (w.x - mx) ** 2, 0); // kg/day
  const avg = logged.reduce((a, k) => a + k, 0) / logged.length;
  const tdee = Math.min(4500, Math.max(1200, Math.round((avg - slope * 7700) / 10) * 10)); // ~7,700 kcal per kg of body weight
  const latest = [...S.weights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const goal = S.targets.goal;
  let suggested = tdee, why = T.whyKeep;
  if (goal && latest && goal < latest.weight - 0.5) { suggested = Math.max(1200, tdee - 500); why = T.whyCut; }
  else if (goal && latest && goal > latest.weight + 0.5) { suggested = tdee + 250; why = T.whyGain; }
  return { ok: true, tdee, days: logged.length, weighs: ws.length, suggested, why };
}
function paintTDEE() {
  const r = adaptiveTDEE();
  if (!r.ok) {
    $('tdeeNote').textContent = T.tdeeNeed.replace('{d}', r.needDays).replace('{w}', r.needWeighs);
    $('tdeeUse').hidden = true; return;
  }
  $('tdeeNote').textContent = T.tdee.replace('{t}', r.tdee.toLocaleString()).replace('{d}', r.days).replace('{w}', r.weighs);
  $('tdeeUse').hidden = Math.abs(r.suggested - (S.targets.kcal || 0)) < 50;
  $('tdeeUse').textContent = T.tdeeUse.replace('{t}', r.suggested.toLocaleString()).replace('{why}', r.why);
  $('tdeeUse').onclick = () => { S.targets.kcal = r.suggested; $('sKcal').value = r.suggested; saveTargets(); paintTDEE(); };
}

/* ---------- weekly report ---------- */
function weekStats() {
  const days = lastDays(7);
  const logged = days.filter((d) => dayKcal(d) >= 500);
  if (!logged.length) return null;
  const sum = (arr) => arr.reduce((a, v) => a + v, 0);
  const meals = (d) => S.entries.filter((e) => e.date === d && e.source !== 'water');
  const avgK = sum(logged.map(dayKcal)) / logged.length;
  const avgP = sum(logged.map((d) => sum(meals(d).map((e) => e.protein)))) / logged.length;
  const onTarget = logged.filter((d) => Math.abs(dayKcal(d) - dayTarget(d)) <= dayTarget(d) * 0.1).length;
  const ws = S.weights.filter((w) => days.includes(w.date)).sort((a, b) => (a.date < b.date ? -1 : 1));
  const dW = ws.length >= 2 ? ws[ws.length - 1].weight - ws[0].weight : null;
  const water = days.map((d) => {
    const es = S.entries.filter((e) => e.date === d);
    const hd = S.health.find((h) => h.date === d);
    return sum(es.filter((e) => e.source === 'water').map((e) => e.grams)) + sum(es.filter(isDrinkEntry).map((e) => e.grams))
      + (hd && hd.water_ml > 0 ? hd.water_ml : 0);
  }).filter((v) => v > 0);
  const naDays = logged.map((d) => meals(d).filter((e) => e.sodium_mg != null)).filter((a) => a.length);
  const sleep = S.health.filter((h) => days.includes(h.date) && h.sleep_hours > 0).map((h) => h.sleep_hours);
  return {
    days_logged: logged.length, avg_kcal: Math.round(avgK), kcal_target: S.targets.kcal || 2000,
    avg_protein_g: Math.round(avgP), protein_target_g: S.targets.protein || null, days_on_target: onTarget,
    weight_change_kg: dW === null ? null : Math.round(dW * 10) / 10,
    avg_water_ml: water.length ? Math.round(sum(water) / water.length) : null, water_target_ml: waterTarget(),
    avg_sodium_mg: naDays.length ? Math.round(sum(naDays.map((a) => sum(a.map((e) => e.sodium_mg)))) / naDays.length) : null,
    avg_sleep_h: sleep.length ? Math.round(sum(sleep) / sleep.length * 10) / 10 : null,
    maintenance_kcal: adaptiveTDEE().tdee || null, goal_weight_kg: S.targets.goal || null,
  };
}
function renderWeek() {
  const st = weekStats();
  $('wkTitle').textContent = T.wkTitle;
  const cell = (l, v) => `<div class="macro"><div class="lbl">${l}</div><div class="val num">${v}</div></div>`;
  if (!st) {
    $('wkRow1').innerHTML = ''; $('wkRow2').innerHTML = '';
    $('wkMore').textContent = T.wkNoData; $('wkCoach').hidden = true; $('wkCoachText').hidden = true; return;
  }
  $('wkRow1').innerHTML = cell(T.wkKcal, `${st.avg_kcal.toLocaleString()}`) + cell(T.wkPro, `${st.avg_protein_g}g`)
    + cell(T.wkOn, `${st.days_on_target}/${st.days_logged}`);
  $('wkRow2').innerHTML = cell(T.wkWeight, st.weight_change_kg === null ? '—' : `${st.weight_change_kg > 0 ? '+' : ''}${st.weight_change_kg} kg`)
    + cell(T.wkWater, st.avg_water_ml === null ? '—' : `${st.avg_water_ml.toLocaleString()} ml`)
    + cell(st.avg_sleep_h !== null ? T.wkSleep : T.wkNa,
      st.avg_sleep_h !== null ? `${st.avg_sleep_h} h` : (st.avg_sodium_mg === null ? '—' : `${st.avg_sodium_mg.toLocaleString()} mg`));
  const r = adaptiveTDEE();
  $('wkMore').textContent = r.ok ? T.tdee.replace('{t}', r.tdee.toLocaleString()).replace('{d}', r.days).replace('{w}', r.weighs) : '';
  $('wkCoach').hidden = LOCAL;
  $('wkCoach').textContent = T.wkCoach;
  try {
    const c = JSON.parse(localStorage.getItem('ps-coach') || 'null');
    if (c && c.day === todayISO()) { $('wkCoachText').hidden = false; $('wkCoachText').textContent = c.text; }
  } catch {}
}
async function runCoach() {
  const st = weekStats(); if (!st) return;
  $('wkCoach').disabled = true; $('wkCoach').textContent = T.wkCoachBusy;
  try {
    const text = (await cloudCall({ task: 'coach', lang: ZH ? 'zh' : 'en', stats: st })).trim();
    $('wkCoachText').hidden = false; $('wkCoachText').textContent = text;
    try { localStorage.setItem('ps-coach', JSON.stringify({ day: todayISO(), text })); } catch {}
  } catch (e) { toast(String((e && e.message) || e).slice(0, 90)); }
  $('wkCoach').disabled = false; $('wkCoach').textContent = T.wkCoach;
}

/* ---------- export & account deletion ---------- */
function downloadFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function exportJson() {
  const data = {
    exported_at: new Date().toISOString(), app: 'SnapCal', profile: S.profile, targets: S.targets,
    entries: S.entries.map(({ _key, ...e }) => e), weights: S.weights, health: S.health,
    custom_foods: S.custom, usual_portions: S.portions,
  };
  downloadFile(`snapcal-${todayISO()}.json`, JSON.stringify(data, null, 2), 'application/json');
}
function exportCsv() {
  const cols = ['date', 'name', 'grams', 'kcal', 'protein', 'fat', 'carbs', 'sodium_mg', 'sugar_g', 'source'];
  const cell = (v) => { const t = v == null ? '' : String(typeof v === 'number' ? Math.round(v * 10) / 10 : v); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const rows = [...S.entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.created_at || 0) - (b.created_at || 0)))
    .map((e) => cols.map((c) => cell(e[c])).join(','));
  downloadFile(`snapcal-meals-${todayISO()}.csv`, '﻿' + [cols.join(','), ...rows].join('\n'), 'text/csv'); // BOM: Excel reads Chinese correctly
}
async function deleteAccount() {
  if ($('delType').value.trim() !== 'DELETE' || LOCAL) return;
  $('delGo').disabled = true;
  try {
    const { data } = await S.sb.auth.getSession();
    const token = data && data.session && data.session.access_token;
    const r = await fetch(PS_CONFIG.SUPABASE_URL + '/functions/v1/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, apikey: PS_CONFIG.SUPABASE_ANON_KEY },
      body: JSON.stringify({ action: 'delete', confirm: 'DELETE' }),
    });
    if (!r.ok) throw new Error('delete');
    try { localStorage.removeItem(LS_KEY); localStorage.removeItem('ps-portions'); localStorage.removeItem('ps-coach'); } catch {}
    toast(T.delDone);
    await S.sb.auth.signOut();
    setTimeout(() => location.reload(), 1200);
  } catch { toast(T.delFail); $('delGo').disabled = false; }
}

/* ---------- water ---------- */
function waterTarget() {
  if (S.targets.water_ml > 0) return S.targets.water_ml;
  const w = [...S.weights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const auto = w ? Math.round(w.weight * 35 / 50) * 50 : 2000; // ~35 ml per kg body weight
  return Math.min(4000, Math.max(1500, auto));
}
function isDrinkEntry(e) {
  if (e.source === 'water' || !e.grams) return false;
  const per100 = e.kcal / e.grams * 100;
  return per100 <= 130 && DRINK_RE.test(e.name || '') && !NOT_DRINK_RE.test(e.name || '');
}
function renderWater(es) {
  const plain = es.filter((e) => e.source === 'water').reduce((a, e) => a + (e.grams || 0), 0);
  const hdw = S.health.find((h) => h.date === (es[0] ? es[0].date : S.date));
  const health = hdw && hdw.water_ml > 0 ? hdw.water_ml : 0;
  const drinks = es.filter(isDrinkEntry).reduce((a, e) => a + (e.grams || 0), 0);
  const total = Math.round(plain + drinks + health), target = waterTarget();
  $('waterNow').textContent = `${total.toLocaleString()} / ${target.toLocaleString()} ml`;
  $('waterBar').style.width = Math.min(100, total / target * 100) + '%';
  const bits = [total >= target ? T.wDone : T.wLeft.replace('{r}', (target - total).toLocaleString())];
  if (drinks > 0) bits.push(T.wFromDrinks.replace('{d}', Math.round(drinks).toLocaleString()));
  if (health > 0) bits.push(T.wFromHealth.replace('{h}', Math.round(health).toLocaleString()));
  $('waterSub').textContent = bits.join(' · ');
  $('wUndo').hidden = plain <= 0;
}
async function addWater(ml) {
  if (!(ml > 0) || ml > 5000) return;
  await addEntry({ date: S.date, name: T.wName, grams: Math.round(ml), kcal: 0, protein: 0, fat: 0, carbs: 0,
    source: 'water', created_at: Date.now() });
}
function undoWater() {
  const last = S.entries.filter((e) => e.date === S.date && e.source === 'water')
    .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))[0];
  if (last) removeEntry(last._key);
}

/* ---------- edit / delete a logged entry ---------- */
let editKey = null, editOrig = null, delArmed = false;
function openEdit(key) {
  const e = S.entries.find((x) => x._key === key);
  if (!e) return;
  editKey = key; editOrig = { ...e }; delArmed = false;
  $('edName').value = e.name; $('edGrams').value = Math.round(e.grams);
  $('edKcal').value = Math.round(e.kcal); $('edPro').value = r1(e.protein);
  $('edFat').value = r1(e.fat); $('edCarb').value = r1(e.carbs); $('edDate').value = e.date;
  $('edDelete').textContent = T.edDelete;
  $('editSheet').hidden = false;
}
function rescaleEdit() {
  const g = parseFloat($('edGrams').value);
  if (!(g > 0) || !(editOrig.grams > 0)) return;
  const k = g / editOrig.grams;
  editOrig.k = k;
  $('edKcal').value = Math.round(editOrig.kcal * k);
  $('edPro').value = r1(editOrig.protein * k); $('edFat').value = r1(editOrig.fat * k); $('edCarb').value = r1(editOrig.carbs * k);
}
async function saveEdit() {
  const name = $('edName').value.trim(), grams = parseFloat($('edGrams').value), kcal = parseFloat($('edKcal').value);
  if (!name || !(grams > 0) || !(kcal >= 0)) return;
  const patch = { name, grams, kcal, protein: parseFloat($('edPro').value) || 0, fat: parseFloat($('edFat').value) || 0,
    carbs: parseFloat($('edCarb').value) || 0, date: $('edDate').value || editOrig.date };
  const k = editOrig.grams > 0 ? grams / editOrig.grams : 1;
  if (editOrig.sodium_mg != null) patch.sodium_mg = Math.round(editOrig.sodium_mg * k);
  if (editOrig.sugar_g != null) patch.sugar_g = r1(editOrig.sugar_g * k);
  if (Math.abs(k - 1) > 0.1 && editOrig.source !== 'vlm') rememberPortion('serv:' + name, grams);
  $('editSheet').hidden = true;
  await updateEntry(editKey, patch);
}
async function deleteEdit() {
  if (!delArmed) { delArmed = true; $('edDelete').textContent = T.edConfirm; return; }
  $('editSheet').hidden = true;
  await removeEntry(editKey);
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
  const remK = Math.round(dayTarget(S.date) - eaten.kcal);
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
  if (n.includes(q)) return 0.75 + 0.25 * Math.min(1, q.length / n.length); // substring, weighted by coverage
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
