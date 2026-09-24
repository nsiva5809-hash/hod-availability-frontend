import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import facultyDeskLogo from "./assets/faculty-desk-logo.png";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://hod-availability-backend.onrender.com";

const reportCellStyle = {
  padding: "10px",
  border: "1px solid #e2e8f0",
  textAlign: "left",
  verticalAlign: "top",
  color: "#334155",
};

const reportSummaryStyle = {
  padding: "14px",
  borderRadius: "10px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "#0f172a",
};

const GLOBAL_STYLES = `
* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
}

button,
input {
  font-family: inherit;
}

button {
  cursor: pointer;
}
`;

const HOME_STYLES = `
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 10%, rgba(79,70,229,.20), transparent 30%),
    radial-gradient(circle at 90% 15%, rgba(14,165,233,.18), transparent 28%),
    linear-gradient(135deg, #eef2ff, #f8fbff, #eef8ff);
}

.home-header {
  width: 100%;
  padding: 22px 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faculty-desk-logo {
  width: 280px;
  max-width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
.brand {
  display: flex;
  align-items: center;
  gap: 13px;
}

.brand-logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  box-shadow: 0 10px 25px rgba(37,99,235,.25);
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  color: #172554;
}

.brand-subtitle {
  margin-top: 2px;
  font-size: 11px;
  color: #64748b;
}

.system-pill {
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(148,163,184,.22);
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.home-content {
  width: 100%;
  max-width: 1120px;
  margin: auto;
  padding: 35px 24px 55px;
}

.hero {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 38px;
}

.hero-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,.78);
  color: #4f46e5;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 18px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(36px, 6vw, 62px);
  line-height: 1.04;
  letter-spacing: -2.5px;
  color: #172554;
}

.hero h1 span {
  background: linear-gradient(90deg, #4f46e5, #2563eb, #0891b2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  max-width: 620px;
  margin: 18px auto 0;
  color: #64748b;
  font-size: 16px;
  line-height: 1.7;
}

.login-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.login-option {
  position: relative;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
  transition: transform .25s ease, box-shadow .25s ease;
  overflow: hidden;
}

.login-option:hover {
  transform: translateY(-7px);
  box-shadow: 0 25px 55px rgba(15,23,42,.13);
}

.login-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #2563eb);
}

.login-option.faculty::before {
  background: linear-gradient(90deg, #0891b2, #06b6d4);
}

.login-option.admin::before {
  background: linear-gradient(90deg, #7c3aed, #a855f7);
}

.option-icon {
  width: 56px;
  height: 56px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 22px;
  background: #eef2ff;
}

.faculty .option-icon {
  background: #ecfeff;
}

.admin .option-icon {
  background: #f5f3ff;
}

.option-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.option-title {
  margin: 7px 0 0;
  color: #172554;
  font-size: 23px;
  font-weight: 800;
}

.option-description {
  margin: 9px 0 22px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  min-height: 42px;
}

.option-button {
  width: 100%;
  border: none;
  border-radius: 13px;
  padding: 13px 16px;
  font-size: 14px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
}

.faculty .option-button {
  background: linear-gradient(135deg, #0891b2, #0284c7);
}

.admin .option-button {
  background: linear-gradient(135deg, #7c3aed, #9333ea);
}

.home-footer {
  text-align: center;
  padding: 22px;
  color: #94a3b8;
  font-size: 11px;
}

.home-footer strong {
  color: #64748b;
}

.login-option.student::before {
  background: linear-gradient(90deg, #059669, #10b981);
}

.student .option-icon {
  background: #ecfdf5;
}

.student .option-button {
  background: linear-gradient(135deg, #059669, #0d9488);
}

@media (max-width: 850px) {
  .login-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: auto;
  }

  .system-pill {
    display: none;
  }
}

@media (max-width: 480px) {
  .home-header {
    padding: 18px 20px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    font-size: 14px;
  }

  .login-option {
    padding: 23px;
  }
}
`;

const FACULTY_STYLES = `
.faculty-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 15%, rgba(6,182,212,.18), transparent 30%),
    radial-gradient(circle at 90% 85%, rgba(37,99,235,.18), transparent 32%),
    linear-gradient(135deg, #ecfeff, #f8fafc, #eff6ff);
}

.faculty-bg-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.faculty-circle-one {
  width: 280px;
  height: 280px;
  top: -130px;
  right: -100px;
  background: rgba(6,182,212,.10);
}

.faculty-circle-two {
  width: 230px;
  height: 230px;
  bottom: -110px;
  left: -80px;
  background: rgba(37,99,235,.10);
}

.faculty-login-wrapper {
  width: 100%;
  max-width: 950px;
  min-height: 570px;
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  background: rgba(255,255,255,.94);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 30px 80px rgba(15,23,42,.14);
}

.faculty-brand-panel {
  padding: 45px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #0891b2, #0284c7, #2563eb);
  position: relative;
  overflow: hidden;
}

.faculty-brand-panel::before {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  top: -120px;
  right: -120px;
}

.faculty-brand-panel::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  bottom: -100px;
  left: -90px;
}

.faculty-brand-content,
.faculty-feature-list {
  position: relative;
  z-index: 2;
}

.faculty-brand-icon {
  width: 64px;
  height: 64px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 25px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.20);
}

.faculty-brand-panel h2 {
  margin: 0;
  font-size: 31px;
  line-height: 1.15;
}

.faculty-brand-panel p {
  margin: 15px 0 0;
  color: rgba(255,255,255,.82);
  font-size: 14px;
  line-height: 1.7;
}

.faculty-feature-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.faculty-feature {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,.9);
  font-size: 12px;
  font-weight: 600;
}

.faculty-feature-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.15);
}

.faculty-form-panel {
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.faculty-form-top {
  margin-bottom: 28px;
}

.faculty-welcome {
  color: #0891b2;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  margin-bottom: 8px;
}

.faculty-form-panel h1 {
  margin: 0;
  color: #0f172a;
  font-size: 34px;
}

.faculty-form-subtitle {
  margin: 9px 0 0;
  color: #64748b;
  font-size: 14px;
}

.faculty-field {
  margin-bottom: 19px;
}

.faculty-field label {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 8px;
}

.faculty-input-wrapper {
  position: relative;
}

.faculty-input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
  .faculty-input {
  width: 100%;
  height: 51px;
  border-radius: 13px;
  border: 1px solid #dbe3ed;
  background: #f8fafc;
  padding: 0 15px 0 45px;
  outline: none;
  font-size: 14px;
}

.faculty-input:focus {
  background: white;
  border-color: #06b6d4;
  box-shadow: 0 0 0 4px rgba(6,182,212,.10);
}

.faculty-login-error {
  padding: 11px 13px;
  border-radius: 11px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.faculty-login-button {
  width: 100%;
  height: 51px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(135deg, #0891b2, #0284c7, #2563eb);
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(2,132,199,.22);
}

.faculty-login-button:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.faculty-back-button {
  width: 100%;
  margin-top: 13px;
  height: 45px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.faculty-security-note {
  margin-top: 23px;
  padding-top: 17px;
  border-top: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 11px;
}

@media (max-width: 800px) {
  .faculty-login-wrapper {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .faculty-brand-panel {
    padding: 30px;
    min-height: 230px;
  }

  .faculty-feature-list {
    display: none;
  }

  .faculty-form-panel {
    padding: 35px 30px;
  }
}

@media (max-width: 480px) {
  .faculty-login-page {
    padding: 15px;
  }

  .faculty-login-wrapper {
    border-radius: 23px;
  }

  .faculty-brand-panel {
    padding: 25px;
  }

  .faculty-form-panel {
    padding: 30px 22px;
  }

  .faculty-form-panel h1 {
    font-size: 29px;
  }
}
`;

const COMMON_LOGIN_STYLES = `
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(79,70,229,.18), transparent 35%),
    linear-gradient(135deg, #eef2ff, #f8fafc);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255,255,255,.96);
  padding: 34px;
  border-radius: 25px;
  border: 1px solid rgba(148,163,184,.18);
  box-shadow: 0 25px 70px rgba(15,23,42,.12);
}

.login-card h1 {
  color: #172554;
  margin: 0 0 8px;
}

.login-subtitle {
  color: #64748b;
  margin-bottom: 25px;
}

.login-card label {
  display: block;
  margin: 14px 0 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.login-card input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 11px;
  border: 1px solid #dbe3ef;
  outline: none;
  font-size: 14px;
}

.login-card button {
  width: 100%;
  border: none;
  border-radius: 11px;
  padding: 13px;
  margin-top: 12px;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  font-weight: 800;
  cursor: pointer;
}

.login-error {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #b91c1c;
  background: #fef2f2;
  font-size: 13px;
}
`;

function App() {
  const getInitialPage = () => {
    const path = window.location.pathname;

    if (path === "/admin") return "admin-login";
    if (path === "/faculty") return "faculty-login";
    if (path === "/viewer") return "viewer";
    if (path === "/student") return "student";

    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

  // =========================
  // HOD
  // =========================
  const [hodId, setHodId] = useState("");
  const [hodPassword, setHodPassword] = useState("");
  const [hodError, setHodError] = useState("");
  const [hodLoading, setHodLoading] = useState(false);

  const [hodUser, setHodUser] = useState(() => {
    const saved = sessionStorage.getItem("hodUser");

    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [hodStatus, setHodStatus] = useState(null);
  const [hodStatusMessage, setHodStatusMessage] = useState("");
  const [hodExpectedReturn, setHodExpectedReturn] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  // =========================
  // STUDENT PORTAL
  // =========================
  const [studentDepartments, setStudentDepartments] = useState([]);
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  // =========================
 // =========================
// FACULTY
// =========================

const [facultyId, setFacultyId] =
  useState("");

const [facultyPassword, setFacultyPassword] =
  useState("");

const [facultyError, setFacultyError] =
  useState("");

const [facultyLoading, setFacultyLoading] =
  useState(false);


const [facultyUser, setFacultyUser] =
  useState(() => {

    const saved =
      sessionStorage.getItem(
        "facultyUser"
      );

    if (!saved) return null;

    try {

      return JSON.parse(saved);

    } catch {

      return null;

    }

  });
  const [facultyCurrentStatus, setFacultyCurrentStatus] =
  useState(null);
// =====================================================
// FACULTY LEAVE / HOLIDAY STATE
// =====================================================

const [facultySelectedDate, setFacultySelectedDate] =
  useState(
    new Date().toISOString().split("T")[0]
  );

const [facultyLeave, setFacultyLeave] =
  useState(null);

const [collegeHoliday, setCollegeHoliday] =
  useState(null);

const [facultyLeaveReason, setFacultyLeaveReason] =
  useState("");

const [holidayName, setHolidayName] =
  useState("");

const [holidayDescription, setHolidayDescription] =
  useState("");

const [leaveHolidayLoading, setLeaveHolidayLoading] =
  useState(false);
const taskDateBlocked =
  !!facultyLeave || !!collegeHoliday;
const [facultyStatusLoading, setFacultyStatusLoading] =
  useState(false);

const [facultyHodAvailability, setFacultyHodAvailability] =
  useState(null);

const [facultyHodLoading, setFacultyHodLoading] =
  useState(false);

const [facultyHodError, setFacultyHodError] =
  useState("");

// =========================
// FACULTY TIMETABLE
// =========================

const [facultyTimetable, setFacultyTimetable] = useState([]);
const [timetableDay, setTimetableDay] = useState("Monday");
const [timetableLoading, setTimetableLoading] = useState(false);
const [timetableError, setTimetableError] = useState("");
const [timetableSuccess, setTimetableSuccess] = useState("");
const [editingPeriod, setEditingPeriod] = useState(null);

const [facultyTasks, setFacultyTasks] = useState([]);
const [facultyTasksLoading, setFacultyTasksLoading] = useState(false);
const [facultyTasksError, setFacultyTasksError] = useState("");
const [facultyTasksSuccess, setFacultyTasksSuccess] = useState("");
const [editingTaskId, setEditingTaskId] = useState(null);
const [facultyReport, setFacultyReport] = useState(null);

const generateFacultyReportPDF = async () => {
  if (!facultyReport) {
    alert("Please generate the report first.");
    return;
  }

  const doc = new jsPDF();

  const from = facultyReport.from || "";
  const to = facultyReport.to || "";

  const facultyName =
    facultyUser?.name ||
    facultyUser?.faculty_name ||
    "Faculty";

  const facultyId =
    facultyUser?.facultyId ||
    facultyUser?.faculty_id ||
    facultyUser?.username ||
    "";

  let department =
  facultyUser?.departmentName ||
  facultyUser?.department_name ||
  facultyUser?.departmentCode ||
  facultyUser?.department_code ||
  "";

if (!department && facultyUser?.departmentId) {
  try {
    const departmentResponse = await fetch(
      `${API_URL}/api/student/department/${facultyUser.departmentId}`
    );

    const departmentData =
      await departmentResponse.json();

    department =
      departmentData?.department?.name ||
      departmentData?.department?.code ||
      "";
  } catch (error) {
    console.error(
      "Unable to fetch department for PDF:",
      error
    );
  }
}

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Faculty Activity Report", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Faculty Name: ${facultyName}`, 14, 27);
  doc.text(`Faculty ID: ${facultyId}`, 14, 34);
  doc.text(`Department: ${department}`, 14, 41);
  doc.text(`Report Period: ${from} to ${to}`, 14, 48);

  const summary = facultyReport.summary || {};

  autoTable(doc, {
    startY: 56,
    head: [
      [
        "Total Tasks",
        "L1",
        "L2",
        "L3",
        "Completion",
      ],
    ],
    body: [
      [
        summary.totalTasks ?? 0,
        summary.l1Count ?? 0,
        summary.l2Count ?? 0,
        summary.l3Count ?? 0,
        `${summary.completionPercentage ?? 0}%`,
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  let currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("P1-P8 Daily Activity", 14, currentY);

  currentY += 5;

  const periods = facultyReport.periods || [];

  if (periods.length > 0) {
    const periodRows = periods.map((period) => {
      let activity = period.activityType || "Free";
      let details = "";
      let status = "";

      if (activity === "Class") {
        details = [
          period.subject,
          period.className,
          period.section,
          period.room
            ? `Room: ${period.room}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ");

        status = "CLASS";
      } else if (activity === "Task") {
        details = [
          period.taskName,
          period.taskDescription,
        ]
          .filter(Boolean)
          .join(" - ");

        status = period.statusLevel || "";
      } else {
        activity = "Free";
        details = "No class or task";
        status = "FREE";
      }

      return [
        `P${period.periodNo}`,
        period.time || "",
        activity,
        details,
        status,
      ];
    });

    autoTable(doc, {
      startY: currentY + 3,
      head: [
        [
          "Period",
          "Time",
          "Activity",
          "Details",
          "Status",
        ],
      ],
      body: periodRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: "top",
      },
      headStyles: {
        fontStyle: "bold",
      },
    });

    currentY = doc.lastAutoTable.finalY + 12;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      "P1-P8 period details are not available for this report.",
      14,
      currentY + 10
    );

    currentY += 22;
  }

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Task Details", 14, currentY);

  currentY += 5;

  const tasks = facultyReport.tasks || [];

  if (tasks.length > 0) {
    const taskRows = tasks.map((task) => [
      task.task_date || "",
      `P${task.period_no || ""}`,
      task.day_of_week || "",
      task.task_name || "",
      task.task_description || "",
      task.status_level || "",
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [
        [
          "Date",
          "Period",
          "Day",
          "Task",
          "Description",
          "Level",
        ],
      ],
      body: taskRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: "top",
      },
      headStyles: {
        fontStyle: "bold",
      },
    });
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      "No tasks recorded for this report period.",
      14,
      currentY + 10
    );
  }

  const fileDate =
    from === to
      ? from
      : `${from}_to_${to}`;

  doc.save(
    `Faculty_Report_${fileDate || "Report"}.pdf`
  );
};

const [taskForm, setTaskForm] = useState({
  taskDate: "",
  dayOfWeek: "Monday",
  periodNo: "1",
  taskName: "",
  taskDescription: "",
  statusLevel: "L1",
});



const [timetableForm, setTimetableForm] = useState({
  subject: "",
  className: "",
  section: "",
  room: "",
});
// =========================
// FACULTY TIMETABLE SETTINGS
// =========================

const periodTimes = {
  1: ["09:15 AM", "10:05 AM"],
  2: ["10:05 AM", "10:55 AM"],
  3: ["10:55 AM", "11:45 AM"],
  4: ["11:45 AM", "12:35 PM"],
  5: ["01:30 PM", "02:20 PM"],
  6: ["02:20 PM", "03:10 PM"],
  7: ["03:10 PM", "04:00 PM"],
  8: ["04:00 PM", "04:50 PM"],
};

const timetableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
  // =========================
  // STUDENT PORTAL
  // =========================

  const fetchStudentDepartments = async () => {
    try {
      setStudentError("");

      const response = await fetch(
        `${API_URL}/api/student/departments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to fetch departments"
        );
      }

      setStudentDepartments(data || []);
    } catch (error) {
      console.error("Student departments error:", error);
      setStudentError("Unable to load departments.");
    }
  };

  const fetchStudentAvailability = async (departmentId) => {
    if (!departmentId) {
      setStudentData(null);
      return;
    }

    try {
      setStudentLoading(true);
      setStudentError("");

      const response = await fetch(
        `${API_URL}/api/student/department/${departmentId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to fetch availability"
        );
      }

      setStudentData(data);
    } catch (error) {
      console.error("Student availability error:", error);
      setStudentData(null);
      setStudentError(
        error.message || "Unable to load availability."
      );
    } finally {
      setStudentLoading(false);
    }
  };

  const openStudentPortal = () => {
    setPage("student");
    window.history.pushState({}, "", "/student");
  };

  // Load departments whenever the Student Portal is opened.
  // This also fixes direct navigation to /student, where
  // openStudentPortal() is not called.
  useEffect(() => {
    if (page !== "student") {
      return;
    }

    fetchStudentDepartments();
  }, [page]);

  const handleStudentDepartmentChange = (e) => {
    const departmentId = e.target.value;

    setStudentDepartment(departmentId);
    fetchStudentAvailability(departmentId);
  };

  const handleStudentRefresh = () => {
    if (studentDepartment) {
      fetchStudentAvailability(studentDepartment);
    }
  };

  // Automatically refresh the selected department availability every 15 seconds.
  useEffect(() => {
    if (page !== "student" || !studentDepartment) {
      return;
    }

    const interval = setInterval(() => {
      fetchStudentAvailability(studentDepartment);
    }, 15000);

    return () => clearInterval(interval);
  }, [page, studentDepartment]);

  // =========================
  // HOD LOGIN
  // =========================

  const handleHodLogin = async (e) => {
    e.preventDefault();
    setHodError("");

    if (!hodId || !hodPassword) {
      setHodError("Please enter HOD ID and password.");
      return;
    }

    setHodLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hodId,
            password: hodPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setHodError(
          data.error ||
            "Invalid HOD ID or password."
        );
        return;
      }

      sessionStorage.setItem(
        "hodToken",
        data.token
      );

      sessionStorage.setItem(
        "hodUser",
        JSON.stringify(data.user)
      );

      setHodUser(data.user);
      setPage("hod-dashboard");

      window.history.pushState(
        {},
        "",
        "/"
      );
    } catch (error) {
      console.error(
        "HOD login error:",
        error
      );

      setHodError(
        "Unable to connect to the server."
      );
    } finally {
      setHodLoading(false);
    }
  };

  // =========================
  // HOD LOGOUT
  // =========================

  const handleHodLogout = () => {
    sessionStorage.removeItem(
      "hodToken"
    );

    sessionStorage.removeItem(
      "hodUser"
    );

    setHodUser(null);
    setHodId("");
    setHodPassword("");
    setHodStatus(null);
    setHodStatusMessage("");
    setHodExpectedReturn("");
    setStatusError("");
    setStatusSuccess("");

    setPage("home");

    window.history.pushState(
      {},
      "",
      "/"
    );
  };

  // =========================
  // FETCH HOD STATUS
  // =========================

  const fetchHodStatus = async () => {
    try {
      const token =
        sessionStorage.getItem("hodToken");

      const response = await fetch(
        `${API_URL}/api/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setHodStatus(
          data.status ||
            "Available"
        );

        setHodStatusMessage("");



        setHodExpectedReturn(
          data.expectedReturnTime ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "Fetch status error:",
        error
      );
    }
  };

  // =========================
  // UPDATE HOD STATUS
  // =========================

  const handleUpdateStatus =
    async (newStatus) => {
      setStatusError("");
      setStatusSuccess("");
      setStatusLoading(true);

      try {
        const token =
          sessionStorage.getItem(
            "hodToken"
          );

        const response =
          await fetch(
            `${API_URL}/api/status`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status: newStatus,

                message:
                  hodStatusMessage,

                expectedReturnTime:
                  newStatus ===
                  "Unavailable"
                    ? hodExpectedReturn
                    : "",
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setStatusError(
            data.error ||
              "Unable to update status."
          );

          return;
        }

        setHodStatus(
          data.status
        );

        setHodStatusMessage("");



        setHodExpectedReturn(
          data.expectedReturnTime ||
            ""
        );

        setStatusSuccess(
          "Status updated successfully."
        );
      } catch (error) {
        console.error(
          "Update status error:",
          error
        );

        setStatusError(
          "Unable to connect to the server."
        );
      } finally {
        setStatusLoading(false);
      }
    };

  useEffect(() => {
    if (
      page ===
      "hod-dashboard"
    ) {
      fetchHodStatus();
    }
  }, [page]);
    // =========================
  // FACULTY LOGIN
  // =========================

  const handleFacultyLogin =
    async (e) => {
      e.preventDefault();

      setFacultyError("");

      if (
        !facultyId ||
        !facultyPassword
      ) {
        setFacultyError(
          "Please enter Faculty ID and password."
        );

        return;
      }

      setFacultyLoading(true);

      try {
        const response =
          await fetch(
            `${API_URL}/api/auth/faculty-login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                facultyId:
                  facultyId
                    .trim()
                    .toUpperCase(),

                password:
                  facultyPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setFacultyError(
            data.error ||
              "Invalid Faculty ID or password."
          );

          return;
        }

        sessionStorage.setItem(
          "facultyToken",
          data.token
        );

        sessionStorage.setItem(
          "facultyUser",
          JSON.stringify(
            data.user
          )
        );

        setFacultyUser(
          data.user
        );

        setPage(
          "faculty-dashboard"
        );

        window.history.pushState(
          {},
          "",
          "/faculty"
        );
      } catch (error) {
        console.error(
          "Faculty login error:",
          error
        );

        setFacultyError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } finally {
        setFacultyLoading(false);
      }
    };

  // =========================
  // FACULTY LOGOUT
  // =========================

  const handleFacultyLogout =
    () => {
      sessionStorage.removeItem(
        "facultyToken"
      );

      sessionStorage.removeItem(
        "facultyUser"
      );

      setFacultyUser(null);
      setFacultyId("");
      setFacultyPassword("");

      setPage("home");

      window.history.pushState(
        {},
        "",
        "/"
      );
    };
    // =========================
// FACULTY TIMETABLE APIs
// =========================

const fetchFacultyTimetable = async () => {
  setTimetableLoading(true);
  setTimetableError("");

  try {
    const token = sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error || "Unable to load timetable."
      );
      return;
    }

    setFacultyTimetable(
      Array.isArray(data) ? data : []
    );
  } catch (error) {
    console.error(
      "Faculty timetable fetch error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  } finally {
    setTimetableLoading(false);
  }
};
const fetchFacultyTasks = async () => {
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");

    const response = await fetch(`${API_URL}/api/faculty/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch tasks");
    }

    setFacultyTasks(data);
  } catch (error) {
    console.error("Faculty tasks error:", error);
    setFacultyTasksError(error.message || "Unable to load tasks.");
  } finally {
    setFacultyTasksLoading(false);
  }
};


// FACULTY TASK DATE & FREE PERIOD LOGIC

const getDayFromTaskDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
};

const getFreeTaskPeriods = (dateValue, editingPeriod = null) => {
  const day = getDayFromTaskDate(dateValue);

  if (!day) {
    return [];
  }

  // Periods occupied by classes
  const occupiedClassPeriods = facultyTimetable
    .filter(
      (item) =>
        item.day_of_week === day &&
        Number(item.period_no) !== Number(editingPeriod)
    )
    .map((item) => Number(item.period_no));

  // Periods already used by tasks on the selected date
  const occupiedTaskPeriods = facultyTasks
    .filter(
      (task) =>
        task.task_date === dateValue &&
        Number(task.period_no) !== Number(editingPeriod)
    )
    .map((task) => Number(task.period_no));

  // Remove both class periods and already-used task periods
  const occupiedPeriods = [
    ...occupiedClassPeriods,
    ...occupiedTaskPeriods,
  ];

  return Object.keys(periodTimes)
    .map(Number)
    .filter(
      (periodNo) =>
        !occupiedPeriods.includes(periodNo)
    );
};

const saveFacultyTask = async () => {
  if (taskDateBlocked) {
    alert(
      facultyLeave
        ? "This date is marked as Leave. Task entry is disabled."
        : "This date is marked as Holiday. Task entry is disabled."
    );
    return;
  }
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");
    setFacultyTasksSuccess("");

    const url = editingTaskId
      ? `${API_URL}/api/faculty/tasks/${editingTaskId}`
      : `${API_URL}/api/faculty/tasks`;

    const method = editingTaskId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        taskDate: taskForm.taskDate,
        dayOfWeek:
          getDayFromTaskDate(taskForm.taskDate),
        periodNo: Number(taskForm.periodNo),
        taskName: taskForm.taskName,
        taskDescription: taskForm.taskDescription,
        statusLevel: taskForm.statusLevel,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save task");
    }

    setFacultyTasksSuccess(
      editingTaskId
        ? "Task updated successfully."
        : "Task added successfully."
    );

    setEditingTaskId(null);

    setTaskForm({
      taskDate: "",
      dayOfWeek: "",
      periodNo: "",
      taskName: "",
      taskDescription: "",
      statusLevel: "L1",
    });

    await fetchFacultyTasks();
  } catch (error) {
    console.error("Save faculty task error:", error);
    setFacultyTasksError(error.message || "Unable to save task.");
  } finally {
    setFacultyTasksLoading(false);
  }
};

const deleteFacultyTask = async (taskId) => {
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");
    setFacultyTasksSuccess("");

    const response = await fetch(`${API_URL}/api/faculty/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete task");
    }

    setFacultyTasksSuccess("Task deleted successfully.");

    await fetchFacultyTasks();
  } catch (error) {
    console.error("Delete faculty task error:", error);
    setFacultyTasksError(error.message || "Unable to delete task.");
  } finally {
    setFacultyTasksLoading(false);
  }
};

const startEditingFacultyTask = (task) => {
  setEditingTaskId(task.id);

  setTaskForm({
    taskDate: task.task_date || "",
    dayOfWeek: task.day_of_week || "Monday",
    periodNo: String(task.period_no || 1),
    taskName: task.task_name || "",
    taskDescription: task.task_description || "",
    statusLevel: task.status_level || "L1",
  });

  setFacultyTasksError("");
  setFacultyTasksSuccess("");
};

const cancelEditingFacultyTask = () => {
  setEditingTaskId(null);

  setTaskForm({
    taskDate: "",
    dayOfWeek: "Monday",
    periodNo: "1",
    taskName: "",
    taskDescription: "",
    statusLevel: "L1",
  });

  setFacultyTasksError("");
  setFacultyTasksSuccess("");
};
// =====================================================
// FETCH FACULTY CURRENT STATUS
// =====================================================

const fetchFacultyCurrentStatus = async () => {
  try {
    setFacultyStatusLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    if (!token) {
      throw new Error(
        "Faculty session expired"
      );
    }

    const response = await fetch(
      `${API_URL}/api/faculty/current-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to fetch current status"
      );
    }

    setFacultyCurrentStatus(data);

  } catch (error) {
    console.error(
      "Faculty current status error:",
      error
    );

    setFacultyCurrentStatus({
      status: "Unavailable",
    });

  } finally {
    setFacultyStatusLoading(false);
  }
};

// =====================================================
// FETCH FACULTY LEAVE / HOLIDAY FOR SELECTED DATE
// =====================================================

const fetchFacultyLeaveHoliday = async (date) => {
  if (!facultyUser || !date) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const leaveResponse = await fetch(
      `${API_URL}/api/faculty/leave?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const leaveData =
      await leaveResponse.json();

    if (leaveResponse.ok) {
      setFacultyLeave(
        leaveData.leave || null
      );

      setFacultyLeaveReason(
        leaveData.leave?.reason || ""
      );
    }

    const holidayResponse = await fetch(
      `${API_URL}/api/holidays?date=${date}`
    );

    const holidayData =
      await holidayResponse.json();

    if (holidayResponse.ok) {
      setCollegeHoliday(
        holidayData.holiday || null
      );

      setHolidayName(
        holidayData.holiday?.holiday_name || ""
      );

      setHolidayDescription(
        holidayData.holiday?.description || ""
      );
    }

  } catch (error) {
    console.error(
      "Faculty leave/holiday fetch error:",
      error
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// MARK FACULTY LEAVE
// =====================================================

const markFacultyLeave = async () => {
  if (!facultySelectedDate) {
    alert("Please select a date.");
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveDate: facultySelectedDate,
          reason: facultyLeaveReason || "",
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to mark leave"
      );
    }

    alert("Leave marked successfully.");

    await fetchFacultyLeaveHoliday(
      facultySelectedDate
    );

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Mark leave error:",
      error
    );

    alert(
      error.message ||
      "Unable to mark leave."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// CANCEL FACULTY LEAVE
// =====================================================

const cancelFacultyLeave = async () => {
  if (!facultySelectedDate) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/leave/${facultySelectedDate}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to cancel leave"
      );
    }

    alert(
      "Leave cancelled successfully."
    );

    setFacultyLeave(null);
    setFacultyLeaveReason("");

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Cancel leave error:",
      error
    );

    alert(
      error.message ||
      "Unable to cancel leave."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// MARK COLLEGE HOLIDAY
// =====================================================

const markCollegeHoliday = async () => {
  if (!facultySelectedDate) {
    alert("Please select a date.");
    return;
  }

  if (!holidayName.trim()) {
    alert("Please enter the holiday name.");
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/holidays`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          holidayDate: facultySelectedDate,
          holidayName: holidayName.trim(),
          description: holidayDescription.trim(),
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to mark holiday"
      );
    }

    alert(
      "College holiday marked successfully."
    );

    await fetchFacultyLeaveHoliday(
      facultySelectedDate
    );

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Mark holiday error:",
      error
    );

    alert(
      error.message ||
      "Unable to mark holiday."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// CANCEL COLLEGE HOLIDAY
// =====================================================

const cancelCollegeHoliday = async () => {
  if (!facultySelectedDate) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/holidays/${facultySelectedDate}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to cancel holiday"
      );
    }

    alert(
      "College holiday cancelled successfully."
    );

    setCollegeHoliday(null);
    setHolidayName("");
    setHolidayDescription("");

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Cancel holiday error:",
      error
    );

    alert(
      error.message ||
      "Unable to cancel holiday."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};

const fetchFacultyHodAvailability = async () => {
  if (!facultyUser?.departmentId) {
    return;
  }

  try {
    setFacultyHodLoading(true);
    setFacultyHodError("");

    const response = await fetch(`${API_URL}/api/student/department/${facultyUser.departmentId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch HOD availability");
    }

    setFacultyHodAvailability(data.hod || null);
  } catch (error) {
    console.error("Faculty HOD availability error:", error);
    setFacultyHodAvailability(null);
    setFacultyHodError(error.message || "Unable to load HOD availability.");
  } finally {
    setFacultyHodLoading(false);
  }
};

const resetTimetableForm = () => {
  setEditingPeriod(null);

  setTimetableForm({
    subject: "",
    className: "",
    section: "",
    room: "",
  });
};


const openTimetableForm = (periodNo) => {
  const existing = facultyTimetable.find(
    (item) =>
      item.day_of_week === timetableDay &&
      Number(item.period_no) === periodNo
  );

  setTimetableError("");
  setTimetableSuccess("");
  setEditingPeriod(periodNo);

  setTimetableForm({
    subject: existing?.subject || "",
    className: existing?.class_name || "",
    section: existing?.section || "",
    room: existing?.room || "",
  });
};


const handleTimetableSave = async (e) => {
  e.preventDefault();

  setTimetableError("");
  setTimetableSuccess("");

  if (!timetableForm.subject.trim()) {
    setTimetableError(
      "Please enter the subject."
    );
    return;
  }

  try {
    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          dayOfWeek: timetableDay,
          periodNo: editingPeriod,

          subject:
            timetableForm.subject,

          className:
            timetableForm.className,

          section:
            timetableForm.section,

          room:
            timetableForm.room,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error ||
          "Unable to save timetable."
      );
      return;
    }

    setTimetableSuccess(
      "Class saved successfully."
    );

    resetTimetableForm();

    await fetchFacultyTimetable();

  } catch (error) {
    console.error(
      "Faculty timetable save error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  }
};


const handleTimetableDelete = async (id) => {

  if (
    !window.confirm(
      "Delete this class from the timetable?"
    )
  ) {
    return;
  }

  setTimetableError("");
  setTimetableSuccess("");

  try {
    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error ||
          "Unable to delete timetable entry."
      );
      return;
    }

    setTimetableSuccess(
      "Class deleted successfully."
    );

    resetTimetableForm();

    await fetchFacultyTimetable();

  } catch (error) {
    console.error(
      "Faculty timetable delete error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  }
};



useEffect(() => {
  if (
    page === "faculty-dashboard" &&
    facultyUser
  ) {
    fetchFacultyTimetable();
    fetchFacultyCurrentStatus();
    fetchFacultyHodAvailability();
    fetchFacultyTasks();
    fetchFacultyLeaveHoliday(
      facultySelectedDate
    );
  }
}, [
  page,
  facultyUser,
  facultySelectedDate,
]);


// Automatically refresh current availability every 15 seconds
useEffect(() => {
  if (
    page !== "faculty-dashboard" ||
    !facultyUser
  ) {
    return;
  }

  const interval = setInterval(() => {
    fetchFacultyCurrentStatus();
  }, 15000);

  return () => {
    clearInterval(interval);
  };
}, [page, facultyUser]);


useEffect(() => {
  if (
    page !== "faculty-dashboard" ||
    !facultyUser
  ) {
    return;
  }

  const interval = setInterval(() => {
    fetchFacultyHodAvailability();
    fetchFacultyTasks();
  }, 15000);

  return () => {
    clearInterval(interval);
  };
}, [page, facultyUser]);


// =========================
// ADMIN
// =========================

const handleAdminLogin =
  (user) => {
    sessionStorage.setItem(
      "adminUser",
      JSON.stringify(user)
    );

    setPage(
      "admin-dashboard"
    );

    window.history.pushState(
      {},
      "",
      "/admin"
    );
  };

const handleAdminLogout =
  () => {
    sessionStorage.removeItem(
      "adminToken"
    );

    sessionStorage.removeItem(
      "adminUser"
    );

    setPage("home");

    window.history.pushState(
      {},
      "",
      "/"
    );
  };
  // ============================================================
  // HOME
  // ============================================================

  if (page === "home") {
    return (
      <>
        <style>
          {GLOBAL_STYLES +
            HOME_STYLES}
        </style>

        <div className="home-page">

          <header className="home-header">
  <div className="brand">
    <img
      src={facultyDeskLogo}
      alt="Faculty Desk"
      className="faculty-desk-logo"
    />
  </div>

  <div className="system-pill">
    Secure Academic Portal
  </div>
</header>

          <main className="home-content">

            <section className="hero">

              <div className="hero-badge">
                ✨ Welcome to the Campus Portal
              </div>

              <h1>
                Academic{" "}
                <span>
                  Availability
                </span>
                <br />
                Management
              </h1>

              <p>
                A unified platform for
                HODs, faculty members
                and administrators to
                manage academic
                availability and campus
                activities.
              </p>

            </section>

            <section className="login-grid">

              {/* HOD */}

              <div
                className="login-option"
                onClick={() => {
                  setPage(
                    "hod-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );
                }}
              >

                <div className="option-icon">
                  👨‍💼
                </div>

                <div className="option-label">
                  Department
                </div>

                <div className="option-title">
                  HOD Portal
                </div>

                <div className="option-description">
                  Update HOD availability
                  and manage
                  department-level
                  information.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "hod-login"
                    );
                  }}
                >
                  HOD Login →
                </button>

              </div>

              {/* FACULTY */}

              <div
                className="login-option faculty"
                onClick={() => {
                  setPage(
                    "faculty-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/faculty"
                  );
                }}
              >

                <div className="option-icon">
                  👨‍🏫
                </div>

                <div className="option-label">
                  Academic Staff
                </div>

                <div className="option-title">
                  Faculty Portal
                </div>

                <div className="option-description">
                  Manage your
                  availability,
                  timetable and
                  academic activities.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "faculty-login"
                    );

                    window.history.pushState(
                      {},
                      "",
                      "/faculty"
                    );
                  }}
                >
                  Faculty Login →
                </button>

              </div>

              {/* ADMIN */}

              <div
                className="login-option admin"
                onClick={() => {
                  setPage(
                    "admin-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/admin"
                  );
                }}
              >

                <div className="option-icon">
                  🛡️
                </div>

                <div className="option-label">
                  System Management
                </div>

                <div className="option-title">
                  Admin Portal
                </div>

                <div className="option-description">
                  Manage departments,
                  HODs, faculty and
                  system configuration.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "admin-login"
                    );

                    window.history.pushState(
                      {},
                      "",
                      "/admin"
                    );
                  }}
                >
                  Admin Login →
                </button>

              </div>

              {/* STUDENT */}

              <div
                className="login-option student"
                onClick={
                  openStudentPortal
                }
              >

                <div className="option-icon">
                  🎓
                </div>

                <div className="option-label">
                  Campus Access
                </div>

                <div className="option-title">
                  Student Portal
                </div>

                <div className="option-description">
                  Check HOD and faculty
                  availability by
                  selecting your
                  department.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    openStudentPortal();
                  }}
                >
                  View Availability →
                </button>

              </div>

            </section>

          </main>

          <footer className="home-footer">

            <strong>
              Academic Availability System
            </strong>

            {" "}• Secure Campus Platform

          </footer>

        </div>
      </>
    );
  }

  // ============================================================
  // STUDENT PORTAL
  // ============================================================

  if (page === "student") {
    return (
      <>
        <style>{`

          ${GLOBAL_STYLES}

          .student-page {
            min-height: 100vh;

            background:
              radial-gradient(
                circle at 10% 10%,
                rgba(79,70,229,.15),
                transparent 30%
              ),

              radial-gradient(
                circle at 90% 15%,
                rgba(14,165,233,.14),
                transparent 28%
              ),

              linear-gradient(
                135deg,
                #f8fafc,
                #eef2ff,
                #eff6ff
              );

            padding-bottom: 50px;
          }

          .student-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 22px 6%;

            background:
              rgba(255,255,255,.72);

            border-bottom:
              1px solid
              rgba(148,163,184,.18);

            backdrop-filter: blur(12px);
          }

          .student-brand {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .student-logo {
            width: 48px;
            height: 48px;

            border-radius: 15px;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #2563eb
              );

            color: white;

            font-size: 24px;

            box-shadow:
              0 10px 25px
              rgba(37,99,235,.20);
          }

          .student-brand-title {
            color: #172554;
            font-size: 18px;
            font-weight: 800;
          }

          .student-brand-subtitle {
            color: #64748b;
            font-size: 11px;
            margin-top: 3px;
          }

          .student-back {
            border:
              1px solid #dbe3ed;

            background: white;

            color: #475569;

            border-radius: 11px;

            padding: 10px 15px;

            font-weight: 700;

            cursor: pointer;
          }

          .student-content {
            width: 100%;
            max-width: 1050px;

            margin: auto;

            padding: 45px 22px;
          }

          .student-hero {
            text-align: center;
            margin-bottom: 30px;
          }

          .student-badge {
            display: inline-block;

            padding: 8px 14px;

            border-radius: 999px;

            background: #eef2ff;

            color: #4f46e5;

            font-size: 11px;

            font-weight: 800;

            margin-bottom: 14px;
          }

          .student-hero h1 {
            margin: 0;

            color: #172554;

            font-size:
              clamp(
                30px,
                5vw,
                48px
              );
          }

          .student-hero p {
            color: #64748b;

            max-width: 650px;

            margin:
              12px auto 0;

            line-height: 1.6;

            font-size: 14px;
          }

          .student-selector {
            max-width: 650px;

            margin:
              0 auto 30px;

            background:
              rgba(255,255,255,.94);

            padding: 24px;

            border-radius: 20px;

            border:
              1px solid
              rgba(148,163,184,.18);

            box-shadow:
              0 18px 45px
              rgba(15,23,42,.07);
          }

          .student-selector label {
            display: block;

            color: #334155;

            font-size: 12px;

            font-weight: 800;

            margin-bottom: 8px;
          }

          .student-select {
            width: 100%;

            height: 50px;

            padding: 0 14px;

            border-radius: 12px;

            border:
              1px solid #dbe3ed;

            background: #f8fafc;

            color: #0f172a;

            font-size: 14px;

            outline: none;
          }

          .student-select:focus {
            border-color: #6366f1;

            background: white;

            box-shadow:
              0 0 0 4px
              rgba(99,102,241,.10);
          }

          .student-loading {
            text-align: center;

            color: #64748b;

            padding: 25px;
          }

          .student-error {
            max-width: 650px;

            margin:
              15px auto;

            padding:
              12px 15px;

            border-radius: 12px;

            background: #fef2f2;

            border:
              1px solid #fecaca;

            color: #b91c1c;

            font-size: 13px;

            font-weight: 600;
          }

          .student-department-title {
            text-align: center;

            margin:
              25px 0;
          }

          .student-department-title h2 {
            margin: 0;

            color: #172554;

            font-size: 25px;
          }

          .student-department-title p {
            color: #64748b;

            margin-top: 6px;

            font-size: 13px;
          }

          .student-grid {
            display: grid;

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 20px;
          }

          .student-card {
            background:
              rgba(255,255,255,.95);

            border-radius: 20px;

            border:
              1px solid
              rgba(148,163,184,.18);

            padding: 24px;

            box-shadow:
              0 18px 45px
              rgba(15,23,42,.07);
          }

          .student-card-header {
            display: flex;

            align-items: center;

            justify-content:
              space-between;

            gap: 10px;

            margin-bottom: 18px;
          }

          .student-card-title {
            color: #172554;

            font-size: 19px;

            font-weight: 800;
          }

          .student-card-icon {
            width: 42px;
            height: 42px;

            border-radius: 13px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #eef2ff;

            font-size: 20px;
          }

          .student-person {
            padding: 17px;

            border-radius: 15px;

            background: #f8fafc;

            border:
              1px solid #eef2f7;
          }

          .student-person-name {
            color: #0f172a;

            font-weight: 800;

            font-size: 16px;
          }

          .student-person-id {
            color: #64748b;

            font-size: 11px;

            margin-top: 4px;
          }

          .student-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
            margin-top: 12px;
          }

          .student-status.available {
            background: #dcfce7;
            color: #15803d;
          }

          .student-status.unavailable {
            background: #fee2e2;
            color: #b91c1c;
          }

          .student-status.not-configured {
            background: #dc2626;
            color: white;
            border: 1px solid #b91c1c;
          }

          .student-info {
            margin-top: 10px;

            color: #64748b;

            font-size: 12px;

            line-height: 1.6;
          }

          .student-refresh {
            display: block;

            margin:
              25px auto 0;

            border: none;

            border-radius: 12px;

            padding:
              12px 20px;

            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #2563eb
              );

            color: white;

            font-weight: 800;

            cursor: pointer;
          }

          .student-faculty-list {
            display: flex;

            flex-direction: column;

            gap: 12px;
          }

          .student-empty {
            padding: 20px;

            text-align: center;

            color: #64748b;

            background: #f8fafc;

            border-radius: 14px;

            font-size: 13px;
          }

          @media (max-width: 750px) {

            .student-grid {
              grid-template-columns:
                1fr;
            }

            .student-header {
              padding:
                18px 20px;
            }

            .student-content {
              padding-top: 30px;
            }
          }

          @media (max-width: 480px) {

            .student-brand-title {
              font-size: 15px;
            }

            .student-brand-subtitle {
              display: none;
            }

            .student-back {
              padding:
                8px 11px;

              font-size: 11px;
            }

            .student-selector,
            .student-card {
              padding: 18px;
            }
          }

        `}</style>

        <div className="student-page">

          <header className="student-header">

            <div className="student-brand">

              <div className="student-logo">
                🎓
              </div>

              <div>

                <div className="student-brand-title">
                  Academic Availability System
                </div>

                <div className="student-brand-subtitle">
                  Student Portal
                </div>

              </div>

            </div>

            <button
              className="student-back"
              onClick={() => {

                setPage("home");

                setStudentDepartment(
                  ""
                );

                setStudentData(
                  null
                );

                setStudentError(
                  ""
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );
              }}
            >
              ← Home
            </button>

          </header>

          <main className="student-content">

            <section className="student-hero">

              <div className="student-badge">
                🔎 CHECK AVAILABILITY
              </div>

              <h1>
                Faculty & HOD Availability
              </h1>

              <p>
                Select your department to view
                the current availability of the
                HOD and faculty members.
              </p>

            </section>

            <div className="student-selector">

              <label>
                SELECT DEPARTMENT
              </label>

              <select
                className="student-select"
                value={
                  studentDepartment
                }
                onChange={
                  handleStudentDepartmentChange
                }
              >

                <option value="">
                  Select your department
                </option>

                {studentDepartments.map(
                  (department) => (
                    <option
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {department.code}
                      {" — "}
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {studentError && (
              <div className="student-error">
                ⚠ {studentError}
              </div>
            )}

            {studentLoading && (
              <div className="student-loading">
                Loading availability...
              </div>
            )}

            {studentData &&
              !studentLoading && (
                <>
                  <div className="student-department-title">

                    <h2>
                      {
                        studentData
                          .department
                          .name
                      }
                    </h2>

                    <p>
                      Department Code:{" "}
                      {
                        studentData
                          .department
                          .code
                      }
                    </p>

                  </div>

                  <div className="student-grid">

                    {/* HOD CARD */}

                    <div className="student-card">

                      <div className="student-card-header">

                        <div className="student-card-title">
                          HOD Availability
                        </div>

                        <div className="student-card-icon">
                          👨‍💼
                        </div>

                      </div>

                      {studentData.hod ? (

                        <div className="student-person">

                          <div className="student-person-name">
                            {
                              studentData
                                .hod
                                .name
                            }
                          </div>

                          <div className="student-person-id">
                            HOD ID:{" "}
                            {
                              studentData
                                .hod
                                .hodId
                            }
                          </div>

                          <div
                            className={
                              `student-status ${
                                studentData.hod.status ===
                                "Available"
                                  ? "available"
                                  : studentData.hod.status ===
                                    "In Meeting"
                                  ? "meeting"
                                  : studentData.hod.status ===
                                    "Away"
                                  ? "away"
                                  : studentData.hod.status ===
                                    "Unavailable"
                                  ? "unavailable"
                                  : "default"
                              }`
                            }
                          >

                            {
                              studentData
                                .hod
                                .status ===
                              "Available"
                                ? "🟢"
                                : studentData
                                    .hod
                                    .status ===
                                  "In Meeting"
                                ? "🟡"
                                : studentData
                                    .hod
                                    .status ===
                                  "Away"
                                ? "🔵"
                                : "🔴"
                            }

                            {
                              studentData
                                .hod
                                .status
                            }

                          </div>

                          {
                            studentData
                              .hod
                              .message && (
                              <div className="student-info">

                                <strong>
                                  Message:
                                </strong>{" "}

                                {
                                  studentData
                                    .hod
                                    .message
                                }

                              </div>
                            )
                          }

                          {
                            studentData
                              .hod
                              .expectedReturnTime && (
                              <div className="student-info">

                                <strong>
                                  Expected Return:
                                </strong>{" "}

                                {
                                  studentData
                                    .hod
                                    .expectedReturnTime
                                }

                              </div>
                            )
                          }

                        </div>

                      ) : (

                        <div className="student-empty">
                          HOD information is not
                          available.
                        </div>

                      )}

                    </div>

                    {/* FACULTY CARD */}

                    <div className="student-card">

                      <div className="student-card-header">

                        <div className="student-card-title">
                          Faculty Availability
                        </div>

                        <div className="student-card-icon">
                          👨‍🏫
                        </div>

                      </div>

                      <div className="student-faculty-list">

                        {studentData.faculty &&
                        studentData.faculty.length >
                          0 ? (

                          studentData.faculty.map(
                            (faculty) => (
                              <div
                                className="student-person"
                                key={faculty.id}
                              >

                                <div className="student-person-name">
                                  {faculty.name}
                                </div>

                                <div
                                  className={`student-status ${
                                    faculty.status === "Available"
                                      ? "available"
                                      : faculty.status === "Not Configured"
                                      ? "not-configured"
                                      : "unavailable"
                                  }`}
                                >
                                  {faculty.status === "Available"
                                    ? "🟢"
                                    : faculty.status === "Not Configured"
                                    ? "⚪"
                                    : "🔴"}

                                  {faculty.status}
                                </div>

                                {faculty.message && (
                                  <div className="student-info">
                                    <strong>Message:</strong>{" "}
                                    {faculty.message}
                                  </div>
                                )}

                                {faculty.expectedReturnTime && (
                                  <div className="student-info">
                                    <strong>Expected Return:</strong>{" "}
                                    {faculty.expectedReturnTime}
                                  </div>
                                )}

                                {faculty.periodNo && (
                                  <div className="student-info">
                                    <strong>Period:</strong>{" "}
                                    P{faculty.periodNo}
                                  </div>
                                )}

                                {faculty.subject && (
                                  <div className="student-info">
                                    <strong>Subject:</strong>{" "}
                                    {faculty.subject}
                                  </div>
                                )}

                                {faculty.className && (
                                  <div className="student-info">
                                    <strong>Class:</strong>{" "}
                                    {faculty.className}
                                  </div>
                                )}

                                {faculty.section && (
                                  <div className="student-info">
                                    <strong>Section:</strong>{" "}
                                    {faculty.section}
                                  </div>
                                )}

                                {faculty.room && (
                                  <div className="student-info">
                                    <strong>Room:</strong>{" "}
                                    {faculty.room}
                                  </div>
                                )}

                              </div>
                            )
                          )

                        ) : (

                          <div className="student-empty">
                            No active faculty found
                            for this department.
                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                  <button
                    className="student-refresh"
                    onClick={
                      handleStudentRefresh
                    }
                    disabled={
                      studentLoading
                    }
                  >
                    🔄 Refresh Availability
                  </button>

                </>
              )}

          </main>

        </div>
      </>
    );
  }

  // ============================================================
  // HOD LOGIN
  // ============================================================

  if (page === "hod-login") {
        return (
      <>
        <style>
          {GLOBAL_STYLES +
            COMMON_LOGIN_STYLES}
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Login
            </h1>

            <p className="login-subtitle">
              Sign in to manage HOD availability.
            </p>

            <form
              onSubmit={
                handleHodLogin
              }
            >

              <label>
                HOD ID
              </label>

              <input
                type="text"
                placeholder="Enter HOD ID"
                value={hodId}
                onChange={(e) =>
                  setHodId(
                    e.target.value
                  )
                }
                autoComplete="username"
              />

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={hodPassword}
                onChange={(e) =>
                  setHodPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
              />

              {hodError && (
                <div className="login-error">
                  ⚠ {hodError}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  hodLoading
                }
              >
                {hodLoading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            <button
              style={{
                background:
                  "#64748b",
              }}
              onClick={() => {
                setPage(
                  "home"
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );
              }}
            >
              ← Back
            </button>

          </div>

        </div>
      </>
    );
  }

  // ============================================================
  // FACULTY LOGIN
  // ============================================================

  if (
    page ===
    "faculty-login"
  ) {

    return (
      <>
        <style>
          {
            GLOBAL_STYLES +
            FACULTY_STYLES
          }
        </style>

        <div className="faculty-login-page">

          <div className="faculty-bg-circle faculty-circle-one" />

          <div className="faculty-bg-circle faculty-circle-two" />

          <div className="faculty-login-wrapper">

            <div className="faculty-brand-panel">

              <div className="faculty-brand-content">

                <div className="faculty-brand-icon">
                  👨‍🏫
                </div>

                <h2>
                  Faculty
                  <br />
                  Academic Portal
                </h2>

                <p>
                  Manage your academic
                  availability, timetable
                  and faculty activities
                  from one secure platform.
                </p>

              </div>

              <div className="faculty-feature-list">

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Availability Management

                </div>

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Timetable Management

                </div>

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Academic Activities

                </div>

              </div>

            </div>

            <div className="faculty-form-panel">

              <div className="faculty-form-top">

                <div className="faculty-welcome">
                  Welcome Back
                </div>

                <h1>
                  Faculty Login
                </h1>

                <p className="faculty-form-subtitle">
                  Sign in to access your faculty dashboard.
                </p>

              </div>

              <form
                onSubmit={
                  handleFacultyLogin
                }
              >

                <div className="faculty-field">

                  <label>
                    FACULTY ID
                  </label>

                  <div className="faculty-input-wrapper">

                    <span className="faculty-input-icon">
                      👤
                    </span>

                    <input
                      className="faculty-input"
                      type="text"
                      placeholder="Enter your Faculty ID"
                      value={
                        facultyId
                      }
                      onChange={(e) =>
                        setFacultyId(
                          e.target.value
                        )
                      }
                      autoComplete="username"
                    />

                  </div>

                </div>

                <div className="faculty-field">

                  <label>
                    PASSWORD
                  </label>

                  <div className="faculty-input-wrapper">

                    <span className="faculty-input-icon">
                      🔒
                    </span>

                    <input
                      className="faculty-input"
                      type="password"
                      placeholder="Enter your password"
                      value={
                        facultyPassword
                      }
                      onChange={(e) =>
                        setFacultyPassword(
                          e.target.value
                        )
                      }
                      autoComplete="current-password"
                    />

                  </div>

                </div>

                {facultyError && (
                  <div className="faculty-login-error">
                    ⚠ {facultyError}
                  </div>
                )}

                <button
                  className="faculty-login-button"
                  type="submit"
                  disabled={
                    facultyLoading
                  }
                >
                  {facultyLoading
                    ? "Signing in..."
                    : "Sign In to Faculty Portal →"}
                </button>

              </form>

              <button
                className="faculty-back-button"
                onClick={() => {

                  setPage(
                    "home"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );

                }}
              >
                ← Back to Login Selection
              </button>

              <div className="faculty-security-note">
                🔐 Secure Faculty Access
              </div>

            </div>

          </div>

        </div>
      </>
    );
  }

  // ============================================================
  // ADMIN LOGIN
  // ============================================================

  if (
    page ===
    "admin-login"
  ) {

    return (
      <AdminLogin
        onLogin={
          handleAdminLogin
        }
      />
    );
  }

  // ============================================================
  // HOD DASHBOARD
  // ============================================================

  if (
    page ===
    "hod-dashboard"
  ) {

    return (
      <>
        <style>
          {
            GLOBAL_STYLES +
            COMMON_LOGIN_STYLES
          }
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Dashboard
            </h1>

            <p className="login-subtitle">
              Welcome,{" "}
              {hodUser?.name ||
                "HOD"}
            </p>

            <p>
              <strong>
                Current Status:
              </strong>{" "}

              {hodStatus ===
              "Available"
                ? "🟢 Available"
                : hodStatus ===
                  "Unavailable"
                ? "🔴 Unavailable"
                : "Loading..."}
            </p>

            <label>
              Status Message
            </label>

            <input
              type="text"
              placeholder="e.g. In a meeting"
              value={
                hodStatusMessage
              }
              onChange={(e) =>
                setHodStatusMessage(
                  e.target.value
                )
              }
            />

            {hodStatus ===
              "Unavailable" && (
              <>
                <label>
                  Expected Return
                </label>

                <input
                  type="text"
                  placeholder="e.g. 3:00 PM"
                  value={
                    hodExpectedReturn
                  }
                  onChange={(e) =>
                    setHodExpectedReturn(
                      e.target.value
                    )
                  }
                />
              </>
            )}

            {statusError && (
              <div className="login-error">
                {statusError}
              </div>
            )}

            {statusSuccess && (
              <div
                style={{
                  color:
                    "#15803d",

                  background:
                    "#f0fdf4",

                  padding:
                    "10px",

                  borderRadius:
                    "10px",

                  marginTop:
                    "12px",
                }}
              >
                {
                  statusSuccess
                }
              </div>
            )}

            <button
              onClick={() =>
                handleUpdateStatus(
                  "Available"
                )
              }
              disabled={
                statusLoading
              }
            >
              🟢 Mark as Available
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(
                  "Unavailable"
                )
              }
              disabled={
                statusLoading
              }
            >
              🔴 Mark as Unavailable
            </button>

            <button
              onClick={
                handleHodLogout
              }
              style={{
                background:
                  "#64748b",
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </>
    );
  }

// ============================================================
// FACULTY DASHBOARD
// ============================================================

if (
  page ===
  "faculty-dashboard"
) {

  const dayEntries =
    facultyTimetable.filter(
      (item) =>
        item.day_of_week ===
        timetableDay
    );

  const getEntryForPeriod =
    (periodNo) =>
      dayEntries.find(
        (item) =>
          Number(item.period_no) ===
          periodNo
      );

  return (
    <>
      <style>
        {
          GLOBAL_STYLES +
          COMMON_LOGIN_STYLES
        }
      </style>

      <div
        className="login-page"
        style={{
          alignItems:
            "flex-start",
          padding:
            "35px 20px",
          overflowY:
            "auto",
        }}
      >

        <div
          className="login-card"
          style={{
            width: "100%",
            maxWidth:
              "1000px",
            margin:
              "0 auto",
          }}
        >

          {/* HEADER */}

          <h1>
            Faculty Dashboard
          </h1>

          <p
            className="login-subtitle"
          >
            Welcome,{" "}
            {facultyUser?.name ||
              "Faculty"}
          </p>


          {/* FACULTY INFORMATION */}

          <div
            style={{
              background:
                "#f8fafc",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "14px",
              padding: "16px",
              marginTop:
                "18px",
            }}
          >

            <div
              style={{
                color:
                  "#334155",
                marginBottom:
                  "8px",
              }}
            >

              <strong>
                Faculty ID:
              </strong>{" "}

              {
                facultyUser
                  ?.facultyId ||
                "-"
              }

            </div>


            <div
              style={{
                color:
                  "#334155",
                marginBottom:
                  "8px",
              }}
            >

              <strong>
                Department:
              </strong>{" "}

              {
                facultyUser
                  ?.department
                  ?.code ||
                "-"
              }

            </div>


            <div
              style={{
                color:
                  "#475569",
              }}
            >

              {
                facultyUser
                  ?.department
                  ?.name ||
                ""
              }

            </div>

          </div>


          {/* AVAILABILITY */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
{/* =====================================================
    FACULTY LEAVE / HOLIDAY MANAGEMENT
===================================================== */}

<div
  style={{
    marginBottom: "24px",
    padding: "20px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  }}
>
  <h2
    style={{
      margin: "0 0 16px",
      color: "#0f172a",
      fontSize: "20px",
    }}
  >
    📅 Leave & Holiday Management
  </h2>

  {/* DATE */}
  <div
    style={{
      marginBottom: "16px",
    }}
  >
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontWeight: "700",
        color: "#334155",
      }}
    >
      Select Date
    </label>

    <input
      type="date"
      value={facultySelectedDate}
      onChange={(e) => {
        const selectedDate =
          e.target.value;

        setFacultySelectedDate(
          selectedDate
        );

        fetchFacultyLeaveHoliday(
          selectedDate
        );
      }}
      style={{
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />
  </div>

  {/* CURRENT DATE STATUS */}
  {leaveHolidayLoading ? (
    <div
      style={{
        marginBottom: "16px",
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      Checking leave and holiday status...
    </div>
  ) : (
    <>
      {facultyLeave && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
          }}
        >
          <strong>
            🔵 Leave Marked
          </strong>

          {facultyLeave.reason && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "13px",
              }}
            >
              Reason:{" "}
              {facultyLeave.reason}
            </div>
          )}
        </div>
      )}

      {collegeHoliday && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#f5f3ff",
            border: "1px solid #ddd6fe",
            color: "#6d28d9",
          }}
        >
          <strong>
            🏖️ College Holiday
          </strong>

          <div
            style={{
              marginTop: "5px",
              fontSize: "13px",
            }}
          >
            {collegeHoliday.holiday_name}
          </div>

          {collegeHoliday.description && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "13px",
              }}
            >
              {collegeHoliday.description}
            </div>
          )}
        </div>
      )}
    </>
  )}

  {/* LEAVE SECTION */}
  <div
    style={{
      marginBottom: "20px",
      padding: "16px",
      borderRadius: "12px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <h3
      style={{
        margin: "0 0 12px",
        fontSize: "16px",
        color: "#1e40af",
      }}
    >
      🔵 Faculty Leave
    </h3>

    <input
      type="text"
      placeholder="Leave reason (optional)"
      value={facultyLeaveReason}
      onChange={(e) =>
        setFacultyLeaveReason(
          e.target.value
        )
      }
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
            <button
        type="button"
        onClick={markFacultyLeave}
        disabled={
          leaveHolidayLoading ||
          !!collegeHoliday
        }
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        📅 Mark Leave
      </button>

      {facultyLeave && (
        <button
          type="button"
          onClick={cancelFacultyLeave}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Leave
        </button>
      )}
    </div>
  </div>

  {/* HOLIDAY SECTION */}
  <div
    style={{
      padding: "16px",
      borderRadius: "12px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <h3
      style={{
        margin: "0 0 12px",
        fontSize: "16px",
        color: "#6d28d9",
      }}
    >
      🏖️ College Holiday
    </h3>

    <input
      type="text"
      placeholder="Holiday name"
      value={holidayName}
      onChange={(e) =>
        setHolidayName(
          e.target.value
        )
      }
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />

    <textarea
      placeholder="Holiday description (optional)"
      value={holidayDescription}
      onChange={(e) =>
        setHolidayDescription(
          e.target.value
        )
      }
      rows={3}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        resize: "vertical",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
            <button
        type="button"
        onClick={markCollegeHoliday}
        disabled={
          leaveHolidayLoading ||
          !!facultyLeave
        }
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#7c3aed",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        🏖️ Mark Holiday
      </button>

      {collegeHoliday && (
        <button
          type="button"
          onClick={cancelCollegeHoliday}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Holiday
        </button>
      )}
    </div>
  </div>
</div>
{/* MY CURRENT AVAILABILITY */}
<div
  style={{
    padding: "20px",
    borderRadius: "16px",
    background:
      facultyCurrentStatus?.status === "Holiday"
        ? "#f5f3ff"
        : facultyCurrentStatus?.status === "Leave"
        ? "#eff6ff"
        : facultyCurrentStatus?.status === "Unavailable"
        ? "#fef2f2"
        : facultyCurrentStatus?.status === "In Class"
        ? "#fef2f2"
        : "#f0fdf4",
    border:
      facultyCurrentStatus?.status === "Holiday"
        ? "1px solid #ddd6fe"
        : facultyCurrentStatus?.status === "Leave"
        ? "1px solid #bfdbfe"
        : facultyCurrentStatus?.status === "Unavailable"
        ? "1px solid #fecaca"
        : facultyCurrentStatus?.status === "In Class"
        ? "1px solid #fecaca"
        : "1px solid #bbf7d0",
  }}
>
  <h2
    style={{
      margin: "0 0 14px",
      color:
        facultyCurrentStatus?.status === "Holiday"
          ? "#6d28d9"
          : facultyCurrentStatus?.status === "Leave"
          ? "#1d4ed8"
          : facultyCurrentStatus?.status === "Unavailable"
          ? "#991b1b"
          : facultyCurrentStatus?.status === "In Class"
          ? "#991b1b"
          : "#166534",
      fontSize: "20px",
    }}
  >
    My Current Availability
  </h2>

  {facultyStatusLoading ? (
    <p>Checking current status...</p>
  ) : (
    <>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color:
            facultyCurrentStatus?.status === "Holiday"
              ? "#7c3aed"
              : facultyCurrentStatus?.status === "Leave"
              ? "#2563eb"
              : facultyCurrentStatus?.status === "Unavailable"
              ? "#dc2626"
              : facultyCurrentStatus?.status === "In Class"
              ? "#dc2626"
              : "#16a34a",
          marginBottom: "10px",
        }}
      >
        {facultyCurrentStatus?.status === "Holiday"
          ? "🏖️ HOLIDAY"
          : facultyCurrentStatus?.status === "Leave"
          ? "🔵 ON LEAVE"
          : facultyCurrentStatus?.status === "In Class"
          ? "🔴 IN CLASS"
          : facultyCurrentStatus?.status === "Unavailable"
          ? "🔴 UNAVAILABLE"
          : "🟢 AVAILABLE"}
      </div>

      {facultyCurrentStatus?.status === "Holiday" && (
        <div
          style={{
            color: "#6d28d9",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          🏖️{" "}
          {facultyCurrentStatus?.holidayName ||
            "College Holiday"}
        </div>
      )}

      {facultyCurrentStatus?.status === "Leave" && (
        <div
          style={{
            color: "#1d4ed8",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          🔵{" "}
          {facultyCurrentStatus?.leaveReason ||
            "Faculty is on leave."}
        </div>
      )}

      {facultyCurrentStatus?.status === "Unavailable" && (
        <div
          style={{
            color: "#991b1b",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          College is currently closed.
        </div>
      )}

      {facultyCurrentStatus?.periodNo && (
        <div
          style={{
            color: "#475569",
            lineHeight: "1.7",
          }}
        >
          <div>
            <strong>Period:</strong>{" "}
            P{facultyCurrentStatus.periodNo}
          </div>

          <div>
            <strong>Subject:</strong>{" "}
            {facultyCurrentStatus.subject || "-"}
          </div>

          <div>
            <strong>Class:</strong>{" "}
            {facultyCurrentStatus.className || "-"}
          </div>

          <div>
            <strong>Section:</strong>{" "}
            {facultyCurrentStatus.section || "-"}
          </div>

          <div>
            <strong>Room:</strong>{" "}
            {facultyCurrentStatus.room || "-"}
          </div>
        </div>
      )}
    </>
  )}
</div>
            {/* HOD AVAILABILITY */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  color: "#1e3a8a",
                  fontSize: "20px",
                }}
              >
                HOD Availability
              </h2>

              {facultyHodLoading ? (
                <p>Loading HOD availability...</p>
              ) : facultyHodAvailability ? (
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                    {facultyHodAvailability.name || "HOD"}
                  </div>
                  <div style={{ color: "#64748b", margin: "4px 0 12px" }}>
                    HOD ID: {facultyHodAvailability.hodId || "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: facultyHodAvailability.status === "Available" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {facultyHodAvailability.status === "Available"
                      ? "🟢 AVAILABLE"
                      : "🔴 NOT AVAILABLE"}
                  </div>
                  {facultyHodAvailability.message && (
                    <div style={{ marginTop: "10px", color: "#475569" }}>
                      <strong>Message:</strong> {facultyHodAvailability.message}
                    </div>
                  )}
                  {facultyHodAvailability.expectedReturnTime && (
                    <div style={{ marginTop: "6px", color: "#475569" }}>
                      <strong>Expected Return:</strong> {facultyHodAvailability.expectedReturnTime}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "#64748b" }}>HOD availability is not available.</p>
              )}

              {facultyHodError && (
                <p style={{ color: "#dc2626", marginTop: "10px" }}>
                  {facultyHodError}
                </p>
              )}
            </div>

          </div>


          {/* TIMETABLE */}

          <div
            style={{
              marginTop:
                "24px",
              padding:
                "20px",
              borderRadius:
                "16px",
              background:
                "linear-gradient(135deg,#eff6ff,#f8fafc)",
              border:
                "1px solid #dbeafe",
            }}
          >

            <h2
              style={{
                margin:
                  "0 0 6px",
                color:
                  "#172554",
                fontSize:
                  "22px",
              }}
            >
              My Timetable
            </h2>


            <p
              style={{
                margin:
                  "0 0 16px",
                color:
                  "#64748b",
                fontSize:
                  "14px",
              }}
            >
              Add only the periods
              where you have classes.
              Other periods are
              automatically treated
              as free periods.
            </p>


            {/* DAYS */}

            <div
              style={{
                display:
                  "flex",
                gap: "8px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "18px",
              }}
            >

              {timetableDays.map(
                (day) => (

                  <button
                    key={day}
                    type="button"
                    onClick={() => {

                      setTimetableDay(
                        day
                      );

                      resetTimetableForm();

                      setTimetableError(
                        ""
                      );

                      setTimetableSuccess(
                        ""
                      );

                    }}
                    style={{
                      width:
                        "auto",
                      marginTop:
                        0,
                      padding:
                        "9px 15px",
                      borderRadius:
                        "10px",
                      border:
                        "1px solid #cbd5e1",
                      background:
                        timetableDay ===
                        day
                          ? "#2563eb"
                          : "white",
                      color:
                        timetableDay ===
                        day
                          ? "white"
                          : "#334155",
                    }}
                  >
                    {day}
                  </button>

                )
              )}

            </div>


            {/* PERIODS */}

            {timetableLoading ? (

              <p
                style={{
                  color:
                    "#64748b",
                }}
              >
                Loading timetable...
              </p>

            ) : (

              <div
                style={{
                  display:
                    "grid",
                  gap: "10px",
                }}
              >

                {Array.from(
                  {
                    length: 8,
                  },
                  (
                    _,
                    index
                  ) =>
                    index + 1
                ).map(
                  (periodNo) => {

                    const entry =
                      getEntryForPeriod(
                        periodNo
                      );

                    const [
                      start,
                      end,
                    ] =
                      periodTimes[
                        periodNo
                      ];

                    const isEditing =
                      editingPeriod ===
                      periodNo;

                    return (

                      <div
                        key={
                          periodNo
                        }
                        style={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "12px",
                          padding:
                            "14px",
                          background:
                            entry
                              ? "#eff6ff"
                              : "white",
                        }}
                      >

                        {/* PERIOD HEADER */}

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap:
                              "12px",
                            flexWrap:
                              "wrap",
                          }}
                        >

                          <div>

                            <strong
                              style={{
                                color:
                                  "#172554",
                              }}
                            >
                              P
                              {periodNo}
                            </strong>


                            <span
                              style={{
                                color:
                                  "#64748b",
                                marginLeft:
                                  "10px",
                                fontSize:
                                  "13px",
                              }}
                            >
                              {start}
                              {" – "}
                              {end}
                            </span>

                          </div>


                          {/* CLASS / FREE */}

                          {entry ? (

                            <div
                              style={{
                                flex:
                                  "1 1 350px",
                                color:
                                  "#334155",
                              }}
                            >

                              <strong>
                                {
                                  entry.subject
                                }
                              </strong>


                              {entry.class_name &&
                                ` · ${entry.class_name}`}


                              {entry.section &&
                                ` - ${entry.section}`}


                              {entry.room && (

                                <span
                                  style={{
                                    color:
                                      "#64748b",
                                  }}
                                >
                                  {" "}
                                  · Room{" "}
                                  {
                                    entry.room
                                  }
                                </span>

                              )}

                            </div>

                          ) : (

                            <span
                              style={{
                                color:
                                  "#16a34a",
                                fontWeight:
                                  700,
                              }}
                            >
                              🟢 Free Period
                            </span>

                          )}


                          {/* BUTTONS */}

                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "8px",
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                openTimetableForm(
                                  periodNo
                                )
                              }
                              style={{
                                width:
                                  "auto",
                                marginTop:
                                  0,
                                padding:
                                  "8px 12px",
                                background:
                                  entry
                                    ? "#2563eb"
                                    : "#0f766e",
                              }}
                            >
                              {entry
                                ? "Edit"
                                : "+ Add Class"}
                            </button>


                            {entry && (

                              <button
                                type="button"
                                onClick={() =>
                                  handleTimetableDelete(
                                    entry.id
                                  )
                                }
                                style={{
                                  width:
                                    "auto",
                                  marginTop:
                                    0,
                                  padding:
                                    "8px 12px",
                                  background:
                                    "#dc2626",
                                }}
                              >
                                Delete
                              </button>

                            )}

                          </div>

                        </div>


                        {/* ADD / EDIT FORM */}

                        {isEditing && (

                          <form
                            onSubmit={
                              handleTimetableSave
                            }
                            style={{
                              marginTop:
                                "14px",
                              padding:
                                "16px",
                              borderRadius:
                                "12px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit,minmax(180px,1fr))",
                                gap:
                                  "12px",
                              }}
                            >

                              {/* SUBJECT */}

                              <label
                                style={{
                                  color:
                                    "#334155",
                                  fontWeight:
                                    700,
                                  fontSize:
                                    "13px",
                                }}
                              >

                                Subject

                                <input
                                  value={
                                    timetableForm.subject
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setTimetableForm(
                                      {
                                        ...timetableForm,
                                        subject:
                                          e.target
                                            .value,
                                      }
                                    )
                                  }
                                  placeholder="Artificial Intelligence"
                                  style={{
                                    marginTop:
                                      "6px",
                                    width:
                                      "100%",
                                    padding:
                                      "11px",
                                    border:
                                      "1px solid #cbd5e1",
                                    borderRadius:
                                      "9px",
                                  }}
                                />

                              </label>


                              {/* CLASS */}

                              <label
                                style={{
                                  color:
                                    "#334155",
                                  fontWeight:
                                    700,
                                  fontSize:
                                    "13px",
                                }}
                              >

                                Class

                                <input
                                  value={
                                    timetableForm.className
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setTimetableForm(
                                      {
                                        ...timetableForm,
                                        className:
                                          e.target
                                            .value,
                                      }
                                    )
                                  }
                                  placeholder="III B.Tech"
                                  style={{
                                    marginTop:
                                      "6px",
                                    width:
                                      "100%",
                                    padding:
                                      "11px",
                                    border:
                                      "1px solid #cbd5e1",
                                    borderRadius:
                                      "9px",
                                  }}
                                />

                              </label>


                              {/* SECTION */}

                              <label
                                style={{
                                  color:
                                    "#334155",
                                  fontWeight:
                                    700,
                                  fontSize:
                                    "13px",
                                }}
                              >

                                Section

                                <input
                                  value={
                                    timetableForm.section
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setTimetableForm(
                                      {
                                        ...timetableForm,
                                        section:
                                          e.target
                                            .value,
                                      }
                                    )
                                  }
                                  placeholder="A"
                                  style={{
                                    marginTop:
                                      "6px",
                                    width:
                                      "100%",
                                    padding:
                                      "11px",
                                    border:
                                      "1px solid #cbd5e1",
                                    borderRadius:
                                      "9px",
                                  }}
                                />

                              </label>


                              {/* ROOM */}

                              <label
                                style={{
                                  color:
                                    "#334155",
                                  fontWeight:
                                    700,
                                  fontSize:
                                    "13px",
                                }}
                              >

                                Room

                                <input
                                  value={
                                    timetableForm.room
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setTimetableForm(
                                      {
                                        ...timetableForm,
                                        room:
                                          e.target
                                            .value,
                                      }
                                    )
                                  }
                                  placeholder="302"
                                  style={{
                                    marginTop:
                                      "6px",
                                    width:
                                      "100%",
                                    padding:
                                      "11px",
                                    border:
                                      "1px solid #cbd5e1",
                                    borderRadius:
                                      "9px",
                                  }}
                                />

                              </label>

                            </div>


                            {/* FORM BUTTONS */}

                            <div
                              style={{
                                display:
                                  "flex",
                                gap:
                                  "10px",
                                marginTop:
                                  "14px",
                              }}
                            >

                              <button
                                type="submit"
                                style={{
                                  width:
                                    "auto",
                                  marginTop:
                                    0,
                                  padding:
                                    "10px 18px",
                                }}
                              >
                                Save Class
                              </button>


                              <button
                                type="button"
                                onClick={
                                  resetTimetableForm
                                }
                                style={{
                                  width:
                                    "auto",
                                  marginTop:
                                    0,
                                  padding:
                                    "10px 18px",
                                  background:
                                    "#64748b",
                                }}
                              >
                                Cancel
                              </button>

                            </div>

                          </form>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

            )}


            {/* ERROR */}

            {timetableError && (

              <div
                className="login-error"
                style={{
                  marginTop:
                    "14px",
                }}
              >
                {timetableError}
              </div>

            )}


            {/* SUCCESS */}

            {timetableSuccess && (

              <div
                style={{
                  color:
                    "#15803d",
                  background:
                    "#f0fdf4",
                  padding:
                    "10px 12px",
                  borderRadius:
                    "10px",
                  marginTop:
                    "14px",
                  fontSize:
                    "13px",
                }}
              >
                {timetableSuccess}
              </div>

            )}

          </div>



{/* FACULTY TASK MANAGEMENT */}

<div
  style={{
    marginTop: "28px",
    padding: "24px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  }}
>
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  }}
>
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        Faculty Task Management
      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Record and track tasks completed during free periods.
      </p>
{taskDateBlocked && (
  <div
    style={{
      marginBottom: "16px",
      padding: "12px 14px",
      borderRadius: "10px",
      background: facultyLeave
        ? "#eff6ff"
        : "#f5f3ff",
      border: facultyLeave
        ? "1px solid #bfdbfe"
        : "1px solid #ddd6fe",
      color: facultyLeave
        ? "#1d4ed8"
        : "#6d28d9",
      fontWeight: "700",
      fontSize: "14px",
    }}
  >
    {facultyLeave
      ? "🔵 This date is marked as Leave. Task entry is disabled."
      : "🏖️ This date is marked as Holiday. Task entry is disabled."}
  </div>
)}
    </div>

    {editingTaskId && (
      <span
        style={{
          padding: "7px 12px",
          borderRadius: "999px",
          background: "#eff6ff",
          color: "#2563eb",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        Editing Task
      </span>
    )}
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "14px",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Task Date
      </label>

      <input
  type="date"
  value={taskForm.taskDate}
  disabled={taskDateBlocked}
  onChange={(e) => {
          const selectedDate = e.target.value;
          const selectedDay =
            getDayFromTaskDate(selectedDate);

          const freePeriods =
            getFreeTaskPeriods(
              selectedDate,
              editingTaskId
                ? taskForm.periodNo
                : null
            );

          setTaskForm({
            ...taskForm,
            taskDate: selectedDate,
            dayOfWeek: selectedDay,
            periodNo:
              freePeriods.length > 0
                ? String(freePeriods[0])
                : "",
          });
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Day
      </label>

      <div
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#f9fafb",
          color: taskForm.dayOfWeek
            ? "#111827"
            : "#9ca3af",
          minHeight: "40px",
        }}
      >
        {taskForm.dayOfWeek ||
          "Select task date"}
      </div>
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Period
      </label>

      <select
        value={taskForm.periodNo}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            periodNo: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        {getFreeTaskPeriods(
          taskForm.taskDate,
          editingTaskId
            ? taskForm.periodNo
            : null
        ).map((period) => (
          <option key={period} value={period}>
            P{period} — {periodTimes[period][0]} to{" "}
            {periodTimes[period][1]}
          </option>
        ))}

        {taskForm.taskDate &&
          getFreeTaskPeriods(
            taskForm.taskDate,
            editingTaskId
              ? taskForm.periodNo
              : null
          ).length === 0 && (
            <option value="">
              No Free Periods
            </option>
          )}
      </select>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
      marginTop: "14px",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Task Name
      </label>

      <input
        type="text"
        placeholder="Example: Student Counselling"
        value={taskForm.taskName}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            taskName: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Completion Level
      </label>

      <select
        value={taskForm.statusLevel}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            statusLevel: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <option value="L1">L1 — Partially Completed</option>
        <option value="L2">L2 — Moderately Completed</option>
        <option value="L3">L3 — Successfully Completed</option>
      </select>
    </div>
  </div>

  <div style={{ marginTop: "14px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151",
      }}
    >
      Task Description
    </label>

    <textarea
      rows="3"
      placeholder="Enter task details..."
      value={taskForm.taskDescription}
      onChange={(e) =>
        setTaskForm({
          ...taskForm,
          taskDescription: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        boxSizing: "border-box",
        resize: "vertical",
      }}
    />
  </div>

  {facultyTasksError && (
    <div
      style={{
        marginTop: "14px",
        padding: "10px 12px",
        borderRadius: "8px",
        background: "#fef2f2",
        color: "#b91c1c",
        fontSize: "14px",
      }}
    >
      {facultyTasksError}
    </div>
  )}

  {facultyTasksSuccess && (
    <div
      style={{
        marginTop: "14px",
        padding: "10px 12px",
        borderRadius: "8px",
        background: "#f0fdf4",
        color: "#15803d",
        fontSize: "14px",
      }}
    >
      {facultyTasksSuccess}
    </div>
  )}

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "16px",
      flexWrap: "wrap",
    }}
  >
    <button
  type="button"
  onClick={saveFacultyTask}
  disabled={
    facultyTasksLoading ||
    taskDateBlocked
  }
      disabled={
        facultyTasksLoading ||
        !taskForm.taskDate ||
        !taskForm.periodNo ||
        !taskForm.taskName.trim()
      }
      style={{
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        opacity:
          facultyTasksLoading ||
          !taskForm.taskDate ||
          !taskForm.periodNo ||
          !taskForm.taskName.trim()
            ? 0.6
            : 1,
      }}
    >
      {facultyTasksLoading
        ? "Saving..."
        : editingTaskId
        ? "Update Task"
        : "Add Task"}
    </button>

    {editingTaskId && (
      <button
        type="button"
        onClick={cancelEditingFacultyTask}
        style={{
          padding: "10px 18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#fff",
          color: "#374151",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    )}
  </div>

  <div
    style={{
      marginTop: "28px",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "20px",
    }}
  >
    <h3
      style={{
        margin: "0 0 14px",
        fontSize: "18px",
        color: "#111827",
      }}
    >
      My Tasks
    </h3>

    {facultyTasksLoading && facultyTasks.length === 0 ? (
      <p style={{ color: "#6b7280" }}>
        Loading tasks...
      </p>
    ) : facultyTasks.length === 0 ? (
      <p
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#6b7280",
          background: "#f9fafb",
          borderRadius: "10px",
        }}
      >
        No tasks recorded yet.
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {facultyTasks.map((task) => {
          const levelStyle =
            task.status_level === "L3"
              ? {
                  background: "#dcfce7",
                  color: "#15803d",
                  label: "L3 — Successfully Completed",
                }
              : task.status_level === "L2"
              ? {
                  background: "#fef3c7",
                  color: "#a16207",
                  label: "L2 — Moderately Completed",
                }
              : {
                  background: "#fee2e2",
                  color: "#b91c1c",
                  label: "L1 — Partially Completed",
                };

          return (
            <div
              key={task.id}
              style={{
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    {task.task_name}
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    {task.task_date} • {task.day_of_week} • P{task.period_no}
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      color: "#6b7280",
                      fontSize: "12px",
                    }}
                  >
                    {periodTimes[task.period_no]
                      ? periodTimes[task.period_no][0] +
                        " - " +
                        periodTimes[task.period_no][1]
                      : ""}
                  </div>
                </div>

                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: levelStyle.background,
                    color: levelStyle.color,
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {levelStyle.label}
                </span>
              </div>

              {task.task_description && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#f9fafb",
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {task.task_description}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => startEditingFacultyTask(task)}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #bfdbfe",
                    borderRadius: "7px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this task?"
                      )
                    ) {
                      deleteFacultyTask(task.id);
                    }
                  }}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #fecaca",
                    borderRadius: "7px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>

{/* FACULTY REPORTS */}
<div
  style={{
    marginTop: "24px",
    padding: "20px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  }}
>
  <h2
    style={{
      margin: "0 0 8px 0",
      fontSize: "20px",
      fontWeight: 800,
      color: "#0f172a",
    }}
  >
    📊 Faculty Reports
  </h2>

  <p
    style={{
      margin: "0 0 18px 0",
      color: "#64748b",
      fontSize: "13px",
    }}
  >
    View your complete P1–P8 daily activity report.
  </p>

  <div
    style={{
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "end",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#0f172a",
        }}
      >
        From Date
      </label>

      <input
        type="date"
        id="reportFromDate"
        style={{
          padding: "9px 11px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#0f172a",
        }}
      >
        To Date
      </label>

      <input
        type="date"
        id="reportToDate"
        style={{
          padding: "9px 11px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}
      />
    </div>

    <button
      type="button"
      onClick={async () => {
        const from =
          document.getElementById("reportFromDate")?.value;

        const to =
          document.getElementById("reportToDate")?.value;

        if (!from || !to) {
          alert("Please select both From Date and To Date.");
          return;
        }

        try {
          const token =
            sessionStorage.getItem("facultyToken");

          const response = await fetch(
            `${API_URL}/api/faculty/reports?from=${from}&to=${to}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || "Unable to fetch report"
            );
          }

          setFacultyReport(data);
        } catch (error) {
          console.error(
            "Faculty report error:",
            error
          );

          alert(
            error.message ||
            "Unable to fetch report."
          );
        }
      }}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Generate Report
    </button>
  </div>

  {facultyReport && (
    <div
      style={{
        marginTop: "24px",
        borderTop: "1px solid #e5e7eb",
        paddingTop: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 6px 0",
          color: "#0f172a",
          fontSize: "18px",
          fontWeight: 800,
        }}
      >
        📊 Faculty Report
      </h3>

      <div
        style={{
          fontSize: "13px",
          color: "#475569",
          marginBottom: "18px",
        }}
      >
        {facultyReport.from === facultyReport.to
          ? `Date: ${facultyReport.from}`
          : `Period: ${facultyReport.from} to ${facultyReport.to}`}
      </div>

      {facultyReport.periods &&
        facultyReport.periods.length > 0 && (
          <div
            style={{
              overflowX: "auto",
              marginBottom: "22px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                background: "#ffffff",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#eff6ff",
                    color: "#0f172a",
                  }}
                >
                  <th style={reportCellStyle}>
                    Period
                  </th>

                  <th style={reportCellStyle}>
                    Time
                  </th>

                  <th style={reportCellStyle}>
                    Activity
                  </th>

                  <th style={reportCellStyle}>
                    Details
                  </th>

                  <th style={reportCellStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {facultyReport.periods.map(
                  (period) => (
                    <tr key={period.periodNo}>
                      <td
                        style={{
                          ...reportCellStyle,
                          fontWeight: 800,
                        }}
                      >
                        P{period.periodNo}
                      </td>

                      <td style={reportCellStyle}>
                        {period.time}
                      </td>

                      <td
                        style={{
                          ...reportCellStyle,
                          fontWeight: 700,
                        }}
                      >
                        {period.activityType}
                      </td>

                      <td style={reportCellStyle}>
                        {period.activityType ===
                        "Class" ? (
                          <>
                            <strong>
                              {period.subject}
                            </strong>
                            <br />
                            {period.className}
                            {period.section
                              ? ` - ${period.section}`
                              : ""}
                            {period.room
                              ? ` · Room ${period.room}`
                              : ""}
                          </>
                        ) : period.activityType ===
                          "Task" ? (
                          <>
                            <strong>
                              {period.taskName}
                            </strong>

                            {period.taskDescription && (
                              <>
                                <br />
                                {period.taskDescription}
                              </>
                            )}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td style={reportCellStyle}>
                        {period.activityType ===
                        "Class" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              fontWeight: 800,
                            }}
                          >
                            🏫 CLASS
                          </span>
                        ) : period.statusLevel ===
                          "L1" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#fee2e2",
                              color: "#b91c1c",
                              fontWeight: 800,
                            }}
                          >
                            🔴 L1
                          </span>
                        ) : period.statusLevel ===
                          "L2" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#fef3c7",
                              color: "#a16207",
                              fontWeight: 800,
                            }}
                          >
                            🟡 L2
                          </span>
                        ) : period.statusLevel ===
                          "L3" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 800,
                            }}
                          >
                            🟢 L3
                          </span>
                        ) : (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 800,
                            }}
                          >
                            🟢 FREE
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      <h3
        style={{
          margin: "0 0 12px 0",
          color: "#0f172a",
          fontSize: "16px",
          fontWeight: 800,
        }}
      >
        📈 Completion
      </h3>

      <div
        style={{
          height: "18px",
          width: "100%",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${facultyReport.summary.completionPercentage}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "999px",
          }}
        />
      </div>

      <div
        style={{
          fontWeight: 800,
          color: "#15803d",
          marginBottom: "18px",
        }}
      >
        {facultyReport.summary.completionPercentage}%
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <div style={reportSummaryStyle}>
          <strong>Total Tasks</strong>
          <span>
            {facultyReport.summary.totalTasks}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🔴 L1</strong>
          <span>
            {facultyReport.summary.l1Count}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🟡 L2</strong>
          <span>
            {facultyReport.summary.l2Count}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🟢 L3</strong>
          <span>
            {facultyReport.summary.l3Count}
          </span>
        </div>
            </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "18px",
        }}
      >
        <button
          type="button"
          onClick={generateFacultyReportPDF}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#dc2626",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          Download PDF
        </button>
      </div>

      <h3
        style={{
          margin: "0 0 12px 0",
          color: "#0f172a",
          fontSize: "16px",
          fontWeight: 800,
        }}
      >
        Task Details
      </h3>

      {facultyReport.tasks &&
      facultyReport.tasks.length > 0 ? (
        <div>
          {facultyReport.tasks.map(
            (task) => (
              <div
                key={task.id}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong
                    style={{
                      color: "#0f172a",
                    }}
                  >
                    P{task.period_no} —{" "}
                    {task.task_name}
                  </strong>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    {task.task_date} •{" "}
                    {task.day_of_week}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  {task.status_level ===
                  "L1"
                    ? "🔴 L1"
                    : task.status_level ===
                      "L2"
                    ? "🟡 L2"
                    : "🟢 L3"}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div
          style={{
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "10px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          No tasks found for this period.
        </div>
      )}
    </div>
  )}
</div>

          {/* LOGOUT */}

          <button
            onClick={
              handleFacultyLogout
            }
            style={{
              marginTop:
                "22px",
            }}
          >
            Logout
          </button>

        </div>

      </div>
    </>
  );
}

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  if (
    page ===
    "admin-dashboard"
  ) {

    let adminUser = null;

    try {

      adminUser =
        JSON.parse(
          sessionStorage.getItem(
            "adminUser"
          ) || "null"
        );

    } catch {

      adminUser = null;

    }

    return (
      <AdminDashboard
        adminUser={
          adminUser
        }
        onLogout={
          handleAdminLogout
        }
      />
    );
  }

  // ============================================================
  // VIEWER
  // ============================================================

  if (
    page ===
    "viewer"
  ) {

    return (
      <>
        <style>
          {
            GLOBAL_STYLES +
            COMMON_LOGIN_STYLES
          }
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Availability
            </h1>

            <p className="login-subtitle">
              Public viewer
            </p>

            <p>
              Current HOD Status:{" "}

              <strong>
                {
                  hodStatus ||
                  "Loading..."
                }
              </strong>
            </p>

            <button
              onClick={() => {

                setPage(
                  "home"
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );

              }}
            >
              ← Back
            </button>

          </div>

        </div>
      </>
    );
  }

  return null;
}

export default App;












