const STORAGE_KEY = "task-organizer:stable";
const LEGACY_KEYS = ["task-organizer:v2", "task-organizer:v1"];

const form = document.getElementById("task-form");
const stats = document.getElementById("stats");
const filter = document.getElementById("filter");
const timeframeFilter = document.getElementById("timeframe-filter");
const categoryFilter = document.getElementById("category-filter");
const search = document.getElementById("search");
const clearCompleted = document.getElementById("clear-completed");
const empty = document.getElementById("empty");
const modal = document.getElementById("modal");
const openModal = document.getElementById("open-modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const taskIdField = document.getElementById("task-id");
const saveTaskBtn = document.getElementById("save-task");
const orbit = document.getElementById("orbit");
const orbitTasks = document.getElementById("orbit-tasks");
const noteModal = document.getElementById("note-modal");
const closeNoteModal = document.getElementById("close-note-modal");
const cancelNote = document.getElementById("cancel-note");
const noteForm = document.getElementById("note-form");
const noteText = document.getElementById("note-text");
const noteSlotId = document.getElementById("note-slot-id");
const noteTitle = document.getElementById("note-title");
const openCompleted = document.getElementById("open-completed");
const completedModal = document.getElementById("completed-modal");
const closeCompleted = document.getElementById("close-completed");
const toggleTasks = document.getElementById("toggle-tasks");
const dateModal = document.getElementById("date-modal");
const closeDateModal = document.getElementById("close-date-modal");
const dateForm = document.getElementById("date-form");
const dateDayKey = document.getElementById("date-day-key");
const dateInput = document.getElementById("day-date-input");
const clearDateBtn = document.getElementById("clear-date");
const completedList = document.getElementById("completed-list");
const DATE_LABELS_KEY = "task-organizer:day-dates";
const SCHEDULE_NOTES_KEY = "task-organizer:schedule-notes";
const AUTH_PASSWORD = " ";
const AUTH_KEY = "task-organizer:auth";

const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");

const TIMEFRAMES = ["Today", "Tomorrow", "End of the week", "Next month", "Way out"];
const TIMEFRAME_ARCS = {
  "Today": { start: 200, end: 230 },          // top-left
  "Tomorrow": { start: 230, end: 270 },       // left/down
  "End of the week": { start: 270, end: 310 },// bottom
  "Next month": { start: 310, end: 350 },     // right/down
  "Way out": { start: 350, end: 380 },        // top-right
};

let tasks = loadTasks();
let isDragging = false;
let dragTarget = null;
let dragOffset = { x: 0, y: 0 };
let scheduleNotes = loadScheduleNotes();
let dayDates = loadDayDates();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        localStorage.setItem(STORAGE_KEY, legacy);
        return parsed;
      }
    }

    return [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadScheduleNotes() {
  try {
    const raw = localStorage.getItem(SCHEDULE_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadDayDates() {
  try {
    const raw = localStorage.getItem(DATE_LABELS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDayDates() {
  localStorage.setItem(DATE_LABELS_KEY, JSON.stringify(dayDates));
}

function saveScheduleNotes() {
  localStorage.setItem(SCHEDULE_NOTES_KEY, JSON.stringify(scheduleNotes));
}

function isAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

function lockApp() {
  document.body.classList.add("locked");
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
  authPassword.value = "";
  authError.textContent = "";
  setTimeout(() => authPassword.focus(), 0);
}

function unlockApp() {
  sessionStorage.setItem(AUTH_KEY, "true");
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

function filteredTasks() {
  const f = filter.value;
  const tf = timeframeFilter.value;
  const c = categoryFilter.value;
  const q = search.value.trim().toLowerCase();

  return tasks
    .filter((t) => {
      if (f === "active" && t.done) return false;
      if (f === "done" && !t.done) return false;
      if (tf !== "all" && t.timeframe !== tf) return false;
      if (c !== "all" && t.category !== c) return false;
      if (q && !(`${t.title} ${t.notes}`.toLowerCase().includes(q))) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  stats.textContent = `${total} total • ${done} done`;
}

function openModalView(task = null) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  if (task) {
    modalTitle.textContent = "Edit Task";
    saveTaskBtn.textContent = "Save Changes";
    taskIdField.value = task.id;
    form.title.value = task.title;
    form.notes.value = task.notes;
    form.timeframe.value = task.timeframe;
    form.category.value = task.category;
  } else {
    modalTitle.textContent = "Add a To-Do";
    saveTaskBtn.textContent = "Save Task";
    taskIdField.value = "";
    form.reset();
  }

  document.getElementById("title").focus();
}

function closeModalView() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function openNoteModal(slot) {
  const id = slot.dataset.slotId;
  if (!id) return;
  const label = slot.dataset.slotLabel || "Schedule Note";
  noteSlotId.value = id;
  const existing = scheduleNotes[id] || {};
  noteTitle.value = existing.title || "";
  noteText.value = existing.text || "";
  noteModal.classList.add("show");
  noteModal.setAttribute("aria-hidden", "false");
  noteModal.querySelector("h2").textContent = label;
  noteText.focus();
}

function closeNoteModalView() {
  noteModal.classList.remove("show");
  noteModal.setAttribute("aria-hidden", "true");
  noteSlotId.value = "";
  noteText.value = "";
  noteTitle.value = "";
}


function renderTaskCard(task, index) {
  const card = document.createElement("div");
  card.className = `task-pill${task.done ? " done" : ""}`;
  card.dataset.category = task.category;
  card.dataset.timeframe = task.timeframe;
  card.dataset.priority = "Medium";
  card.dataset.taskId = task.id;

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;

  const date = document.createElement("div");
  date.className = "task-date";
  date.textContent = formatDate(task.createdAt);

  const doneDate = document.createElement("div");
  doneDate.className = "task-done-date";
  doneDate.textContent = task.done && task.completedAt ? `Done ${formatDate(task.completedAt)}` : "";

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.textContent = task.category;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "icon-btn";
  toggleBtn.textContent = task.done ? "Undo" : "Done";
  toggleBtn.addEventListener("click", () => toggleTask(task.id));

  const editBtn = document.createElement("button");
  editBtn.className = "icon-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => openModalView(task));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => removeTask(task.id));

  actions.appendChild(toggleBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(date);
  card.appendChild(doneDate);
  card.appendChild(meta);
  card.appendChild(actions);

  card.style.setProperty("--task-scale", 1);
  card.style.setProperty("--float-delay", `${(index * 0.2) % 2.4}s`);
  card.style.setProperty("--float-duration", `${5.5 + (index % 5) * 0.6}s`);

  card.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    isDragging = true;
    dragTarget = card;
    const rect = card.getBoundingClientRect();
    dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    card.classList.add("dragging");
  });

  return card;
}

function resolveCollisions(nodes, bounds, avoidRect, center) {
  const padding = 38;
  const iterations = 48;

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const minDist = (Math.max(a.w, b.w) * 0.75) + 28;
        if (dist < minDist) {
          const push = (minDist - dist) * 0.5;
          const ux = dx / dist;
          const uy = dy / dist;
          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
        }
      }
    }

    for (const n of nodes) {
      n.x = Math.min(bounds.right - n.w / 2 - padding, Math.max(bounds.left + n.w / 2 + padding, n.x));
      n.y = Math.min(bounds.bottom - n.h / 2 - padding, Math.max(bounds.top + n.h / 2 + padding, n.y));

      if (avoidRect) {
        const left = n.x - n.w / 2;
        const right = n.x + n.w / 2;
        const top = n.y - n.h / 2;
        const bottom = n.y + n.h / 2;
        const overlaps =
          right > avoidRect.left &&
          left < avoidRect.right &&
          bottom > avoidRect.top &&
          top < avoidRect.bottom;
        if (overlaps) {
          const dx = n.x - center.x;
          const dy = n.y - center.y;
          const dist = Math.hypot(dx, dy) || 1;
          const push = 40;
          n.x += (dx / dist) * push;
          n.y += (dy / dist) * push;
        }
      }
    }
  }
}

function positionTasks(items) {
  orbitTasks.innerHTML = "";
  if (!items.length) return;

  const orbitRect = orbit.getBoundingClientRect();
  const schedule = document.getElementById("schedule");
  const scheduleRect = schedule.getBoundingClientRect();

  const groups = TIMEFRAMES.reduce((acc, tf) => {
    acc[tf] = items.filter((t) => t.timeframe === tf);
    return acc;
  }, {});

  const scheduleBox = {
    left: scheduleRect.left - orbitRect.left,
    right: scheduleRect.left - orbitRect.left + scheduleRect.width,
    top: scheduleRect.top - orbitRect.top,
    bottom: scheduleRect.top - orbitRect.top + scheduleRect.height,
    width: scheduleRect.width,
    height: scheduleRect.height,
  };

  const orbitPadding = 28;
  const orbitBounds = {
    left: orbitPadding,
    right: orbitRect.width - orbitPadding,
    top: orbitPadding,
    bottom: orbitRect.height - orbitPadding,
  };

  const avoidRect = {
    left: scheduleBox.left - 12,
    right: scheduleBox.right + 12,
    top: scheduleBox.top - 12,
    bottom: scheduleBox.bottom + 12,
  };

  const margin = 18;
  const centerY = scheduleBox.top + scheduleBox.height / 2;

  const leftRegion = {
    x1: orbitBounds.left,
    x2: scheduleBox.left - margin,
    y1: orbitBounds.top,
    y2: orbitBounds.bottom,
  };
  const rightRegion = {
    x1: scheduleBox.right + margin,
    x2: orbitBounds.right,
    y1: orbitBounds.top,
    y2: orbitBounds.bottom,
  };
  const bottomRegion = {
    x1: orbitBounds.left,
    x2: orbitBounds.right,
    y1: scheduleBox.bottom + margin,
    y2: orbitBounds.bottom,
  };

  const regions = {
    "Today": {
      x1: leftRegion.x1,
      x2: leftRegion.x2,
      y1: leftRegion.y1,
      y2: centerY - margin,
    },
    "Tomorrow": {
      x1: leftRegion.x1,
      x2: leftRegion.x2,
      y1: centerY + margin,
      y2: leftRegion.y2,
    },
    "End of the week": {
      x1: bottomRegion.x1,
      x2: bottomRegion.x2,
      y1: bottomRegion.y1,
      y2: bottomRegion.y2,
    },
    "Next month": {
      x1: rightRegion.x1,
      x2: rightRegion.x2,
      y1: centerY + margin,
      y2: rightRegion.y2,
    },
    "Way out": {
      x1: rightRegion.x1,
      x2: rightRegion.x2,
      y1: rightRegion.y1,
      y2: centerY - margin,
    },
  };

  const orderedTimeframes = [
    "Today",
    "Tomorrow",
    "End of the week",
    "Next month",
    "Way out",
  ];

  const cards = [];
  const locked = [];
  let index = 0;
  for (const timeframe of orderedTimeframes) {
    const group = groups[timeframe] || [];
    if (!group.length) continue;

    const sortedGroup = [...group].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    sortedGroup.forEach((task) => {
      const card = renderTaskCard(task, index);
      orbitTasks.appendChild(card);
      if (task.position && task.position.locked) {
        locked.push({ card, x: task.position.x, y: task.position.y, w: 190, h: 110 });
      } else {
        cards.push({ card, timeframe });
      }
      card.style.setProperty("--float-offset", `${(index % 3) * 6 - 6}px`);
      index += 1;
    });
  }

  const placeVerticalRegion = (nodes, region) => {
    const cardW = 190;
    const cardH = 110;
    const gap = 14;
    const width = Math.max(0, region.x2 - region.x1);
    const height = Math.max(0, region.y2 - region.y1);
    if (width < cardW || height < cardH) return;

    const maxCols = Math.max(1, Math.floor((width + gap) / (cardW + gap)));
    const maxRowsPerCol = Math.max(1, Math.floor((height + gap) / (cardH + gap)));
    const cols = Math.min(maxCols, Math.max(1, Math.ceil(nodes.length / maxRowsPerCol)));

    const colGap = cols === 1 ? 0 : (width - cols * cardW) / (cols - 1);
    const safeColGap = Math.max(gap, colGap);
    const gridW = cols * cardW + (cols - 1) * safeColGap;
    const startX = region.x1 + (width - gridW) / 2 + cardW / 2;

    for (let c = 0; c < cols; c++) {
      const colNodes = nodes.filter((_, i) => i % cols == c);
      if (!colNodes.length) continue;
      const rows = colNodes.length;
      const rowGap = rows == 1 ? 0 : (height - rows * cardH) / (rows - 1);
      const safeRowGap = Math.max(gap, rowGap);
      const gridH = rows * cardH + (rows - 1) * safeRowGap;
      const startY = region.y1 + (height - gridH) / 2 + cardH / 2;
      colNodes.forEach((node, r) => {
        node.x = startX + c * (cardW + safeColGap);
        node.y = startY + r * (cardH + safeRowGap);
        node.w = cardW;
        node.h = cardH;
      });
    }
  };

  const placeHorizontalRegion = (nodes, region) => {
    const cardW = 190;
    const cardH = 110;
    const gap = 14;
    const width = Math.max(0, region.x2 - region.x1);
    const height = Math.max(0, region.y2 - region.y1);
    if (width < cardW || height < cardH) return;

    const maxRows = Math.max(1, Math.floor((height + gap) / (cardH + gap)));
    const maxColsPerRow = Math.max(1, Math.floor((width + gap) / (cardW + gap)));
    const rows = Math.min(maxRows, Math.max(1, Math.ceil(nodes.length / maxColsPerRow)));

    const rowGap = rows === 1 ? 0 : (height - rows * cardH) / (rows - 1);
    const safeRowGap = Math.max(gap, rowGap);
    const gridH = rows * cardH + (rows - 1) * safeRowGap;
    const startY = region.y1 + (height - gridH) / 2 + cardH / 2;

    for (let r = 0; r < rows; r++) {
      const rowNodes = nodes.filter((_, i) => i % rows == r);
      if (!rowNodes.length) continue;
      const cols = rowNodes.length;
      const colGap = cols == 1 ? 0 : (width - cols * cardW) / (cols - 1);
      const safeColGap = Math.max(gap, colGap);
      const gridW = cols * cardW + (cols - 1) * safeColGap;
      const startX = region.x1 + (width - gridW) / 2 + cardW / 2;
      rowNodes.forEach((node, c) => {
        node.x = startX + c * (cardW + safeColGap);
        node.y = startY + r * (cardH + safeRowGap);
        node.w = cardW;
        node.h = cardH;
      });
    }
  };

  requestAnimationFrame(() => {
    const nodes = cards.map(({ card, timeframe }) => ({ card, timeframe, x: 0, y: 0, w: 0, h: 0 }));

    locked.forEach((node) => {
      const clampedX = Math.min(orbitBounds.right, Math.max(orbitBounds.left, node.x));
      const clampedY = Math.min(orbitBounds.bottom, Math.max(orbitBounds.top, node.y));
      node.card.style.left = `${clampedX}px`;
      node.card.style.top = `${clampedY}px`;
    });

    orderedTimeframes.forEach((timeframe) => {
      const region = regions[timeframe];
      if (!region) return;
      const regionNodes = nodes.filter((n) => n.timeframe === timeframe);
      if (!regionNodes.length) return;
      if (timeframe === "End of the week") {
        placeHorizontalRegion(regionNodes, region);
      } else {
        placeVerticalRegion(regionNodes, region);
      }
    });

    const center = {
      x: scheduleBox.left + scheduleBox.width / 2,
      y: scheduleBox.top + scheduleBox.height / 2,
    };

    resolveCollisions(nodes, orbitBounds, avoidRect, center);

    for (const node of nodes) {
      const clampedX = Math.min(orbitBounds.right, Math.max(orbitBounds.left, node.x));
      const clampedY = Math.min(orbitBounds.bottom, Math.max(orbitBounds.top, node.y));
      node.card.style.left = `${clampedX}px`;
      node.card.style.top = `${clampedY}px`;
    }
  });
}
function render() {
  const items = filteredTasks();
  positionTasks(items);
  empty.style.display = items.length === 0 ? "block" : "none";
  updateStats();
}

function addTask(data) {
  const now = Date.now();
  const task = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: data.title.trim(),
    notes: data.notes.trim(),
    timeframe: data.timeframe,
    category: data.category,
    done: false,
    createdAt: now,
    completedAt: null,
  };
  tasks.unshift(task);
  saveTasks();
  render();
}

function updateTask(id, data) {
  tasks = tasks.map((t) => {
    if (t.id !== id) return t;
    const newTimeframe = data.timeframe;
    const updated = {
      ...t,
      title: data.title.trim(),
      notes: data.notes.trim(),
      timeframe: newTimeframe,
      category: data.category,
    };
    if (t.timeframe !== newTimeframe) {
      updated.position = undefined;
    }
    return updated;
  });
  saveTasks();
  if (tasks.some((t) => t.position === undefined)) {
    resetAutoPositions();
  }
  render();
}

function toggleTask(id) {
  tasks = tasks.map((t) => {
    if (t.id !== id) return t;
    const done = !t.done;
    return { ...t, done, completedAt: done ? Date.now() : null };
  });
  saveTasks();
  resetAutoPositions();
  render();
}

function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  resetAutoPositions();
  render();
}

function clearDone() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  resetAutoPositions();
  render();
}

function resetAutoPositions() {
  tasks = tasks.map((t) => {
    if (t.position && t.position.locked) return t;
    return { ...t, position: undefined };
  });
  saveTasks();
}

function resetAllPositions() {
  tasks = tasks.map((t) => ({ ...t, position: undefined }));
  saveTasks();
}

function lockAllPositions() {
  const cards = document.querySelectorAll(".task-pill");
  const positions = {};
  cards.forEach((card) => {
    const id = card.dataset.taskId;
    const x = parseFloat(card.style.left || "0");
    const y = parseFloat(card.style.top || "0");
    if (!id || !Number.isFinite(x) || !Number.isFinite(y)) return;
    positions[id] = { x, y };
  });
  tasks = tasks.map((t) => {
    const pos = positions[t.id];
    if (!pos) return t;
    return { ...t, position: { x: pos.x, y: pos.y, locked: true } };
  });
  saveTasks();
}

function handleMouseMove(e) {
  if (!isDragging || !dragTarget) return;
  const orbitRect = orbit.getBoundingClientRect();
  const x = e.clientX - orbitRect.left - dragOffset.x + dragTarget.offsetWidth / 2;
  const y = e.clientY - orbitRect.top - dragOffset.y + dragTarget.offsetHeight / 2;
  const pad = 28;
  const clampedX = Math.min(orbitRect.width - pad, Math.max(pad, x));
  const clampedY = Math.min(orbitRect.height - pad, Math.max(pad, y));
  dragTarget.style.left = `${clampedX}px`;
  dragTarget.style.top = `${clampedY}px`;
}

function handleMouseUp() {
  if (!isDragging || !dragTarget) return;
  const orbitRect = orbit.getBoundingClientRect();
  const scheduleRect = document.getElementById("schedule").getBoundingClientRect();
  const avoidRect = {
    left: scheduleRect.left - orbitRect.left - 10,
    top: scheduleRect.top - orbitRect.top - 10,
    right: scheduleRect.left - orbitRect.left + scheduleRect.width + 10,
    bottom: scheduleRect.top - orbitRect.top + scheduleRect.height + 10,
  };
  const x = parseFloat(dragTarget.style.left);
  const y = parseFloat(dragTarget.style.top);
  const left = x - dragTarget.offsetWidth / 2;
  const right = x + dragTarget.offsetWidth / 2;
  const top = y - dragTarget.offsetHeight / 2;
  const bottom = y + dragTarget.offsetHeight / 2;
  const overlaps =
    right > avoidRect.left &&
    left < avoidRect.right &&
    bottom > avoidRect.top &&
    top < avoidRect.bottom;
  if (overlaps) {
    const center = {
      x: avoidRect.left + (avoidRect.right - avoidRect.left) / 2,
      y: avoidRect.top + (avoidRect.bottom - avoidRect.top) / 2,
    };
    const dx = x - center.x;
    const dy = y - center.y;
    const dist = Math.hypot(dx, dy) || 1;
    const push = 40;
    dragTarget.style.left = `${x + (dx / dist) * push}px`;
    dragTarget.style.top = `${y + (dy / dist) * push}px`;
  }
  const id = dragTarget.dataset.taskId;
  const task = tasks.find((t) => t.id === id);
  if (task) {
    lockAllPositions();
  }
  dragTarget.classList.remove("dragging");
  dragTarget = null;
  isDragging = false;
}

function bindScheduleToggle() {
  document.querySelectorAll(".slot").forEach((slot) => {
    let clickTimer = null;
    slot.addEventListener("click", () => {
      if (slot.classList.contains("editing")) return;
      if (clickTimer) return;
      clickTimer = setTimeout(() => {
        slot.classList.toggle("completed");
        clickTimer = null;
      }, 220);
    });
    slot.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      openNoteModal(slot);
    });
  });
}

function renderDayDates() {
  document.querySelectorAll("[data-day-date]").forEach((el) => {
    const key = el.dataset.dayDate;
    const value = dayDates[key];
    if (!value) {
      el.textContent = "";
      return;
    }
    const [year, month, dayNumRaw] = value.split("-").map(Number);
    if (!year || !month || !dayNumRaw) {
      el.textContent = "";
      return;
    }
    const date = new Date(year, month - 1, dayNumRaw);
    const day = date.toLocaleDateString(undefined, { weekday: "short" });
    const dayNum = date.getDate();
    el.textContent = `${day} ${dayNum}`;
  });
}

function renderScheduleNotes() {
  document.querySelectorAll(".slot").forEach((slot) => {
    const id = slot.dataset.slotId;
    if (!id) return;
    let note = slot.querySelector(".slot-note");
    const noteData = scheduleNotes[id];
    if (noteData && (noteData.title || noteData.text)) {
      if (!note) {
        note = document.createElement("div");
        note.className = "slot-note";
        slot.appendChild(note);
      }
      note.textContent = noteData.title || "Note";
      slot.title = noteData.text || noteData.title || "";
      slot.classList.add("has-note");
    } else if (note) {
      note.remove();
      slot.classList.remove("has-note");
      slot.removeAttribute("title");
    }
  });
}

function layoutOnResize() {
  window.requestAnimationFrame(render);
}

function renderCompletedList() {
  const doneTasks = tasks
    .filter((t) => t.done && t.completedAt)
    .sort((a, b) => b.completedAt - a.completedAt);
  completedList.innerHTML = "";
  if (doneTasks.length === 0) {
    completedList.textContent = "No completed tasks yet.";
    return;
  }
  const ul = document.createElement("ul");
  ul.className = "completed-ul";
  for (const t of doneTasks) {
    const li = document.createElement("li");
    li.textContent = `${t.title} • ${formatDate(t.completedAt)}`;
    ul.appendChild(li);
  }
  completedList.appendChild(ul);
}

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = authPassword.value;
  if (value === AUTH_PASSWORD) {
    unlockApp();
    return;
  }
  authError.textContent = "Incorrect password.";
  authPassword.select();
});

if (!isAuthed()) {
  lockApp();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.title || !data.title.trim()) return;

  const id = taskIdField.value;
  if (id) {
    updateTask(id, data);
  } else {
    addTask(data);
  }

  form.reset();
  closeModalView();
});

[filter, timeframeFilter, categoryFilter, search].forEach((el) => {
  el.addEventListener("input", render);
});

clearCompleted.addEventListener("click", clearDone);
openModal.addEventListener("click", () => openModalView());
closeModal.addEventListener("click", closeModalView);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalView();
});

window.addEventListener("resize", layoutOnResize);
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("mouseup", handleMouseUp);
toggleTasks.addEventListener("click", () => {
  document.body.classList.toggle("tasks-hidden");
  toggleTasks.textContent = document.body.classList.contains("tasks-hidden")
    ? "Show Tasks"
    : "Hide Tasks";
});

openCompleted.addEventListener("click", () => {
  renderCompletedList();
  completedModal.classList.add("show");
  completedModal.setAttribute("aria-hidden", "false");
});
document.querySelectorAll("[data-day-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.dayBtn;
    dateDayKey.value = key;
    dateInput.value = dayDates[key] || "";
    dateModal.classList.add("show");
    dateModal.setAttribute("aria-hidden", "false");
  });
});

closeDateModal.addEventListener("click", () => {
  dateModal.classList.remove("show");
  dateModal.setAttribute("aria-hidden", "true");
});

dateModal.addEventListener("click", (e) => {
  if (e.target === dateModal) {
    dateModal.classList.remove("show");
    dateModal.setAttribute("aria-hidden", "true");
  }
});

clearDateBtn.addEventListener("click", () => {
  const key = dateDayKey.value;
  if (!key) return;
  delete dayDates[key];
  saveDayDates();
  renderDayDates();
  dateModal.classList.remove("show");
  dateModal.setAttribute("aria-hidden", "true");
});

dateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const key = dateDayKey.value;
  if (!key) return;
  dayDates[key] = dateInput.value;
  saveDayDates();
  renderDayDates();
  dateModal.classList.remove("show");
  dateModal.setAttribute("aria-hidden", "true");
});

closeCompleted.addEventListener("click", () => {
  completedModal.classList.remove("show");
  completedModal.setAttribute("aria-hidden", "true");
});
completedModal.addEventListener("click", (e) => {
  if (e.target === completedModal) {
    completedModal.classList.remove("show");
    completedModal.setAttribute("aria-hidden", "true");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalView();
});

closeNoteModal.addEventListener("click", closeNoteModalView);
cancelNote.addEventListener("click", closeNoteModalView);
noteModal.addEventListener("click", (e) => {
  if (e.target === noteModal) closeNoteModalView();
});
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = noteSlotId.value;
  if (!id) return;
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();
  if (title || text) {
    scheduleNotes[id] = { title, text };
  } else {
    delete scheduleNotes[id];
  }
  saveScheduleNotes();
  renderScheduleNotes();
  closeNoteModalView();
});

bindScheduleToggle();
renderScheduleNotes();
render();
