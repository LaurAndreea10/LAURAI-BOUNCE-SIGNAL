/* =========================================================
   LAURAI / BOUNCE SIGNAL
   Chapter 03 — Mission Control
========================================================= */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const storageKey = "laurai-bounce-signal-v3";

/* =========================================================
   DATA
========================================================= */

const scenarios = [
  {
    id: "soft",
    icon: "↻",
    title: "Soft Bounce",
    subtitle: "Temporary delivery issue",
    code: "421",
    signal: 84,
    confidence: 94,
    risk: "LOW",
    health: 89,
    trust: "A+",
    retry: 1,
    analysis:
      "The destination server is temporarily unavailable. LaurAI can safely retry the transmission.",
    recommendation:
      "Retry using exponential backoff.",
    success:
      "Temporary failure resolved. The message entered the inbox.",
    xp: 80
  },

  {
    id: "hard",
    icon: "×",
    title: "Hard Bounce",
    subtitle: "Permanent address failure",
    code: "550",
    signal: 52,
    confidence: 98,
    risk: "HIGH",
    health: 57,
    trust: "A",
    retry: 0,
    analysis:
      "The recipient address appears invalid or permanently unavailable. Repeated retries are not recommended.",
    recommendation:
      "Quarantine address and request contact repair.",
    success:
      "Invalid email isolated. LaurAI switched to the selected fallback channel.",
    xp: 120
  },

  {
    id: "mailbox",
    icon: "▣",
    title: "Mailbox Full",
    subtitle: "Recipient storage exceeded",
    code: "552",
    signal: 68,
    confidence: 91,
    risk: "MED",
    health: 72,
    trust: "A+",
    retry: 2,
    analysis:
      "The recipient mailbox exceeded its storage quota. Delivery should be retried later.",
    recommendation:
      "Delay transmission and retry in the next window.",
    success:
      "Mailbox capacity restored. Transmission delivered.",
    xp: 95
  },

  {
    id: "spam",
    icon: "⚠",
    title: "Spam Block",
    subtitle: "Message rejected by filter",
    code: "554",
    signal: 61,
    confidence: 96,
    risk: "HIGH",
    health: 64,
    trust: "B+",
    retry: 1,
    analysis:
      "The receiving server classified the transmission as suspicious. Authentication is valid, but content risk is elevated.",
    recommendation:
      "Repair content signature and reroute.",
    success:
      "Signal signature repaired. Spam filter cleared.",
    xp: 130
  },

  {
    id: "domain",
    icon: "◎",
    title: "Domain Offline",
    subtitle: "MX destination unavailable",
    code: "NX",
    signal: 38,
    confidence: 97,
    risk: "MED",
    health: 51,
    trust: "A",
    retry: 2,
    analysis:
      "The domain cannot currently resolve a valid mail exchange destination.",
    recommendation:
      "Scan MX records and activate alternative relay.",
    success:
      "Alternative MX relay discovered and transmission restored.",
    xp: 140
  },

  {
    id: "delay",
    icon: "◷",
    title: "Delayed Delivery",
    subtitle: "Transmission queued",
    code: "451",
    signal: 76,
    confidence: 89,
    risk: "LOW",
    health: 82,
    trust: "A+",
    retry: 1,
    analysis:
      "The message remains in a remote queue. No permanent failure has been detected.",
    recommendation:
      "Maintain queue and reschedule delivery.",
    success:
      "Queue released. Transmission delivered within SLA.",
    xp: 75
  },

  {
    id: "storm",
    icon: "ϟ",
    title: "Signal Storm",
    subtitle: "Multiple network failures",
    code: "503",
    signal: 24,
    confidence: 87,
    risk: "CRITICAL",
    health: 35,
    trust: "B",
    retry: 3,
    analysis:
      "Multiple relay nodes are unstable. LaurAI detected packet loss across the current route.",
    recommendation:
      "Deploy emergency relay and switch channel if needed.",
    success:
      "Emergency relay stabilized. Signal survived the storm.",
    xp: 200
  },

  {
    id: "perfect",
    icon: "✦",
    title: "Perfect Delivery",
    subtitle: "Zero-bounce transmission",
    code: "200",
    signal: 100,
    confidence: 100,
    risk: "NONE",
    health: 100,
    trust: "A+",
    retry: 0,
    analysis:
      "Authentication, routing and destination health are optimal.",
    recommendation:
      "Proceed with direct delivery.",
    success:
      "Perfect delivery achieved with zero recovery actions.",
    xp: 60
  }
];

const badgeDefinitions = [
  {
    id: "first",
    icon: "✦",
    name: "First Contact",
    description: "Complete your first mission."
  },
  {
    id: "zero",
    icon: "◎",
    name: "Zero Bounce",
    description: "Complete Perfect Delivery."
  },
  {
    id: "recovery",
    icon: "↻",
    name: "Recovery Pilot",
    description: "Recover 3 failed signals."
  },
  {
    id: "storm",
    icon: "ϟ",
    name: "Storm Rider",
    description: "Survive Signal Storm."
  },
  {
    id: "hard",
    icon: "◆",
    name: "Dead Letter Hunter",
    description: "Resolve a Hard Bounce."
  },
  {
    id: "speed",
    icon: "»",
    name: "Hyper Route",
    description: "Finish a mission under 5 seconds."
  },
  {
    id: "streak",
    icon: "🔥",
    name: "Signal Streak",
    description: "Reach a 5 mission streak."
  },
  {
    id: "all",
    icon: "∞",
    name: "Orbit Master",
    description: "Complete all eight scenarios."
  }
];

const translations = {
  en: {
    sequence: "EMAIL TRANSMISSION",
    hero1: "The message bounced.",
    hero2: "LaurAI found another route.",
    heroCopy:
      "Scan the failure, repair the route and guide the signal back into the inbox.",
    network: "NETWORK",
    mission: "MISSION",
    level: "LEVEL",
    scenario: "Scenario",
    difficulty: "Difficulty",
    channel: "Fallback channel",
    signal: "SIGNAL",
    currentState: "CURRENT STATE",
    startMission: "START MISSION",
    pause: "PAUSE",
    analysis: "AI Analysis",
    confidence: "CONFIDENCE",
    recommended: "RECOMMENDED ACTION",
    metrics: "Metrics",
    commandCenter: "Command Center",
    history: "Transmission History"
  },

  ro: {
    sequence: "TRANSMISIE EMAIL",
    hero1: "Mesajul a ricoșat.",
    hero2: "LaurAI a găsit o altă rută.",
    heroCopy:
      "Scanează eroarea, repară ruta și ghidează semnalul înapoi spre inbox.",
    network: "REȚEA",
    mission: "MISIUNE",
    level: "NIVEL",
    scenario: "Scenariu",
    difficulty: "Dificultate",
    channel: "Canal alternativ",
    signal: "SEMNAL",
    currentState: "STARE CURENTĂ",
    startMission: "PORNEȘTE MISIUNEA",
    pause: "PAUZĂ",
    analysis: "Analiză AI",
    confidence: "ÎNCREDERE",
    recommended: "ACȚIUNE RECOMANDATĂ",
    metrics: "Metrici",
    commandCenter: "Centru de comandă",
    history: "Istoric transmisii"
  }
};

/* =========================================================
   STATE
========================================================= */

const defaultState = {
  language: "en",
  theme: "dark",
  sound: true,
  reducedMotion: false,
  highContrast: false,

  scenario: "soft",
  difficulty: "normal",
  channel: "email",
  speed: 1,

  xp: 0,
  streak: 0,
  completed: [],
  badges: [],
  history: [],

  missionCounter: 1
};

let persistent = loadState();

let runtime = {
  running: false,
  paused: false,
  currentStep: -1,
  timers: [],
  startTime: null,
  bounceCount: 0,
  retries: 0
};

/* =========================================================
   ELEMENTS
========================================================= */

const scenarioList = $("#scenarioList");
const scenarioTitle = $("#scenarioTitle");

const statusText = $("#statusText");
const statusCode = $("#statusCode");
const progressBar = $("#progressBar");

const signalValue = $("#signalValue");
const confidenceValue = $("#confidenceValue");
const confidenceRing = $("#confidenceRing");

const aiAnalysis = $("#aiAnalysis");
const aiRecommendation = $("#aiRecommendation");

const bounceMetric = $("#bounceMetric");
const latencyMetric = $("#latencyMetric");
const retryMetric = $("#retryMetric");
const healthMetric = $("#healthMetric");
const trustMetric = $("#trustMetric");
const riskMetric = $("#riskMetric");
const mxState = $("#mxState");

const startButton = $("#startButton");
const pauseButton = $("#pauseButton");
const stepButton = $("#stepButton");
const pulseButton = $("#pulseButton");

const emailPacket = $("#emailPacket");
const scanner = $("#scanner");
const pulseWave = $("#pulseWave");
const stormField = $("#stormField");

const terminalOutput = $("#terminalOutput");

const languageButton = $("#languageButton");
const soundButton = $("#soundButton");

const missionId = $("#missionId");
const packetId = $("#packetId");

const xpDisplay = $("#xpDisplay");
const levelDisplay = $("#levelDisplay");

const settingsOverlay = $("#settingsOverlay");
const commandOverlay = $("#commandOverlay");
const resultOverlay = $("#resultOverlay");

const toastRegion = $("#toastRegion");

/* =========================================================
   STORAGE
========================================================= */

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    return {
      ...defaultState,
      ...(saved || {})
    };
  } catch {
    return {...defaultState};
  }
}

function saveState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify(persistent)
  );
}

/* =========================================================
   SCENARIO RENDERING
========================================================= */

function renderScenarios() {
  scenarioList.innerHTML = scenarios.map((scenario, index) => `
    <button
      class="scenario-button ${
        persistent.scenario === scenario.id ? "active" : ""
      }"
      data-scenario="${scenario.id}"
    >
      <span class="scenario-icon">${scenario.icon}</span>

      <span>
        <strong>${scenario.title}</strong>
        <small>${scenario.subtitle}</small>
      </span>

      <b>0${index + 1}</b>
    </button>
  `).join("");

  $$(".scenario-button").forEach(button => {
    button.addEventListener("click", () => {
      selectScenario(button.dataset.scenario);
    });
  });
}

function getScenario() {
  return scenarios.find(
    scenario => scenario.id === persistent.scenario
  );
}

function selectScenario(id) {
  if (runtime.running) {
    stopMission();
  }

  persistent.scenario = id;
  saveState();

  renderScenarios();
  updateScenarioUI();

  log(
    "system",
    `Scenario loaded: ${getScenario().title}`,
    "info"
  );
}

function updateScenarioUI() {
  const scenario = getScenario();

  scenarioTitle.textContent = scenario.title;

  statusCode.textContent = scenario.code;
  signalValue.textContent = `${scenario.signal}%`;

  confidenceValue.textContent =
    `${scenario.confidence}%`;

  confidenceRing.textContent =
    scenario.confidence;

  aiAnalysis.textContent =
    scenario.analysis;

  aiRecommendation.textContent =
    scenario.recommendation;

  healthMetric.textContent =
    `${scenario.health}%`;

  trustMetric.textContent =
    scenario.trust;

  riskMetric.textContent =
    scenario.risk;

  retryMetric.textContent =
    `${scenario.retry}/3`;

  mxState.textContent =
    scenario.id === "domain"
      ? "SCAN"
      : "READY";

  mxState.className =
    scenario.id === "domain"
      ? "fail"
      : "pass";

  stormField.innerHTML = "";

  if (scenario.id === "storm") {
    createStorm();
  }

  resetMissionUI();
}

/* =========================================================
   MISSION STEPS
========================================================= */

function buildSteps() {
  const scenario = getScenario();

  return [
    {
      status: "BOUNCING",
      code: scenario.code,
      progress: 17,
      log: "Delivery failure detected.",
      type: "warn"
    },

    {
      status: "SCANNING",
      code: "AI-01",
      progress: 38,
      log: "LaurAI scanning signal integrity.",
      type: "ai"
    },

    {
      status: "REPAIRING",
      code: "FIX-7",
      progress: 59,
      log: scenario.recommendation,
      type: "ai"
    },

    {
      status: "ROUTING",
      code: "R-07",
      progress: 79,
      log:
        persistent.channel === "auto"
          ? "Smart relay selecting optimal fallback channel."
          : `Routing via ${persistent.channel.toUpperCase()}.`,
      type: "info"
    },

    {
      status: "DELIVERED",
      code: "200",
      progress: 100,
      log: scenario.success,
      type: "success"
    }
  ];
}

function startMission() {
  clearTimers();

  runtime.running = true;
  runtime.paused = false;
  runtime.currentStep = -1;
  runtime.startTime = performance.now();
  runtime.bounceCount++;
  runtime.retries = 0;

  resetMissionUI();

  bounceMetric.textContent = runtime.bounceCount;

  startButton.innerHTML =
    "<span>↻</span><span>RESTART MISSION</span>";

  $("#footerStatus").textContent =
    "TRANSMISSION ACTIVE";

  updateMissionIds();

  log(
    "system",
    `Mission ${missionId.textContent} initiated.`,
    "info"
  );

  playTone(420, .05);

  scheduleMission();
}

function scheduleMission() {
  const steps = buildSteps();

  const baseDelay = 1500 / persistent.speed;

  steps.forEach((_, index) => {
    const timer = setTimeout(
      () => {
        if (!runtime.paused) {
          executeStep(index);
        }
      },
      index * baseDelay
    );

    runtime.timers.push(timer);
  });
}

function executeStep(index) {
  const steps = buildSteps();

  if (index >= steps.length) {
    return;
  }

  runtime.currentStep = index;

  const step = steps[index];

  statusText.textContent = step.status;
  statusCode.textContent = step.code;

  progressBar.style.width =
    `${step.progress}%`;

  setTimeline(index);

  scanner.classList.toggle(
    "active",
    index === 1
  );

  if (index === 0) {
    runtime.retries++;
    retryMetric.textContent =
      `${Math.min(runtime.retries,3)}/3`;

    playTone(240, .06);
  }

  if (index === 1) {
    playTone(650, .04);
  }

  if (index === 2) {
    healthMetric.textContent =
      `${Math.min(100, getScenario().health + 8)}%`;

    playTone(760, .04);
  }

  if (index === 3) {
    signalValue.textContent =
      `${Math.min(100, getScenario().signal + 14)}%`;

    pulse();

    playTone(880, .04);
  }

  if (index === 4) {
    signalValue.textContent = "100%";
    healthMetric.textContent = "100%";
    scanner.classList.remove("active");

    playSuccess();

    completeMission();
  }

  log(
    "signal",
    step.log,
    step.type
  );
}

function setTimeline(index) {
  $$("#timeline button").forEach(
    (button, buttonIndex) => {

      button.classList.remove(
        "active",
        "complete"
      );

      if (buttonIndex < index) {
        button.classList.add("complete");
      }

      if (buttonIndex === index) {
        button.classList.add("active");
      }
    }
  );
}

function pauseMission() {
  if (!runtime.running) {
    toast("No active mission.");
    return;
  }

  runtime.paused = !runtime.paused;

  pauseButton.querySelector("span").textContent =
    runtime.paused
      ? "RESUME"
      : translations[persistent.language].pause;

  if (runtime.paused) {
    clearTimers();

    log(
      "system",
      "Transmission paused.",
      "warn"
    );
  } else {
    log(
      "system",
      "Transmission resumed.",
      "info"
    );

    continueFromCurrentStep();
  }
}

function continueFromCurrentStep() {
  const next = runtime.currentStep + 1;
  const steps = buildSteps();

  steps
    .slice(next)
    .forEach((_, relativeIndex) => {
      const timer = setTimeout(
        () => executeStep(next + relativeIndex),
        (relativeIndex + 1) *
          (1500 / persistent.speed)
      );

      runtime.timers.push(timer);
    });
}

function manualStep() {
  if (!runtime.running) {
    runtime.running = true;
    runtime.startTime = performance.now();
    runtime.currentStep = -1;
  }

  clearTimers();

  const next =
    Math.min(
      runtime.currentStep + 1,
      buildSteps().length - 1
    );

  executeStep(next);
}

function stopMission() {
  clearTimers();

  runtime.running = false;
  runtime.paused = false;

  scanner.classList.remove("active");
}

function clearTimers() {
  runtime.timers.forEach(clearTimeout);
  runtime.timers = [];
}

/* =========================================================
   COMPLETE MISSION
========================================================= */

function completeMission() {
  runtime.running = false;

  const scenario = getScenario();

  const elapsed =
    (performance.now() - runtime.startTime) / 1000;

  const difficultyMultiplier = {
    easy: .8,
    normal: 1,
    critical: 1.45
  }[persistent.difficulty];

  const speedBonus =
    Math.max(
      0,
      Math.round(150 - elapsed * 10)
    );

  const score =
    Math.round(
      (
        scenario.xp * 10 +
        speedBonus * 4
      ) *
      difficultyMultiplier
    );

  const gainedXp =
    Math.round(
      scenario.xp *
      difficultyMultiplier
    );

  persistent.xp += gainedXp;
  persistent.streak += 1;

  if (!persistent.completed.includes(scenario.id)) {
    persistent.completed.push(scenario.id);
  }

  const entry = {
    id: missionId.textContent,
    date: new Date().toISOString(),
    scenario: scenario.title,
    scenarioId: scenario.id,
    difficulty: persistent.difficulty,
    channel: persistent.channel,
    score,
    xp: gainedXp,
    seconds: Number(elapsed.toFixed(1)),
    status: "Delivered"
  };

  persistent.history.unshift(entry);

  if (persistent.history.length > 30) {
    persistent.history =
      persistent.history.slice(0,30);
  }

  persistent.missionCounter++;

  unlockBadges(entry);

  saveState();

  updateProfile();
  renderHistory();
  renderBadges();

  showResult(
    scenario,
    score,
    gainedXp,
    elapsed
  );

  log(
    "system",
    `Mission complete · ${score} points · +${gainedXp} XP`,
    "success"
  );

  $("#footerStatus").textContent =
    "DELIVERY CONFIRMED";
}

function showResult(
  scenario,
  score,
  xp,
  elapsed
) {
  $("#resultTitle").textContent =
    scenario.success;

  $("#resultDescription").textContent =
    `Recovered via ${persistent.channel.toUpperCase()} · ${persistent.difficulty.toUpperCase()} mission.`;

  $("#resultScore").textContent =
    score.toLocaleString();

  $("#resultXp").textContent =
    `+${xp}`;

  $("#resultTime").textContent =
    `${elapsed.toFixed(1)}s`;

  resultOverlay.classList.add("open");

  createCelebration();
}

/* =========================================================
   BADGES
========================================================= */

function unlockBadges(entry) {
  const unlock = id => {
    if (!persistent.badges.includes(id)) {
      persistent.badges.push(id);

      const badge =
        badgeDefinitions.find(
          item => item.id === id
        );

      toast(`Achievement unlocked: ${badge.name}`);
    }
  };

  if (persistent.history.length >= 1) {
    unlock("first");
  }

  if (entry.scenarioId === "perfect") {
    unlock("zero");
  }

  if (
    persistent.history.filter(
      item => item.scenarioId !== "perfect"
    ).length >= 3
  ) {
    unlock("recovery");
  }

  if (entry.scenarioId === "storm") {
    unlock("storm");
  }

  if (entry.scenarioId === "hard") {
    unlock("hard");
  }

  if (entry.seconds < 5) {
    unlock("speed");
  }

  if (persistent.streak >= 5) {
    unlock("streak");
  }

  if (persistent.completed.length === scenarios.length) {
    unlock("all");
  }
}

function renderBadges() {
  $("#badgeGrid").innerHTML =
    badgeDefinitions.map(badge => `
      <article
        class="badge ${
          persistent.badges.includes(badge.id)
            ? ""
            : "locked"
        }"
      >
        <span class="badge-icon">${badge.icon}</span>

        <div>
          <strong>${badge.name}</strong>
          <small>${badge.description}</small>
        </div>
      </article>
    `).join("");
}

/* =========================================================
   PROFILE / XP
========================================================= */

function getLevel() {
  return Math.floor(persistent.xp / 200) + 1;
}

function updateProfile() {
  const level = getLevel();

  const levelBase =
    (level - 1) * 200;

  const current =
    persistent.xp - levelBase;

  const percent =
    Math.min(100, current / 200 * 100);

  levelDisplay.textContent =
    String(level).padStart(2,"0");

  xpDisplay.textContent =
    persistent.xp;

  $("#profileLevel").textContent =
    `LEVEL ${level}`;

  $("#profileXp").textContent =
    `${current} / 200 XP`;

  $("#xpBar").style.width =
    `${percent}%`;

  $("#streakDisplay").textContent =
    `${persistent.streak} 🔥`;
}

/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {
  const list = $("#historyList");

  $("#historyCount").textContent =
    `${persistent.history.length} missions`;

  if (!persistent.history.length) {
    list.innerHTML = `
      <div class="empty-state">
        No completed missions yet.
      </div>
    `;

    return;
  }

  list.innerHTML =
    persistent.history.map(entry => `
      <article class="history-item">
        <div>
          <strong>${entry.scenario}</strong>
          <small>${entry.id}</small>
        </div>

        <div>
          <b>${entry.status}</b>
          <small>${entry.channel.toUpperCase()}</small>
        </div>

        <div>
          <b>${entry.score.toLocaleString()}</b>
          <small>SCORE</small>
        </div>

        <div>
          <b>+${entry.xp}</b>
          <small>XP</small>
        </div>

        <div>
          <b>${entry.seconds}s</b>
          <small>${entry.difficulty.toUpperCase()}</small>
        </div>
      </article>
    `).join("");
}

/* =========================================================
   EXPORT
========================================================= */

function download(name, content, type) {
  const blob = new Blob(
    [content],
    {type}
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = name;
  anchor.click();

  URL.revokeObjectURL(url);
}

$("#exportJson").addEventListener(
  "click",
  () => {
    download(
      "laurai-transmissions.json",
      JSON.stringify(
        persistent.history,
        null,
        2
      ),
      "application/json"
    );
  }
);

$("#exportTxt").addEventListener(
  "click",
  () => {
    const text =
      persistent.history
        .map(item =>
          `${item.id} | ${item.scenario} | ${item.status} | ${item.score} pts | ${item.seconds}s`
        )
        .join("\n");

    download(
      "laurai-transmissions.txt",
      text,
      "text/plain"
    );
  }
);

$("#copyReport").addEventListener(
  "click",
  async () => {
    const latest =
      persistent.history[0];

    if (!latest) {
      toast("No mission report available.");
      return;
    }

    const report =
`LAURAI / BOUNCE SIGNAL
Mission: ${latest.id}
Scenario: ${latest.scenario}
Status: ${latest.status}
Difficulty: ${latest.difficulty}
Route: ${latest.channel}
Score: ${latest.score}
XP: +${latest.xp}
Duration: ${latest.seconds}s`;

    await navigator.clipboard.writeText(report);

    toast("Mission report copied.");
  }
);

/* =========================================================
   TERMINAL
========================================================= */

function log(source, message, type = "info") {
  const p = document.createElement("p");

  const now =
    new Date().toLocaleTimeString(
      "en-GB",
      {hour12:false}
    );

  p.innerHTML = `
    <time>${now}</time>
    <span class="${type}">${source}</span>
  `;

  p.append(
    document.createTextNode(message)
  );

  terminalOutput.append(p);
  terminalOutput.scrollTop =
    terminalOutput.scrollHeight;
}

$("#clearLog").addEventListener(
  "click",
  () => {
    terminalOutput.innerHTML = "";
    log(
      "system",
      "Console cleared.",
      "info"
    );
  }
);

/* =========================================================
   VISUAL EFFECTS
========================================================= */

function pulse() {
  pulseWave.classList.remove("active");

  void pulseWave.offsetWidth;

  pulseWave.classList.add("active");

  log(
    "signal",
    "Manual pulse transmitted.",
    "info"
  );

  playTone(920,.04);
}

function createStorm() {
  stormField.innerHTML = "";

  for (let i = 0; i < 22; i++) {
    const particle =
      document.createElement("i");

    particle.style.left =
      `${Math.random() * 100}%`;

    particle.style.top =
      `${Math.random() * 100}%`;

    particle.style.animationDelay =
      `${Math.random()}s`;

    stormField.append(particle);
  }
}

function createCelebration() {
  const stage = $("#signalStage");

  for (let i = 0; i < 24; i++) {
    const p =
      document.createElement("i");

    p.style.position = "absolute";
    p.style.zIndex = "20";

    p.style.left = "50%";
    p.style.top = "50%";

    p.style.width =
      `${2 + Math.random()*4}px`;

    p.style.height =
      p.style.width;

    p.style.borderRadius = "50%";

    p.style.background =
      i % 2
        ? "var(--cyan)"
        : "var(--violet)";

    stage.append(p);

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      100 + Math.random() * 170;

    const x =
      Math.cos(angle) * distance;

    const y =
      Math.sin(angle) * distance;

    const animation =
      p.animate(
        [
          {
            transform:
              "translate(-50%,-50%) scale(1)",
            opacity:1
          },
          {
            transform:
              `translate(
                calc(-50% + ${x}px),
                calc(-50% + ${y}px)
              ) scale(0)`,
            opacity:0
          }
        ],
        {
          duration:
            700 + Math.random()*700,
          easing:
            "cubic-bezier(.2,.8,.2,1)"
        }
      );

    animation.onfinish =
      () => p.remove();
  }
}

/* =========================================================
   SOUND
========================================================= */

let audioContext = null;

function playTone(
  frequency,
  duration
) {
  if (!persistent.sound) {
    return;
  }

  try {
    audioContext ||=
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.frequency.value =
      frequency;

    oscillator.type = "sine";

    gain.gain.setValueAtTime(
      .035,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      .0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration
    );
  } catch {}
}

function playSuccess() {
  playTone(660,.08);

  setTimeout(
    () => playTone(880,.09),
    80
  );

  setTimeout(
    () => playTone(1100,.12),
    160
  );
}

/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage() {
  const language =
    persistent.language;

  document.documentElement.lang =
    language;

  languageButton.textContent =
    language.toUpperCase();

  $$("[data-i18n]").forEach(element => {
    const key =
      element.dataset.i18n;

    if (translations[language][key]) {
      element.textContent =
        translations[language][key];
    }
  });
}

languageButton.addEventListener(
  "click",
  () => {
    persistent.language =
      persistent.language === "en"
        ? "ro"
        : "en";

    saveState();
    applyLanguage();

    toast(
      persistent.language === "ro"
        ? "Limba a fost schimbată în română."
        : "Language changed to English."
    );
  }
);

/* =========================================================
   SETTINGS
========================================================= */

function applySettings() {
  document.documentElement.dataset.theme =
    persistent.theme;

  document.body.classList.toggle(
    "reduced-motion",
    persistent.reducedMotion
  );

  document.body.classList.toggle(
    "high-contrast",
    persistent.highContrast
  );

  $("#themeSelect").value =
    persistent.theme;

  $("#motionToggle").checked =
    persistent.reducedMotion;

  $("#contrastToggle").checked =
    persistent.highContrast;

  $("#settingsSoundToggle").checked =
    persistent.sound;

  soundButton.textContent =
    persistent.sound
      ? "♪"
      : "×♪";
}

$("#settingsButton").addEventListener(
  "click",
  () => settingsOverlay.classList.add("open")
);

$("#themeSelect").addEventListener(
  "change",
  event => {
    persistent.theme =
      event.target.value;

    saveState();
    applySettings();
  }
);

$("#motionToggle").addEventListener(
  "change",
  event => {
    persistent.reducedMotion =
      event.target.checked;

    saveState();
    applySettings();
  }
);

$("#contrastToggle").addEventListener(
  "change",
  event => {
    persistent.highContrast =
      event.target.checked;

    saveState();
    applySettings();
  }
);

function toggleSound(value = !persistent.sound) {
  persistent.sound = value;

  saveState();
  applySettings();
}

soundButton.addEventListener(
  "click",
  () => toggleSound()
);

$("#settingsSoundToggle").addEventListener(
  "change",
  event =>
    toggleSound(event.target.checked)
);

$("#resetApp").addEventListener(
  "click",
  () => {
    localStorage.removeItem(storageKey);

    persistent = {...defaultState};

    saveState();

    location.reload();
  }
);

/* =========================================================
   DIFFICULTY + CHANNEL + SPEED
========================================================= */

$$("[data-difficulty]").forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        persistent.difficulty =
          button.dataset.difficulty;

        $$("[data-difficulty]").forEach(
          item =>
            item.classList.toggle(
              "active",
              item === button
            )
        );

        saveState();

        toast(
          `Difficulty: ${persistent.difficulty}`
        );
      }
    );
  }
);

$$("[data-channel]").forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        persistent.channel =
          button.dataset.channel;

        $$("[data-channel]").forEach(
          item =>
            item.classList.toggle(
              "active",
              item === button
            )
        );

        saveState();

        log(
          "route",
          `Fallback channel set to ${persistent.channel.toUpperCase()}.`,
          "info"
        );
      }
    );
  }
);

$$("[data-speed]").forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        persistent.speed =
          Number(button.dataset.speed);

        $$("[data-speed]").forEach(
          item =>
            item.classList.toggle(
              "active",
              item === button
            )
        );

        saveState();

        toast(
          `Mission speed ${persistent.speed}×`
        );
      }
    );
  }
);

/* =========================================================
   TABS
========================================================= */

$$("[data-tab]").forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        $$("[data-tab]").forEach(
          item =>
            item.classList.remove("active")
        );

        $$(".tab-panel").forEach(
          panel =>
            panel.classList.remove("active")
        );

        button.classList.add("active");

        $(
          `#tab-${button.dataset.tab}`
        ).classList.add("active");
      }
    );
  }
);

/* =========================================================
   COMMAND PALETTE
========================================================= */

const commands = [
  {
    label: "Start Mission",
    action: startMission
  },
  {
    label: "Pause / Resume",
    action: pauseMission
  },
  {
    label: "Send Signal Pulse",
    action: pulse
  },
  {
    label: "Random Scenario",
    action: randomScenario
  },
  {
    label: "Toggle Language",
    action: () => languageButton.click()
  },
  {
    label: "Toggle Sound",
    action: () => soundButton.click()
  },
  {
    label: "Open Settings",
    action: () =>
      settingsOverlay.classList.add("open")
  },
  {
    label: "Dark Space Theme",
    action: () => setTheme("dark")
  },
  {
    label: "Cyber Neon Theme",
    action: () => setTheme("cyber")
  },
  {
    label: "Retro NASA Theme",
    action: () => setTheme("retro")
  }
];

function renderCommands(filter = "") {
  const results =
    commands.filter(command =>
      command.label
        .toLowerCase()
        .includes(filter.toLowerCase())
    );

  $("#commandList").innerHTML =
    results.map(
      (command,index) => `
        <button
          class="command-item"
          data-command="${commands.indexOf(command)}"
        >
          <span>${command.label}</span>
          <small>RUN</small>
        </button>
      `
    ).join("");

  $$(".command-item").forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          commands[
            Number(button.dataset.command)
          ].action();

          commandOverlay.classList.remove("open");
        }
      );
    }
  );
}

function openCommandPalette() {
  commandOverlay.classList.add("open");

  $("#commandSearch").value = "";
  renderCommands();

  setTimeout(
    () => $("#commandSearch").focus(),
    0
  );
}

$("#commandButton").addEventListener(
  "click",
  openCommandPalette
);

$("#commandSearch").addEventListener(
  "input",
  event =>
    renderCommands(event.target.value)
);

function setTheme(theme) {
  persistent.theme = theme;

  saveState();
  applySettings();
}

/* =========================================================
   RANDOM
========================================================= */

function randomScenario() {
  const alternatives =
    scenarios.filter(
      scenario =>
        scenario.id !== persistent.scenario
    );

  const choice =
    alternatives[
      Math.floor(
        Math.random() *
        alternatives.length
      )
    ];

  selectScenario(choice.id);
}

$("#randomScenario").addEventListener(
  "click",
  randomScenario
);

/* =========================================================
   IDS
========================================================= */

function updateMissionIds() {
  const serial =
    String(
      persistent.missionCounter
    ).padStart(4,"0");

  const date =
    new Date()
      .toLocaleDateString(
        "en-GB",
        {
          day:"2-digit",
          month:"2-digit"
        }
      )
      .replace("/","");

  missionId.textContent =
    `LAI-${date}-${serial}`;

  packetId.textContent =
    `MSG-${serial}`;
}

/* =========================================================
   RESET UI
========================================================= */

function resetMissionUI() {
  runtime.currentStep = -1;

  statusText.textContent = "READY";
  progressBar.style.width = "0%";

  signalValue.textContent =
    `${getScenario().signal}%`;

  latencyMetric.textContent = "—";

  scanner.classList.remove("active");

  $$("#timeline button").forEach(
    button =>
      button.classList.remove(
        "active",
        "complete"
      )
  );
}

/* =========================================================
   TOAST
========================================================= */

function toast(message) {
  const element =
    document.createElement("div");

  element.className = "toast";
  element.textContent = message;

  toastRegion.append(element);

  setTimeout(
    () => element.remove(),
    2800
  );
}

/* =========================================================
   MODALS
========================================================= */

$$(".close-modal").forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        button
          .closest(".overlay")
          .classList.remove("open");
      }
    );
  }
);

$$(".result-close").forEach(
  button => {
    button.addEventListener(
      "click",
      () =>
        resultOverlay.classList.remove("open")
    );
  }
);

$$(".overlay").forEach(
  overlay => {
    overlay.addEventListener(
      "click",
      event => {
        if (event.target === overlay) {
          overlay.classList.remove("open");
        }
      }
    );
  }
);

/* =========================================================
   HISTORY ACTIONS
========================================================= */

$("#clearHistory").addEventListener(
  "click",
  () => {
    persistent.history = [];

    saveState();
    renderHistory();

    toast("Transmission history cleared.");
  }
);

/* =========================================================
   BUTTON EVENTS
========================================================= */

startButton.addEventListener(
  "click",
  startMission
);

pauseButton.addEventListener(
  "click",
  pauseMission
);

stepButton.addEventListener(
  "click",
  manualStep
);

pulseButton.addEventListener(
  "click",
  pulse
);

emailPacket.addEventListener(
  "click",
  () => {
    emailPacket.style.animation = "none";

    void emailPacket.offsetWidth;

    emailPacket.style.animation = "";

    runtime.bounceCount++;

    bounceMetric.textContent =
      runtime.bounceCount;

    log(
      "signal",
      "Manual bounce injected.",
      "warn"
    );

    playTone(260,.06);
  }
);

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.target.matches(
        "input, textarea, select"
      )
    ) {
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (event.key === "Escape") {
      $$(".overlay.open").forEach(
        overlay =>
          overlay.classList.remove("open")
      );

      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      pauseMission();
      return;
    }

    switch (
      event.key.toLowerCase()
    ) {
      case "r":
        startMission();
        break;

      case "s":
        manualStep();
        break;

      case "p":
        pulse();
        break;
    }

    const number =
      Number(event.key);

    if (
      number >= 1 &&
      number <= scenarios.length
    ) {
      selectScenario(
        scenarios[number - 1].id
      );
    }
  }
);

/* =========================================================
   INITIAL ACTIVE CONTROLS
========================================================= */

function syncControls() {
  $$("[data-difficulty]").forEach(
    button =>
      button.classList.toggle(
        "active",
        button.dataset.difficulty ===
          persistent.difficulty
      )
  );

  $$("[data-channel]").forEach(
    button =>
      button.classList.toggle(
        "active",
        button.dataset.channel ===
          persistent.channel
      )
  );

  $$("[data-speed]").forEach(
    button =>
      button.classList.toggle(
        "active",
        Number(button.dataset.speed) ===
          persistent.speed
      )
  );
}

/* =========================================================
   STARTUP
========================================================= */

function init() {
  renderScenarios();

  applyLanguage();
  applySettings();

  syncControls();

  updateScenarioUI();

  updateProfile();
  renderHistory();
  renderBadges();

  updateMissionIds();

  renderCommands();

  log(
    "system",
    "LaurAI Bounce Signal v3 initialized.",
    "info"
  );

  log(
    "ai",
    "Mission Control awaiting operator input.",
    "ai"
  );
}

init();
