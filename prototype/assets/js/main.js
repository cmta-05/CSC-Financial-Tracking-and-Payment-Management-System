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
    amount: "₱150.00",
    description: "Official BU Polangui ID lace with guidelines.",
    target: "student_info_lanyards.html",
    theme: "lanyards",
  },
  {
    key: "pe",
    label: "PE UNIFORM",
    amount: "₱300.00",
    description: "Required attire for PE classes with sizing tips.",
    target: "student_info_pe_uniform.html",
    theme: "pe",
  },
  {
    key: "seal",
    label: "SEAL & PLATES",
    amount: "₱50.00",
    description: "CSC seal & plate for ID validation.",
    target: "student_info_seal_plate.html",
    theme: "seal",
  },
  {
    key: "merch",
    label: "MERCH SHIRT",
    amount: "₱350.00",
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
  "Upload a clear receipt photo when filing concerns.",
  "Check module status bars weekly for pending requirements.",
  "Use the info pages to review policies before pickups.",
  "Contact CSC officers early if a payment is missing.",
];

const dashboardReminders = [
  {
    title: "Keep Proofs Ready",
    body: "Take photos of every payment receipt for faster verification.",
  },
  {
    title: "Watch Stock Notices",
    body: "Lanyards, seal & plates, and merch drop announcements happen in batches.",
  },
  {
    title: "Pickup Etiquette",
    body: "Bring your ID and proof of payment when claiming PE uniforms or merch.",
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
  dashboardTips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    list.appendChild(li);
  });
}
// CSC Financial Tracking and Payment Management System - Frontend Prototype
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
    const options = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    el.textContent = now.toLocaleString(undefined, options);
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
    password: "CSCPayTrack1",
    role: "student",
    name: "VANNESA ROSE B.",
  },
  "csctreasurer@gmail.com": {
    password: "CSCPayTrack2",
    role: "treasurer",
    name: "CSC Treasurer",
  },
  "cscbm@gmail.com": {
    password: "CSCPayTrack3",
    role: "bm",
    name: "CSC Business Manager",
  },
  "cscauditor@gmail.com": {
    password: "CSCPayTrack4",
    role: "auditor",
    name: "CSC Auditor",
  },
  "cscpresident@gmail.com": {
    password: "CSCPayTrack1",
    role: "president",
    name: "CSC President",
  },
  "admin@gmail.com": {
    password: "CSCPayTrack",
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
    case "auditor":
      target = "auditor/auditor_dashboard.html";
      break;
    case "president":
      target = "president/president_dashboard.html";
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

  renderModuleCards();
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

// CSC fee table with Verify button
function renderCscFeeTable() {
  const tbody = document.getElementById("table-csc-fee");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!cscFeePayments.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center placeholder-note">
          No CSC fee records yet.
        </td>
      </tr>
    `;
    return;
  }

  cscFeePayments.forEach((p) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.receiptId}</td>
        <td>${p.studentName}</td>
        <td>${p.amount}</td>
        <td>${p.date}</td>
        <td>${p.status}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="verifyPayment('${p.receiptId}')">
            Verify
          </button>
        </td>
      </tr>
    `;
  });
}

// Add CSC fee payment from modal
function addCSCfee() {
  const studentId = document.getElementById("form_studentId").value.trim();
  const amountVal = document.getElementById("form_amount").value;
  const details = document.getElementById("form_details").value.trim();

  if (!studentId || !amountVal) {
    alert("Student ID and Amount are required.");
    return;
  }

  const amount = parseFloat(amountVal);
  const student = students.find((s) => s.id === studentId);

  cscFeePayments.push({
    receiptId: generateId("CSC"),
    studentId,
    studentName: student ? student.name : "Unknown Student",
    amount,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    details,
  });

  closeModal("addRecordModal");
  document.getElementById("addRecordForm").reset();
  renderCscFeeTable();
}

// Verify CSC fee payment
function verifyPayment(receiptId) {
  const payment = cscFeePayments.find((p) => p.receiptId === receiptId);
  if (payment) {
    payment.status = "Verified";
  }
  renderCscFeeTable();
}

function loadTreasurerDashboard() {
  renderTable("treasurerRecentPaymentsBody", cscFeePayments, [
    "date",
    "studentName",
    "receiptId",
    "amount",
  ]);

  const countEl = document.getElementById("countCSC");
  if (countEl) countEl.innerText = cscFeePayments.length.toString();

  if (typeof Chart !== "undefined") {
    const ctx = document.getElementById("treasurerCollectionChart");
    if (ctx && cscFeePayments.length > 0) {
      const agg = aggregateByMonth(cscFeePayments, "amount", "date");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: agg.labels,
          datasets: [
            {
              label: "CSC Fee Collections",
              data: agg.values,
              backgroundColor: "#16a34a88",
              borderColor: "#16a34a",
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }
}

function loadTreasurerDisputeTable() {
  const data = disputes.map((d) => {
    const student = students.find((s) => s.id === d.studentId);
    return {
      disputeId: d.disputeId,
      date: d.date,
      student: student ? student.name : d.studentId,
      type: "CSC Fee",
      summary: d.issue,
      status: d.status,
    };
  });

  renderTable("treasurerDisputeTableBody", data, [
    "disputeId",
    "date",
    "student",
    "type",
    "summary",
    "status",
  ]);
}

function loadTreasurerReports() {
  if (typeof Chart !== "undefined") {
    const ctx = document.getElementById("cscFeeChart");
    if (ctx) {
      // Simple static chart from prompt
      const months = ["Jan", "Feb", "Mar", "Apr"];
      const totals = [300, 450, 500, 600];

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "CSC Fee Collections",
              data: totals,
              backgroundColor: "#2563eb88",
              borderColor: "#2563eb",
              borderWidth: 1,
            },
          ],
        },
      });
    }

    const disputeCtx = document.getElementById("treasurerDisputeChart");
    if (disputeCtx) {
      const statusCounts = {};
      disputes.forEach((d) => {
        statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
      });
      const labels = Object.keys(statusCounts);
      const values = labels.map((k) => statusCounts[k]);

      new Chart(disputeCtx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              label: "Disputes by Status",
              data: values,
              backgroundColor: ["#f97316", "#22c55e", "#ef4444", "#6366f1"],
            },
          ],
        },
      });
    }
  }

  const summary = [
    {
      term: "AY 2025-2026 (Mock)",
      total: cscFeePayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0,
      ),
      paid: cscFeePayments
        .filter((p) => p.status === "Verified")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
      unpaid: cscFeePayments
        .filter((p) => p.status !== "Verified")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
      disputes: disputes.length,
    },
  ];

  renderTable("treasurerSummaryTableBody", summary, [
    "term",
    "total",
    "paid",
    "unpaid",
    "disputes",
  ]);
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
// AUDITOR, PRESIDENT, ADMIN
// ===============================

function loadAuditorDashboard() {
  if (typeof Chart !== "undefined") {
    const collCtx = document.getElementById("auditorCollectionChart");
    if (collCtx) {
      const agg = aggregateByMonth(cscFeePayments, "amount", "date");
      new Chart(collCtx, {
        type: "line",
        data: {
          labels: agg.labels,
          datasets: [
            {
              label: "CSC Collections",
              data: agg.values,
              borderColor: "#22c55e",
            },
          ],
        },
      });
    }

    const disputeCtx = document.getElementById("auditorDisputeChart");
    if (disputeCtx) {
      const statusCounts = {};
      disputes.forEach((d) => {
        statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
      });
      const labels = Object.keys(statusCounts);
      const values = labels.map((k) => statusCounts[k]);

      new Chart(disputeCtx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#f97316", "#22c55e", "#ef4444"],
            },
          ],
        },
      });
    }
  }

  const rows = [
    {
      date: "2025-02-02",
      module: "Treasurer",
      action: "Verified CSC-001",
      performedBy: "Treasurer User (mock)",
    },
  ];
  renderTable("auditorAuditTableBody", rows, [
    "date",
    "module",
    "action",
    "performedBy",
  ]);
}

function loadPresidentDashboard() {
  const totalCollections = cscFeePayments.reduce(
    (s, p) => s + Number(p.amount || 0),
    0,
  );
  const merchandiseTotal =
    merchandiseOrders.reduce((s, o) => s + Number(o.amount || 0), 0) +
    peUniformOrders.reduce((s, o) => s + Number(o.amount || 0), 0) +
    sealPlateRequests.reduce((s, o) => s + Number(o.amount || 0), 0) +
    idLaceRequests.reduce((s, o) => s + Number(o.amount || 0), 0);

  if (typeof Chart !== "undefined") {
    const ctx = document.getElementById("presidentSnapshotChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["CSC Fees", "BM Revenues"],
          datasets: [
            {
              label: "Amount (₱)",
              data: [totalCollections, merchandiseTotal],
              backgroundColor: ["#2563eb88", "#16a34a88"],
              borderColor: ["#2563eb", "#16a34a"],
            },
          ],
        },
      });
    }
  }

  const countC = document.getElementById("countPresidentCSC");
  if (countC) countC.innerText = cscFeePayments.length.toString();
}

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
  // No-op placeholder
}

// Attach global nav highlighter + reveal-on-scroll
document.addEventListener("DOMContentLoaded", () => {
  setActiveLink();
  initRevealOnScroll();
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

