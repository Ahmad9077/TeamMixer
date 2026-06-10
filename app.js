const pools = [
  { id: "poolA", title: "التنانين", accent: "#b3403a", logo: "assets/dragon-red.jpg", players: ["الملا", "جراغ", "حميد", "طروق", "البريجي"] },
  { id: "poolB", title: "الأسود", accent: "#b45309", logo: "assets/lion-yellow.jpg", players: ["بوحمد", "الخلف", "الهلالي", "قرطبة"] },
  { id: "poolC", title: "الذئاب", accent: "#1d4ed8", logo: "assets/wolf-blue.jpg", players: ["حمود", "عليوي", "موسى"] },
];

const categories = [
  { id: "travel", title: "سياحة وسفر", image: "assets/categories/travel.jpg" },
  { id: "geography", title: "جغرافيا", image: "assets/categories/geography.jpg" },
  { id: "countries-capitals", title: "دول و عواصم", image: "assets/categories/countries-capitals.jpg" },
  { id: "cars", title: "سيارات", image: "assets/categories/cars.jpg" },
  { id: "kuwait", title: "الكويت", image: "assets/categories/kuwait.jpg" },
  { id: "general-info", title: "معلومات عامة", image: "assets/categories/general-info.jpg" },
  { id: "history", title: "تاريخ", image: "assets/categories/history.jpg" },
  { id: "foreign-word", title: "ولا كلمة فن أجنبي", image: "assets/categories/foreign-word.jpg" },
  { id: "location", title: "لوكيشن", image: "assets/categories/location.jpg" },
  { id: "riddles", title: "ألغاز", image: "assets/categories/riddles.jpg" },
  { id: "world-logos", title: "شعارات عالمية", image: "assets/categories/world-logos.jpg" },
  { id: "technology", title: "تكنولوجيا", image: "assets/categories/technology.jpg" },
  { id: "order", title: "ترتيب", image: "assets/categories/order.jpg" },
  { id: "islamic-order", title: "ترتيب إسلامي", image: "assets/categories/islamic-order.jpg" },
  { id: "celebrity-voice", title: "صوت المشهور", image: "assets/categories/celebrity-voice.jpg" },
  { id: "letters", title: "حروف", image: "assets/categories/letters.jpg" },
];

const limitedCategoryIds = new Set(["travel", "geography", "countries-capitals"]);
const limitedCategoryMax = 2;
const preloadedAssetUrls = new Set();

const STORAGE_KEY = "seenjeem_state_v1";
const SCREENS = ["setup", "randomize", "results", "categories"];
const defaultPlayers = pools.map((pool) => [...pool.players]);
const defaultDrawMessage = "جاهزين لقرعة جديدة";
const defaultCategoryMessage = "اختر 6 فئات للعبة";

const state = {
  activeScreen: "setup",
  poolQueues: [],
  groupStartCounts: [],
  currentPoolIndex: 0,
  assigned: [],
  teams: {
    one: [],
    two: [],
  },
  nextTeam: "one",
  bonusTeam: null,
  bonusRemaining: 0,
  spinning: false,
  rotation: 0,
  lastResult: null,
  drawReady: false,
  categoryQueue: [],
  selectedCategories: [],
  categorySpinning: false,
  categoryRotation: 0,
  categoryLastResult: defaultCategoryMessage,
};

const wheelPalette = ["#bfe3df", "#fbe3bb", "#dbe4f5", "#f8ddd3", "#d9eed7", "#f1eadf", "#cfe2e8", "#f7e3ee"];

const fallbackWheelSegments = [
  { label: "جاهز", color: wheelPalette[0] },
  { label: "قرعة", color: wheelPalette[1] },
  { label: "اسم", color: wheelPalette[2] },
  { label: "سحب", color: wheelPalette[3] },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function preloadImage(url) {
  if (!url || preloadedAssetUrls.has(url)) return;
  preloadedAssetUrls.add(url);
  const image = new Image();
  image.src = url;
}

function preloadAssets() {
  pools.forEach((pool) => preloadImage(pool.logo));
  categories.forEach((category) => preloadImage(category.image));
}

function randomInt(maxExclusive) {
  if (maxExclusive <= 1) return 0;
  const buffer = new Uint32Array(1);
  const limit = Math.floor(4294967296 / maxExclusive) * maxExclusive;
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % maxExclusive;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SOUND_KEY = "seenjeem_sound_v1";
let soundOn = true;
try {
  soundOn = localStorage.getItem(SOUND_KEY) !== "off";
} catch {
  /* storage unavailable */
}
let audioCtx = null;
let masterGain = null;

function audio() {
  if (!soundOn) return null;
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone({ freq, endFreq = 0, type = "sine", start = 0, dur = 0.2, peak = 0.25, attack = 0.01 }) {
  const ctx = audio();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst({ start = 0, dur = 0.15, peak = 0.2, filterFreq = 1800, filterEndFreq = 0 }) {
  const ctx = audio();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur) + 1, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(filterFreq, t0);
  if (filterEndFreq) filter.frequency.exponentialRampToValueAtTime(filterEndFreq, t0 + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  source.connect(filter).connect(gain).connect(masterGain);
  source.start(t0);
  source.stop(t0 + dur + 0.05);
}

function sfxTada() {
  [523, 659, 784, 1047].forEach((freq, index) => tone({ freq, type: "triangle", start: index * 0.09, dur: 0.2, peak: 0.26 }));
  tone({ freq: 1047, type: "triangle", start: 0.38, dur: 0.55, peak: 0.3 });
  tone({ freq: 1319, type: "sine", start: 0.38, dur: 0.55, peak: 0.12 });
}

function sfxPartyHorn() {
  [0, 0.3].forEach((start) => {
    tone({ freq: 392, endFreq: 360, type: "sawtooth", start, dur: 0.24, peak: 0.2 });
    tone({ freq: 784, endFreq: 700, type: "square", start, dur: 0.24, peak: 0.05 });
  });
  tone({ freq: 392, endFreq: 470, type: "sawtooth", start: 0.62, dur: 0.34, peak: 0.22 });
}

function sfxSlideWhistle() {
  tone({ freq: 320, endFreq: 1300, type: "sine", dur: 0.45, peak: 0.3 });
  tone({ freq: 1300, endFreq: 980, type: "sine", start: 0.46, dur: 0.2, peak: 0.22 });
}

function sfxBoing() {
  tone({ freq: 540, endFreq: 130, type: "triangle", dur: 0.34, peak: 0.32 });
  tone({ freq: 400, endFreq: 120, type: "triangle", start: 0.32, dur: 0.28, peak: 0.2 });
}

function sfxSparkle() {
  [523, 587, 659, 784, 880, 1047].forEach((freq, index) => {
    tone({ freq, type: "triangle", start: index * 0.07, dur: 0.16, peak: 0.22 });
    tone({ freq: freq * 2, type: "sine", start: index * 0.07 + 0.02, dur: 0.1, peak: 0.07 });
  });
}

function sfxApplause(start = 0, claps = 26) {
  for (let i = 0; i < claps; i += 1) {
    noiseBurst({ start: start + i * 0.05 + Math.random() * 0.03, dur: 0.04 + Math.random() * 0.05, peak: 0.08 + Math.random() * 0.1, filterFreq: 1200 + Math.random() * 2200 });
  }
}

const celebrationSfx = [sfxTada, sfxPartyHorn, sfxSlideWhistle, sfxBoing, sfxSparkle];

function playCelebration() {
  try {
    if (!audio()) return;
    celebrationSfx[randomInt(celebrationSfx.length)]();
  } catch {
    /* sound must never break the game */
  }
}

function playGrandFinale() {
  try {
    if (!audio()) return;
    sfxSlideWhistle();
    sfxTada();
    sfxApplause(0.35, 34);
  } catch {
    /* sound must never break the game */
  }
}

function playSpinSounds(durationSec, totalDeg, segmentDeg) {
  try {
    if (!audio()) return;
    noiseBurst({ start: 0, dur: 0.5, peak: 0.14, filterFreq: 500, filterEndFreq: 1600 });
    const ticks = Math.min(Math.floor(totalDeg / segmentDeg), 140);
    for (let k = 1; k <= ticks; k += 1) {
      const progress = (k * segmentDeg) / totalDeg;
      const time = 1 - Math.cbrt(1 - progress);
      tone({ freq: 1900 + Math.random() * 500, type: "square", start: time * durationSec, dur: 0.025, peak: 0.1, attack: 0.002 });
    }
  } catch {
    /* sound must never break the game */
  }
}

function updateSoundToggle() {
  const button = $("#soundToggleBtn");
  button.textContent = soundOn ? "🔊" : "🔇";
  button.setAttribute("aria-pressed", String(soundOn));
  button.title = soundOn ? "إيقاف الأصوات" : "تشغيل الأصوات";
}

function toggleSound() {
  soundOn = !soundOn;
  try {
    localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  if (!soundOn && audioCtx) audioCtx.suspend();
  if (soundOn) {
    audio();
    sfxSparkle();
  }
  updateSoundToggle();
}

function otherTeam(team) {
  return team === "one" ? "two" : "one";
}

function teamLabel(team) {
  return team === "one" ? "الفريق الأول" : "الفريق الثاني";
}

function playerFromPool(pool, name) {
  return { name, pool: pool.title, accent: pool.accent, logo: pool.logo, poolId: pool.id };
}

function allPlayers() {
  return pools.flatMap((pool) => pool.players.map((name) => playerFromPool(pool, name)));
}

function remainingPlayers() {
  return state.poolQueues.flat();
}

function currentQueue() {
  return state.poolQueues[state.currentPoolIndex] || [];
}

function currentPool() {
  return pools[state.currentPoolIndex] || null;
}

function advanceToNextAvailablePool() {
  while (state.currentPoolIndex < state.poolQueues.length && state.poolQueues[state.currentPoolIndex].length === 0) {
    state.currentPoolIndex += 1;
  }
}

function saveState() {
  try {
    const payload = {
      version: 1,
      players: Object.fromEntries(pools.map((pool) => [pool.id, [...pool.players]])),
      draw: {
        poolQueues: state.poolQueues.map((queue) => queue.map((player) => player.name)),
        groupStartCounts: [...state.groupStartCounts],
        currentPoolIndex: state.currentPoolIndex,
        assigned: state.assigned.map((player) => ({ name: player.name, poolId: player.poolId, team: player.team })),
        teams: {
          one: state.teams.one.map((player) => ({ name: player.name, poolId: player.poolId })),
          two: state.teams.two.map((player) => ({ name: player.name, poolId: player.poolId })),
        },
        nextTeam: state.nextTeam,
        bonusTeam: state.bonusTeam,
        bonusRemaining: state.bonusRemaining,
        lastResult: state.lastResult,
        drawReady: state.drawReady,
      },
      categories: {
        queueIds: state.categoryQueue.map((category) => category.id),
        selectedIds: state.selectedCategories.map((category) => category.id),
        lastResult: state.categoryLastResult,
      },
      activeScreen: state.activeScreen,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable; the app keeps working in-memory */
  }
}

function clearStoredState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return false;

    pools.forEach((pool) => {
      const names = data.players?.[pool.id];
      if (Array.isArray(names)) pool.players = names.filter((name) => typeof name === "string" && name.trim());
    });

    const poolById = new Map(pools.map((pool) => [pool.id, pool]));
    const revivePlayer = (entry) => {
      if (!entry || typeof entry.name !== "string") return null;
      const pool = poolById.get(entry.poolId);
      return pool ? playerFromPool(pool, entry.name) : null;
    };

    const draw = data.draw || {};
    state.poolQueues = pools.map((pool, index) => {
      const names = Array.isArray(draw.poolQueues?.[index]) ? draw.poolQueues[index] : [];
      return names.filter((name) => typeof name === "string").map((name) => playerFromPool(pool, name));
    });
    state.groupStartCounts = Array.isArray(draw.groupStartCounts) ? draw.groupStartCounts.map(Number) : pools.map((pool) => pool.players.length);
    state.currentPoolIndex = Number.isInteger(draw.currentPoolIndex) ? draw.currentPoolIndex : 0;
    state.teams.one = (Array.isArray(draw.teams?.one) ? draw.teams.one : []).map(revivePlayer).filter(Boolean);
    state.teams.two = (Array.isArray(draw.teams?.two) ? draw.teams.two : []).map(revivePlayer).filter(Boolean);
    state.assigned = (Array.isArray(draw.assigned) ? draw.assigned : [])
      .map((entry) => {
        const player = revivePlayer(entry);
        return player && (entry.team === "one" || entry.team === "two") ? { ...player, team: entry.team } : null;
      })
      .filter(Boolean);
    state.nextTeam = draw.nextTeam === "two" ? "two" : "one";
    state.bonusTeam = draw.bonusTeam === "one" || draw.bonusTeam === "two" ? draw.bonusTeam : null;
    state.bonusRemaining = Number.isInteger(draw.bonusRemaining) && draw.bonusRemaining > 0 ? draw.bonusRemaining : 0;
    state.lastResult = typeof draw.lastResult === "string" ? draw.lastResult : defaultDrawMessage;
    state.drawReady = Boolean(draw.drawReady);
    state.spinning = false;
    state.rotation = 0;

    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const storedCategories = data.categories || {};
    state.categoryQueue = (Array.isArray(storedCategories.queueIds) ? storedCategories.queueIds : []).map((id) => categoryById.get(id)).filter(Boolean);
    state.selectedCategories = (Array.isArray(storedCategories.selectedIds) ? storedCategories.selectedIds : []).map((id) => categoryById.get(id)).filter(Boolean);
    state.categoryLastResult = typeof storedCategories.lastResult === "string" ? storedCategories.lastResult : defaultCategoryMessage;
    state.categorySpinning = false;
    state.categoryRotation = 0;

    state.activeScreen = SCREENS.includes(data.activeScreen) ? data.activeScreen : "setup";
    advanceToNextAvailablePool();
    return true;
  } catch {
    return false;
  }
}

function resetDraw(message = defaultDrawMessage) {
  state.poolQueues = pools.map((pool) => shuffle(pool.players.map((name) => playerFromPool(pool, name))));
  state.groupStartCounts = pools.map((pool) => pool.players.length);
  state.currentPoolIndex = 0;
  state.assigned = [];
  state.teams.one = [];
  state.teams.two = [];
  state.nextTeam = "one";
  state.bonusTeam = null;
  state.bonusRemaining = 0;
  state.spinning = false;
  state.rotation = 0;
  state.lastResult = message;
  state.drawReady = true;
  advanceToNextAvailablePool();
  render();
}

function resetCategories(message = defaultCategoryMessage) {
  state.categoryQueue = shuffle(categories);
  state.selectedCategories = [];
  state.categorySpinning = false;
  state.categoryRotation = 0;
  state.categoryLastResult = message;
  render();
}

function startOver() {
  clearStoredState();
  pools.forEach((pool, index) => {
    pool.players = [...defaultPlayers[index]];
  });
  state.categoryQueue = shuffle(categories);
  state.selectedCategories = [];
  state.categorySpinning = false;
  state.categoryRotation = 0;
  state.categoryLastResult = defaultCategoryMessage;
  resetDraw(defaultDrawMessage);
  showScreen("setup");
}

function showScreen(screen) {
  state.activeScreen = screen;
  $$(".screen").forEach((section) => section.classList.toggle("active", section.id === screen));
  $$(".nav-btn").forEach((button) => button.classList.toggle("nav-active", button.dataset.screen === screen));
  saveState();
}

function addPlayer(poolId) {
  const input = $(`#input-${poolId}`);
  const value = input.value.trim();
  if (!value) return;
  const pool = pools.find((item) => item.id === poolId);
  pool.players.push(value);
  input.value = "";
  resetDraw("تمت إضافة اللاعب، ابدأ القرعة من جديد");
}

function removePlayer(poolId, index) {
  const pool = pools.find((item) => item.id === poolId);
  pool.players.splice(index, 1);
  resetDraw("تم حذف اللاعب، ابدأ القرعة من جديد");
}

function renderPools() {
  $("#poolGrid").innerHTML = pools
    .map(
      (pool) => `
        <article class="panel rounded-2xl p-5">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-3">
                <img src="${pool.logo}" alt="${pool.title}" class="team-logo-sm" />
                <h3 class="arabic-text text-2xl font-extrabold" dir="rtl" style="color:${pool.accent}">${pool.title}</h3>
              </div>
            </div>
            <span class="count-chip px-4 py-2 text-sm" style="color:${pool.accent}">${pool.players.length}</span>
          </div>
          <div class="flex gap-2">
            <input id="input-${pool.id}" class="field min-w-0 flex-1 px-4 py-3 text-sm font-normal" placeholder="ضيف اسم اللاعب" />
            <button class="add-btn btn-primary px-4 py-3 text-sm" data-pool="${pool.id}">إضافة</button>
          </div>
          <div class="mt-4 flex min-h-28 flex-wrap content-start gap-2">
            ${pool.players
              .map(
                (player, index) => `
                  <span class="chip inline-flex items-center gap-2 px-2.5 py-1 text-base font-bold">
                    <img src="${pool.logo}" alt="${pool.title}" class="team-logo-sm" />
                    <span class="arabic-text font-bold" dir="rtl">${player}</span>
                    <button class="remove-btn chip-remove" data-pool="${pool.id}" data-index="${index}" aria-label="حذف ${player}">×</button>
                  </span>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");

  $$(".add-btn").forEach((button) => button.addEventListener("click", () => addPlayer(button.dataset.pool)));
  pools.forEach((pool) => {
    const input = $(`#input-${pool.id}`);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") addPlayer(pool.id);
    });
  });
  $$(".remove-btn").forEach((button) => button.addEventListener("click", () => removePlayer(button.dataset.pool, Number(button.dataset.index))));
}

function polarToCartesian(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function wheelItems() {
  const queue = currentQueue();
  if (queue.length) {
    return queue.map((player, index) => ({ ...player, label: player.name, color: wheelPalette[index % wheelPalette.length] }));
  }
  return fallbackWheelSegments;
}

function renderWheel() {
  const items = wheelItems();
  const segmentSize = 360 / items.length;

  if (items.length === 1) {
    $("#wheelSvg").innerHTML = `
      <circle cx="160" cy="160" r="154" fill="${items[0].color}" stroke="#ffffff" stroke-width="5"></circle>
      ${items[0].logo ? `<image href="${items[0].logo}" x="137" y="104" width="46" height="46" preserveAspectRatio="xMidYMid slice"></image>` : ""}
      <text x="160" y="160" fill="#221f1a" font-family="Cairo, Calibri, sans-serif" font-size="26" font-weight="700" text-anchor="middle" dominant-baseline="middle">${items[0].label.slice(0, 14)}</text>
    `;
    $("#wheelSvg").style.transform = `rotate(${state.rotation}deg)`;
    return;
  }

  $("#wheelSvg").innerHTML = items
    .map((item, index) => {
      const start = index * segmentSize;
      const end = start + segmentSize;
      const mid = start + segmentSize / 2;
      const label = polarToCartesian(160, 160, 98, mid);
      const logo = polarToCartesian(160, 160, 70, mid);
      return `
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${item.color}" stroke="#ffffff" stroke-width="5"></path>
        ${item.logo ? `<image href="${item.logo}" x="${logo.x - 13}" y="${logo.y - 13}" width="26" height="26" preserveAspectRatio="xMidYMid slice" transform="rotate(${mid}, ${logo.x}, ${logo.y})"></image>` : ""}
        <text x="${label.x}" y="${label.y}" fill="#221f1a" font-family="Cairo, Calibri, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid}, ${label.x}, ${label.y})">${item.label.slice(0, 10)}</text>
      `;
    })
    .join("");
  $("#wheelSvg").style.transform = `rotate(${state.rotation}deg)`;
}

function categoryWheelItems() {
  const queue = availableCategoryQueue();
  if (queue.length) return queue;
  return categories.slice(0, 6);
}

function selectedLimitedCategoryCount() {
  return state.selectedCategories.filter((category) => limitedCategoryIds.has(category.id)).length;
}

function availableCategoryQueue() {
  if (selectedLimitedCategoryCount() < limitedCategoryMax) return state.categoryQueue;
  return state.categoryQueue.filter((category) => !limitedCategoryIds.has(category.id));
}

function categoryWheelLabel(title) {
  const parts = title.replace("/", " / ").split(/\s+/).filter(Boolean);
  if (title.length <= 8 || parts.length <= 1) return [title];
  if (parts.length === 2) return parts;

  const midpoint = Math.ceil(parts.length / 2);
  return [parts.slice(0, midpoint).join(" "), parts.slice(midpoint).join(" ")];
}

function renderCategoryWheel() {
  const items = categoryWheelItems();
  const segmentSize = 360 / items.length;

  $("#categoryWheelSvg").innerHTML = items
    .map((item, index) => {
      const start = index * segmentSize;
      const end = start + segmentSize;
      const mid = start + segmentSize / 2;
      const labelPoint = polarToCartesian(160, 160, 106, mid);
      const lines = categoryWheelLabel(item.title);
      const fontSize = lines.some((line) => line.length > 10) ? 9 : 10;
      const lineHeight = fontSize + 1;
      const firstLineOffset = -((lines.length - 1) * lineHeight) / 2;
      return `
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${wheelPalette[index % wheelPalette.length]}" stroke="#ffffff" stroke-width="5"></path>
        <text x="${labelPoint.x}" y="${labelPoint.y}" fill="#221f1a" font-family="Cairo, Calibri, sans-serif" font-size="${fontSize}" font-weight="400" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid + 90}, ${labelPoint.x}, ${labelPoint.y})">
          ${lines.map((line, lineIndex) => `<tspan x="${labelPoint.x}" dy="${lineIndex === 0 ? firstLineOffset : lineHeight}">${line}</tspan>`).join("")}
        </text>
      `;
    })
    .join("");
  $("#categoryWheelSvg").style.transform = `rotate(${state.categoryRotation}deg)`;
}

function nextAssignedTeam() {
  return state.bonusRemaining > 0 ? state.bonusTeam : state.nextTeam;
}

function balancedTeam(preferredTeam) {
  const other = otherTeam(preferredTeam);
  const preferredCount = state.teams[preferredTeam].length;
  const otherCount = state.teams[other].length;
  return preferredCount + 1 - otherCount >= 2 ? other : preferredTeam;
}

function completeCurrentGroupIfNeeded() {
  const finishedPoolIndex = state.currentPoolIndex;
  if (currentQueue().length > 0) return;

  const wasOdd = state.groupStartCounts[finishedPoolIndex] % 2 === 1;
  const hasNextGroup = state.poolQueues.slice(finishedPoolIndex + 1).some((queue) => queue.length > 0);
  if (wasOdd && hasNextGroup) {
    state.bonusTeam = balancedTeam(state.nextTeam);
    state.bonusRemaining = 2;
    state.lastResult += ` ${teamLabel(state.bonusTeam)} ياخذ أول اختيارين من المجموعة الجاية.`;
  }

  state.currentPoolIndex += 1;
  advanceToNextAvailablePool();
}

function assignSelectedPlayer(selectedIndex, usedSpin) {
  const queue = currentQueue();
  const [assigned] = queue.splice(selectedIndex, 1);
  const preferredTeam = nextAssignedTeam();
  const team = balancedTeam(preferredTeam);
  state.teams[team].push(assigned);
  state.assigned.push({ ...assigned, team });

  if (state.bonusRemaining > 0) {
    state.bonusRemaining -= 1;
    if (state.bonusRemaining === 0) {
      state.nextTeam = otherTeam(team);
      state.bonusTeam = null;
    }
  } else {
    state.nextTeam = otherTeam(team);
  }

  state.spinning = false;
  state.lastResult = usedSpin ? `${assigned.name} انضم إلى ${teamLabel(team)}` : `${assigned.name} آخر اسم في ${assigned.pool} وانضم إلى ${teamLabel(team)}`;
  completeCurrentGroupIfNeeded();
  render();
  if (!remainingPlayers().length) {
    playGrandFinale();
    showScreen("results");
  } else {
    playCelebration();
  }
}

function spin() {
  if (state.spinning) return;
  if (!state.drawReady) resetDraw("بدأت القرعة");
  advanceToNextAvailablePool();

  const queue = currentQueue();
  if (!queue.length) {
    state.lastResult = allPlayers().length ? "توزع كل اللاعبين" : "ضيف اللاعبين قبل ما تسحب";
    render();
    showScreen(allPlayers().length ? "results" : "setup");
    return;
  }

  const selectedIndex = randomInt(queue.length);
  if (queue.length === 1) {
    assignSelectedPlayer(selectedIndex, false);
    return;
  }

  const segmentSize = 360 / queue.length;
  const segmentCenter = selectedIndex * segmentSize + segmentSize / 2;
  const desiredPointerAngle = 360 - segmentCenter;
  const currentNormalized = ((state.rotation % 360) + 360) % 360;
  const extraTurns = 4 + randomInt(3);
  const delta = extraTurns * 360 + ((desiredPointerAngle - currentNormalized + 360) % 360);

  state.spinning = true;
  state.rotation += delta;
  state.lastResult = `نسحب اسم من ${currentPool().title}...`;
  playSpinSounds(4.5, delta, segmentSize);
  render();

  window.setTimeout(() => {
    assignSelectedPlayer(selectedIndex, true);
  }, 4550);
}

function assignCategory(selectedIndex) {
  const category = availableCategoryQueue()[selectedIndex];
  if (!category) {
    state.categorySpinning = false;
    state.categoryLastResult = "ما فيه فئة متاحة حسب القوانين";
    render();
    return;
  }

  state.categoryQueue = state.categoryQueue.filter((item) => item.id !== category.id);
  state.selectedCategories.push(category);
  state.categorySpinning = false;
  state.categoryLastResult = state.selectedCategories.length === 6 ? "تم اختيار كل الفئات الست" : `تم اختيار ${category.title}`;
  if (state.selectedCategories.length === 6) {
    playGrandFinale();
  } else {
    playCelebration();
  }
  render();
}

function spinCategory() {
  if (state.categorySpinning || state.selectedCategories.length >= 6) return;
  if (!state.categoryQueue.length) resetCategories();

  const queue = availableCategoryQueue();
  if (!queue.length) {
    state.categoryLastResult = "ما فيه فئة متاحة حسب القوانين";
    render();
    return;
  }

  const selectedIndex = randomInt(queue.length);
  const segmentSize = 360 / queue.length;
  const segmentCenter = selectedIndex * segmentSize + segmentSize / 2;
  const desiredPointerAngle = 360 - segmentCenter;
  const currentNormalized = ((state.categoryRotation % 360) + 360) % 360;
  const extraTurns = 4 + randomInt(3);
  const delta = extraTurns * 360 + ((desiredPointerAngle - currentNormalized + 360) % 360);

  state.categorySpinning = true;
  state.categoryRotation += delta;
  state.categoryLastResult = "نسحب فئة...";
  playSpinSounds(4.5, delta, segmentSize);
  render();

  window.setTimeout(() => {
    assignCategory(selectedIndex);
  }, 4550);
}

function renderProgress() {
  const total = allPlayers().length;
  $("#alphaProgress").textContent = `${state.teams.one.length}/${total}`;
  $("#betaProgress").textContent = `${state.teams.two.length}/${total}`;
  $("#totalPlayers").textContent = total;

  const pool = currentPool();
  const nextTeamText = remainingPlayers().length ? `الاختيار الجاي: ${teamLabel(nextAssignedTeam())}` : "افتح النتائج وشوف الفرق";
  $("#upNextName").textContent = pool && currentQueue().length ? pool.title : remainingPlayers().length ? "ننتقل للمجموعة الجاية" : "توزع كل اللاعبين";
  $("#upNextPool").textContent = pool && currentQueue().length ? `باقي ${currentQueue().length} أسماء. ${nextTeamText}` : nextTeamText;
  $("#spinStatus").textContent = state.lastResult || "";
  $("#spinBtn").disabled = state.spinning || total === 0 || (state.drawReady && remainingPlayers().length === 0);
}

function playerRow(player) {
  return `
    <div class="row flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <img src="${player.logo}" alt="${player.pool}" class="team-logo" />
        <span class="arabic-text text-xl font-bold" dir="rtl">${player.name}</span>
      </div>
      <span class="arabic-text text-sm font-bold text-muted" dir="rtl">${player.pool}</span>
    </div>
  `;
}

function compactPlayerRow(player) {
  return `
    <div class="row flex items-center justify-center gap-3 px-4 py-3">
      <img src="${player.logo}" alt="${player.pool}" class="team-logo" />
      <span class="arabic-text text-xl font-bold" dir="rtl">${player.name}</span>
    </div>
  `;
}

function renderResults() {
  $("#alphaCount").textContent = `${state.teams.one.length} لاعبين`;
  $("#betaCount").textContent = `${state.teams.two.length} لاعبين`;
  $("#alphaList").innerHTML = state.teams.one.length ? state.teams.one.map(playerRow).join("") : `<p class="empty-note px-4 py-3 text-sm font-medium">ما فيه أسماء لحين</p>`;
  $("#betaList").innerHTML = state.teams.two.length ? state.teams.two.map(playerRow).join("") : `<p class="empty-note px-4 py-3 text-sm font-medium">ما فيه أسماء لحين</p>`;
  $("#drawAlphaCount").textContent = state.teams.one.length;
  $("#drawBetaCount").textContent = state.teams.two.length;
  $("#drawAlphaList").innerHTML = state.teams.one.length ? state.teams.one.map(compactPlayerRow).join("") : `<p class="empty-note px-3 py-2 text-xs font-medium">ما فيه لاعبين لحين</p>`;
  $("#drawBetaList").innerHTML = state.teams.two.length ? state.teams.two.map(compactPlayerRow).join("") : `<p class="empty-note px-3 py-2 text-xs font-medium">ما فيه لاعبين لحين</p>`;
}

function categoryCard(category, index) {
  if (!category) {
    return `
      <div class="category-card slot-card flex flex-col items-center justify-center rounded-xl p-3 text-center">
        <span class="text-xs font-semibold">خانة ${index + 1}</span>
      </div>
    `;
  }

  return `
    <div class="category-card panel rounded-xl p-2">
      <div class="category-card-art rounded-lg">
        <img src="${category.image}" alt="${category.title}" class="category-card-image" />
      </div>
      <p class="category-card-title arabic-text mt-2 min-h-8 text-center text-base font-bold leading-tight" dir="rtl">${category.title}</p>
    </div>
  `;
}

function renderCategories() {
  const slots = Array.from({ length: 6 }, (_, index) => state.selectedCategories[index] || null);
  $("#selectedCategories").innerHTML = slots.map(categoryCard).join("");
  const lastPick = state.selectedCategories[state.selectedCategories.length - 1];
  $("#categoryPickName").textContent = lastPick ? lastPick.title : "جاهز للاختيار";
  $("#categoryStatus").textContent = state.categoryLastResult;
  $("#categoryPickedCount").textContent = `${state.selectedCategories.length}/6`;
  $("#categoryRemainingCount").textContent = availableCategoryQueue().length;
  $("#spinCategoryBtn").disabled = state.categorySpinning || state.selectedCategories.length >= 6 || availableCategoryQueue().length === 0;
}

function render() {
  renderPools();
  renderWheel();
  renderCategoryWheel();
  renderProgress();
  renderResults();
  renderCategories();
  showScreen(state.activeScreen);
}

$$(".nav-btn").forEach((button) => button.addEventListener("click", () => showScreen(button.dataset.screen)));
$("#shuffleQueueBtn").addEventListener("click", () => {
  resetDraw("بدأت القرعة");
  showScreen("randomize");
});
$("#spinBtn").addEventListener("click", spin);
$("#spinCategoryBtn").addEventListener("click", spinCategory);
$("#resetCategoriesBtn").addEventListener("click", () => resetCategories());
$("#startOverBtn").addEventListener("click", startOver);
$("#soundToggleBtn").addEventListener("click", toggleSound);

updateSoundToggle();
preloadAssets();
if (loadState()) {
  render();
} else {
  state.categoryQueue = shuffle(categories);
  state.categoryLastResult = defaultCategoryMessage;
  resetDraw("جاهزين للبداية");
}
