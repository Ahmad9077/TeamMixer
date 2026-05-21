const pools = [
  { id: "poolA", title: "Group One", accent: "#b9c7e0", players: ["Maya", "Omar", "Lina"] },
  { id: "poolB", title: "Group Two", accent: "#e0c47e", players: ["Noah", "Sara", "Zaid"] },
  { id: "poolC", title: "Group Three", accent: "#8bd6b6", players: ["Ali", "Reem", "Nora"] },
];

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
};

const fallbackWheelSegments = [
  { label: "Ready", color: "#7c3aed" },
  { label: "Draw", color: "#34d399" },
  { label: "Next", color: "#f472b6" },
  { label: "Name", color: "#064e3b" },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

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
  return pools.flatMap((pool) => pool.players.map((name) => ({ name, pool: pool.title, accent: pool.accent, poolId: pool.id })));
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
  state.poolQueues = pools.map((pool) => shuffle(pool.players.map((name) => ({ name, pool: pool.title, accent: pool.accent, poolId: pool.id }))));
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
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e9197]">Source group</p>
              <h3 class="text-2xl font-semibold" style="color:${pool.accent}">${pool.title}</h3>
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
                  <span class="inline-flex items-center gap-2 rounded-md border border-[#44474c] bg-[#0b1326] px-3 py-2 text-sm font-medium text-[#dae2fd]">
                    ${player}
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
    const palette = ["#334155", "#584409", "#004a35", "#222a3d", "#515f74", "#8e6f1a", "#00513b", "#2d3449"];
    return queue.map((player, index) => ({ ...player, label: player.name, color: palette[index % palette.length] }));
  }
  return fallbackWheelSegments;
}

function renderWheel() {
  const items = wheelItems();
  const segmentSize = 360 / items.length;

  if (items.length === 1) {
    $("#wheelSvg").innerHTML = `
      <circle cx="160" cy="160" r="154" fill="${items[0].color}" stroke="#0b1326" stroke-width="5"></circle>
      <text x="160" y="160" fill="#dae2fd" font-size="22" font-weight="600" text-anchor="middle" dominant-baseline="middle">${items[0].label.slice(0, 14)}</text>
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
      return `
        <path d="${describeArc(160, 160, 154, start, end)}" fill="${item.color}" stroke="#0b1326" stroke-width="5"></path>
        <text x="${label.x}" y="${label.y}" fill="#dae2fd" font-size="15" font-weight="600" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid}, ${label.x}, ${label.y})">${item.label.slice(0, 10)}</text>
      `;
    })
    .join("");
  $("#wheelSvg").style.transform = `rotate(${state.rotation}deg)`;
}

function nextAssignedTeam() {
  return state.bonusRemaining > 0 ? state.bonusTeam : state.nextTeam;
}

function completeCurrentGroupIfNeeded() {
  const finishedPoolIndex = state.currentPoolIndex;
  if (currentQueue().length > 0) return;

  const wasOdd = state.groupStartCounts[finishedPoolIndex] % 2 === 1;
  const hasNextGroup = state.poolQueues.slice(finishedPoolIndex + 1).some((queue) => queue.length > 0);
  if (wasOdd && hasNextGroup) {
    state.bonusTeam = state.nextTeam;
    state.bonusRemaining = 2;
    state.lastResult += ` ${teamLabel(state.bonusTeam)} receives the first two picks from the next group.`;
  }

  state.currentPoolIndex += 1;
  advanceToNextAvailablePool();
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
    const [assigned] = queue.splice(selectedIndex, 1);
    const team = nextAssignedTeam();
    state.teams[team].push(assigned);
    state.assigned.push({ ...assigned, team });

    if (state.bonusRemaining > 0) {
      state.bonusRemaining -= 1;
      if (state.bonusRemaining === 0) {
        state.nextTeam = otherTeam(state.bonusTeam);
        state.bonusTeam = null;
      }
    } else {
      state.nextTeam = otherTeam(team);
    }

    state.spinning = false;
    state.lastResult = `${assigned.name} joined ${teamLabel(team)}.`;
    completeCurrentGroupIfNeeded();
    render();
    if (!remainingPlayers().length) showScreen("results");
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
        <span class="h-3 w-3 rounded-full" style="background:${player.accent}"></span>
        <span class="font-medium text-[#dae2fd]">${player.name}</span>
      </div>
      <span class="text-xs font-semibold uppercase tracking-[0.12em] text-[#8e9197]">${player.pool}</span>
    </div>
  `;
}

function renderResults() {
  $("#alphaCount").textContent = `${state.teams.one.length} players`;
  $("#betaCount").textContent = `${state.teams.two.length} players`;
  $("#alphaList").innerHTML = state.teams.one.length ? state.teams.one.map(playerRow).join("") : `<p class="rounded-lg border border-[#44474c] bg-[#0b1326] px-4 py-3 text-sm font-medium text-[#8e9197]">No assignments yet.</p>`;
  $("#betaList").innerHTML = state.teams.two.length ? state.teams.two.map(playerRow).join("") : `<p class="rounded-lg border border-[#44474c] bg-[#0b1326] px-4 py-3 text-sm font-medium text-[#8e9197]">No assignments yet.</p>`;
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
  renderProgress();
  renderResults();
  showScreen(state.activeScreen);
}

$$(".nav-btn").forEach((button) => button.addEventListener("click", () => showScreen(button.dataset.screen)));
$("#shuffleQueueBtn").addEventListener("click", () => {
  resetDraw("Draw started.");
  showScreen("randomize");
});
$("#spinBtn").addEventListener("click", spin);
$("#shareBtn").addEventListener("click", shareResults);
$("#startOverBtn").addEventListener("click", () => {
  resetDraw("Ready for a fresh draw.");
  showScreen("setup");
});

resetDraw("Ready to start.");
