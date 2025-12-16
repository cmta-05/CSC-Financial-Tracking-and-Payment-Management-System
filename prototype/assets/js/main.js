function getPrimaryStudent() {
  return (
    students.find((s) => s.id === PRIMARY_STUDENT_ID) || {
      id: PRIMARY_STUDENT_ID,
      name: "Student",
      course: "Program",
      year: "1",
    }
  );
}

function getLatestCscRecord(studentId) {
  return cscFeePayments
    .filter((p) => p.studentId === studentId)
    .sort((a, b) => (a.academicYear || "").localeCompare(b.academicYear || ""))
    .pop();
}

const moduleCardConfig = [
  {
    key: "csc",
    label: "CSC FEE",
    amount: "₱220.00",
    description: "Mandatory council fee for student services.",
    target: "student_info_csc_fee.html",
    theme: "csc",
  },
  {
    key: "lanyards",
    label: "LANYARDS",
    amount: "₱120.00",
    description: "Official BU Polangui ID lace with guidelines.",
    target: "student_info_lanyards.html",
    theme: "lanyards",
  },
  {
    key: "pe",
    label: "PE UNIFORM",
    amount: "₱450.00",
    description: "Required attire for PE classes with sizing tips.",
    target: "student_info_pe_uniform.html",
    theme: "pe",
  },
  {
    key: "seal",
    label: "SEAL & PLATES",
    amount: "₱60.00 / ₱40.00",
    description: "CSC seal & plate for ID validation.",
    target: "student_info_seal_plate.html",
    theme: "seal",
  },
  {
    key: "merch",
    label: "MERCH SHIRT",
    amount: "₱300.00",
    description: "Event shirts and official CSC merchandise.",
    target: "student_info_merch.html",
    theme: "merch",
  },
];

const dashboardDeadlines = [
  {
    title: "CSC Fee Payment Cutoff",
    date: "March 10, 2025",
    detail: "Submit your receipt before 5:00 PM.",
  },
  {
    title: "Merch Pre-Order Close",
    date: "February 28, 2025",
    detail: "Reserve your shirt before slots run out.",
  },
  {
    title: "PE Uniform Pickup Deadline",
    date: "February 14, 2025",
    detail: "Claim at the CSC booth with your receipt.",
  },
];

const dashboardTips = [
  "Step 1: Review Your Dashboard - Start by checking your dashboard to see: Information You Need to Know, Current Transaction Status, Upcoming Deadlines, Quick Reminders",
  "Step 2: Select a Section - Open the section you need to complete from the side main menu bar: CSC Fees, Lanyards, PE Uniforms, Seal & Plate, or Merch Items.",
  "Step 3: Complete the Required Action - Stay updated, track your progress, and follow the instructions shown in the selected section.",
  "Step 4: Stay Updated on Your Transactions - After every physical payment transaction, you will receive a notification showing your current transaction status. This helps you stay updated, avoid losing access, and prevent forgetting any transactions within the College Student Council.",
  "Step 5: Submit a Concern if Needed - If an issue arises (missing payment, incorrect amount posted, not yet verified, or wrong section posted), use the Concern feature to formally report the problem.",
  "Step 6: Exit Safely - End your session properly to keep your account secure.",
];

const dashboardReminders = [
  {
    title: "Prepare Payment Proofs",
    body: "Always keep clear photos of official receipts after every transaction.",
  },
  {
    title: "Monitor Your Account Status",
    body: "Visit your dashboard regularly to track updates on submitted payments.",
  },
  {
    title: "Follow Posted Schedules",
    body: "Late submissions may delay verification and item claiming.",
  },
  {
    title: "Watch for System Updates",
    body: "Important notices and alerts appear on your dashboard.",
  },
  {
    title: "Report Concerns Promptly",
    body: "Early reporting helps avoid longer processing time.",
  },
  {
    title: "Secure Your Account",
    body: "Always log out after using SynTrack on shared devices.",
  },
];

function renderModuleCards() {
  const container = document.getElementById("moduleCardGrid");
  if (!container) return;
  container.innerHTML = "";

  moduleCardConfig.forEach((card) => {
    const div = document.createElement("div");
    div.className = `module-card ${card.theme}`;
    div.setAttribute("role", "button");
    div.innerHTML = `
      <h5>${card.label}</h5>
      <h3 class="fw-bold mb-1">${card.amount}</h3>
      <span>${card.description}</span>
      <div class="module-card-footer">Click to view info</div>
    `;
    div.addEventListener("click", () => navigateTo(card.target));
    container.appendChild(div);
  });
}

function getModuleStatusSnapshot() {
  const latestCsc = getLatestCscRecord(PRIMARY_STUDENT_ID);
  const latestLanyard = idLaceRequests
    .filter((r) => r.studentId === PRIMARY_STUDENT_ID)
    .pop();
  const latestPe = peUniformOrders
    .filter((o) => o.studentId === PRIMARY_STUDENT_ID)
    .pop();
  const latestSeal = sealPlateRequests
    .filter((r) => r.studentId === PRIMARY_STUDENT_ID)
    .pop();
  const latestMerch = merchandiseOrders
    .filter((o) => o.studentId === PRIMARY_STUDENT_ID)
    .pop();

  return [
    {
      label: "CSC Fee",
      status: latestCsc?.status === "Verified"
        ? "Paid (Verified)"
        : latestCsc
          ? "Pending Verification"
          : "Not Paid",
      variant: latestCsc
        ? latestCsc.status === "Verified"
          ? "success"
          : "warning"
        : "danger",
    },
    {
      label: "Lanyards",
      status: latestLanyard
        ? latestLanyard.status === "Paid"
          ? "Paid"
          : "Pending"
        : "No orders",
      variant: latestLanyard
        ? latestLanyard.status === "Paid"
          ? "success"
          : "warning"
        : "secondary",
    },
    {
      label: "PE Uniform",
      status: latestPe
        ? latestPe.status === "Paid"
          ? "Paid"
          : "Pending"
        : "Not Paid",
      variant: latestPe
        ? latestPe.status === "Paid"
          ? "success"
          : "warning"
        : "danger",
    },
    {
      label: "Seal & Plate",
      status: latestSeal
        ? latestSeal.status === "Pending"
          ? "Pending"
          : "Paid"
        : "No orders",
      variant: latestSeal
        ? latestSeal.status === "Pending"
          ? "warning"
          : "success"
        : "secondary",
    },
    {
      label: "Merch",
      status: latestMerch
        ? latestMerch.status === "Paid"
          ? "Paid"
          : "Pending"
        : "Not Paid",
      variant: latestMerch
        ? latestMerch.status === "Paid"
          ? "success"
          : "warning"
        : "danger",
    },
  ];
}

function renderModuleProgress() {
  const container = document.getElementById("moduleProgressList");
  if (!container) return;
  container.innerHTML = "";

  getModuleStatusSnapshot().forEach((module) => {
    const row = document.createElement("div");
    row.className = "module-progress-row";
    row.innerHTML = `
      <div class="label">${module.label}</div>
      <div class="status">
        <span class="status-dot bg-${module.variant}"></span>
        <span>${module.status}</span>
      </div>
      <div class="progress">
        <div class="progress-bar bg-${module.variant}"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderUpcomingDeadlines() {
  const inner = document.getElementById("deadlinesCarouselInner");
  if (!inner) return;
  inner.innerHTML = "";

  dashboardDeadlines.forEach((deadline, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    item.innerHTML = `
      <div class="deadline-card mx-4 my-2 text-center">
        <h6>${deadline.title}</h6>
        <p class="mb-1 fw-semibold">${deadline.date}</p>
        <span>${deadline.detail}</span>
      </div>
    `;
    inner.appendChild(item);
  });
}

function renderQuickReminders() {
  const grid = document.getElementById("reminderGrid");
  if (!grid) return;
  grid.innerHTML = "";

  dashboardReminders.forEach((reminder) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4";
    col.innerHTML = `
      <div class="p-3 rounded border h-100">
        <h6 class="fw-bold mb-1">${reminder.title}</h6>
        <p class="mb-0 text-muted">${reminder.body}</p>
      </div>
    `;
    grid.appendChild(col);
  });
}

function renderTipsList() {
  const list = document.getElementById("tipsList");
  if (!list) return;
  list.innerHTML = "";
  dashboardTips.forEach((tip, index) => {
    const li = document.createElement("li");
    // Extract step number and content
    const stepMatch = tip.match(/^Step (\d+):\s*(.+)$/);
    if (stepMatch) {
      const stepNum = stepMatch[1];
      const content = stepMatch[2];
      li.innerHTML = `<strong>Step ${stepNum}:</strong> ${content}`;
    } else {
      li.textContent = tip;
    }
    li.style.opacity = "0";
    li.style.transform = "translateY(10px)";
    setTimeout(() => {
      li.style.transition = "all 0.4s ease";
      li.style.opacity = "1";
      li.style.transform = "translateY(0)";
    }, index * 100);
    list.appendChild(li);
  });
}
// SynTrack – Bicol University Polangui College Student Council Financial Tracking System - Frontend Prototype
// NOTE: No backend — all data is static and comes from in-memory JS arrays in data.js.

// Simple navigation helper
function navigateTo(url) {
  window.location.href = url;
}

const PRIMARY_STUDENT_ID = "2025-001";

// =========================
// THEME + LAYOUT HELPERS
// =========================

const THEME_KEY = "cscPayTrackTheme";

function applyStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark") {
    document.body.classList.add("theme-dark");
    setThemeToggleTitle("light");
  } else {
    document.body.classList.remove("theme-dark");
    setThemeToggleTitle("dark");
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("theme-dark");
  const mode = isDark ? "dark" : "light";
  localStorage.setItem(THEME_KEY, mode);
  setThemeToggleTitle(isDark ? "light" : "dark");
}

function setThemeToggleTitle(nextMode) {
  const buttons = document.querySelectorAll(".theme-toggle-btn");
  const titleText =
    nextMode === "light" ? "Switch to light mode" : "Switch to dark mode";
  buttons.forEach((btn) => {
    btn.setAttribute("title", titleText);
  });
}

function toggleSidebar() {
  document.body.classList.toggle("sidebar-collapsed");
  // Save preference
  try {
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed') ? 'true' : 'false');
  } catch (e) {}
}

// Ensure user dropdown links open their modals reliably
function bindUserDropdownModalTriggers() {
  const links = document.querySelectorAll(".user-dropdown a[data-bs-target]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-bs-target");
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById("userDropdown");
      if (menu) menu.classList.remove("show");
      const modalEl = document.querySelector(target);
      if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
        const modal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: true });
        modal.show();
      }
    });
  });
}

function toggleUserMenu() {
  const menu = document.getElementById("userDropdown");
  if (!menu) return;
  menu.classList.toggle("show");
}

function toggleNotifications() {
  const panel = document.getElementById("notificationPanel");
  if (!panel) return;
  panel.classList.toggle("show");
}

function startClock(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  function update() {
    const now = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[now.getDay()];
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');
    
    el.textContent = `${weekday}, ${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  update();
  setInterval(update, 1000);
}

// Render announcements in dashboard landing pages
function renderAnnouncements(containerId) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(announcements)) return;

  container.innerHTML = "";
  announcements.forEach((a) => {
    const card = document.createElement("div");
    card.className = "announcement-card";
    card.innerHTML = `
      <h6>${a.title}</h6>
      <span>${a.date} • ${a.author}</span>
      <p class="mt-2 mb-0">${a.description}</p>
    `;
    container.appendChild(card);
  });
}

// =========================
// LOGIN HANDLER
// =========================

const loginAccounts = {
  "2023-9135-16062": {
    password: "SynTrack1",
    role: "student",
    name: "VANNESA ROSE B.",
  },
  "csctreasurer@gmail.com": {
    password: "SynTrack2",
    role: "treasurer",
    name: "CSC Treasurer",
  },
  "cscbm@gmail.com": {
    password: "SynTrack3",
    role: "bm",
    name: "CSC Business Manager",
  },
  "admin@gmail.com": {
    password: "SynTrack",
    role: "admin",
    name: "System Admin",
  },
};

const REMEMBER_KEY = "cscPayTrackRemember";

function handleLoginSubmit(event) {
  if (event) event.preventDefault();

  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");
  const rememberCheckbox = document.getElementById("rememberMe");
  const errorEl = document.getElementById("loginError");

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  const account = loginAccounts[username];
  if (!account || account.password !== password) {
    if (errorEl) {
      errorEl.textContent = "Invalid credentials. Please check your ID/username and password.";
      errorEl.classList.add("show");
    }
    return;
  }

  if (errorEl) errorEl.classList.remove("show");

  if (rememberCheckbox && rememberCheckbox.checked) {
    localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({
        username,
        role: account.role,
        storedAt: Date.now(),
      }),
    );
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }

  let target = "login.html";
  switch (account.role) {
    case "student":
      target = "student/student_dashboard.html";
      break;
    case "treasurer":
      target = "treasurer/treasurer_dashboard.html";
      break;
    case "bm":
      target = "bm/bm_dashboard.html";
      break;
    case "admin":
      target = "admin/admin_dashboard.html";
      break;
  }

  navigateTo(target);
}

function hydrateLoginForm() {
  applyStoredTheme();
  const stored = localStorage.getItem(REMEMBER_KEY);
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    const usernameInput = document.getElementById("loginUsername");
    const rememberCheckbox = document.getElementById("rememberMe");
    if (usernameInput && parsed.username) {
      usernameInput.value = parsed.username;
    }
    if (rememberCheckbox) rememberCheckbox.checked = true;
  } catch (e) {
    // ignore parse errors
  }
}

// Generic table rendering helper
// tableId: ID of <tbody>, data: array of objects, columns: array of property names
function renderTable(tableId, data, columns) {
  const tableBody = document.getElementById(tableId);
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    const colSpan = columns.length || 1;
    tableBody.innerHTML = `
      <tr>
        <td colspan="${colSpan}" class="text-center placeholder-note">
          No records found (static mock data).
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((item) => {
    let row = "<tr>";
    columns.forEach((col) => {
      row += `<td>${item[col] ?? ""}</td>`;
    });
    row += "</tr>";
    tableBody.innerHTML += row;
  });
}

// Helper to group values by month (YYYY-MM -> sum)
function aggregateByMonth(items, amountKey, dateKey) {
  const map = {};
  items.forEach((it) => {
    const d = new Date(it[dateKey]);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
    map[key] = (map[key] || 0) + (Number(it[amountKey]) || 0);
  });
  const labels = Object.keys(map).sort();
  const values = labels.map((k) => map[k]);
  return { labels, values };
}

// =========================
// STUDENT MODULE RENDERERS
// =========================

function loadStudentDashboard() {
  const student = getPrimaryStudent();
  if (student) {
    const welcomeName = document.getElementById("studentWelcomeName");
    if (welcomeName) welcomeName.textContent = student.name;

    const summaryName = document.getElementById("studentSummaryName");
    const summaryId = document.getElementById("studentSummaryId");
    const summaryCourse = document.getElementById("studentSummaryCourse");

    if (summaryName) summaryName.textContent = student.name;
    if (summaryId) summaryId.textContent = student.id;
    if (summaryCourse) {
      summaryCourse.textContent = `${student.course} • Year ${student.year}${
        student.block ? ` • ${student.block}` : ""
      }`;
    }
  }

  const summaryAy = document.getElementById("studentSummaryAy");
  if (summaryAy) {
    const latest = getLatestCscRecord(PRIMARY_STUDENT_ID);
    summaryAy.textContent = latest?.academicYear || "2024-2025";
  }

  renderModuleProgress();
  renderUpcomingDeadlines();
  renderQuickReminders();
  renderTipsList();
}

function loadStudentHistoryTable() {
  const container = document.getElementById("studentCscFeeHistory");
  if (!container) return;

  const primaryId = "2025-001";
  const records = cscFeePayments
    .filter((p) => p.studentId === primaryId)
    .sort((a, b) => (a.academicYear || "").localeCompare(b.academicYear || ""));

  if (!records.length) {
    container.innerHTML =
      '<p class="placeholder-note">No CSC fee records yet for your account.</p>';
    return;
  }

  container.innerHTML = "";

  records.forEach((p) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card mb-3";
    const statusText =
      p.status === "Verified"
        ? "Paid (Verified)"
        : "Paid (Pending Verification)";
    wrapper.innerHTML = `
      <div class="card-body">
        <h5 class="fw-bold mb-2">📘 Academic Year ${p.academicYear || "N/A"}</h5>
        <p class="mb-1"><strong>Status:</strong> ${statusText}</p>
        <p class="mb-1"><strong>Receipt ID:</strong> ${p.receiptId}</p>
        <p class="mb-1"><strong>Date Paid:</strong> ${p.date}</p>
        <p class="mb-0"><strong>Amount:</strong> ₱${p.amount}</p>
      </div>
    `;
    container.appendChild(wrapper);
  });
}

// Merchandise orders for student
function loadStudentMerchandise() {
  const tbodyId = "studentMerchTableBody";
  const primaryId = "2025-001";
  const rows = merchandiseOrders
    .filter((o) => o.studentId === primaryId)
    .map((o) => ({
      date: o.date,
      receiptId: o.orderId,
      item: o.item,
      amount: o.amount,
      status: o.status,
    }));

  renderTable(tbodyId, rows, ["date", "receiptId", "item", "amount", "status"]);
}

// Lanyard (ID Lace) requests for student
function loadStudentLanyards() {
  const tbodyId = "studentLanyardTableBody";
  const primaryId = "2025-001";
  const rows = idLaceRequests
    .filter((r) => r.studentId === primaryId)
    .map((r) => ({
      date: r.date,
      requestId: r.requestId,
      item: r.item,
      status: r.status,
    }));

  renderTable(tbodyId, rows, ["date", "requestId", "item", "status"]);
}

// PE Uniform orders for student
function loadStudentPeUniform() {
  const tbodyId = "studentPeUniformTableBody";
  const primaryId = "2025-001";
  const rows = peUniformOrders
    .filter((o) => o.studentId === primaryId)
    .map((o) => ({
      date: o.date,
      orderId: o.orderId,
      item: o.item,
      size: o.size,
      status: o.status,
    }));

  renderTable(tbodyId, rows, ["date", "orderId", "item", "size", "status"]);
}

// Seal & Plate requests for student
function loadStudentSealPlate() {
  const tbodyId = "studentSealPlateTableBody";
  const primaryId = "2025-001";
  const rows = sealPlateRequests
    .filter((r) => r.studentId === primaryId)
    .map((r) => ({
      date: r.date,
      requestId: r.requestId,
      item: r.item,
      status: r.status,
    }));

  renderTable(tbodyId, rows, ["date", "requestId", "item", "status"]);
}

// Student dispute list for table id "student-disputes"
function loadStudentDisputesTable() {
  const primaryId = "2025-001";
  const data = disputes
    .filter((d) => d.studentId === primaryId)
    .map((d) => ({
      disputeId: d.disputeId,
      concernType: d.concernType || "CSC Fee",
      issue: d.issue,
      date: d.date,
      status: d.status,
    }));

  renderTable("student-disputes", data, [
    "disputeId",
    "concernType",
    "issue",
    "date",
    "status",
  ]);

  // Also render to status panels
  const newBody = document.getElementById("student-disputes-new");
  const reviewBody = document.getElementById("student-disputes-review");
  const resolvedBody = document.getElementById("student-disputes-resolved");

  if (newBody) newBody.innerHTML = "";
  if (reviewBody) reviewBody.innerHTML = "";
  if (resolvedBody) resolvedBody.innerHTML = "";

  data.forEach((d) => {
    const rowHtml = `<tr><td>${d.disputeId}</td><td>${d.issue}</td></tr>`;
    if (d.status === "New" && newBody) {
      newBody.innerHTML += rowHtml;
    } else if (d.status === "Pending" && reviewBody) {
      reviewBody.innerHTML += rowHtml;
    } else if (d.status === "Resolved" && resolvedBody) {
      resolvedBody.innerHTML += rowHtml;
    }
  });
}

// Submit dispute (student side)
function submitDispute() {
  const concernType =
    document.getElementById("form_concernType")?.value || "Missing payment";
  const module =
    document.getElementById("form_module")?.value || "CSC Fee";
  const details = document.getElementById("form_details").value || "";

  if (!details.trim()) {
    alert("Please explain your issue.");
    return;
  }

  disputes.push({
    disputeId: generateId("D"),
    studentId: "2025-001", // fixed for prototype
    concernType,
    module,
    issue: details,
    date: new Date().toISOString().split("T")[0],
    status: "New",
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  loadStudentDisputesTable();
}

// ===========================
// TREASURER MODULE RENDERERS
// ===========================

const TREASURER_NAME = "VANNESA ROSE B.";

function logAudit(action, details) {
  if (!Array.isArray(auditTrail)) return;
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  auditTrail.unshift({ timestamp, action, details, performedBy: TREASURER_NAME });
}

function getBlocksFromData() {
  const set = new Set();
  students.forEach((s) => s.block && set.add(s.block));
  cscFeePayments.forEach((p) => p.block && set.add(p.block));
  // Ensure 1A-4B range exists for filters
  ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"].forEach((b) => set.add(b));
  return Array.from(set).sort();
}

function getCoursesFromData() {
  const set = new Set();
  students.forEach((s) => s.course && set.add(s.course));
  cscFeePayments.forEach((p) => p.course && set.add(p.course));
  return Array.from(set).sort();
}

function computeCscStats() {
  const totalVerified = cscFeePayments.filter((p) => p.status === "Verified").length;
  const totalPending = cscFeePayments.filter((p) => p.status === "Pending").length;
  const totalCollected = cscFeePayments
    .filter((p) => p.status === "Verified")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const paidIds = new Set(
    cscFeePayments.filter((p) => p.status === "Verified").map((p) => p.studentId),
  );
  const studentsNotPaid = students.filter((s) => !paidIds.has(s.id)).length;
  return { totalVerified, totalPending, totalCollected, studentsNotPaid };
}

function renderCscOverview() {
  const { totalVerified, totalPending, totalCollected, studentsNotPaid } = computeCscStats();
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setText("cscTotalVerified", totalVerified);
  setText("cscTotalPending", totalPending);
  setText(
    "cscTotalCollected",
    "₱" + totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 }),
  );
  setText("cscStudentsNotPaid", studentsNotPaid);
  const badge = document.getElementById("pendingCountBadge");
  if (badge) badge.textContent = totalPending;
}

function renderPendingTable() {
  const tbody = document.getElementById("pendingPaymentsTable");
  if (!tbody) return;

  const q = document.getElementById("cscSearchInput")?.value.toLowerCase() || "";
  const block = document.getElementById("cscBlockFilter")?.value || "";
  const course = document.getElementById("cscCourseFilter")?.value || "";
  let rows = cscFeePayments.filter((p) => p.status === "Pending");
  if (q)
    rows = rows.filter(
      (p) =>
        p.studentName.toLowerCase().includes(q) ||
        p.studentId.toLowerCase().includes(q) ||
        (p.referenceNumber || "").toLowerCase().includes(q),
    );
  if (block) rows = rows.filter((p) => p.block === block);
  if (course) rows = rows.filter((p) => p.course === course);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">No pending submissions</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (p) => `
    <tr>
      <td><strong>${p.studentName}</strong></td>
      <td>${p.studentId}</td>
      <td>${p.block || "-"}</td>
      <td class="d-none d-md-table-cell">${p.course || "-"}</td>
      <td>₱${Number(p.amount || 0).toFixed(2)}</td>
      <td>${p.referenceNumber || "—"}</td>
      <td>${p.dateSubmitted || p.date || "—"}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="openPaymentModal('${p.receiptId}')">
          <i class="bi bi-image"></i> Proof
        </button>
      </td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-success" onclick="verifyPending('${p.receiptId}')"><i class="bi bi-check2-circle"></i> Verify</button>
          <button class="btn btn-outline-danger" onclick="rejectPending('${p.receiptId}')"><i class="bi bi-x-circle"></i> Reject</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

function renderStudentStatusTable() {
  const tbody = document.getElementById("studentStatusTable");
  if (!tbody) return;

  const q = document.getElementById("cscSearchInput")?.value.toLowerCase() || "";
  const block = document.getElementById("cscBlockFilter")?.value || "";
  const statusFilter = document.getElementById("cscStatusFilter")?.value || "";
  const course = document.getElementById("cscCourseFilter")?.value || "";

  const latestByStudent = {};
  cscFeePayments.forEach((p) => {
    const existing = latestByStudent[p.studentId];
    if (!existing || (p.dateSubmitted || p.date) > (existing.dateSubmitted || existing.date)) {
      latestByStudent[p.studentId] = p;
    }
  });

  let rows = students.map((s) => {
    const latest = latestByStudent[s.id];
    let status = "Unpaid";
    let dateVerified = "";
    let verifiedBy = "";
    if (latest) {
      if (latest.status === "Verified") {
        status = "Verified";
        dateVerified = latest.date || latest.dateSubmitted || "";
        verifiedBy = latest.verifiedBy || TREASURER_NAME;
      } else if (latest.status === "Pending") {
        status = "Pending";
      } else if (latest.status === "Rejected") {
        status = "Rejected";
      }
    }
    return {
      studentName: s.name,
      studentId: s.id,
      block: s.block || "-",
      course: s.course || "-",
      status,
      dateVerified,
      verifiedBy,
    };
  });

  if (q) rows = rows.filter((r) => r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q));
  if (block) rows = rows.filter((r) => r.block === block);
  if (course) rows = rows.filter((r) => r.course === course);
  if (statusFilter) rows = rows.filter((r) => r.status === statusFilter);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No records found</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td><strong>${r.studentName}</strong></td>
      <td>${r.studentId}</td>
      <td>${r.block}</td>
      <td class="d-none d-lg-table-cell">${r.course}</td>
      <td><span class="badge bg-${r.status === "Verified" ? "success" : r.status === "Pending" ? "warning text-dark" : r.status === "Rejected" ? "danger" : "secondary"}">${r.status === "Verified" ? "Paid" : r.status === "Pending" ? "Pending" : r.status === "Rejected" ? "Rejected" : "Not Paid"}</span></td>
      <td>${r.dateVerified || "—"}</td>
      <td>${r.verifiedBy || "—"}</td>
    </tr>
  `,
    )
    .join("");
}

let paymentModalInstance = null;
let currentModalPaymentId = null;

function openPaymentModal(receiptId) {
  const payment = cscFeePayments.find((p) => p.receiptId === receiptId);
  if (!payment) return;
  currentModalPaymentId = receiptId;

  document.getElementById("modalStudentName").textContent = payment.studentName;
  document.getElementById("modalStudentId").textContent = payment.studentId;
  document.getElementById("modalStudentBlock").textContent = payment.block || "-";
  document.getElementById("modalAmount").textContent = Number(payment.amount || 0).toFixed(2);
  document.getElementById("modalDate").textContent = payment.dateSubmitted || payment.date || "—";
  document.getElementById("modalReference").textContent = payment.referenceNumber || "—";

  const img = document.getElementById("modalProofImage");
  img.src = payment.proofUrl || "https://via.placeholder.com/640x480?text=No+Proof";
  img.onclick = () => window.open(img.src, "_blank");

  const modalEl = document.getElementById("paymentModal");
  paymentModalInstance = paymentModalInstance || new bootstrap.Modal(modalEl);
  paymentModalInstance.show();

  const verifyBtn = document.getElementById("modalVerifyBtn");
  const rejectBtn = document.getElementById("modalRejectBtn");
  verifyBtn.onclick = () => {
    verifyPending(receiptId);
    paymentModalInstance.hide();
  };
  rejectBtn.onclick = () => {
    rejectPending(receiptId);
    paymentModalInstance.hide();
  };

  logAudit(
    "VIEWED_PROOF",
    `Viewed proof for ${payment.studentName} (${payment.referenceNumber || "No Ref"})`,
  );
}

function verifyPending(receiptId) {
  const payment = cscFeePayments.find((p) => p.receiptId === receiptId);
  if (!payment) return;
  payment.status = "Verified";
  payment.date = payment.date || new Date().toISOString().split("T")[0];
  payment.verifiedBy = TREASURER_NAME;
  logAudit(
    "VERIFIED_PAYMENT",
    `Verified payment from ${payment.studentName} (${payment.referenceNumber || "No Ref"})`,
  );
  refreshCscPage();
}

function rejectPending(receiptId) {
  const payment = cscFeePayments.find((p) => p.receiptId === receiptId);
  if (!payment) return;
  payment.status = "Rejected";
  payment.verifiedBy = TREASURER_NAME;
  logAudit(
    "REJECTED_PAYMENT",
    `Rejected payment from ${payment.studentName} (${payment.referenceNumber || "No Ref"})`,
  );
  refreshCscPage();
}

function bindCscFilters() {
  ["cscSearchInput", "cscBlockFilter", "cscCourseFilter", "cscStatusFilter"].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("input", () => {
        renderPendingTable();
        renderStudentStatusTable();
        logAudit("FILTER_CHANGED", `Updated filters on CSC Fee page (${id})`);
      });
  });
}

function hydrateBlockFilterOptions() {
  const select = document.getElementById("cscBlockFilter");
  if (!select) return;
  const blocks = getBlocksFromData();
  select.innerHTML =
    `<option value="">All Blocks</option>` + blocks.map((b) => `<option value="${b}">${b}</option>`).join("");
}

function hydrateCourseFilterOptions() {
  const select = document.getElementById("cscCourseFilter");
  if (!select) return;
  const courses = getCoursesFromData();
  select.innerHTML =
    `<option value="">All Courses</option>` +
    courses
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
}

function refreshCscPage() {
  renderCscOverview();
  renderPendingTable();
  renderStudentStatusTable();
}

function loadTreasurerCscFeePage() {
  applyStoredTheme && applyStoredTheme();
  startClock && startClock("currentDateTime");
  hydrateBlockFilterOptions();
  hydrateCourseFilterOptions();
  bindCscFilters();
  refreshCscPage();
}

// ===============================
// BUSINESS MANAGER (BM) RENDERERS
// ===============================

function loadBmDashboard() {
  const recent = [];

  merchandiseOrders.forEach((o) =>
    recent.push({
      date: o.date,
      studentId: o.studentId,
      item: o.item,
      amount: o.amount,
    }),
  );
  peUniformOrders.forEach((o) =>
    recent.push({
      date: o.date,
      studentId: o.studentId,
      item: o.item,
      amount: o.amount,
    }),
  );

  renderTable("bmRecentOrdersTableBody", recent, [
    "date",
    "studentId",
    "item",
    "amount",
  ]);

  const merchCount = document.getElementById("countMerch");
  if (merchCount) merchCount.innerText = merchandiseOrders.length.toString();
}

// Generic add-entry helpers for BM pages (using shared modal)
function addMerchandiseOrder() {
  const studentId = document.getElementById("form_studentId").value.trim();
  const amountVal = document.getElementById("form_amount").value;
  const details =
    document.getElementById("form_details").value.trim() || "CSC T-Shirt";

  if (!studentId || !amountVal) {
    alert("Student ID and Amount are required.");
    return;
  }

  merchandiseOrders.push({
    orderId: generateId("M"),
    studentId,
    item: details,
    size: "M",
    amount: parseFloat(amountVal),
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  renderTable("bmMerchandiseTableBody", merchandiseOrders, [
    "date",
    "studentId",
    "item",
    "size",
    "amount",
    "status",
  ]);
}

function addPeUniformOrder() {
  const studentId = document.getElementById("form_studentId").value.trim();
  const amountVal = document.getElementById("form_amount").value;
  const details =
    document.getElementById("form_details").value.trim() || "PE Uniform";

  if (!studentId || !amountVal) {
    alert("Student ID and Amount are required.");
    return;
  }

  peUniformOrders.push({
    orderId: generateId("PE"),
    studentId,
    item: details,
    size: "L",
    amount: parseFloat(amountVal),
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  renderTable("bmPeUniformTableBody", peUniformOrders, [
    "date",
    "studentId",
    "size",
    "item",
    "amount",
    "status",
  ]);
}

function addSealPlateRequest() {
  const studentId = document.getElementById("form_studentId").value.trim();
  const amountVal = document.getElementById("form_amount").value;
  const details =
    document.getElementById("form_details").value.trim() || "Seal and Plate";

  if (!studentId || !amountVal) {
    alert("Student ID and Amount are required.");
    return;
  }

  sealPlateRequests.push({
    requestId: generateId("SP"),
    studentId,
    item: details,
    amount: parseFloat(amountVal),
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  renderTable("bmSealPlateTableBody", sealPlateRequests, [
    "date",
    "studentId",
    "item",
    "amount",
    "status",
  ]);
}

function addIdLaceRequest() {
  const studentId = document.getElementById("form_studentId").value.trim();
  const amountVal = document.getElementById("form_amount").value;
  const details =
    document.getElementById("form_details").value.trim() || "ID Lace";

  if (!studentId || !amountVal) {
    alert("Student ID and Amount are required.");
    return;
  }

  idLaceRequests.push({
    requestId: generateId("ID"),
    studentId,
    item: details,
    amount: parseFloat(amountVal),
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  renderTable("bmIdLaceTableBody", idLaceRequests, [
    "date",
    "studentId",
    "item",
    "amount",
    "status",
  ]);
}

function loadBmMerchandiseTable() {
  renderTable("bmMerchandiseTableBody", merchandiseOrders, [
    "date",
    "studentId",
    "item",
    "size",
    "amount",
    "status",
  ]);
}

function loadBmPeUniformTable() {
  renderTable("bmPeUniformTableBody", peUniformOrders, [
    "date",
    "studentId",
    "size",
    "item",
    "amount",
    "status",
  ]);
}

function loadBmSealPlateTable() {
  renderTable("bmSealPlateTableBody", sealPlateRequests, [
    "date",
    "studentId",
    "item",
    "amount",
    "status",
  ]);
}

function loadBmIdLaceTable() {
  renderTable("bmIdLaceTableBody", idLaceRequests, [
    "date",
    "studentId",
    "item",
    "amount",
    "status",
  ]);
}

function loadBmReports() {
  if (typeof Chart !== "undefined") {
    const catCtx = document.getElementById("bmCategoryChart");
    if (catCtx) {
      const merchTotal = merchandiseOrders.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      );
      const peTotal = peUniformOrders.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      );
      const sealTotal = sealPlateRequests.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      );
      const idTotal = idLaceRequests.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      );

      new Chart(catCtx, {
        type: "pie",
        data: {
          labels: ["Merchandise", "PE Uniform", "Seal & Plate", "ID Lace"],
          datasets: [
            {
              data: [merchTotal, peTotal, sealTotal, idTotal],
              backgroundColor: [
                "#22c55e",
                "#0ea5e9",
                "#a855f7",
                "#f97316",
              ],
            },
          ],
        },
      });
    }

    const monthlyCtx = document.getElementById("bmMonthlyChart");
    if (monthlyCtx) {
      const all = [
        ...merchandiseOrders,
        ...peUniformOrders,
        ...sealPlateRequests,
        ...idLaceRequests,
      ];
      const agg = aggregateByMonth(all, "amount", "date");
      new Chart(monthlyCtx, {
        type: "bar",
        data: {
          labels: agg.labels,
          datasets: [
            {
              label: "Total BM Sales",
              data: agg.values,
              backgroundColor: "#0369a188",
              borderColor: "#0369a1",
            },
          ],
        },
      });
    }
  }

  const summary = [
    {
      category: "Merchandise",
      orders: merchandiseOrders.length,
      totalAmount: merchandiseOrders.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      ),
    },
    {
      category: "PE Uniform",
      orders: peUniformOrders.length,
      totalAmount: peUniformOrders.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      ),
    },
    {
      category: "Seal & Plate",
      orders: sealPlateRequests.length,
      totalAmount: sealPlateRequests.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      ),
    },
    {
      category: "ID Lace",
      orders: idLaceRequests.length,
      totalAmount: idLaceRequests.reduce(
        (s, o) => s + Number(o.amount || 0),
        0,
      ),
    },
  ];

  renderTable("bmSummaryTableBody", summary, [
    "category",
    "orders",
    "totalAmount",
  ]);
}

// ===============================
// ADMIN
// ===============================

function loadAdminDashboard() {
  const rows = [
    {
      date: "2025-02-01",
      user: "admin",
      role: "Admin",
      action: "Created Treasurer account (mock)",
    },
  ];
  renderTable("adminRecentActivityTableBody", rows, [
    "date",
    "user",
    "role",
    "action",
  ]);
}

function loadAdminUsers() {
  const rows = [
    { userId: "admin", name: "System Admin", role: "Admin", status: "Active" },
    {
      userId: "treas001",
      name: "Treasurer User",
      role: "Treasurer",
      status: "Active",
    },
  ];
  renderTable("adminUserTableBody", rows, [
    "userId",
    "name",
    "role",
    "status",
  ]);
}

function loadAdminLogs() {
  const rows = [
    {
      date: "2025-02-01",
      module: "Admin",
      user: "admin",
      role: "Admin",
      action: "Initial setup (mock)",
    },
  ];
  renderTable("adminLogsTableBody", rows, [
    "date",
    "module",
    "user",
    "role",
    "action",
  ]);
}

// ==============
// NAV HIGHLIGHT
// ==============

function setActiveLink() {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (path.endsWith(href) || path.includes("/" + href)) {
      link.classList.add("active");
    }
  });
}

// Basic per-page init hook (kept for flexibility)
function initPage(pageId) {
  bindUserDropdownModalTriggers();
  if (pageId === "treasurer-csc-fee") {
    loadTreasurerCscFeePage();
  }
}

// Attach global nav highlighter + reveal-on-scroll
document.addEventListener("DOMContentLoaded", () => {
  setActiveLink();
  initRevealOnScroll();
  bindUserDropdownModalTriggers();
});

function initRevealOnScroll() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal-on-scroll")
      .forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".reveal-on-scroll")
    .forEach((el) => observer.observe(el));
}

