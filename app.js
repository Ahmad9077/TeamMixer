const pools = [
  { id: "poolA", title: "جلاد التنانين", accent: "#7c2d12", logo: "assets/dragon-slayer.jpg", players: ["جراغ", "الملا", "طروق"] },
  { id: "poolB", title: "التنانين", accent: "#b3403a", logo: "assets/dragon-red.jpg", players: ["حميد", "البريجي", "بوحمد"] },
  { id: "poolC", title: "الأسود", accent: "#b45309", logo: "assets/lion-yellow.jpg", players: ["عليوي", "الخلف", "الهلالي"] },
  { id: "poolD", title: "الذئاب", accent: "#1d4ed8", logo: "assets/wolf-blue.jpg", players: ["حمود", "مويس", "قرطبة"] },
  { id: "poolE", title: "البطاريق", accent: "#111827", logo: "assets/penguin-black.jpg", players: ["هشوم"] },
];

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const categories = [
  { id: "travel", title: "سياحة وسفر", image: "assets/categories/travel.jpg" },
  { id: "geography", title: "جغرافيا", image: "assets/categories/geography.jpg" },
  { id: "countries-capitals", title: "دول و عواصم", image: "assets/categories/countries-capitals.jpg" },
  { id: "cars", title: "سيارات", image: "assets/categories/cars.jpg" },
  { id: "kuwait", title: "الكويت", image: "assets/categories/kuwait.jpg" },
  { id: "general-info", title: "معلومات عامة", image: "assets/categories/general-info.jpg" },
  { id: "sports", title: "رياضة", image: "assets/categories/sports.jpg" },
  { id: "foreign-word", title: "ولا كلمة فن أجنبي", image: "assets/categories/foreign-word.jpg" },
  { id: "location", title: "لوكيشن", image: "assets/categories/location.jpg" },
  { id: "riddles", title: "ألغاز", image: "assets/categories/riddles.jpg" },
  { id: "world-logos", title: "شعارات عالمية", image: "assets/categories/world-logos.jpg" },
  { id: "technology", title: "تكنولوجيا", image: "assets/categories/technology.jpg" },
  { id: "no-word", title: "ولا كلمة", image: "assets/categories/no-word.jpg" },
  { id: "kuwait-malls", title: "مجمعات الكويت", image: "assets/categories/kuwait-malls.jpg" },
  { id: "moving-letters", title: "حروف متحركة", image: "assets/categories/moving-letters.jpg" },
  { id: "letters", title: "حروف", image: "assets/categories/letters.jpg" },
];

// Category wheel limit groups: once a group reaches max, remaining members are excluded.
const categoryLimitGroups = [
  { ids: new Set(["travel", "geography", "countries-capitals"]), max: 2 },
  { ids: new Set(["no-word", "foreign-word"]), max: 1 },
];
const legacyCategoryIds = new Map([["history", "sports"]]);
const preloadedAssetUrls = new Set();

const STORAGE_KEY = "seenjeem_state_v1";
const ROSTER_VERSION = 3;
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

const wheelPalette = ["#fed7aa", "#fecaca", "#bfdbfe", "#bbf7d0", "#e9d5ff", "#fde68a", "#c7d2fe", "#bae6fd"];

const fallbackWheelSegments = [
  { label: "جاهز", color: wheelPalette[0] },
  { label: "قرعة", color: wheelPalette[1] },
  { label: "اسم", color: wheelPalette[2] },
  { label: "سحب", color: wheelPalette[3] },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

function preloadImage(url) {
  if (!url || preloadedAssetUrls.has(url)) return;
  preloadedAssetUrls.add(url);
  const image = new Image();
  image.src = url;
}

function preloadAssets() {
  pools.forEach((pool) => preloadImage(pool.logo));
  categories.forEach((category) => preloadImage(category.image));
  try {
    if (ADMIN_SOUND_SETTINGS.enabled) fetchSpinClips();
  } catch {
    /* sound must never break the game */
  }
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

// Audio is controlled only here. There is intentionally no user-facing sound
// switch in the prototype UI.
const ADMIN_SOUND_SETTINGS = Object.freeze({
  enabled: true,
  masterVolume: 0.5,
  playerSounds: Object.freeze({
    "البريجي": "assets/sounds/player-breiji.mp3",
    "حميد": "assets/sounds/player-hameed.mp3",
    "الملا": "assets/sounds/player-almulla.mp3",
    "حمود": "assets/sounds/player-hamoud.mp3",
    "عليوي": "assets/sounds/player-alewi.mp3",
    "بوحمد": "assets/sounds/player-buhamad.mp3",
    "الخلف": "assets/sounds/player-alkhalaf.mp3",
    "قرطبة": "assets/sounds/player-qurtuba.mp3",
    "مويس": "assets/sounds/player-mousa.mp3",
    "طروق": "assets/sounds/player-tarouq.mp3",
    "جراغ": "assets/sounds/player-jaragh.mp3",
    "هشوم": "assets/sounds/player-hashoum.mp3",
  }),
});

let audioCtx = null;
let masterGain = null;

// Spinning voice clips are intentionally disabled. Player spins use only
// the synthesized whoosh and wheel ticks.
const spinClips = [];

// Random post-selection voice clips are intentionally disabled. Players
// without a dedicated clip use only synthesized celebration sounds.
const celebrationClips = [];

// Per-player clips, keyed by player name. Clip files can be replaced in-place
// without changing this registry when the player-to-path mapping stays the same.
// When that player is chosen, their
// clip plays after the selection and no other voice clip plays for them —
// neither during their spin nor as their celebration.
const playerClips = Object.fromEntries(
  Object.entries(ADMIN_SOUND_SETTINGS.playerSounds).map(([player, url]) => [player, { url, data: null, buffer: null }])
);

let spinClipUsed = false;

function allVoiceClips() {
  return [...spinClips, ...celebrationClips, ...Object.values(playerClips)];
}

function fetchSpinClips() {
  allVoiceClips().forEach((clip) => {
    if (clip.data || clip.buffer) return;
    fetch(clip.url)
      .then((response) => (response.ok ? response.arrayBuffer() : null))
      .then((data) => {
        clip.data = data;
        decodeSpinClips();
      })
      .catch(() => {});
  });
}

function decodeSpinClips() {
  if (!audioCtx) return;
  allVoiceClips().forEach((clip) => {
    if (!clip.data || clip.buffer) return;
    const data = clip.data;
    clip.data = null;
    audioCtx.decodeAudioData(data).then(
      (buffer) => {
        clip.buffer = buffer;
      },
      () => {}
    );
  });
}

function audio() {
  if (!ADMIN_SOUND_SETTINGS.enabled) return null;
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = ADMIN_SOUND_SETTINGS.masterVolume;
      masterGain.connect(audioCtx.destination);
      decodeSpinClips();
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

function playPlayerClip(player) {
  try {
    const clip = playerClips[player.name];
    if (!clip || !audio()) return false;
    return playVoiceClip(clip);
  } catch {
    return false;
  }
}

function playCelebration(allowClips = false) {
  try {
    if (!audio()) return;
    // Celebration voice clips only join the pool when this player's spin
    // did not already use a voice clip (no two mp3 sounds per player).
    // When eligible, the clips get a 50/50 chance against the whole
    // synthesized pool so they are heard regularly.
    const readyClips = allowClips && !spinClipUsed ? celebrationClips.filter((clip) => clip.buffer) : [];
    spinClipUsed = false;
    if (readyClips.length && randomInt(2) === 0) {
      playVoiceClip(readyClips[randomInt(readyClips.length)]);
    } else {
      celebrationSfx[randomInt(celebrationSfx.length)]();
    }
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

function playVoiceClip(clip) {
  const ctx = audio();
  if (!ctx || !clip.buffer) return false;
  // Clips always play to their natural end, even after the wheel lands.
  const t0 = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = clip.buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(0.9, t0 + 0.06);
  source.connect(gain).connect(masterGain);
  source.start(t0);
  return true;
}

function playSpinSounds(durationSec, totalDeg, segmentDeg, allowClips = false) {
  try {
    if (!audio()) return;
    if (allowClips) {
      const readyClips = spinClips.filter((clip) => clip.buffer);
      // Random pick between the voice clips and the synthesized ticks:
      // each ready clip and the tick sound get an equal slot.
      const slot = randomInt(readyClips.length + 1);
      if (slot < readyClips.length && playVoiceClip(readyClips[slot])) {
        spinClipUsed = true;
        return;
      }
    }
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

function otherTeam(team) {
  return team === "one" ? "two" : "one";
}

function teamLabel(team) {
  return team === "one" ? "الفريق الأول" : "الفريق الثاني";
}

function poolLevel(poolId) {
  const index = pools.findIndex((pool) => pool.id === poolId);
  return index === -1 ? 0 : pools.length - index;
}

function teamLevelTotal(players) {
  return players.reduce((total, player) => total + poolLevel(player.poolId), 0);
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

function applyFreshDrawState(message = defaultDrawMessage) {
  frozenWheelItems = null;
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
}

function saveState() {
  try {
    const payload = {
      version: 1,
      rosterVersion: ROSTER_VERSION,
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

    const needsRosterMigration = data.rosterVersion !== ROSTER_VERSION;
    if (!needsRosterMigration) {
      pools.forEach((pool) => {
        const names = data.players?.[pool.id];
        if (Array.isArray(names)) pool.players = names.filter((name) => typeof name === "string" && name.trim());
      });
    }

    const poolById = new Map(pools.map((pool) => [pool.id, pool]));
    const revivePlayer = (entry) => {
      if (!entry || typeof entry.name !== "string") return null;
      const pool = poolById.get(entry.poolId);
      return pool ? playerFromPool(pool, entry.name) : null;
    };

    const draw = data.draw || {};
    if (needsRosterMigration) {
      applyFreshDrawState("تم تحديث التصنيف، ابدأ القرعة");
    } else {
      state.poolQueues = pools.map((pool, index) => {
        const names = Array.isArray(draw.poolQueues?.[index]) ? draw.poolQueues[index] : [];
        return names.filter((name) => typeof name === "string").map((name) => playerFromPool(pool, name));
      });
      state.groupStartCounts = pools.map((pool) => pool.players.length);
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
    }

    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const storedCategories = data.categories || {};
    const reviveCategories = (ids) =>
      [...new Set(ids.filter((id) => typeof id === "string").map((id) => legacyCategoryIds.get(id) || id))]
        .map((id) => categoryById.get(id))
        .filter(Boolean);
    state.categoryQueue = reviveCategories(Array.isArray(storedCategories.queueIds) ? storedCategories.queueIds : []);
    state.selectedCategories = reviveCategories(Array.isArray(storedCategories.selectedIds) ? storedCategories.selectedIds : []);
    const selectedCategoryIds = new Set(state.selectedCategories.map((category) => category.id));
    state.categoryQueue = state.categoryQueue.filter((category) => !selectedCategoryIds.has(category.id));
    state.categoryLastResult = typeof storedCategories.lastResult === "string" ? storedCategories.lastResult : defaultCategoryMessage;
    state.categorySpinning = false;
    state.categoryRotation = 0;

    state.activeScreen = needsRosterMigration ? "setup" : SCREENS.includes(data.activeScreen) ? data.activeScreen : "setup";
    advanceToNextAvailablePool();
    return true;
  } catch {
    return false;
  }
}

function resetDraw(message = defaultDrawMessage) {
  applyFreshDrawState(message);
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
  navigateTo("setup");
}

function showScreen(screen) {
  state.activeScreen = screen;
  $$(".screen").forEach((section) => section.classList.toggle("active", section.id === screen));
  $$(".nav-btn").forEach((button) => button.classList.toggle("nav-active", button.dataset.screen === screen));
  saveState();
}

function navigateTo(screen) {
  showScreen(screen);
  window.scrollTo({ top: 0, behavior: "auto" });
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
        <article class="pool-card panel" style="--pool-accent:${pool.accent}">
          <div class="mb-3 flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2.5">
              <img src="${pool.logo}" alt="${pool.title}" class="team-logo" />
              <div class="min-w-0">
                <h3 class="arabic-text text-lg font-extrabold leading-tight" dir="rtl">${pool.title}</h3>
                <span class="level-badge mt-1 px-2 py-1 text-[11px]" style="color:${pool.accent}">المستوى ${poolLevel(pool.id)}</span>
              </div>
            </div>
            <div class="text-left">
              <span class="count-chip px-2.5 py-1.5 text-xs" style="color:${pool.accent}">${pool.players.length}</span>
              <p class="mt-1 text-[10px] font-semibold text-muted">لاعبين</p>
            </div>
          </div>
          <div class="flex gap-2">
            <input id="input-${pool.id}" class="field min-w-0 flex-1 px-3 py-2.5 text-sm font-normal" placeholder="ضيف اسم اللاعب" aria-label="إضافة لاعب إلى ${pool.title}" />
            <button class="add-btn btn-primary px-3.5 py-2.5 text-sm" data-pool="${pool.id}">إضافة</button>
          </div>
          <div class="mt-3 flex min-h-16 flex-wrap content-start gap-1.5">
            ${pool.players
              .map((player, index) => {
                const safePlayer = escapeHtml(player);
                return `
                  <span class="chip inline-flex max-w-full items-center gap-1.5 py-1 pe-1 ps-2 text-sm font-bold">
                    <img src="${pool.logo}" alt="${pool.title}" class="team-logo-sm" />
                    <span class="arabic-text min-w-0 truncate font-bold" dir="rtl">${safePlayer}</span>
                    <button class="remove-btn chip-remove" data-pool="${pool.id}" data-index="${index}" aria-label="حذف ${safePlayer}">×</button>
                  </span>
                `;
              })
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

// After a spin lands, the wheel keeps showing the segments it landed on
// (including the selected player) until the next spin starts.
let frozenWheelItems = null;

function wheelItems() {
  if (frozenWheelItems) return frozenWheelItems;
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
    const mid = 180;
    const label = polarToCartesian(160, 160, 118, 180);
    const logo = polarToCartesian(160, 160, 70, 180);
    $("#wheelSvg").innerHTML = `
      <circle cx="160" cy="160" r="154" fill="${items[0].color}" stroke="#ffffff" stroke-width="5"></circle>
      ${items[0].logo ? `<image href="${items[0].logo}" x="${logo.x - 18}" y="${logo.y - 18}" width="36" height="36" preserveAspectRatio="xMidYMid slice" transform="rotate(${mid} ${logo.x} ${logo.y})"></image>` : ""}
    `;
    $("#wheelLabels").innerHTML = `<span class="player-wheel-label${items[0].label.length > 12 ? " player-wheel-label-long" : ""}" dir="rtl" lang="ar" style="left:${(label.x / 320) * 100}%;top:${(label.y / 320) * 100}%;transform:translate(-50%,-50%) rotate(${mid}deg)">${escapeHtml(items[0].label)}</span>`;
    $("#wheelRotor").style.transform = `rotate(${state.rotation}deg)`;
    return;
  }

  $("#wheelSvg").innerHTML = items
    .map((item, index) => {
      const start = index * segmentSize;
      const end = start + segmentSize;
      const mid = start + segmentSize / 2;
      const logo = polarToCartesian(160, 160, 70, mid);
      return `
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${item.color}" stroke="#ffffff" stroke-width="5"></path>
        ${item.logo ? `<image href="${item.logo}" x="${logo.x - 13}" y="${logo.y - 13}" width="26" height="26" preserveAspectRatio="xMidYMid slice" transform="rotate(${mid} ${logo.x} ${logo.y})"></image>` : ""}
      `;
    })
    .join("");

  $("#wheelLabels").innerHTML = items
    .map((item, index) => {
      const mid = index * segmentSize + segmentSize / 2;
      const labelPoint = polarToCartesian(160, 160, 118, mid);
      const longClass = item.label.length > 12 ? " player-wheel-label-long" : "";
      return `<span class="player-wheel-label${longClass}" dir="rtl" lang="ar" style="left:${(labelPoint.x / 320) * 100}%;top:${(labelPoint.y / 320) * 100}%;transform:translate(-50%,-50%) rotate(${mid}deg)">${escapeHtml(item.label)}</span>`;
    })
    .join("");
  $("#wheelRotor").style.transform = `rotate(${state.rotation}deg)`;
}

function categoryWheelItems() {
  const queue = availableCategoryQueue();
  if (queue.length) return queue;
  return categories.slice(0, 6);
}

function selectedCategoryLimitCount(limitGroup) {
  return state.selectedCategories.filter((category) => limitGroup.ids.has(category.id)).length;
}

function availableCategoryQueue() {
  return state.categoryQueue.filter((category) =>
    categoryLimitGroups.every((limitGroup) => selectedCategoryLimitCount(limitGroup) < limitGroup.max || !limitGroup.ids.has(category.id))
  );
}

function uprightWheelLabelRotation(angle) {
  let rotation = ((angle + 90 + 180) % 360) - 180;
  if (rotation > 90) rotation -= 180;
  if (rotation < -90) rotation += 180;
  return rotation;
}

function renderCategoryWheel() {
  const items = categoryWheelItems();
  const segmentSize = 360 / items.length;

  $("#categoryWheelSvg").innerHTML = items
    .map((item, index) => {
      const start = index * segmentSize;
      const end = start + segmentSize;
      return `
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${wheelPalette[index % wheelPalette.length]}" stroke="#ffffff" stroke-width="5"></path>
      `;
    })
    .join("");

  $("#categoryWheelLabels").innerHTML = items
    .map((item, index) => {
      const mid = index * segmentSize + segmentSize / 2;
      const labelPoint = polarToCartesian(160, 160, 106, mid);
      const labelRotation = uprightWheelLabelRotation(mid + state.categoryRotation) - state.categoryRotation;
      const longClass = item.title.length > 14 ? " category-wheel-label-long" : "";
      return `<span class="category-wheel-label${longClass}" dir="rtl" lang="ar" style="left:${(labelPoint.x / 320) * 100}%;top:${(labelPoint.y / 320) * 100}%;transform:translate(-50%,-50%) rotate(${labelRotation}deg)">${item.title}</span>`;
    })
    .join("");
  $("#categoryWheelRotor").style.transform = `rotate(${state.categoryRotation}deg)`;
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

function assignSelectedPlayer(selectedIndex) {
  const queue = currentQueue();
  frozenWheelItems = wheelItems();
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
  state.lastResult = `${assigned.name} انضم إلى ${teamLabel(team)}`;
  completeCurrentGroupIfNeeded();
  render();
  if (!remainingPlayers().length) {
    if (playPlayerClip(assigned)) {
      try {
        sfxApplause(0.3, 30);
      } catch {
        /* sound must never break the game */
      }
    } else {
      playGrandFinale();
    }
    navigateTo("results");
  } else if (playerClips[assigned.name]) {
    // Dedicated player clip; if it is not ready yet, fall back to the
    // synthesized celebrations only (no other voice clip for this player).
    if (!playPlayerClip(assigned)) playCelebration(false);
  } else {
    playCelebration(true);
  }
}

function spin() {
  if (state.spinning) return;
  spinClipUsed = false;
  frozenWheelItems = null;
  if (!state.drawReady) resetDraw("بدأت القرعة");
  advanceToNextAvailablePool();

  const queue = currentQueue();
  if (!queue.length) {
    state.lastResult = allPlayers().length ? "توزع كل اللاعبين" : "ضيف اللاعبين قبل ما تسحب";
    render();
    navigateTo(allPlayers().length ? "results" : "setup");
    return;
  }

  const selectedIndex = randomInt(queue.length);
  const selected = queue[selectedIndex];
  const segmentSize = 360 / queue.length;
  const segmentCenter = selectedIndex * segmentSize + segmentSize / 2;
  const desiredPointerAngle = 360 - segmentCenter;
  const currentNormalized = ((state.rotation % 360) + 360) % 360;
  const extraTurns = 4 + randomInt(3);
  const delta = extraTurns * 360 + ((desiredPointerAngle - currentNormalized + 360) % 360);

  state.spinning = true;
  state.rotation += delta;
  state.lastResult = `نسحب اسم من ${currentPool().title}...`;
  playSpinSounds(4.5, delta, segmentSize, !playerClips[selected.name]);
  render();

  window.setTimeout(() => {
    assignSelectedPlayer(selectedIndex);
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
  const assignedCount = state.assigned.length;
  $("#alphaProgress").textContent = `${state.teams.one.length}/${total}`;
  $("#betaProgress").textContent = `${state.teams.two.length}/${total}`;
  $("#totalPlayers").textContent = total;
  $("#drawProgressLabel").textContent = `${assignedCount}/${total}`;
  $("#drawProgressFill").style.width = `${total ? (assignedCount / total) * 100 : 0}%`;

  const readiness = $("#drawReadiness");
  readiness.textContent = total ? "جاهزة" : "أضف لاعبين";
  readiness.classList.toggle("is-ready", total > 0);

  const pool = currentPool();
  const nextTeamText = remainingPlayers().length ? `الاختيار الجاي: ${teamLabel(nextAssignedTeam())}` : "افتح النتائج وشوف الفرق";
  $("#upNextName").textContent = pool && currentQueue().length ? pool.title : remainingPlayers().length ? "ننتقل للمجموعة الجاية" : "توزع كل اللاعبين";
  $("#upNextPool").textContent = pool && currentQueue().length ? `باقي ${currentQueue().length} أسماء. ${nextTeamText}` : nextTeamText;
  $("#currentPoolRank").textContent = pool ? `المستوى ${poolLevel(pool.id)}` : "اكتملت المجموعات";
  $("#currentPoolRemaining").textContent = currentQueue().length;
  const currentPoolLogo = $("#currentPoolLogo");
  currentPoolLogo.hidden = !pool;
  if (pool) {
    currentPoolLogo.src = pool.logo;
    currentPoolLogo.alt = pool.title;
  }
  $("#currentPoolPlayers").innerHTML = currentQueue().length
    ? currentQueue()
        .map(
          (player) => `
            <div class="queue-player">
              <img src="${player.logo}" alt="${player.pool}" class="team-logo-sm" />
              <span class="arabic-text min-w-0 truncate" dir="rtl">${escapeHtml(player.name)}</span>
            </div>
          `
        )
        .join("")
    : `<p class="empty-note px-3 py-2.5 text-xs font-semibold">ما فيه أسماء في الدور</p>`;
  $("#spinStatus").textContent = state.lastResult || "";
  $("#spinBtn").disabled = state.spinning || total === 0 || (state.drawReady && remainingPlayers().length === 0);
  $("#headerResetBtn").disabled = state.spinning || state.categorySpinning || total === 0;
}

function playerRow(player) {
  const safeName = escapeHtml(player.name);
  return `
    <div class="row flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
      <div class="flex min-w-0 items-center gap-3">
        <img src="${player.logo}" alt="${player.pool}" class="team-logo" />
        <span class="arabic-text min-w-0 text-lg font-bold sm:text-xl" dir="rtl">${safeName}</span>
      </div>
      <div class="flex flex-col items-end gap-1 text-left">
        <span class="level-badge px-2 py-1 text-[10px]">المستوى ${poolLevel(player.poolId)}</span>
        <span class="arabic-text text-[10px] font-bold text-muted sm:text-xs" dir="rtl">${player.pool}</span>
      </div>
    </div>
  `;
}

function compactPlayerRow(player) {
  const safeName = escapeHtml(player.name);
  return `
    <div class="row flex min-w-0 items-center gap-2 px-2.5 py-2">
      <img src="${player.logo}" alt="${player.pool}" class="team-logo-sm" />
      <span class="arabic-text min-w-0 truncate text-sm font-bold" dir="rtl">${safeName}</span>
    </div>
  `;
}

function renderResults() {
  const alphaLevel = teamLevelTotal(state.teams.one);
  const betaLevel = teamLevelTotal(state.teams.two);
  const totalLevel = alphaLevel + betaLevel;
  const levelDifference = Math.abs(alphaLevel - betaLevel);
  const balancePercent = totalLevel ? Math.max(0, Math.round((1 - levelDifference / totalLevel) * 100)) : 0;
  const balanceText = !state.assigned.length
    ? "بانتظار اكتمال القرعة"
    : levelDifference === 0
      ? "توازن كامل في مجموع المستويات"
      : levelDifference <= 1
        ? "تقارب ممتاز بين الفريقين"
        : levelDifference <= 3
          ? "تقارب جيد بين الفريقين"
          : "يوجد فرق في مجموع المستويات";

  $("#alphaCount").textContent = `${state.teams.one.length} لاعبين`;
  $("#betaCount").textContent = `${state.teams.two.length} لاعبين`;
  $("#alphaList").innerHTML = state.teams.one.length ? state.teams.one.map(playerRow).join("") : `<p class="empty-note px-4 py-3 text-sm font-medium">ما فيه أسماء لحين</p>`;
  $("#betaList").innerHTML = state.teams.two.length ? state.teams.two.map(playerRow).join("") : `<p class="empty-note px-4 py-3 text-sm font-medium">ما فيه أسماء لحين</p>`;
  $("#drawAlphaCount").textContent = state.teams.one.length;
  $("#drawBetaCount").textContent = state.teams.two.length;
  $("#drawAlphaList").innerHTML = state.teams.one.length ? state.teams.one.map(compactPlayerRow).join("") : `<p class="empty-note px-3 py-2 text-xs font-medium">ما فيه لاعبين لحين</p>`;
  $("#drawBetaList").innerHTML = state.teams.two.length ? state.teams.two.map(compactPlayerRow).join("") : `<p class="empty-note px-3 py-2 text-xs font-medium">ما فيه لاعبين لحين</p>`;
  $("#drawAlphaLevel").textContent = `مجموع المستويات ${alphaLevel}`;
  $("#drawBetaLevel").textContent = `مجموع المستويات ${betaLevel}`;
  $("#alphaLevelTotal").textContent = `مجموع المستويات ${alphaLevel}`;
  $("#betaLevelTotal").textContent = `مجموع المستويات ${betaLevel}`;
  $("#resultBalanceText").textContent = balanceText;
  $("#resultBalanceValue").textContent = `${balancePercent}%`;
  $("#resultBalanceValue").classList.toggle("is-ready", balancePercent >= 85 && state.assigned.length > 0);
  $("#resultBalanceFill").style.width = `${balancePercent}%`;
}

function categoryCard(category, index) {
  if (!category) {
    return `
      <div class="category-card slot-card flex flex-col items-center justify-center p-2 text-center">
        <span class="text-xs font-semibold">خانة ${index + 1}</span>
      </div>
    `;
  }

  return `
    <div class="category-card">
      <div class="category-card-art">
        <img src="${category.image}" alt="${category.title}" class="category-card-image" />
      </div>
      <p class="category-card-title arabic-text mt-1.5 min-h-7 text-center text-xs font-bold leading-tight sm:text-sm" dir="rtl">${category.title}</p>
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
  $("#resetCategoriesBtn").disabled = state.categorySpinning;

  const appliedRules = [];
  if (selectedCategoryLimitCount(categoryLimitGroups[0]) >= categoryLimitGroups[0].max) {
    appliedRules.push("اكتمل الحد المسموح: فئتان فقط من دول وعواصم، جغرافيا، وسياحة وسفر");
  }
  if (selectedCategoryLimitCount(categoryLimitGroups[1]) >= categoryLimitGroups[1].max) {
    appliedRules.push("تم استبعاد الفئة المقابلة بين ولا كلمة وولا كلمة فن أجنبي");
  }
  const ruleNotice = $("#categoryRuleNotice");
  ruleNotice.hidden = appliedRules.length === 0;
  ruleNotice.textContent = appliedRules.join(". ");
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

$$(".nav-btn").forEach((button) => button.addEventListener("click", () => navigateTo(button.dataset.screen)));
$("#shuffleQueueBtn").addEventListener("click", () => {
  resetDraw("بدأت القرعة");
  navigateTo("randomize");
});
$("#headerResetBtn").addEventListener("click", () => {
  resetDraw("بدأت قرعة جديدة");
  navigateTo("randomize");
});
$("#spinBtn").addEventListener("click", spin);
$("#spinCategoryBtn").addEventListener("click", spinCategory);
$("#resetCategoriesBtn").addEventListener("click", () => resetCategories());
$("#rerunDrawBtn").addEventListener("click", () => {
  resetDraw("بدأت قرعة جديدة");
  navigateTo("randomize");
});
$("#startOverBtn").addEventListener("click", startOver);

preloadAssets();
if (loadState()) {
  render();
} else {
  state.categoryQueue = shuffle(categories);
  state.categoryLastResult = defaultCategoryMessage;
  resetDraw("جاهزين للبداية");
}
window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
