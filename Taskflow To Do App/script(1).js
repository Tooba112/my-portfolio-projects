/* ================================================
   TASKFLOW — Premium To-Do App
   script.js
   ================================================ */

/* ================================================
   1. STATE — all app data lives here
   ================================================ */

/** @type {Array<{id: string, text: string, completed: boolean, priority: string, dueDate: string, createdAt: number}>} */
let tasks = [];

/** Which filter tab is active */
let currentFilter = 'all';

/** Current search query */
let searchQuery = '';

/** ID of the task pending deletion (used by the confirm modal) */
let pendingDeleteId = null;

/** Toast hide timer reference */
let toastTimer = null;

/* ================================================
   2. CONSTANTS — element references
   ================================================ */
const taskInput        = document.getElementById('taskInput');
const prioritySelect   = document.getElementById('prioritySelect');
const dueDateInput     = document.getElementById('dueDateInput');
const addTaskBtn       = document.getElementById('addTaskBtn');
const taskList         = document.getElementById('taskList');
const emptyState       = document.getElementById('emptyState');
const emptyText        = document.getElementById('emptyText');
const searchInput      = document.getElementById('searchInput');
const clearSearchBtn   = document.getElementById('clearSearch');
const filterBtns       = document.querySelectorAll('.filter-btn');
const progressFill     = document.getElementById('progressFill');
const progressLabel    = document.getElementById('progressLabel');
const statTotal        = document.getElementById('statTotal');
const statCompleted    = document.getElementById('statCompleted');
const statRemaining    = document.getElementById('statRemaining');
const headerDate       = document.getElementById('headerDate');
const bottomBar        = document.getElementById('bottomBar');
const bottomHint       = document.getElementById('bottomHint');
const clearCompletedBtn= document.getElementById('clearCompletedBtn');
const confirmModal     = document.getElementById('confirmModal');
const cancelDeleteBtn  = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const toast            = document.getElementById('toast');

/* ================================================
   3. INITIALISATION
   ================================================ */

/**
 * Run when the page loads.
 * Loads tasks from localStorage, renders everything, sets the date.
 */
function init() {
  loadFromStorage();
  setHeaderDate();
  render();
}

/** Display today's date in the header */
function setHeaderDate() {
  const now = new Date();
  headerDate.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ================================================
   4. LOCAL STORAGE
   ================================================ */

/** Save the current tasks array to localStorage */
function saveToStorage() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

/** Load tasks from localStorage (if any) */
function loadFromStorage() {
  const stored = localStorage.getItem('taskflow_tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

/* ================================================
   5. CORE TASK OPERATIONS
   ================================================ */

/**
 * Generate a unique ID using timestamp + random string.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Add a new task.
 * Validates input, prevents duplicates and empty strings.
 */
function addTask() {

  const text = taskInput.value.trim();

  const formattedTask =
    text.charAt(0).toUpperCase() + text.slice(1);

  if (!text) {
    shakeInput(taskInput);
    showToast("Please enter a task name.", "error");
    taskInput.focus();
    return;
  }

  const isDuplicate = tasks.some(
    (t) => t.text.toLowerCase() === text.toLowerCase()
  );

  if (isDuplicate) {
    shakeInput(taskInput);
    showToast("A task with this name already exists.", "error");
    taskInput.focus();
    return;
  }

  const newTask = {
    id: generateId(),
    text: formattedTask,
    completed: false,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    createdAt: Date.now(),
  };

  tasks.unshift(newTask);

  saveToStorage();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "medium";

  taskInput.focus();

  render();

  showToast("Task added successfully! ✨", "success");
}

/**
 * Toggle a task's completed state.
 * @param {string} id
 */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveToStorage();
  render();
  showToast(
    task.completed ? 'Task completed! 🎉' : 'Task marked as active.',
    task.completed ? 'success' : 'info'
  );
}

/**
 * Open the delete confirmation modal for a given task.
 * @param {string} id
 */
function requestDeleteTask(id) {
  pendingDeleteId = id;
  openModal();
}

/**
 * Actually delete the task after confirmation.
 */
function deleteTask() {
  if (!pendingDeleteId) return;

  // Find the list item element and animate it out before removing from state
  const listItem = document.querySelector(`[data-id="${pendingDeleteId}"]`);
  if (listItem) {
    listItem.classList.add('removing');
    // Wait for the CSS animation to finish, then update state
    listItem.addEventListener('animationend', () => {
      tasks = tasks.filter((t) => t.id !== pendingDeleteId);
      pendingDeleteId = null;
      saveToStorage();
      render();
    }, { once: true });
  } else {
    tasks = tasks.filter((t) => t.id !== pendingDeleteId);
    pendingDeleteId = null;
    saveToStorage();
    render();
  }

  closeModal();
  showToast('Task deleted.', 'info');
}

/**
 * Enter edit mode for a task item.
 * Replaces the text span with an input field.
 * @param {string} id
 */
function startEditing(id) {
  const task     = tasks.find((t) => t.id === id);
  if (!task) return;

  const listItem = document.querySelector(`[data-id="${id}"]`);
  const textEl   = listItem.querySelector('.task-text');
  const editBtn  = listItem.querySelector('.btn-edit');

  // Replace text with an input
  const input = document.createElement('input');
  input.type  = 'text';
  input.value = task.text;
  input.className = 'task-edit-input';
  input.maxLength = 120;
  input.setAttribute('aria-label', 'Edit task');

  textEl.replaceWith(input);
  input.focus();
  input.select();

  // Change edit button to a save button
  editBtn.textContent = '💾';
  editBtn.title = 'Save';
  editBtn.onclick = () => saveEdit(id, input);

  // Save on Enter, cancel on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit(id, input);
    if (e.key === 'Escape') cancelEdit(id);
  });

  // Save if user clicks away
  input.addEventListener('blur', () => {
    // Small delay so save-button click fires first
    setTimeout(() => saveEdit(id, input), 150);
  });
}

/**
 * Save the edited task text.
 * @param {string} id
 * @param {HTMLInputElement} input
 */
function saveEdit(id, input) {
  const newText = input.value.trim();

  // Don't save if the input is gone (already saved)
  if (!input.isConnected) return;

  if (!newText) {
    showToast('Task name cannot be empty.', 'error');
    input.focus();
    return;
  }

  // Check for duplicates (excluding the current task)
  const isDuplicate = tasks.some(
    (t) => t.id !== id && t.text.toLowerCase() === newText.toLowerCase()
  );
  if (isDuplicate) {
    showToast('A task with this name already exists.', 'error');
    input.focus();
    return;
  }

  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.text = newText;
    saveToStorage();
  }

  render();
  showToast('Task updated! ✦', 'success');
}

/**
 * Cancel editing without saving.
 * @param {string} id
 */
function cancelEdit(id) {
  // Just re-render to restore original text
  render();
}

/**
 * Delete all completed tasks.
 */
function clearCompleted() {
  const count = tasks.filter((t) => t.completed).length;
  if (count === 0) return;
  tasks = tasks.filter((t) => !t.completed);
  saveToStorage();
  render();
  showToast(`${count} completed task${count > 1 ? 's' : ''} cleared.`, 'info');
}

/* ================================================
   6. FILTERING & SEARCHING
   ================================================ */

/**
 * Returns the subset of tasks that match the current
 * filter tab AND the search query.
 * @returns {Array}
 */
function getFilteredTasks() {
  return tasks.filter((task) => {
    // Filter tab
    const passesFilter =
      currentFilter === 'all'       ? true :
      currentFilter === 'active'    ? !task.completed :
      currentFilter === 'completed' ? task.completed : true;

    // Search query (case-insensitive)
    const passesSearch =
      searchQuery === '' ||
      task.text.toLowerCase().includes(searchQuery.toLowerCase());

    return passesFilter && passesSearch;
  });
}

/* ================================================
   7. RENDER — build the DOM from state
   ================================================ */

/**
 * Main render function.
 * Rebuilds the task list and updates all counters/UI.
 */
function render() {
  const filtered = getFilteredTasks();

  // --- Update stats (always based on all tasks, not filtered) ---
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  statTotal.textContent     = total;
  statCompleted.textContent = completed;
  statRemaining.textContent = remaining;

  // Progress bar
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  progressFill.style.width    = pct + '%';
  progressLabel.textContent   = `${pct}% Complete`;

  // --- Bottom bar ---
  const hasCompleted = tasks.some((t) => t.completed);
  bottomBar.hidden = total === 0;
  bottomHint.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;

  // --- Empty state vs list ---
  if (filtered.length === 0) {
    taskList.innerHTML = '';
    emptyState.hidden  = false;

    // Contextual empty message
    if (tasks.length === 0) {
      emptyText.textContent = 'Add your first task above to get started.';
    } else if (searchQuery) {
      emptyText.textContent = `No tasks match "${searchQuery}".`;
    } else {
      emptyText.textContent = `No ${currentFilter} tasks yet.`;
    }
    return;
  }

  emptyState.hidden = true;

  // --- Build task list items ---
  // Use a DocumentFragment for a single DOM insertion (performance)
  const fragment = document.createDocumentFragment();

  filtered.forEach((task) => {
    const li = buildTaskElement(task);
    fragment.appendChild(li);
  });

  taskList.innerHTML = '';
  taskList.appendChild(fragment);
}

/**
 * Build a single <li> element for a task.
 * @param {Object} task
 * @returns {HTMLLIElement}
 */
function buildTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}`;
  li.setAttribute('data-id', task.id);
  li.setAttribute('data-priority', task.priority);

  // --- Checkbox ---
  const checkbox = document.createElement('input');
  checkbox.type    = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.className = 'task-checkbox';
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => toggleTask(task.id));

  // --- Main content wrapper ---
  const main = document.createElement('div');
  main.className = 'task-main';

  // Task text
  const textEl = document.createElement('span');
  textEl.className = 'task-text';
  textEl.textContent = task.text;

  // Meta row (priority badge + due date)
  const meta = document.createElement('div');
  meta.className = 'task-meta';

  // Priority badge
  const badge = document.createElement('span');
  badge.className = `priority-badge ${task.priority}`;
  badge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  meta.appendChild(badge);

  // Due date label (if set)
  if (task.dueDate) {
    const dateLabel = document.createElement('span');
    dateLabel.className = 'due-date-label';

    // Check if overdue
    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const due      = new Date(task.dueDate + 'T00:00:00');
    const isOverdue = !task.completed && due < today;

    if (isOverdue) dateLabel.classList.add('overdue');

    const icon = isOverdue ? '⚠️' : '📅';
    dateLabel.textContent = `${icon} ${formatDate(task.dueDate)}`;
    if (isOverdue) dateLabel.title = 'This task is overdue!';

    meta.appendChild(dateLabel);
  }

  main.appendChild(textEl);
  main.appendChild(meta);

  // --- Action buttons ---
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'task-btn btn-edit';
  editBtn.textContent = '✏️';
  editBtn.title = 'Edit task';
  editBtn.setAttribute('aria-label', `Edit "${task.text}"`);
  editBtn.addEventListener('click', () => startEditing(task.id));

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-btn btn-delete';
  deleteBtn.textContent = '🗑️';
  deleteBtn.title = 'Delete task';
  deleteBtn.setAttribute('aria-label', `Delete "${task.text}"`);
  deleteBtn.addEventListener('click', () => requestDeleteTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  // Assemble the list item
  li.appendChild(checkbox);
  li.appendChild(main);
  li.appendChild(actions);

  return li;
}

/**
 * Format a 'YYYY-MM-DD' date string into something readable.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ================================================
   8. MODAL
   ================================================ */

function openModal() {
  confirmModal.classList.add('open');
  confirmDeleteBtn.focus();
}

function closeModal() {
  confirmModal.classList.remove('open');
  pendingDeleteId = null;
}

/* ================================================
   9. TOAST NOTIFICATIONS
   ================================================ */

/**
 * Show a toast message.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  // Clear any existing timer
  clearTimeout(toastTimer);

  // Reset classes
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Trigger animation (allow repaint first)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  // Auto-hide after 2.8 seconds
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ================================================
   10. UI HELPERS
   ================================================ */

/**
 * Shake an input element to indicate an error.
 * @param {HTMLElement} el
 */
function shakeInput(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow trick to restart animation
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });

  // Add shake keyframes dynamically (only once)
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(6px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ================================================
   11. EVENT LISTENERS
   ================================================ */

// Add task — button click
addTaskBtn.addEventListener('click', addTask);

// Add task — press Enter in the task input
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Search — update query and re-render on each keystroke
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  // Show/hide the ✕ clear button
  if (searchQuery) {
    clearSearchBtn.classList.add('visible');
  } else {
    clearSearchBtn.classList.remove('visible');
  }
  render();
});

// Search — clear button
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.remove('visible');
  searchInput.focus();
  render();
});

// Filter tabs
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    currentFilter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// Modal — cancel
cancelDeleteBtn.addEventListener('click', closeModal);

// Modal — confirm delete
confirmDeleteBtn.addEventListener('click', deleteTask);

// Modal — close on overlay click
confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) closeModal();
});

// Modal — close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && confirmModal.classList.contains('open')) {
    closeModal();
  }
});

// Set the minimum date for the due-date picker to today
dueDateInput.min = new Date().toISOString().split('T')[0];

/* ================================================
   12. KICK OFF
   ================================================ */
init();
