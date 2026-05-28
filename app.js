const pools = [
  { id: "poolA", title: "التنانين", accent: "#b9c7e0", logo: "assets/dragon-red.jpg", players: ["الملا", "جراغ", "حميد", "طروق", "البريجي"] },
  { id: "poolB", title: "الأسود", accent: "#e0c47e", logo: "assets/lion-yellow.jpg", players: ["بوحمد"] },
  { id: "poolC", title: "الذئاب", accent: "#8bd6b6", logo: "assets/wolf-blue.jpg", players: ["حمود", "عليوي", "الخلف", "الهلالي", "قرطبة"] },
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
  { id: "theater-poster", title: "بوستر مسرح كبار", image: "assets/categories/theater-poster.jpg" },
  { id: "islamic-order", title: "ترتيب إسلامي", image: "assets/categories/islamic-order.jpg" },
  { id: "sports", title: "رياضة", image: "assets/categories/sports.jpg" },
  { id: "letters", title: "حروف", image: "assets/categories/letters.jpg" },
];

const limitedCategoryIds = new Set(["travel", "geography", "countries-capitals"]);
const limitedCategoryMax = 2;
const preloadedAssetUrls = new Set();

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
  categoryLastResult: "Choose 6 categories for the game.",
};

const fallbackWheelSegments = [
  { label: "Ready", color: "#7c3aed" },
  { label: "Draw", color: "#34d399" },
  { label: "Next", color: "#f472b6" },
  { label: "Name", color: "#064e3b" },
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

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function otherTeam(team) {
  return team === "one" ? "two" : "one";
}

function teamLabel(team) {
  return team === "one" ? "Team 1" : "Team 2";
}

function allPlayers() {
  return pools.flatMap((pool) => pool.players.map((name) => ({ name, pool: pool.title, accent: pool.accent, logo: pool.logo, poolId: pool.id })));
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

function resetDraw(message = "Ready for a new draw.") {
  state.poolQueues = pools.map((pool) => shuffle(pool.players.map((name) => ({ name, pool: pool.title, accent: pool.accent, logo: pool.logo, poolId: pool.id }))));
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

function resetCategories(message = "Choose 6 categories for the game.") {
  state.categoryQueue = shuffle(categories);
  state.selectedCategories = [];
  state.categorySpinning = false;
  state.categoryRotation = 0;
  state.categoryLastResult = message;
  render();
}

function showScreen(screen) {
  state.activeScreen = screen;
  $$(".screen").forEach((section) => section.classList.toggle("active", section.id === screen));
  $$(".nav-btn").forEach((button) => {
    const active = button.dataset.screen === screen;
    button.classList.toggle("bg-[#7c3aed]", active);
    button.classList.toggle("text-white", active);
    button.classList.toggle("shadow-pulse", active);
    button.classList.toggle("text-slate-600", !active);
  });
}

function addPlayer(poolId) {
  const input = $(`#input-${poolId}`);
  const value = input.value.trim();
  if (!value) return;
  const pool = pools.find((item) => item.id === poolId);
  pool.players.push(value);
  input.value = "";
  resetDraw("Player added. Start the draw again.");
}

function removePlayer(poolId, index) {
  const pool = pools.find((item) => item.id === poolId);
  pool.players.splice(index, 1);
  resetDraw("Player removed. Start the draw again.");
}

function renderPools() {
  $("#poolGrid").innerHTML = pools
    .map(
      (pool) => `
        <article class="midnight-panel rounded-2xl p-5 backdrop-blur">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-3">
                <img src="${pool.logo}" alt="${pool.title}" class="team-logo-sm" />
                <h3 class="arabic-text text-2xl font-bold" dir="rtl" style="color:${pool.accent}">${pool.title}</h3>
              </div>
            </div>
            <span class="rounded-md border border-[#44474c] bg-[#0b1326] px-4 py-2 text-sm font-medium" style="color:${pool.accent}">${pool.players.length}</span>
          </div>
          <div class="flex gap-2">
            <input id="input-${pool.id}" class="midnight-input min-w-0 flex-1 rounded-lg border px-4 py-3 text-sm font-normal outline-none transition" placeholder="Add player" />
            <button class="add-btn midnight-button rounded-lg px-4 py-3 text-sm font-medium text-white" data-pool="${pool.id}">Add</button>
          </div>
          <div class="mt-4 flex min-h-28 flex-wrap content-start gap-2">
            ${pool.players
              .map(
                (player, index) => `
                  <span class="inline-flex items-center gap-2 rounded-md border border-[#44474c] bg-[#0b1326] px-3 py-2 text-base font-bold text-[#dae2fd]">
                    <img src="${pool.logo}" alt="${pool.title}" class="team-logo-sm" />
                    <span class="arabic-text font-bold" dir="rtl">${player}</span>
                    <button class="remove-btn grid h-6 w-6 place-items-center rounded bg-[#171f33] text-[#c5c6cd] transition hover:border hover:border-[#e0c47e] hover:text-[#e0c47e]" data-pool="${pool.id}" data-index="${index}" aria-label="Remove ${player}">x</button>
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
    const palette = ["#f7d98f", "#e9c272", "#d9edf0", "#eadfcf", "#c9ded6", "#f3eadc", "#d7c49d", "#e7eef1"];
    return queue.map((player, index) => ({ ...player, label: player.name, color: palette[index % palette.length] }));
  }
  return fallbackWheelSegments;
}

function renderWheel() {
  const items = wheelItems();
  const segmentSize = 360 / items.length;

  if (items.length === 1) {
    $("#wheelSvg").innerHTML = `
      <circle cx="160" cy="160" r="154" fill="${items[0].color}" stroke="#fffaf2" stroke-width="5"></circle>
      ${items[0].logo ? `<image href="${items[0].logo}" x="137" y="104" width="46" height="46" preserveAspectRatio="xMidYMid slice"></image>` : ""}
      <text x="160" y="160" fill="#2b2118" font-family="Calibri, sans-serif" font-size="26" font-weight="700" text-anchor="middle" dominant-baseline="middle">${items[0].label.slice(0, 14)}</text>
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
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${item.color}" stroke="#fffaf2" stroke-width="5"></path>
        ${item.logo ? `<image href="${item.logo}" x="${logo.x - 13}" y="${logo.y - 13}" width="26" height="26" preserveAspectRatio="xMidYMid slice" transform="rotate(${mid}, ${logo.x}, ${logo.y})"></image>` : ""}
        <text x="${label.x}" y="${label.y}" fill="#2b2118" font-family="Calibri, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid}, ${label.x}, ${label.y})">${item.label.slice(0, 10)}</text>
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
  const palette = ["#f7d98f", "#e9c272", "#d9edf0", "#eadfcf", "#c9ded6", "#f3eadc", "#d7c49d", "#e7eef1"];

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
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${palette[index % palette.length]}" stroke="#fffaf2" stroke-width="5"></path>
        <text x="${labelPoint.x}" y="${labelPoint.y}" fill="#2b2118" font-family="Calibri, sans-serif" font-size="${fontSize}" font-weight="400" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid + 90}, ${labelPoint.x}, ${labelPoint.y})">
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
    state.lastResult += ` ${teamLabel(state.bonusTeam)} receives the first two picks from the next group.`;
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
  state.lastResult = usedSpin ? `${assigned.name} joined ${teamLabel(team)}.` : `${assigned.name} was the final name in ${assigned.pool} and joined ${teamLabel(team)}.`;
  completeCurrentGroupIfNeeded();
  render();
  if (!remainingPlayers().length) showScreen("results");
}

function spin() {
  if (state.spinning) return;
  if (!state.drawReady) resetDraw("Draw started.");
  advanceToNextAvailablePool();

  const queue = currentQueue();
  if (!queue.length) {
    state.lastResult = allPlayers().length ? "All players are assigned." : "Add players before spinning.";
    render();
    showScreen(allPlayers().length ? "results" : "setup");
    return;
  }

  const selectedIndex = Math.floor(Math.random() * queue.length);
  if (queue.length === 1) {
    assignSelectedPlayer(selectedIndex, false);
    return;
  }

  const selected = queue[selectedIndex];
  const segmentSize = 360 / queue.length;
  const segmentCenter = selectedIndex * segmentSize + segmentSize / 2;
  const desiredPointerAngle = 360 - segmentCenter;
  const currentNormalized = ((state.rotation % 360) + 360) % 360;
  const extraTurns = 4 + Math.floor(Math.random() * 3);
  const delta = extraTurns * 360 + ((desiredPointerAngle - currentNormalized + 360) % 360);

  state.spinning = true;
  state.rotation += delta;
  state.lastResult = `Spinning for a name from ${currentPool().title}...`;
  render();

  window.setTimeout(() => {
    assignSelectedPlayer(selectedIndex, true);
  }, 4550);
}

function assignCategory(selectedIndex) {
  const category = availableCategoryQueue()[selectedIndex];
  if (!category) {
    state.categorySpinning = false;
    state.categoryLastResult = "No category available for this rule set.";
    render();
    return;
  }

  state.categoryQueue = state.categoryQueue.filter((item) => item.id !== category.id);
  state.selectedCategories.push(category);
  state.categorySpinning = false;
  state.categoryLastResult = state.selectedCategories.length === 6 ? "All 6 categories are selected." : `${category.title} selected.`;
  render();
}

function spinCategory() {
  if (state.categorySpinning || state.selectedCategories.length >= 6) return;
  if (!state.categoryQueue.length) resetCategories();

  const queue = availableCategoryQueue();
  if (!queue.length) {
    state.categoryLastResult = "No category available for this rule set.";
    render();
    return;
  }

  const selectedIndex = Math.floor(Math.random() * queue.length);
  const segmentSize = 360 / queue.length;
  const segmentCenter = selectedIndex * segmentSize + segmentSize / 2;
  const desiredPointerAngle = 360 - segmentCenter;
  const currentNormalized = ((state.categoryRotation % 360) + 360) % 360;
  const extraTurns = 4 + Math.floor(Math.random() * 3);
  const delta = extraTurns * 360 + ((desiredPointerAngle - currentNormalized + 360) % 360);

  state.categorySpinning = true;
  state.categoryRotation += delta;
  state.categoryLastResult = "Spinning for a category...";
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
  const nextTeamText = remainingPlayers().length ? `Next assignment: ${teamLabel(nextAssignedTeam())}` : "Open results to review the teams.";
  $("#upNextName").textContent = pool && currentQueue().length ? pool.title : remainingPlayers().length ? "Moving to next group" : "All players assigned";
  $("#upNextPool").textContent = pool && currentQueue().length ? `${currentQueue().length} names remaining. ${nextTeamText}` : nextTeamText;
  $("#spinStatus").textContent = state.lastResult || "";
  $("#spinBtn").disabled = state.spinning || total === 0 || (state.drawReady && remainingPlayers().length === 0);
}

function playerRow(player) {
  return `
    <div class="flex items-center justify-between rounded-lg border border-[#44474c] bg-[#0b1326] px-4 py-3">
      <div class="flex items-center gap-3">
        <img src="${player.logo}" alt="${player.pool}" class="team-logo" />
        <span class="arabic-text text-xl font-bold text-[#dae2fd]" dir="rtl">${player.name}</span>
      </div>
      <span class="arabic-text text-sm font-bold text-[#8e9197]" dir="rtl">${player.pool}</span>
    </div>
  `;
}

function compactPlayerRow(player) {
  return `
    <div class="flex items-center justify-center gap-3 rounded-lg border border-[#44474c] bg-[#131b2e] px-4 py-3">
      <img src="${player.logo}" alt="${player.pool}" class="team-logo" />
      <span class="arabic-text text-xl font-bold text-[#dae2fd]" dir="rtl">${player.name}</span>
    </div>
  `;
}

function renderResults() {
  $("#alphaCount").textContent = `${state.teams.one.length} players`;
  $("#betaCount").textContent = `${state.teams.two.length} players`;
  $("#alphaList").innerHTML = state.teams.one.length ? state.teams.one.map(playerRow).join("") : `<p class="rounded-lg border border-[#44474c] bg-[#0b1326] px-4 py-3 text-sm font-medium text-[#8e9197]">No assignments yet.</p>`;
  $("#betaList").innerHTML = state.teams.two.length ? state.teams.two.map(playerRow).join("") : `<p class="rounded-lg border border-[#44474c] bg-[#0b1326] px-4 py-3 text-sm font-medium text-[#8e9197]">No assignments yet.</p>`;
  $("#drawAlphaCount").textContent = state.teams.one.length;
  $("#drawBetaCount").textContent = state.teams.two.length;
  $("#drawAlphaList").innerHTML = state.teams.one.length ? state.teams.one.map(compactPlayerRow).join("") : `<p class="rounded-md border border-[#44474c] bg-[#131b2e] px-3 py-2 text-xs font-medium text-[#8e9197]">No players yet.</p>`;
  $("#drawBetaList").innerHTML = state.teams.two.length ? state.teams.two.map(compactPlayerRow).join("") : `<p class="rounded-md border border-[#44474c] bg-[#131b2e] px-3 py-2 text-xs font-medium text-[#8e9197]">No players yet.</p>`;
}

function categoryCard(category, index) {
  if (!category) {
    return `
      <div class="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-[#44474c] bg-[#0b1326]/70 p-3 text-center">
        <span class="text-xs font-semibold uppercase tracking-[0.14em] text-[#8e9197]">Slot ${index + 1}</span>
      </div>
    `;
  }

  return `
    <div class="rounded-xl border border-[#44474c] bg-[#131b2e] p-2 shadow-pulse">
      <img src="${category.image}" alt="${category.title}" class="category-card-image w-full rounded-lg border border-[#44474c]" />
      <p class="arabic-text mt-2 min-h-8 text-center text-base font-bold leading-tight text-[#dae2fd]" dir="rtl">${category.title}</p>
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

function shareResults() {
  const text = [
    "قرعة لعبة سين جيم - ديوانية الجيران",
    "",
    `Team 1: ${state.teams.one.map((player) => player.name).join(", ") || "No players"}`,
    `Team 2: ${state.teams.two.map((player) => player.name).join(", ") || "No players"}`,
  ].join("\n");

  if (navigator.share) {
    navigator.share({ title: "قرعة لعبة سين جيم", text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text);
    state.lastResult = "Results copied to clipboard.";
    render();
  }
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
  resetDraw("Draw started.");
  showScreen("randomize");
});
$("#spinBtn").addEventListener("click", spin);
$("#spinCategoryBtn").addEventListener("click", spinCategory);
$("#resetCategoriesBtn").addEventListener("click", resetCategories);
$("#shareBtn").addEventListener("click", shareResults);
$("#startOverBtn").addEventListener("click", () => {
  resetDraw("Ready for a fresh draw.");
  showScreen("setup");
});

preloadAssets();
resetCategories();
resetDraw("Ready to start.");
