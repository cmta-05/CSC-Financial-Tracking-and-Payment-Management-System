// Mock data for CSC Financial Tracking and Payment Management System
// No backend — all data is static in-memory JS objects/arrays.

// Students
const students = [
  {
    id: "2025-001",
    name: "Juan Dela Cruz",
    course: "BSIT",
    year: "3",
  },
  {
    id: "2025-002",
    name: "Maria Santos",
    course: "BSA",
    year: "1",
  },
];

// CSC Fee Payments (₱220 per Academic Year)
// academicYear is stored as "YYYY-YYYY" for grouping.
const cscFeePayments = [
  {
    receiptId: "CSC-AY22-23",
    studentId: "2025-001",
    studentName: "Juan Dela Cruz",
    academicYear: "2022-2023",
    amount: 220,
    date: "2023-01-12",
    status: "Verified",
  },
  {
    receiptId: "CSC-AY23-24",
    studentId: "2025-001",
    studentName: "Juan Dela Cruz",
    academicYear: "2023-2024",
    amount: 220,
    date: "2024-01-10",
    status: "Pending",
  },
  {
    receiptId: "CSC-AY23-24-MS",
    studentId: "2025-002",
    studentName: "Maria Santos",
    academicYear: "2023-2024",
    amount: 220,
    date: "2024-01-11",
    status: "Verified",
  },
];

// Merchandise Orders (Business Manager)
const merchandiseOrders = [
  {
    orderId: "M-001",
    studentId: "2025-001",
    item: "CSC T-Shirt",
    size: "M",
    amount: 300,
    date: "2025-01-15",
    status: "Paid",
  },
];

const peUniformOrders = [
  {
    orderId: "PE-001",
    studentId: "2025-002",
    item: "PE Uniform",
    size: "L",
    amount: 450,
    date: "2025-02-05",
    status: "Paid",
  },
];

const sealPlateRequests = [
  {
    requestId: "SP-001",
    studentId: "2025-001",
    item: "Seal and Plate",
    amount: 250,
    date: "2025-02-18",
    status: "Pending",
  },
];

const idLaceRequests = [
  {
    requestId: "ID-001",
    studentId: "2025-002",
    item: "ID Lace",
    amount: 50,
    date: "2025-02-28",
    status: "Paid",
  },
];

// Disputes
const disputes = [
  {
    disputeId: "D-001",
    studentId: "2025-001",
    issue: "Payment not reflected",
    date: "2025-02-01",
    status: "Resolved",
  },
];

// Announcement board (for landing dashboards)
const announcements = [
  {
    id: 1,
    title: "CSC PayTrack Launch",
    date: "Feb 10, 2025",
    author: "CSC ICT",
    description:
      "Welcome to CSC PayTrack! Explore the new all-in-one financial tracking experience for BU Polangui.",
  },
  {
    id: 2,
    title: "Merchandise Pick-up",
    date: "Feb 14, 2025",
    author: "Business Manager",
    description:
      "Pre-ordered CSC jackets and ID laces will be available at the CSC booth from 9 AM to 4 PM.",
  },
  {
    id: 3,
    title: "Financial Transparency Week",
    date: "Feb 20, 2025",
    author: "CSC Treasurer",
    description:
      "Join the transparency forum to learn about how your CSC fees are allocated for student services.",
  },
];


