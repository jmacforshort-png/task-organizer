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
const blockTaskInput = document.getElementById("block-task-input");
const addBlockTask = document.getElementById("add-block-task");
const blockTaskList = document.getElementById("block-task-list");
const openCompleted = document.getElementById("open-completed");
const completedModal = document.getElementById("completed-modal");
const closeCompleted = document.getElementById("close-completed");
const toggleTasks = document.getElementById("toggle-tasks");
const dateModal = document.getElementById("date-modal");
const closeDateModal = document.getElementById("close-date-modal");
const dateForm = document.getElementById("date-form");
const dateDayKey = document.getElementById("date-day-key");
const dateInput = document.getElementById("day-date-input");
const dayNameInput = document.getElementById("day-name-input");
const dayDatePicker = document.getElementById("day-date-picker");
const dateModalTitle = document.getElementById("date-modal-title");
const clearDateBtn = document.getElementById("clear-date");
const completedList = document.getElementById("completed-list");
const DATE_LABELS_KEY = "task-organizer:day-dates";
const DATE_LABELS_META_KEY = "task-organizer:day-dates-meta";
const SCHEDULE_NOTES_KEY = "task-organizer:schedule-notes";
const SCHEDULE_NOTES_META_KEY = "task-organizer:schedule-notes-meta";
const SCHEDULE_COMPLETED_KEY = "task-organizer:schedule-completed";
const DELETED_TASKS_KEY = "task-organizer:deleted-tasks";
const LOCAL_BACKUP_KEY = "task-organizer:local-backup";
const STATE_UPDATED_AT_KEY = "task-organizer:state-updated-at";
const AUTH_PASSWORD = " ";
const AUTH_KEY = "task-organizer:auth";
const STICKY_KEY = "task-organizer:sticky-notes";
const SUPABASE_URL = "https://qobroovizfpgwxunhlrj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AjE8R1VWav7l6iXNMD5pJw_Qn8qt7Y8";
const CLOUD_TABLE = "task_organizer_state";

const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const cloudModal = document.getElementById("cloud-modal");
const cloudForm = document.getElementById("cloud-form");
const cloudEmail = document.getElementById("cloud-email");
const cloudPassword = document.getElementById("cloud-password");
const cloudFeedback = document.getElementById("cloud-feedback");
const cloudStatus = document.getElementById("cloud-status");
const openCloud = document.getElementById("open-cloud");
const closeCloud = document.getElementById("close-cloud");
const cloudSignup = document.getElementById("cloud-signup");
const cloudSignout = document.getElementById("cloud-signout");
const stickyGrid = document.getElementById("sticky-grid");
const stickyEmpty = document.getElementById("sticky-empty");
const stickyModal = document.getElementById("sticky-modal");
const stickyForm = document.getElementById("sticky-form");
const stickyIdField = document.getElementById("sticky-id");
const stickyTitleField = document.getElementById("sticky-title");
const stickyBodyField = document.getElementById("sticky-body");
const stickyModalTitle = document.getElementById("sticky-modal-title");
const openSticky = document.getElementById("open-sticky");
const closeSticky = document.getElementById("close-sticky");
const cancelSticky = document.getElementById("cancel-sticky");
const noteViewModal = document.getElementById("note-view-modal");
const noteViewTitle = document.getElementById("note-view-title");
const noteViewBody = document.getElementById("note-view-body");
const closeNoteView = document.getElementById("close-note-view");
const noteViewDelete = document.getElementById("note-view-delete");
const noteViewEdit = document.getElementById("note-view-edit");
const syncAlert = document.getElementById("sync-alert");
const syncAlertText = document.getElementById("sync-alert-text");
const syncOpenCloud = document.getElementById("sync-open-cloud");
const syncClose = document.getElementById("sync-close");
const nextUpList = document.getElementById("next-up-list");
const liveClock = document.getElementById("live-clock");
const openSundayBtn = document.getElementById("open-sunday");
const openSaturdayBtn = document.getElementById("open-saturday");
const weekendPlanner = document.getElementById("weekend-planner");
const weekendTitle = document.getElementById("weekend-title");
const weekendDate = document.getElementById("weekend-date");
const weekendHours = document.getElementById("weekend-hours");
const hideWeekendBtn = document.getElementById("hide-weekend");

const TIMEFRAMES = ["Today", "Tomorrow", "End of the week", "Next month", "Way out"];
const TASK_CARD_W = 108;
const TASK_CARD_H = 74;
const TASK_LAYOUT_PADDING = 10;
const TASK_COLS_PER_ROW = 3;
const TASK_ROW_GAP = 12;
const TASK_COL_GAP = 8;
const TASK_LANE_PADDING = 10;
const SCHEDULE_BLOCK_TASKS_KEY = "task-organizer:schedule-block-tasks";
const SCHEDULE_BLOCK_TASKS_META_KEY = "task-organizer:schedule-block-tasks-meta";
const WEEKEND_PLANNER_KEY = "task-organizer:weekend-planner";
const WEEKEND_PLANNER_META_KEY = "task-organizer:weekend-planner-meta";
const SLOT_DAY_INDEX = {
  xday: 1,
  day1: 2,
  day2: 3,
  day3: 4,
  day4: 5,
};

let tasks = loadTasks();
let isDragging = false;
let dragTarget = null;
let dragOffset = { x: 0, y: 0 };
let scheduleNotes = loadScheduleNotes();
let scheduleCompleted = loadScheduleCompleted();
let deletedTaskIds = loadDeletedTaskIds();
let dayDates = loadDayDates();
let dayDatesMeta = loadDayDatesMeta();
let stickyNotes = loadStickyNotes();
let supabaseClient = null;
let cloudReady = false;
let isApplyingCloudState = false;
let cloudSaveTimer = null;
let cloudUserId = null;
let scheduleBlockTasks = loadScheduleBlockTasks();
let scheduleBlockTasksMeta = loadScheduleBlockTasksMeta();
let weekendPlannerNotes = loadWeekendPlannerNotes();
let weekendPlannerNotesMeta = loadWeekendPlannerNotesMeta();
let scheduleNotesMeta = loadScheduleNotesMeta();
let stateUpdatedAt = loadStateUpdatedAt();
const enteringTaskIds = new Set();
const pendingTaskAnimations = new Set();
let syncAlertDismissedAt = 0;
let noteViewSlotId = "";
let noteAutosaveTimer = null;

function enforceSyncAlertState() {
  const connected = /Connected/i.test(cloudStatus.textContent || "");
  if (connected) syncAlert.hidden = true;
}

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
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadScheduleNotes() {
  try {
    const raw = localStorage.getItem(SCHEDULE_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadScheduleNotesMeta() {
  try {
    const raw = localStorage.getItem(SCHEDULE_NOTES_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadScheduleCompleted() {
  try {
    const raw = localStorage.getItem(SCHEDULE_COMPLETED_KEY);
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

function loadDayDatesMeta() {
  try {
    const raw = localStorage.getItem(DATE_LABELS_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDayDates() {
  localStorage.setItem(DATE_LABELS_KEY, JSON.stringify(dayDates));
  localStorage.setItem(DATE_LABELS_META_KEY, JSON.stringify(dayDatesMeta));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function saveScheduleNotes() {
  localStorage.setItem(SCHEDULE_NOTES_KEY, JSON.stringify(scheduleNotes));
  localStorage.setItem(SCHEDULE_NOTES_META_KEY, JSON.stringify(scheduleNotesMeta));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function saveScheduleCompleted() {
  localStorage.setItem(SCHEDULE_COMPLETED_KEY, JSON.stringify(scheduleCompleted));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadDeletedTaskIds() {
  try {
    const raw = localStorage.getItem(DELETED_TASKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDeletedTaskIds() {
  localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(deletedTaskIds));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadScheduleBlockTasks() {
  try {
    const raw = localStorage.getItem(SCHEDULE_BLOCK_TASKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadScheduleBlockTasksMeta() {
  try {
    const raw = localStorage.getItem(SCHEDULE_BLOCK_TASKS_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveScheduleBlockTasks() {
  localStorage.setItem(SCHEDULE_BLOCK_TASKS_KEY, JSON.stringify(scheduleBlockTasks));
  localStorage.setItem(SCHEDULE_BLOCK_TASKS_META_KEY, JSON.stringify(scheduleBlockTasksMeta));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadWeekendPlannerNotes() {
  try {
    const raw = localStorage.getItem(WEEKEND_PLANNER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadWeekendPlannerNotesMeta() {
  try {
    const raw = localStorage.getItem(WEEKEND_PLANNER_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveWeekendPlannerNotes() {
  localStorage.setItem(WEEKEND_PLANNER_KEY, JSON.stringify(weekendPlannerNotes));
  localStorage.setItem(WEEKEND_PLANNER_META_KEY, JSON.stringify(weekendPlannerNotesMeta));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadLocalBackup() {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadStickyNotes() {
  try {
    const raw = localStorage.getItem(STICKY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStickyNotes() {
  localStorage.setItem(STICKY_KEY, JSON.stringify(stickyNotes));
  markLocalStateUpdated();
  scheduleCloudSave();
}

function loadStateUpdatedAt() {
  try {
    const raw = localStorage.getItem(STATE_UPDATED_AT_KEY);
    const parsed = Number(raw || 0);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function markLocalStateUpdated(ts = Date.now()) {
  const next = Number(ts || 0);
  if (!Number.isFinite(next) || next <= 0) return;
  stateUpdatedAt = Math.max(stateUpdatedAt, next);
  localStorage.setItem(STATE_UPDATED_AT_KEY, String(stateUpdatedAt));
}

function backupLocalState(reason = "manual") {
  const snapshot = {
    reason,
    savedAt: Date.now(),
    data: {
      tasks,
      dayDates,
      dayDatesMeta,
      scheduleNotes,
      scheduleNotesMeta,
      scheduleCompleted,
      deletedTaskIds,
      scheduleBlockTasks,
      scheduleBlockTasksMeta,
      weekendPlannerNotes,
      weekendPlannerNotesMeta,
      stickyNotes,
    },
  };
  localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(snapshot));
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

function isSupabaseConfigured() {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR_SUPABASE_URL") &&
    !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY")
  );
}

function openCloudModal() {
  cloudFeedback.textContent = "";
  cloudModal.classList.add("show");
  cloudModal.setAttribute("aria-hidden", "false");
  cloudEmail.focus();
}

function closeCloudModal() {
  cloudModal.classList.remove("show");
  cloudModal.setAttribute("aria-hidden", "true");
}

function updateCloudStatus(text) {
  cloudStatus.textContent = text;
  const isConnected = /Connected/i.test(text);
  if (isConnected) {
    syncAlertDismissedAt = 0;
    syncAlert.hidden = true;
    enforceSyncAlertState();
    return;
  }
  const dismissedRecently = Date.now() - syncAlertDismissedAt < 5 * 60 * 1000;
  if (dismissedRecently) return;
  syncAlertText.textContent = "Out of sync";
  syncAlert.hidden = false;
  enforceSyncAlertState();
}

function formatCloudError(error, fallbackText) {
  const message = error?.message || "";
  if (/failed to fetch/i.test(message)) {
    return "Network error contacting cloud sync. Check internet access, content blockers, or browser privacy settings.";
  }
  return message || fallbackText;
}

async function initSupabase() {
  if (!isSupabaseConfigured() || !window.supabase) {
    updateCloudStatus("Cloud Sync: Not configured");
    openCloud.setAttribute("disabled", "disabled");
    return;
  }
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (sessionData.session) {
      cloudReady = true;
      cloudUserId = sessionData.session.user.id;
      updateCloudStatus("Cloud Sync: Connected");
      await hydrateFromCloud();
    } else {
      updateCloudStatus("Cloud Sync: Signed out");
    }

    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        cloudReady = true;
        cloudUserId = session.user.id;
        updateCloudStatus("Cloud Sync: Connected");
        await hydrateFromCloud();
      } else {
        cloudReady = false;
        cloudUserId = null;
        updateCloudStatus("Cloud Sync: Signed out");
      }
    });
  } catch (error) {
    cloudReady = false;
    cloudUserId = null;
    cloudFeedback.textContent = formatCloudError(error, "Cloud sync failed to initialize.");
    updateCloudStatus("Cloud Sync: Out of sync");
    return;
  }

  setInterval(() => {
    if (!cloudReady || document.hidden) return;
    hydrateFromCloud();
  }, 8000);
}

function buildCloudPayload() {
  const now = Date.now();
  markLocalStateUpdated(now);
  return {
    tasks,
    dayDates,
    dayDatesMeta,
    scheduleNotes,
    scheduleNotesMeta,
    scheduleCompleted,
    deletedTaskIds,
    scheduleBlockTasks,
    scheduleBlockTasksMeta,
    weekendPlannerNotes,
    weekendPlannerNotesMeta,
    stickyNotes,
    updatedAt: now,
  };
}

function taskTimestamp(task) {
  return Number(task.updatedAt || task.completedAt || task.createdAt || 0);
}

function timestampValue(value) {
  return Number(value || 0);
}

function mapEntryTimestamp(map, key, fallback = 0) {
  const value = (map || {})[key];
  if (!value || typeof value !== "object") return timestampValue(fallback);
  return timestampValue(value.updatedAt || fallback);
}

function mergeTimestampedMap(localMap, cloudMap, localMeta, cloudMeta, fallbackLocalTs = 0, fallbackCloudTs = 0) {
  const nextMap = {};
  const nextMeta = {};
  const keys = new Set([
    ...Object.keys(localMap || {}),
    ...Object.keys(cloudMap || {}),
    ...Object.keys(localMeta || {}),
    ...Object.keys(cloudMeta || {}),
  ]);

  keys.forEach((key) => {
    const localTs = timestampValue((localMeta || {})[key]) || mapEntryTimestamp(localMap, key, fallbackLocalTs);
    const cloudTs = timestampValue((cloudMeta || {})[key]) || mapEntryTimestamp(cloudMap, key, fallbackCloudTs);
    const useCloud = cloudTs > localTs;
    const winnerMap = useCloud ? (cloudMap || {}) : (localMap || {});
    if (Object.prototype.hasOwnProperty.call(winnerMap, key)) {
      nextMap[key] = winnerMap[key];
    }
    nextMeta[key] = Math.max(localTs, cloudTs);
  });

  return { map: nextMap, meta: nextMeta };
}

function mergeDeletedTaskIds(localDeleted, cloudDeleted) {
  const merged = { ...localDeleted };
  Object.entries(cloudDeleted || {}).forEach(([id, ts]) => {
    const localTs = Number(merged[id] || 0);
    const remoteTs = Number(ts || 0);
    if (remoteTs > localTs) merged[id] = remoteTs;
  });
  return merged;
}

function mergeTasks(localTasks, cloudTasks, deletedMap) {
  const merged = new Map();
  const ingest = (task) => {
    if (!task || !task.id) return;
    const existing = merged.get(task.id);
    if (!existing || taskTimestamp(task) >= taskTimestamp(existing)) {
      merged.set(task.id, task);
    }
  };
  (localTasks || []).forEach(ingest);
  (cloudTasks || []).forEach(ingest);
  const result = [];
  merged.forEach((task, id) => {
    const deletedAt = Number((deletedMap || {})[id] || 0);
    if (deletedAt > taskTimestamp(task)) return;
    result.push(task);
  });
  return result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function recoverMissingTasksFromBackup() {
  const backup = loadLocalBackup();
  const backupTasks = Array.isArray(backup?.data?.tasks) ? backup.data.tasks : [];
  if (!backupTasks.length) return;

  const now = Date.now();
  const recentWindowMs = 7 * 24 * 60 * 60 * 1000;
  const currentIds = new Set(tasks.map((t) => t.id));
  const recovered = [];

  for (const task of backupTasks) {
    if (!task || !task.id) continue;
    if (currentIds.has(task.id)) continue;
    const deletedAt = Number(deletedTaskIds[task.id] || 0);
    const updatedAt = taskTimestamp(task);
    if (deletedAt > updatedAt) continue;
    if ((task.createdAt || 0) < now - recentWindowMs) continue;
    recovered.push(task);
  }

  if (!recovered.length) return;
  tasks = mergeTasks(tasks, recovered, deletedTaskIds);
  saveTasks();
}

function applyCloudPayload(payload) {
  if (!payload) return;
  const cloudUpdatedAt = Number(payload.updatedAt || 0);

  backupLocalState("before-cloud-apply");
  isApplyingCloudState = true;
  const localTasks = Array.isArray(tasks) ? tasks : [];
  const cloudTasks = Array.isArray(payload.tasks) ? payload.tasks : [];
  const localStickyNotes = Array.isArray(stickyNotes) ? stickyNotes : [];
  const cloudStickyNotes = Array.isArray(payload.stickyNotes) ? payload.stickyNotes : [];
  const cloudDayDatesMeta = payload.dayDatesMeta || {};
  const cloudScheduleNotesMeta = payload.scheduleNotesMeta || {};
  const cloudScheduleBlockTasksMeta = payload.scheduleBlockTasksMeta || {};
  const cloudWeekendPlannerNotesMeta = payload.weekendPlannerNotesMeta || {};
  deletedTaskIds = mergeDeletedTaskIds(deletedTaskIds, payload.deletedTaskIds || {});
  tasks = mergeTasks(localTasks, cloudTasks, deletedTaskIds);
  const mergedDayDates = mergeTimestampedMap(
    dayDates,
    payload.dayDates || {},
    dayDatesMeta,
    cloudDayDatesMeta,
    0,
    cloudUpdatedAt
  );
  dayDates = mergedDayDates.map;
  dayDatesMeta = mergedDayDates.meta;

  const mergedScheduleNotes = mergeTimestampedMap(
    scheduleNotes,
    payload.scheduleNotes || {},
    scheduleNotesMeta,
    cloudScheduleNotesMeta,
    0,
    cloudUpdatedAt
  );
  scheduleNotes = mergedScheduleNotes.map;
  scheduleNotesMeta = mergedScheduleNotes.meta;

  const mergedScheduleBlockTasks = mergeTimestampedMap(
    scheduleBlockTasks,
    payload.scheduleBlockTasks || {},
    scheduleBlockTasksMeta,
    cloudScheduleBlockTasksMeta,
    0,
    cloudUpdatedAt
  );
  scheduleBlockTasks = mergedScheduleBlockTasks.map;
  scheduleBlockTasksMeta = mergedScheduleBlockTasks.meta;

  const mergedWeekendPlannerNotes = mergeTimestampedMap(
    weekendPlannerNotes,
    payload.weekendPlannerNotes || {},
    weekendPlannerNotesMeta,
    cloudWeekendPlannerNotesMeta,
    0,
    cloudUpdatedAt
  );
  weekendPlannerNotes = mergedWeekendPlannerNotes.map;
  weekendPlannerNotesMeta = mergedWeekendPlannerNotes.meta;

  scheduleCompleted = payload.scheduleCompleted || {};
  stickyNotes = mergeStickyNotes(localStickyNotes, cloudStickyNotes);
  saveTasks();
  saveDayDates();
  saveScheduleNotes();
  saveScheduleCompleted();
  saveDeletedTaskIds();
  saveScheduleBlockTasks();
  saveWeekendPlannerNotes();
  saveStickyNotes();
  markLocalStateUpdated(cloudUpdatedAt || Date.now());
  isApplyingCloudState = false;
  renderDayDates();
  renderScheduleCompletion();
  renderBlockMeta();
  renderScheduleNotes();
  renderNextUpPanel();
  renderStickyNotes();
  render();
  scheduleCloudSave();
}

async function hydrateFromCloud() {
  if (!supabaseClient || !cloudReady || !cloudUserId) return;
  const { data, error } = await supabaseClient
    .from(CLOUD_TABLE)
    .select("data")
    .eq("user_id", cloudUserId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    cloudFeedback.textContent = `Sync error: ${formatCloudError(error, "unknown error")}`;
    updateCloudStatus("Cloud Sync: Out of sync");
    return;
  }
  if (data && data.data) {
    applyCloudPayload(data.data);
  } else {
    await saveCloudNow();
  }
}

async function saveCloudNow() {
  if (!supabaseClient || !cloudReady || !cloudUserId) return;
  const payload = buildCloudPayload();
  const { error } = await supabaseClient.from(CLOUD_TABLE).upsert({
    user_id: cloudUserId,
    data: payload,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "user_id",
  });
  if (error) {
    cloudFeedback.textContent = `Sync error: ${formatCloudError(error, "unknown error")}`;
    updateCloudStatus("Cloud Sync: Out of sync");
    return;
  }
  cloudFeedback.textContent = "Cloud sync saved.";
  updateCloudStatus("Cloud Sync: Connected");
}

function scheduleCloudSave() {
  if (isApplyingCloudState || !cloudReady) return;
  if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    saveCloudNow();
  }, 180);
}

function openStickyModal(note = null) {
  stickyModal.classList.add("show");
  stickyModal.setAttribute("aria-hidden", "false");
  if (note) {
    stickyModalTitle.textContent = "Edit Sticky Note";
    stickyIdField.value = note.id;
    stickyTitleField.value = note.title;
    stickyBodyField.value = note.body;
  } else {
    stickyModalTitle.textContent = "Add Sticky Note";
    stickyIdField.value = "";
    stickyForm.reset();
  }
  stickyTitleField.focus();
}

function closeStickyModal() {
  stickyModal.classList.remove("show");
  stickyModal.setAttribute("aria-hidden", "true");
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
  stats.innerHTML = `${total} total • ${done} done <span class="trash-icon" aria-hidden="true">🗑</span>`;
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

function getWeekStartSunday(reference = new Date()) {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function formatShortDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getWeekDates() {
  const sunday = getWeekStartSunday();
  const monday = new Date(sunday);
  monday.setDate(sunday.getDate() + 1);
  const tuesday = new Date(sunday);
  tuesday.setDate(sunday.getDate() + 2);
  const wednesday = new Date(sunday);
  wednesday.setDate(sunday.getDate() + 3);
  const thursday = new Date(sunday);
  thursday.setDate(sunday.getDate() + 4);
  const friday = new Date(sunday);
  friday.setDate(sunday.getDate() + 5);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return { sunday, monday, tuesday, wednesday, thursday, friday, saturday };
}

const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const WEEKDAY_DEFAULT_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

function getAutoWeekdayPresentation(dayKey) {
  const weekDates = getWeekDates();
  const date = weekDates[dayKey];
  return {
    dayLabel: WEEKDAY_DEFAULT_LABELS[dayKey] || "",
    dateLabel: date ? formatShortDate(date) : "",
    isoDate: date ? date.toISOString().slice(0, 10) : "",
  };
}

function getDisplayWeekdayPresentation(dayKey) {
  const auto = getAutoWeekdayPresentation(dayKey);
  const override = dayDates[dayKey];
  if (!override) return auto;
  return {
    dayLabel: (override.dayLabel || "").trim() || auto.dayLabel,
    dateLabel: (override.dateLabel || "").trim() || auto.dateLabel,
    isoDate: auto.isoDate,
  };
}

function setDayDateOverride(dayKey, dayLabel, dateLabel) {
  const nextTs = Date.now();
  dayDates[dayKey] = {
    dayLabel: dayLabel.trim(),
    dateLabel: dateLabel.trim(),
    updatedAt: nextTs,
  };
  dayDatesMeta[dayKey] = nextTs;
  saveDayDates();
}

function clearDayDateOverride(dayKey) {
  const nextTs = Date.now();
  delete dayDates[dayKey];
  dayDatesMeta[dayKey] = nextTs;
  saveDayDates();
}

function getSlotMeta(slot) {
  const start = Number(slot.style.getPropertyValue("--start") || 0);
  const end = Number(slot.style.getPropertyValue("--end") || 0);
  const slotId = slot.dataset.slotId || "";
  const dayPrefix = slotId.split("-")[0];
  const dayIndex = SLOT_DAY_INDEX[dayPrefix];
  return { start, end, dayIndex, slotId };
}

function minuteInDay(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function minuteFromScheduleStart(date = new Date()) {
  return minuteInDay(date) - 360;
}

function getBlockTaskSummary(slotId) {
  const list = scheduleBlockTasks[slotId] || [];
  const pending = list.filter((item) => !item.done).length;
  const total = list.length;
  return { pending, total };
}

function renderBlockTaskEditor(slotId) {
  const tasksForSlot = scheduleBlockTasks[slotId] || [];
  blockTaskList.innerHTML = "";
  tasksForSlot.forEach((task) => {
    const row = document.createElement("label");
    row.className = "block-task-row";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = Boolean(task.done);
    check.addEventListener("change", () => {
      const now = Date.now();
      const next = (scheduleBlockTasks[slotId] || []).map((item) =>
        item.id === task.id ? { ...item, done: check.checked } : item
      );
      scheduleBlockTasks[slotId] = next;
      scheduleBlockTasksMeta[slotId] = now;
      saveScheduleBlockTasks();
      renderBlockTaskEditor(slotId);
      renderBlockMeta();
      renderNextUpPanel();
    });
    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = check.checked ? "done" : "";
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "icon-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const now = Date.now();
      scheduleBlockTasks[slotId] = (scheduleBlockTasks[slotId] || []).filter((item) => item.id !== task.id);
      scheduleBlockTasksMeta[slotId] = now;
      saveScheduleBlockTasks();
      renderBlockTaskEditor(slotId);
      renderBlockMeta();
      renderNextUpPanel();
    });
    row.appendChild(check);
    row.appendChild(text);
    row.appendChild(removeBtn);
    blockTaskList.appendChild(row);
  });
}

function openNoteModal(slot) {
  const id = slot.dataset.slotId;
  if (!id) return;
  const label = slot.dataset.slotLabel || "Schedule Note";
  noteSlotId.value = id;
  const existing = scheduleNotes[id] || {};
  noteTitle.value = existing.title || "";
  noteText.value = existing.text || "";
  blockTaskInput.value = "";
  renderBlockTaskEditor(id);
  noteModal.classList.add("show");
  noteModal.setAttribute("aria-hidden", "false");
  noteModal.querySelector("h2").textContent = label;
  blockTaskInput.focus();
}

function persistActiveNoteDraft() {
  const id = noteSlotId.value;
  if (!id) return;
  const now = Date.now();
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();
  if (title || text) {
    scheduleNotes[id] = { title, text, updatedAt: now };
  } else {
    delete scheduleNotes[id];
  }
  scheduleNotesMeta[id] = now;
  saveScheduleNotes();
  renderScheduleNotes();
  renderBlockMeta();
  renderNextUpPanel();
}

function closeNoteModalView() {
  if (noteSlotId.value) {
    persistActiveNoteDraft();
  }
  if (noteAutosaveTimer) {
    clearTimeout(noteAutosaveTimer);
    noteAutosaveTimer = null;
  }
  noteModal.classList.remove("show");
  noteModal.setAttribute("aria-hidden", "true");
  noteSlotId.value = "";
  noteText.value = "";
  noteTitle.value = "";
  blockTaskInput.value = "";
  blockTaskList.innerHTML = "";
}

function openNoteViewModal(slotId) {
  const noteData = scheduleNotes[slotId];
  if (!noteData) return;
  noteViewSlotId = slotId;
  noteViewTitle.textContent = noteData.title || "Note";
  noteViewBody.textContent = noteData.text || "";
  noteViewModal.classList.add("show");
  noteViewModal.setAttribute("aria-hidden", "false");
}

function closeNoteViewModal() {
  noteViewModal.classList.remove("show");
  noteViewModal.setAttribute("aria-hidden", "true");
  noteViewSlotId = "";
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
  toggleBtn.className = "icon-btn task-action-icon";
  toggleBtn.textContent = "✓";
  toggleBtn.setAttribute("aria-label", task.done ? "Undo Task" : "Mark Task Done");
  toggleBtn.title = task.done ? "Undo" : "Done";
  toggleBtn.addEventListener("click", () => toggleTask(task.id));

  const editBtn = document.createElement("button");
  editBtn.className = "icon-btn task-action-icon";
  editBtn.textContent = "✎";
  editBtn.setAttribute("aria-label", "Edit Task");
  editBtn.title = "Edit";
  editBtn.addEventListener("click", () => openModalView(task));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn task-action-icon";
  deleteBtn.textContent = "🗑";
  deleteBtn.setAttribute("aria-label", "Delete Task");
  deleteBtn.title = "Delete";
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
  if (enteringTaskIds.has(task.id)) {
    card.classList.add("task-enter");
  }

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

function animateTaskTransition(taskId, className, commit, duration = 420) {
  if (pendingTaskAnimations.has(taskId)) return;
  const card = orbitTasks.querySelector(`.task-pill[data-task-id="${taskId}"]`);
  if (!card) {
    commit();
    return;
  }
  pendingTaskAnimations.add(taskId);
  card.classList.add(className);
  card.style.pointerEvents = "none";
  setTimeout(() => {
    pendingTaskAnimations.delete(taskId);
    commit();
  }, duration);
}

function stableHash(value) {
  const text = String(value || "");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function clampValue(value, min, max) {
  if (max < min) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}

function clampNodeToBounds(node, bounds, padding = TASK_LAYOUT_PADDING) {
  node.x = clampValue(node.x, bounds.left + node.w / 2 + padding, bounds.right - node.w / 2 - padding);
  node.y = clampValue(node.y, bounds.top + node.h / 2 + padding, bounds.bottom - node.h / 2 - padding);
}

function clampNodeToRegion(node, region, padding = TASK_LAYOUT_PADDING) {
  if (!region) return;
  node.x = clampValue(node.x, region.x1 + node.w / 2 + padding, region.x2 - node.w / 2 - padding);
  node.y = clampValue(node.y, region.y1 + node.h / 2 + padding, region.y2 - node.h / 2 - padding);
}

function nodeOverlapsRect(node, rect) {
  const left = node.x - node.w / 2;
  const right = node.x + node.w / 2;
  const top = node.y - node.h / 2;
  const bottom = node.y + node.h / 2;
  return right > rect.left && left < rect.right && bottom > rect.top && top < rect.bottom;
}

function pushNodeOutOfRect(node, rect, padding = 0, center = null) {
  if (!nodeOverlapsRect(node, rect)) return;
  const moves = [
    {
      x: (rect.left - padding) - (node.x + node.w / 2),
      y: 0,
      d: Math.abs((rect.left - padding) - (node.x + node.w / 2)),
    },
    {
      x: (rect.right + padding) - (node.x - node.w / 2),
      y: 0,
      d: Math.abs((rect.right + padding) - (node.x - node.w / 2)),
    },
    {
      x: 0,
      y: (rect.top - padding) - (node.y + node.h / 2),
      d: Math.abs((rect.top - padding) - (node.y + node.h / 2)),
    },
    {
      x: 0,
      y: (rect.bottom + padding) - (node.y - node.h / 2),
      d: Math.abs((rect.bottom + padding) - (node.y - node.h / 2)),
    },
  ];

  if (center) {
    const cx = node.x - center.x;
    const cy = node.y - center.y;
    const preferred = Math.abs(cx) >= Math.abs(cy)
      ? (cx < 0 ? 0 : 1)
      : (cy < 0 ? 2 : 3);
    moves[preferred].d *= 0.86;
  }

  moves.sort((a, b) => a.d - b.d);
  node.x += moves[0].x;
  node.y += moves[0].y;
}

function computeLaneGeometry(region) {
  const innerW = Math.max(0, region.x2 - region.x1 - TASK_LANE_PADDING * 2);
  const innerH = Math.max(0, region.y2 - region.y1 - TASK_LANE_PADDING * 2);
  const maxCols = Math.max(1, Math.floor((innerW + TASK_COL_GAP) / (TASK_CARD_W + TASK_COL_GAP)));
  const cols = Math.max(1, Math.min(TASK_COLS_PER_ROW, maxCols));
  const rowStep = TASK_CARD_H + TASK_ROW_GAP;
  const colStep = TASK_CARD_W + TASK_COL_GAP;
  const gridW = cols * TASK_CARD_W + (cols - 1) * TASK_COL_GAP;
  const startX = region.x1 + TASK_LANE_PADDING + TASK_CARD_W / 2 + Math.max(0, (innerW - gridW) / 2);
  const startY = region.y1 + TASK_LANE_PADDING + TASK_CARD_H / 2;
  const maxVisibleRows = Math.max(1, Math.floor((innerH + TASK_ROW_GAP) / rowStep));
  return { cols, rowStep, colStep, startX, startY, maxVisibleRows };
}

function slotOverlapsOccupied(slot, occupied) {
  return occupied.some((node) => {
    const dx = Math.abs(slot.x - node.x);
    const dy = Math.abs(slot.y - node.y);
    return dx < (TASK_CARD_W + TASK_COL_GAP * 0.7) && dy < (TASK_CARD_H + TASK_ROW_GAP * 0.7);
  });
}

function placeNodesInLaneRows(nodes, region, bounds, avoidRect, occupied = []) {
  if (!nodes.length) return;
  const lane = computeLaneGeometry(region);
  const slots = [];
  const targetCount = nodes.length + occupied.length + lane.cols * 2;
  let row = 0;
  while (slots.length < targetCount) {
    for (let col = 0; col < lane.cols; col++) {
      const slot = {
        x: lane.startX + col * lane.colStep,
        y: lane.startY + row * lane.rowStep,
      };
      if (slot.y > region.y2 - TASK_CARD_H / 2) break;
      slots.push(slot);
    }
    row += 1;
    if (row > 200) break;
  }

  let slotIndex = 0;
  nodes.forEach((node) => {
    while (slotIndex < slots.length && slotOverlapsOccupied(slots[slotIndex], occupied)) {
      slotIndex += 1;
    }
    const chosen = slots[Math.min(slotIndex, slots.length - 1)] || {
      x: lane.startX,
      y: lane.startY,
    };
    node.x = chosen.x;
    node.y = chosen.y;
    node.w = TASK_CARD_W;
    node.h = TASK_CARD_H;
    clampNodeToRegion(node, region, 0);
    clampNodeToBounds(node, bounds, 0);
    if (avoidRect) {
      pushNodeOutOfRect(node, avoidRect, 2);
      clampNodeToRegion(node, region, 0);
      clampNodeToBounds(node, bounds, 0);
    }
    occupied.push({ x: node.x, y: node.y });
    slotIndex += 1;
  });
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

  const margin = 20;
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

    const sortedGroup = [...group].sort((a, b) => {
      if ((a.createdAt || 0) !== (b.createdAt || 0)) return (a.createdAt || 0) - (b.createdAt || 0);
      return String(a.id || "").localeCompare(String(b.id || ""));
    });
    sortedGroup.forEach((task) => {
      const card = renderTaskCard(task, index);
      orbitTasks.appendChild(card);
      if (task.position && task.position.locked && task.position.userPlaced) {
        locked.push({
          card,
          x: task.position.x,
          y: task.position.y,
          w: TASK_CARD_W,
          h: TASK_CARD_H,
          fixed: true,
        });
      } else {
        cards.push({
          card,
          timeframe,
          w: TASK_CARD_W,
          h: TASK_CARD_H,
          fixed: false,
          region: regions[timeframe],
        });
      }
      const floatSeed = stableHash(task.id);
      const floatOffset = ((floatSeed % 5) - 2) * 1.5;
      card.style.setProperty("--float-offset", `${floatOffset}px`);
      index += 1;
    });
  }

  requestAnimationFrame(() => {
    const nodes = cards.map((node) => ({ ...node, x: 0, y: 0 }));
    const occupiedByRegion = new Map();

    locked.forEach((node) => {
      clampNodeToBounds(node, orbitBounds);
      const regionName = orderedTimeframes.find((tf) => {
        const region = regions[tf];
        if (!region) return false;
        return node.x >= region.x1 && node.x <= region.x2 && node.y >= region.y1 && node.y <= region.y2;
      });
      if (!regionName) return;
      const list = occupiedByRegion.get(regionName) || [];
      list.push({ x: node.x, y: node.y });
      occupiedByRegion.set(regionName, list);
    });

    orderedTimeframes.forEach((timeframe) => {
      const regionNodes = nodes.filter((n) => n.timeframe === timeframe);
      if (!regionNodes.length) return;
      const occupied = occupiedByRegion.get(timeframe) || [];
      placeNodesInLaneRows(regionNodes, regions[timeframe], orbitBounds, avoidRect, occupied);
    });

    [...nodes, ...locked].forEach((node) => {
      node.card.style.left = `${node.x}px`;
      node.card.style.top = `${node.y}px`;
    });
  });
}
function render() {
  const items = filteredTasks();
  positionTasks(items);
  empty.style.display = items.length === 0 ? "block" : "none";
  updateStats();
  updateTimeProgressShading();
  renderNextUpPanel();
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
    updatedAt: now,
  };
  delete deletedTaskIds[task.id];
  tasks.unshift(task);
  enteringTaskIds.add(task.id);
  saveTasks();
  saveDeletedTaskIds();
  resetAutoPositions();
  render();
  setTimeout(() => enteringTaskIds.delete(task.id), 1200);
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
      updatedAt: Date.now(),
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
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  if (!task.done) {
    animateTaskTransition(
      id,
      "task-melt",
      () => {
        tasks = tasks.map((t) => {
          if (t.id !== id) return t;
          return { ...t, done: true, completedAt: Date.now(), updatedAt: Date.now() };
        });
        saveTasks();
        resetAutoPositions();
        render();
      },
      520
    );
    return;
  }
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: false, completedAt: null, updatedAt: Date.now() } : t));
  saveTasks();
  resetAutoPositions();
  render();
}

function removeTask(id) {
  animateTaskTransition(
    id,
    "task-pop",
    () => {
      deletedTaskIds[id] = Date.now();
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      saveDeletedTaskIds();
      resetAutoPositions();
      render();
    },
    360
  );
}

function clearDone() {
  const now = Date.now();
  tasks.filter((t) => t.done).forEach((t) => {
    deletedTaskIds[t.id] = now;
  });
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  saveDeletedTaskIds();
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

function lockTaskPosition(taskId, x, y) {
  if (!taskId || !Number.isFinite(x) || !Number.isFinite(y)) return;
  tasks = tasks.map((t) => {
    if (t.id !== taskId) return t;
    return { ...t, position: { x, y, locked: true, userPlaced: true }, updatedAt: Date.now() };
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
  const finalX = parseFloat(dragTarget.style.left);
  const finalY = parseFloat(dragTarget.style.top);
  lockTaskPosition(id, finalX, finalY);
  dragTarget.classList.remove("dragging");
  dragTarget = null;
  isDragging = false;
}

function bindScheduleToggle() {
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      const id = slot.dataset.slotId;
      if (!id) return;
      if (scheduleCompleted[id]) {
        delete scheduleCompleted[id];
      } else {
        scheduleCompleted[id] = true;
      }
      saveScheduleCompleted();
      renderScheduleCompletion();
    });

    slot.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = slot.dataset.slotId;
      const noteData = id ? scheduleNotes[id] : null;
      const hasNote = Boolean(noteData && (noteData.title || noteData.text));
      if (hasNote) {
        openNoteViewModal(id);
        return;
      }
      openNoteModal(slot);
    });
  });
}

function normalizeNoteTimestamp(note) {
  if (!note) return 0;
  return Number(note.updatedAt || note.createdAt || 0);
}

function mergeStickyNotes(localNotes, cloudNotes) {
  const merged = new Map();
  const ingest = (note) => {
    if (!note || !note.id) return;
    const existing = merged.get(note.id);
    if (!existing) {
      merged.set(note.id, note);
      return;
    }
    const existingTs = normalizeNoteTimestamp(existing);
    const incomingTs = normalizeNoteTimestamp(note);
    if (incomingTs >= existingTs) {
      merged.set(note.id, note);
    }
  };
  localNotes.forEach(ingest);
  cloudNotes.forEach(ingest);
  return Array.from(merged.values()).sort(
    (a, b) => normalizeNoteTimestamp(b) - normalizeNoteTimestamp(a)
  );
}

function renderScheduleCompletion() {
  document.querySelectorAll(".slot").forEach((slot) => {
    const slotId = slot.dataset.slotId;
    if (slotId && scheduleCompleted[slotId]) {
      slot.classList.add("completed");
    } else {
      slot.classList.remove("completed");
    }
  });
}

function renderDayDates() {
  document.querySelectorAll(".day-label[data-day-key]").forEach((labelEl) => {
    const key = labelEl.dataset.dayKey;
    if (!key) return;
    const nameEl = labelEl.querySelector("[data-day-name]");
    const dateEl = labelEl.querySelector("[data-day-date]");
    const view = getDisplayWeekdayPresentation(key);
    if (nameEl) nameEl.textContent = view.dayLabel;
    if (dateEl) dateEl.textContent = view.dateLabel;
    if (dayDates[key]) {
      labelEl.dataset.dayCustom = "true";
    } else {
      delete labelEl.dataset.dayCustom;
    }
  });
}

function openDayEditorModal(dayKey) {
  if (!WEEKDAY_KEYS.includes(dayKey)) return;
  const auto = getAutoWeekdayPresentation(dayKey);
  const view = getDisplayWeekdayPresentation(dayKey);
  dateDayKey.value = dayKey;
  dayNameInput.value = view.dayLabel;
  dateInput.value = view.dateLabel;
  dayDatePicker.value = auto.isoDate;
  if (dateModalTitle) {
    dateModalTitle.textContent = `Edit ${auto.dayLabel}`;
  }
  dateModal.classList.add("show");
  dateModal.setAttribute("aria-hidden", "false");
  dayNameInput.focus();
}

function closeDayEditorModal() {
  dateModal.classList.remove("show");
  dateModal.setAttribute("aria-hidden", "true");
  dateDayKey.value = "";
  dayNameInput.value = "";
  dateInput.value = "";
  dayDatePicker.value = "";
}

function bindDayHeaderEditors() {
  document.querySelectorAll(".day-label[data-day-key]").forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.dataset.dayKey;
      if (!key) return;
      openDayEditorModal(key);
    });
  });
}

function renderBlockMeta() {
  document.querySelectorAll(".slot").forEach((slot) => {
    const slotId = slot.dataset.slotId;
    if (!slotId) return;

    const summary = getBlockTaskSummary(slotId);
    const existingMeta = slot.querySelector(".slot-meta");
    if (summary.total <= 0) {
      if (existingMeta) existingMeta.remove();
      return;
    }
    const label = summary.total === 1 ? "1 to-do" : `${summary.total} to-dos`;
    let meta = existingMeta;
    if (!meta) {
      meta = document.createElement("div");
      meta.className = "slot-meta";
      slot.appendChild(meta);
    }
    meta.textContent = label;
  });
}

function updateTimeProgressShading() {
  const now = new Date();
  const today = now.getDay();
  const minutes = minuteFromScheduleStart(now);
  const currentClock = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (liveClock) liveClock.textContent = currentClock;

  document.querySelectorAll(".slot").forEach((slot) => {
    const { start, end, dayIndex, slotId } = getSlotMeta(slot);
    slot.classList.remove("time-past", "time-active", "time-future", "block-urgent");
    slot.style.removeProperty("--progress");
    if (!dayIndex) return;

    if (today > dayIndex) {
      slot.classList.add("time-past");
      return;
    }
    if (today < dayIndex) {
      slot.classList.add("time-future");
      return;
    }
    if (minutes >= end) {
      slot.classList.add("time-past");
      return;
    }
    if (minutes < start) {
      slot.classList.add("time-future");
      return;
    }
    slot.classList.add("time-active");
    const span = Math.max(1, end - start);
    const progress = Math.max(0, Math.min(1, (minutes - start) / span));
    slot.style.setProperty("--progress", String(progress));

    const minutesLeft = end - minutes;
    const pending = getBlockTaskSummary(slotId).pending;
    if (minutesLeft <= 10 && pending > 0) {
      slot.classList.add("block-urgent");
    }
  });
}

function getUpcomingBlocks() {
  const now = new Date();
  const today = now.getDay();
  const currentMinutes = minuteFromScheduleStart(now);
  const slots = [];
  document.querySelectorAll(".slot").forEach((slot) => {
    const slotId = slot.dataset.slotId;
    const { start, end, dayIndex } = getSlotMeta(slot);
    if (!slotId || !dayIndex) return;
    if (dayIndex < today) return;
    if (dayIndex === today && end <= currentMinutes) return;
    const label = slot.dataset.slotLabel || slotId;
    slots.push({ slotId, start, end, dayIndex, label });
  });
  slots.sort((a, b) => (a.dayIndex - b.dayIndex) || (a.start - b.start));
  return slots.slice(0, 2);
}

function renderNextUpPanel() {
  if (!nextUpList) return;
  const upcoming = getUpcomingBlocks();
  nextUpList.innerHTML = "";
  if (!upcoming.length) {
    nextUpList.textContent = "No upcoming blocks this week.";
    return;
  }
  upcoming.forEach((block) => {
    const item = document.createElement("div");
    item.className = "next-item";
    const heading = document.createElement("div");
    heading.className = "next-item-title";
    heading.textContent = block.label;
    const summary = getBlockTaskSummary(block.slotId);
    item.appendChild(heading);
    if (summary.total > 0) {
      const meta = document.createElement("div");
      meta.className = "next-item-meta";
      meta.textContent = summary.total === 1 ? "1 to-do" : `${summary.total} to-dos`;
      item.appendChild(meta);
    }

    nextUpList.appendChild(item);
  });
}

function renderScheduleNotes() {
  document.querySelectorAll(".slot").forEach((slot) => {
    const id = slot.dataset.slotId;
    if (!id) return;
    let noteBadge = slot.querySelector(".slot-note-badge");
    let notePreview = slot.querySelector(".slot-note-preview");
    const noteData = scheduleNotes[id];
    if (noteData && (noteData.title || noteData.text)) {
      const title = (noteData.title || "").trim();
      const preview = title || "Note saved";
      const shortPreview = preview.length > 28 ? `${preview.slice(0, 28)}...` : preview;
      if (!noteBadge) {
        noteBadge = document.createElement("div");
        noteBadge.className = "slot-note-badge";
        slot.appendChild(noteBadge);
      }
      if (!notePreview) {
        notePreview = document.createElement("div");
        notePreview.className = "slot-note-preview";
        slot.appendChild(notePreview);
      }
      noteBadge.textContent = "NOTE";
      notePreview.textContent = shortPreview;
      slot.title = noteData.text || noteData.title || "";
      slot.classList.add("has-note");
    } else {
      if (noteBadge) noteBadge.remove();
      if (notePreview) notePreview.remove();
      slot.classList.remove("has-note");
      slot.removeAttribute("title");
    }
  });
}

function getWeekendKey(dayName, hour) {
  const sunday = getWeekStartSunday();
  const weekKey = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, "0")}-${String(sunday.getDate()).padStart(2, "0")}`;
  return `${weekKey}:${dayName}:${hour}`;
}

function formatHourLabel(hour24) {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:00 ${suffix}`;
}

function renderWeekendPlanner(dayName) {
  weekendPlanner.dataset.day = dayName;
  weekendTitle.textContent = `${dayName} Planner`;
  const weekDates = getWeekDates();
  weekendDate.textContent = formatShortDate(dayName === "Sunday" ? weekDates.sunday : weekDates.saturday);
  weekendHours.innerHTML = "";

  for (let hour = 4; hour <= 22; hour += 1) {
    const row = document.createElement("label");
    row.className = "weekend-row";
    const hourText = document.createElement("span");
    hourText.textContent = formatHourLabel(hour);
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Plan / to-do";
    const key = getWeekendKey(dayName, hour);
    input.value = weekendPlannerNotes[key] || "";
    input.addEventListener("input", () => {
      const now = Date.now();
      weekendPlannerNotes[key] = input.value;
      weekendPlannerNotesMeta[key] = now;
      saveWeekendPlannerNotes();
    });
    row.appendChild(hourText);
    row.appendChild(input);
    weekendHours.appendChild(row);
  }
}

function positionWeekendPanel(dayName) {
  const scheduleEl = document.getElementById("schedule");
  const orbitRect = orbit.getBoundingClientRect();
  const scheduleRect = scheduleEl.getBoundingClientRect();
  const scheduleLeft = scheduleRect.left - orbitRect.left;
  const scheduleRight = scheduleLeft + scheduleRect.width;
  const sidePadding = 8;

  weekendPlanner.style.width = "";
  weekendPlanner.style.left = "";

  if (dayName === "Saturday") {
    const sideWidth = Math.max(0, orbitRect.width - scheduleRight - sidePadding);
    weekendPlanner.style.left = `${scheduleRight}px`;
    weekendPlanner.style.width = `${sideWidth}px`;
  } else {
    const sideWidth = Math.max(0, scheduleLeft - sidePadding);
    weekendPlanner.style.left = `${Math.max(0, scheduleLeft - sideWidth)}px`;
    weekendPlanner.style.width = `${sideWidth}px`;
  }
}

function showWeekendPlanner(dayName) {
  renderWeekendPlanner(dayName);
  positionWeekendPanel(dayName);
  weekendPlanner.classList.remove("from-left", "from-right");
  weekendPlanner.classList.add(dayName === "Sunday" ? "from-left" : "from-right", "show");
  weekendPlanner.dataset.day = dayName;
  weekendPlanner.setAttribute("aria-hidden", "false");
}

function hideWeekendPlanner() {
  weekendPlanner.classList.remove("show");
  weekendPlanner.setAttribute("aria-hidden", "true");
}

function layoutOnResize() {
  window.requestAnimationFrame(render);
  if (weekendPlanner.classList.contains("show") && weekendPlanner.dataset.day) {
    positionWeekendPanel(weekendPlanner.dataset.day);
  }
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

function renderStickyNotes() {
  stickyGrid.innerHTML = "";
  stickyEmpty.style.display = stickyNotes.length ? "none" : "block";
  stickyNotes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "sticky-note";
    card.draggable = true;
    card.dataset.stickyId = note.id;
    card.dataset.index = String(index);

    const title = document.createElement("div");
    title.className = "sticky-title";
    title.textContent = note.title;

    const body = document.createElement("div");
    body.className = "sticky-content";
    body.appendChild(linkifyText(note.body));

    const actions = document.createElement("div");
    actions.className = "sticky-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openStickyModal(note));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      stickyNotes = stickyNotes.filter((n) => n.id !== note.id);
      saveStickyNotes();
      renderStickyNotes();
      if (cloudReady) saveCloudNow();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(actions);

    card.addEventListener("dragstart", (e) => {
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", note.id);
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    stickyGrid.appendChild(card);
  });
}

function linkifyText(text) {
  const fragment = document.createDocumentFragment();
  if (!text) return fragment;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
    }
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    link.target = "_blank";
    link.rel = "noopener";
    fragment.appendChild(link);
    lastIndex = start + url.length;
  }
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  return fragment;
}

function reorderStickyNotes(dragId, targetId) {
  if (dragId === targetId) return;
  const fromIndex = stickyNotes.findIndex((n) => n.id === dragId);
  const toIndex = stickyNotes.findIndex((n) => n.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return;
  const updated = [...stickyNotes];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  stickyNotes = updated;
  saveStickyNotes();
  renderStickyNotes();
  if (cloudReady) saveCloudNow();
}

stickyGrid.addEventListener("dragover", (e) => {
  e.preventDefault();
  const target = e.target.closest(".sticky-note");
  if (!target) return;
  const dragging = stickyGrid.querySelector(".sticky-note.dragging");
  if (!dragging || dragging === target) return;
});

stickyGrid.addEventListener("drop", (e) => {
  e.preventDefault();
  const dragId = e.dataTransfer.getData("text/plain");
  const target = e.target.closest(".sticky-note");
  if (!target) return;
  reorderStickyNotes(dragId, target.dataset.stickyId);
});

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

openSticky.addEventListener("click", () => openStickyModal());
closeSticky.addEventListener("click", closeStickyModal);
cancelSticky.addEventListener("click", closeStickyModal);
stickyModal.addEventListener("click", (e) => {
  if (e.target === stickyModal) closeStickyModal();
});
stickyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(stickyForm).entries());
  if (!data.title || !data.title.trim()) return;
  const now = Date.now();
  const id = stickyIdField.value;
  if (id) {
    stickyNotes = stickyNotes.map((n) =>
      n.id === id
        ? { ...n, title: data.title.trim(), body: data.body.trim(), updatedAt: now }
        : n
    );
  } else {
    stickyNotes.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: data.title.trim(),
      body: data.body ? data.body.trim() : "",
      createdAt: now,
      updatedAt: now,
    });
  }
  saveStickyNotes();
  renderStickyNotes();
  closeStickyModal();
  if (cloudReady) saveCloudNow();
});

openCloud.addEventListener("click", openCloudModal);
closeCloud.addEventListener("click", closeCloudModal);
cloudModal.addEventListener("click", (e) => {
  if (e.target === cloudModal) closeCloudModal();
});
cloudForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!supabaseClient) {
    cloudFeedback.textContent = "Cloud sync is not configured yet.";
    return;
  }
  const email = cloudEmail.value.trim();
  const password = cloudPassword.value;
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      cloudFeedback.textContent = formatCloudError(error, "Sign in failed.");
      return;
    }
  } catch (error) {
    cloudFeedback.textContent = formatCloudError(error, "Sign in failed.");
    return;
  }
  cloudFeedback.textContent = "Signed in.";
  updateCloudStatus("Cloud Sync: Connected");
  closeCloudModal();
});
cloudSignup.addEventListener("click", async () => {
  if (!supabaseClient) {
    cloudFeedback.textContent = "Cloud sync is not configured yet.";
    return;
  }
  const email = cloudEmail.value.trim();
  const password = cloudPassword.value;
  try {
    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      cloudFeedback.textContent = formatCloudError(error, "Sign up failed.");
      return;
    }
  } catch (error) {
    cloudFeedback.textContent = formatCloudError(error, "Sign up failed.");
    return;
  }
  cloudFeedback.textContent = "Account created. Check your email if confirmation is enabled.";
});
cloudSignout.addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  cloudFeedback.textContent = "Signed out.";
});
syncOpenCloud.addEventListener("click", openCloudModal);
syncClose.addEventListener("click", () => {
  syncAlertDismissedAt = Date.now();
  syncAlert.hidden = true;
});

closeNoteView.addEventListener("click", closeNoteViewModal);
noteViewModal.addEventListener("click", (e) => {
  if (e.target === noteViewModal) closeNoteViewModal();
});
noteViewDelete.addEventListener("click", () => {
  if (!noteViewSlotId) return;
  scheduleNotesMeta[noteViewSlotId] = Date.now();
  delete scheduleNotes[noteViewSlotId];
  saveScheduleNotes();
  renderScheduleNotes();
  closeNoteViewModal();
});
noteViewEdit.addEventListener("click", () => {
  if (!noteViewSlotId) return;
  const slot = document.querySelector(`.slot[data-slot-id="${noteViewSlotId}"]`);
  if (!slot) return;
  closeNoteViewModal();
  openNoteModal(slot);
});

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
window.addEventListener("beforeunload", () => {
  if (cloudReady) {
    saveCloudNow();
  }
});
window.addEventListener("focus", () => {
  enforceSyncAlertState();
  if (cloudReady) hydrateFromCloud();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && cloudReady) {
    hydrateFromCloud();
  }
});
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

if (closeDateModal) {
  closeDateModal.addEventListener("click", closeDayEditorModal);
}

if (dateModal) {
  dateModal.addEventListener("click", (e) => {
    if (e.target === dateModal) {
      closeDayEditorModal();
    }
  });
}

if (clearDateBtn) {
  clearDateBtn.addEventListener("click", () => {
    const key = dateDayKey.value;
    if (!WEEKDAY_KEYS.includes(key)) return;
    clearDayDateOverride(key);
    renderDayDates();
    closeDayEditorModal();
  });
}

if (dateForm) {
  dateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const key = dateDayKey.value;
    if (!WEEKDAY_KEYS.includes(key)) return;
    const dayLabel = dayNameInput.value.trim();
    const dateLabel = dateInput.value.trim();
    if (!dayLabel || !dateLabel) return;
    setDayDateOverride(key, dayLabel, dateLabel);
    renderDayDates();
    closeDayEditorModal();
  });
}

if (dayDatePicker) {
  dayDatePicker.addEventListener("change", () => {
    if (!dayDatePicker.value) return;
    const nextDate = new Date(`${dayDatePicker.value}T00:00:00`);
    if (Number.isNaN(nextDate.getTime())) return;
    dateInput.value = formatShortDate(nextDate);
  });
}

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
  if (e.key === "Escape") {
    closeModalView();
    closeNoteViewModal();
  }
});

closeNoteModal.addEventListener("click", closeNoteModalView);
cancelNote.addEventListener("click", closeNoteModalView);
noteModal.addEventListener("click", (e) => {
  if (e.target === noteModal) closeNoteModalView();
});
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  persistActiveNoteDraft();
  closeNoteModalView();
});

[noteTitle, noteText].forEach((field) => {
  field.addEventListener("input", () => {
    if (noteAutosaveTimer) clearTimeout(noteAutosaveTimer);
    noteAutosaveTimer = setTimeout(() => {
      persistActiveNoteDraft();
    }, 250);
  });
});

addBlockTask.addEventListener("click", () => {
  const slotId = noteSlotId.value;
  const text = blockTaskInput.value.trim();
  if (!slotId || !text) return;
  const now = Date.now();
  const list = scheduleBlockTasks[slotId] || [];
  list.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    done: false,
    updatedAt: now,
  });
  scheduleBlockTasks[slotId] = list;
  scheduleBlockTasksMeta[slotId] = now;
  blockTaskInput.value = "";
  saveScheduleBlockTasks();
  renderBlockTaskEditor(slotId);
  renderBlockMeta();
  renderNextUpPanel();
});

blockTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addBlockTask.click();
  }
});

openSundayBtn.addEventListener("click", () => showWeekendPlanner("Sunday"));
openSaturdayBtn.addEventListener("click", () => showWeekendPlanner("Saturday"));
hideWeekendBtn.addEventListener("click", hideWeekendPlanner);

bindScheduleToggle();
bindDayHeaderEditors();
recoverMissingTasksFromBackup();
renderDayDates();
renderScheduleCompletion();
renderBlockMeta();
renderScheduleNotes();
renderNextUpPanel();
updateTimeProgressShading();
render();
renderStickyNotes();
initSupabase();

setInterval(() => {
  renderDayDates();
  updateTimeProgressShading();
  renderNextUpPanel();
  enforceSyncAlertState();
}, 60000);
