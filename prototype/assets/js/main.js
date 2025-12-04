// CSC Financial Tracking and Payment Management System - Frontend Prototype
// NOTE: No backend — all data is static and comes from in-memory JS arrays in data.js.

// Simple navigation helper
function navigateTo(url) {
  window.location.href = url;
}

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
  const recent = [];

  cscFeePayments.forEach((p) => {
    recent.push({
      date: p.date,
      type: "CSC Fee",
      amount: p.amount,
      status: p.status,
    });
  });

  merchandiseOrders.forEach((o) => {
    recent.push({
      date: o.date,
      type: o.item,
      amount: o.amount,
      status: o.status,
    });
  });

  peUniformOrders.forEach((o) => {
    recent.push({
      date: o.date,
      type: o.item,
      amount: o.amount,
      status: o.status,
    });
  });

  renderTable("studentRecentPaymentsBody", recent, [
    "date",
    "type",
    "amount",
    "status",
  ]);

  // Dashboard card counters (if present)
  const countEl = document.getElementById("countStudentPayments");
  if (countEl) countEl.innerText = cscFeePayments.length.toString();

  // Current AY CSC fee status for primary student (prototype)
  const primaryId = "2025-001";
  const studentFees = cscFeePayments
    .filter((p) => p.studentId === primaryId)
    .sort((a, b) => (a.academicYear || "").localeCompare(b.academicYear || ""));
  if (studentFees.length > 0) {
    const latest = studentFees[studentFees.length - 1];
    const ayEl = document.getElementById("studentCscAy");
    const statusEl = document.getElementById("studentCscStatus");
    if (ayEl) ayEl.textContent = latest.academicYear || "N/A";
    if (statusEl) {
      statusEl.textContent =
        latest.status === "Verified"
          ? "Paid (Verified)"
          : "Paid (Pending Verification)";
    }
  }

  // Chart: CSC fee per month
  if (typeof Chart !== "undefined") {
    const ctx = document.getElementById("studentPaymentChart");
    if (ctx && cscFeePayments.length > 0) {
      const agg = aggregateByMonth(cscFeePayments, "amount", "date");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: agg.labels,
          datasets: [
            {
              label: "CSC Fee Payments",
              data: agg.values,
              backgroundColor: "#2563eb88",
              borderColor: "#2563eb",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 50 },
            },
          },
        },
      });
    }
  }
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

// Student dispute list for table id "student-disputes"
function loadStudentDisputesTable() {
  const data = disputes.map((d) => ({
    disputeId: d.disputeId,
    issue: d.issue,
    date: d.date,
    status: d.status,
  }));

  renderTable("student-disputes", data, [
    "disputeId",
    "issue",
    "date",
    "status",
  ]);
}

// Submit dispute (student side)
function submitDispute() {
  const issue = document.getElementById("form_details").value || "";
  if (!issue.trim()) {
    alert("Please enter dispute details.");
    return;
  }

  disputes.push({
    disputeId: generateId("D"),
    studentId: "2025-001", // fixed for prototype
    issue,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  closeModal("addRecordModal");
  document.getElementById("form_details").value = "";
  renderTable("student-disputes", disputes, [
    "disputeId",
    "issue",
    "date",
    "status",
  ]);
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

// Attach global nav highlighter
document.addEventListener("DOMContentLoaded", setActiveLink);



