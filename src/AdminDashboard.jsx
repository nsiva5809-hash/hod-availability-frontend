import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import facultyDeskLogo from "./assets/faculty-desk-logo.png";

const API_URL = "http://localhost:5000";

function AdminDashboard({ adminUser, onLogout }) {
  // ==================================================
  // STATE
  // ==================================================

  const [activeSection, setActiveSection] = useState("overview");

  // Departments
  const [departments, setDepartments] = useState([]);
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Admin Faculty Reports
  const [adminReportFacultyId, setAdminReportFacultyId] =
    useState("");
const [adminReportDepartmentId, setAdminReportDepartmentId] =
  useState("");

  const [adminReportFromDate, setAdminReportFromDate] =
    useState("");

  const [adminReportToDate, setAdminReportToDate] =
    useState("");

  const [adminFacultyReport, setAdminFacultyReport] =
    useState(null);

  const [adminReportLoading, setAdminReportLoading] =
    useState(false);
  // HODs
  const [hods, setHods] = useState([]);
  const [hodLoading, setHodLoading] = useState(false);

  // HOD availability
  const [hodAvailability, setHodAvailability] = useState({
    status: "Loading...",
    message: "",
    expectedReturnTime: "",
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [hodSaving, setHodSaving] = useState(false);
  const [hodEditingId, setHodEditingId] = useState(null);
  const [hodId, setHodId] = useState("");
  const [hodName, setHodName] = useState("");
  const [hodPassword, setHodPassword] = useState("");
  const [hodDepartmentId, setHodDepartmentId] = useState("");

  // Faculty
  const [faculties, setFaculties] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultySaving, setFacultySaving] = useState(false);
  const [facultyEditingId, setFacultyEditingId] = useState(null);

  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyDepartmentId, setFacultyDepartmentId] = useState("");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==================================================
  // LOAD DEPARTMENTS
  // ==================================================

  const loadDepartments = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load departments"
        );
      }

      setDepartments(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD HODS
  // ==================================================

  const loadHods = async () => {
    setHodLoading(true);

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/hods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load HODs"
        );
      }

      // Fetch each HOD's current availability so the
      // Admin portal updates without a manual refresh.
      const enrichedHods = await Promise.all(
        (data || []).map(async (hod) => {
          try {
            const statusResponse = await fetch(
              `${API_URL}/api/status?hodId=${encodeURIComponent(
                hod.hod_id
              )}`
            );

            const statusData =
              await statusResponse.json();

            if (statusResponse.ok) {
              return {
                ...hod,
                status:
                  statusData.status || "Available",
                message:
                  statusData.message || "",
                expectedReturnTime:
                  statusData.expectedReturnTime || "",
              };
            }
          } catch (statusError) {
            console.error(
              `Unable to load status for ${hod.hod_id}:`,
              statusError
            );
          }

          return {
            ...hod,
            status: "Available",
            message: "",
            expectedReturnTime: "",
          };
        })
      );

      setHods(enrichedHods);
if (enrichedHods.length > 0) {
  const firstHod = enrichedHods[0];

  setHodAvailability({
    status: firstHod.status || "Available",
    message: firstHod.message || "",
    expectedReturnTime:
      firstHod.expectedReturnTime || "",
  });
}
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setHodLoading(false);
    }
  };

  // ==================================================
  // LOAD FACULTY
  // ==================================================

  const loadFaculties = async () => {
    setFacultyLoading(true);

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/faculty`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load faculty"
        );
      }

      setFaculties(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setFacultyLoading(false);
    }
  };

  // ==================================================
  // ADMIN FACULTY REPORT
  // ==================================================

  const generateAdminFacultyReport = async () => {
    if (!adminReportFacultyId) {
      alert("Please select a faculty member.");
      return;
    }

    if (!adminReportFromDate || !adminReportToDate) {
      alert("Please select both From and To dates.");
      return;
    }

    if (adminReportFromDate > adminReportToDate) {
      alert("From date cannot be after To date.");
      return;
    }

    try {
      setAdminReportLoading(true);
      setAdminFacultyReport(null);

      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/faculty-reports?facultyId=${adminReportFacultyId}&from=${adminReportFromDate}&to=${adminReportToDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to generate faculty report"
        );
      }

      setAdminFacultyReport(data);
    } catch (error) {
      console.error(
        "Admin faculty report error:",
        error
      );

      alert(
        error.message ||
          "Unable to generate faculty report."
      );
    } finally {
      setAdminReportLoading(false);
    }
  };
  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadDepartments();
    loadHods();
    loadFaculties();

    // Refresh HOD availability automatically every 2 seconds.
    // This keeps the Admin portal synchronized with HOD updates
    // without requiring a browser refresh.
    const hodAvailabilityInterval = setInterval(() => {
      loadHods();
    }, 10000);

    return () =>
      clearInterval(hodAvailabilityInterval);
  }, []);

  // ==================================================
  // DEPARTMENT FORM
  // ==================================================

  const clearForm = () => {
    setDepartmentCode("");
    setDepartmentName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !departmentCode.trim() ||
      !departmentName.trim()
    ) {
      setError(
        "Please enter both department code and department name."
      );
      return;
    }

    setSaving(true);

    try {
      const token = sessionStorage.getItem("adminToken");

      const url = editingId
        ? `${API_URL}/api/admin/departments/${editingId}`
        : `${API_URL}/api/admin/departments`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentCode: departmentCode.trim(),
          departmentName: departmentName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save department"
        );
      }

      setSuccess(
        editingId
          ? "Department updated successfully."
          : "Department added successfully."
      );

      clearForm();
      await loadDepartments();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (department) => {
    setDepartmentCode(
      department.department_code
    );

    setDepartmentName(
      department.department_name
    );

    setEditingId(department.id);
    setError("");
    setSuccess("");

    setActiveSection("departments");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStatusChange = async (department) => {
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/departments/${department.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            active: !department.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to change department status"
        );
      }

      setSuccess(
        department.active
          ? "Department deactivated successfully."
          : "Department activated successfully."
      );

      await loadDepartments();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

// ==================================================
// HOD FUNCTIONS
// ==================================================

const clearHodForm = () => {
  setHodId("");
  setHodName("");
  setHodPassword("");
  setHodDepartmentId("");
  setHodEditingId(null);
};

const handleHodSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!hodId.trim()) {
    setError("Please enter HOD ID.");
    return;
  }

  if (!hodName.trim()) {
    setError("Please enter HOD Name.");
    return;
  }

  if (!hodEditingId && !hodPassword) {
    setError("Please enter HOD Password.");
    return;
  }

  if (!hodDepartmentId) {
    setError("Please select a department.");
    return;
  }

  setHodSaving(true);

  try {
    const token =
      sessionStorage.getItem("adminToken");

    const url = hodEditingId
      ? `${API_URL}/api/admin/hods/${hodEditingId}`
      : `${API_URL}/api/admin/hods`;

    const method = hodEditingId
      ? "PUT"
      : "POST";

    const body = {
      hodId:
        hodId.trim().toUpperCase(),
      name: hodName.trim(),
      departmentId:
        Number(hodDepartmentId),
    };

    // During editing, a blank password keeps
    // the existing password.
    if (hodPassword) {
      body.password = hodPassword;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to save HOD"
      );
    }

    setSuccess(
      hodEditingId
        ? "HOD updated successfully."
        : "HOD added successfully."
    );

    clearHodForm();
    await loadHods();
  } catch (error) {
    console.error(
      "HOD save error:",
      error
    );

    setError(
      error.message ||
        "Unable to save HOD"
    );
  } finally {
    setHodSaving(false);
  }
};

const handleHodEdit = (hod) => {
  setHodId(hod.hod_id || "");
  setHodName(hod.name || "");
  setHodPassword("");
  setHodDepartmentId(
    hod.department_id != null
      ? String(hod.department_id)
      : ""
  );
  setHodEditingId(hod.id);

  setError("");
  setSuccess("");

  setActiveSection("hods");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleHodStatusChange = async (hod) => {
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/hods/${hod.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            active: !hod.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to change HOD status"
        );
      }

      setSuccess(
        hod.active
          ? "HOD deactivated successfully."
          : "HOD activated successfully."
      );

      await loadHods();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


// ==================================================
// FACULTY FUNCTIONS
// ==================================================

const clearFacultyForm = () => {
  setFacultyId("");
  setFacultyName("");
  setFacultyPassword("");
  setFacultyDepartmentId("");
  setFacultyEditingId(null);
};

const handleFacultySubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!facultyId.trim()) {
    setError("Please enter Faculty ID.");
    return;
  }

  if (!facultyName.trim()) {
    setError("Please enter Faculty Name.");
    return;
  }

  if (!facultyEditingId && !facultyPassword) {
    setError(
      "Please enter a password for the faculty."
    );
    return;
  }

  if (!facultyDepartmentId) {
    setError("Please select a department.");
    return;
  }

  setFacultySaving(true);

  try {
    const token =
      sessionStorage.getItem("adminToken");

    const url = facultyEditingId
      ? `${API_URL}/api/admin/faculty/${facultyEditingId}`
      : `${API_URL}/api/admin/faculty`;

    const method = facultyEditingId
      ? "PUT"
      : "POST";

    const body = {
      facultyId: facultyId.trim(),
      name: facultyName.trim(),
      departmentId: Number(
        facultyDepartmentId
      ),
    };

    if (facultyPassword) {
      body.password = facultyPassword;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to save faculty"
      );
    }

    setSuccess(
      facultyEditingId
        ? "Faculty updated successfully."
        : "Faculty added successfully."
    );

    clearFacultyForm();

    await loadFaculties();

  } catch (error) {
    console.error(
      "Faculty save error:",
      error
    );

    setError(
      error.message ||
        "Unable to save faculty"
    );

  } finally {
    setFacultySaving(false);
  }
};

const handleFacultyEdit = (
  faculty
) => {
  setFacultyId(
    faculty.faculty_id || ""
  );

  setFacultyName(
    faculty.name || ""
  );

  setFacultyPassword("");

  setFacultyDepartmentId(
    faculty.department_id != null
      ? String(
          faculty.department_id
        )
      : ""
  );

  setFacultyEditingId(
    faculty.id
  );

  setError("");
  setSuccess("");

  setActiveSection(
    "faculty"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleFacultyStatusChange = async (
  faculty
) => {
  setError("");
  setSuccess("");

  try {
    const token =
      sessionStorage.getItem(
        "adminToken"
      );

    const response = await fetch(
      `${API_URL}/api/admin/faculty/${faculty.id}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          active:
            !faculty.active,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to change faculty status"
      );
    }

    setSuccess(
      faculty.active
        ? "Faculty deactivated successfully."
        : "Faculty activated successfully."
    );

    await loadFaculties();

  } catch (error) {
    console.error(
      "Faculty status error:",
      error
    );

    setError(
      error.message ||
        "Unable to change faculty status"
    );
  }
};

  // ==================================================
  // HELPERS
  // ==================================================

  const activeDepartments = departments.filter(
    (d) => d.active
  ).length;

  const activeFaculty = faculties.filter(
    (f) => f.active
  ).length;

  const activeHods = hods.filter(
    (h) => h.active
  ).length;

  const getStatusInfo = (status) => {
    switch (status) {
      case "Available":
        return {
          icon: "●",
          color: "#16a34a",
          background: "#dcfce7",
        };

      case "In Meeting":
        return {
          icon: "●",
          color: "#ea580c",
          background: "#ffedd5",
        };

      case "Away":
        return {
          icon: "●",
          color: "#2563eb",
          background: "#dbeafe",
        };

      case "Not Available":
        return {
          icon: "●",
          color: "#64748b",
          background: "#f1f5f9",
        };

      default:
        return {
          icon: "●",
          color: "#64748b",
          background: "#f1f5f9",
        };
    }
  };

  const statusInfo = getStatusInfo(
    hodAvailability.status
  );

  // ==================================================
  // NAVIGATION
  // ==================================================

  const changeSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setError("");
    setSuccess("");
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div style={styles.app}>
      {/* ==============================================
          SIDEBAR
      ============================================== */}

      <aside
        style={{
          ...styles.sidebar,
          ...(mobileMenuOpen
            ? styles.sidebarMobileOpen
            : {}),
        }}
      >
        <div style={styles.brand}>
  <img
    src={facultyDeskLogo}
    alt="Faculty Desk"
    style={{
      width: "180px",
      maxWidth: "100%",
      height: "auto",
      display: "block",
      objectFit: "contain",
    }}
  />
</div>

        <div style={styles.navTitle}>
          MAIN MENU
        </div>

        <button
          style={{
            ...styles.navButton,
            ...(activeSection === "overview"
              ? styles.navButtonActive
              : {}),
          }}
          onClick={() =>
            changeSection("overview")
          }
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          style={{
            ...styles.navButton,
            ...(activeSection === "departments"
              ? styles.navButtonActive
              : {}),
          }}
          onClick={() =>
            changeSection("departments")
          }
        >
          <span>▦</span>
          Departments
        </button>

        <button
          style={{
            ...styles.navButton,
            ...(activeSection === "hods"
              ? styles.navButtonActive
              : {}),
          }}
          onClick={() =>
            changeSection("hods")
          }
        >
          <span>◉</span>
          HOD Management
        </button>

        <button
          style={{
            ...styles.navButton,
            ...(activeSection === "faculty"
              ? styles.navButtonActive
              : {}),
          }}
          onClick={() =>
            changeSection("faculty")
          }
        >
          <span>♙</span>
          Faculty Management
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeSection === "faculty-reports"
              ? styles.navButtonActive
              : {}),
          }}
          onClick={() =>
            changeSection("faculty-reports")
          }
        >
          <span>📊</span>
          Faculty Reports
        </button>
        <div style={styles.sidebarBottom}>
          <div style={styles.adminMiniCard}>
            <div style={styles.avatarSmall}>
              {(adminUser?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={styles.adminMiniName}>
                {adminUser?.name ||
                  "Administrator"}
              </div>

              <div style={styles.adminMiniRole}>
                Administrator
              </div>
            </div>
          </div>

          <button
            style={styles.logoutButton}
            onClick={onLogout}
          >
            ⇥ &nbsp; Logout
          </button>
        </div>
      </aside>

      {/* ==============================================
          MOBILE HEADER
      ============================================== */}

     <div style={styles.mobileHeader}>
  <button
    style={styles.menuButton}
    onClick={() =>
      setMobileMenuOpen(
        !mobileMenuOpen
      )
    }
  >
    ☰
  </button>

  <img
    src={facultyDeskLogo}
    alt="Faculty Desk"
    style={{
      width: "150px",
      height: "auto",
      objectFit: "contain",
    }}
  />
</div>

      {/* ==============================================
          MAIN CONTENT
      ============================================== */}

      <main style={styles.main}>
        {/* TOP HEADER */}

        <header style={styles.topHeader}>
          <div>
            <div style={styles.breadcrumb}>
              Administration
              <span> / </span>
              Dashboard
            </div>

            <h1 style={styles.pageTitle}>
              {activeSection === "overview"
                ? "Dashboard"
                : activeSection ===
                  "departments"
                ? "Departments"
                : activeSection === "hods"
                ? "HOD Management"
                : "Faculty Management"}
            </h1>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>
              {(adminUser?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <div style={styles.profileName}>
                {adminUser?.name ||
                  "Administrator"}
              </div>

              <div style={styles.profileRole}>
                System Administrator
              </div>
            </div>
          </div>
        </header>

        {/* MESSAGES */}

        {error && (
          <div style={styles.errorBox}>
            <strong>⚠</strong>
            <span>{error}</span>

            <button
              style={styles.messageClose}
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div style={styles.successBox}>
            <strong>✓</strong>
            <span>{success}</span>

            <button
              style={styles.messageClose}
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}

        {/* ==============================================
            OVERVIEW
        ============================================== */}

        {activeSection === "overview" && (
          <>
            <div style={styles.welcomeCard}>
              <div>
                <div style={styles.welcomeSmall}>
                  WELCOME BACK
                </div>

                <h2 style={styles.welcomeTitle}>
                  Hello,{" "}
                  {adminUser?.name ||
                    "Administrator"}{" "}
                  👋
                </h2>

                <p style={styles.welcomeText}>
                  Manage departments, HODs and
                  faculty members from one place.
                </p>
              </div>

              <div style={styles.welcomeIcon}>
                A
              </div>
            </div>

            {/* STAT CARDS */}

            <div style={styles.statsGrid}>
              <div
                style={{
                  ...styles.statCard,
                  borderTop:
                    "4px solid #4f46e5",
                }}
              >
                <div
                  style={{
                    ...styles.statIcon,
                    background: "#eef2ff",
                    color: "#4f46e5",
                  }}
                >
                  ▦
                </div>

                <div>
                  <div style={styles.statLabel}>
                    Departments
                  </div>

                  <div style={styles.statNumber}>
                    {departments.length}
                  </div>

                  <div style={styles.statFooter}>
                    {activeDepartments} active
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styles.statCard,
                  borderTop:
                    "4px solid #0891b2",
                }}
              >
                <div
                  style={{
                    ...styles.statIcon,
                    background: "#ecfeff",
                    color: "#0891b2",
                  }}
                >
                  ◉
                </div>

                <div>
                  <div style={styles.statLabel}>
                    HODs
                  </div>

                  <div style={styles.statNumber}>
                    {hods.length}
                  </div>

                  <div style={styles.statFooter}>
                    {activeHods} active
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styles.statCard,
                  borderTop:
                    "4px solid #7c3aed",
                }}
              >
                <div
                  style={{
                    ...styles.statIcon,
                    background: "#f5f3ff",
                    color: "#7c3aed",
                  }}
                >
                  ♙
                </div>

                <div>
                  <div style={styles.statLabel}>
                    Faculty
                  </div>

                  <div style={styles.statNumber}>
                    {faculties.length}
                  </div>

                  <div style={styles.statFooter}>
                    {activeFaculty} active
                  </div>
                </div>
              </div>

              </div>
            {/* QUICK ACCESS */}

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Quick Management
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Quickly access the main
                    administration modules.
                  </p>
                </div>
              </div>

              <div style={styles.quickGrid}>
                <button
                  style={styles.quickCard}
                  onClick={() =>
                    changeSection(
                      "departments"
                    )
                  }
                >
                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#eef2ff",
                      color: "#4f46e5",
                    }}
                  >
                    ▦
                  </div>

                  <div>
                    <strong>
                      Departments
                    </strong>

                    <p>
                      Add and manage academic
                      departments.
                    </p>
                  </div>

                  <span style={styles.arrow}>
                    →
                  </span>
                </button>

                <button
                  style={styles.quickCard}
                  onClick={() =>
                    changeSection("hods")
                  }
                >
                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#ecfeff",
                      color: "#0891b2",
                    }}
                  >
                    ◉
                  </div>

                  <div>
                    <strong>
                      HOD Management
                    </strong>

                    <p>
                      Assign departments and
                      monitor HOD status.
                    </p>
                  </div>

                  <span style={styles.arrow}>
                    →
                  </span>
                </button>

                <button
                  style={styles.quickCard}
                  onClick={() =>
                    changeSection("faculty")
                  }
                >
                  <div
                    style={{
                      ...styles.quickIcon,
                      background: "#f5f3ff",
                      color: "#7c3aed",
                    }}
                  >
                    ♙
                  </div>

                  <div>
                    <strong>
                      Faculty Management
                    </strong>

                    <p>
                      Add faculty and assign
                      departments.
                    </p>
                  </div>

                  <span style={styles.arrow}>
                    →
                  </span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* ==============================================
            DEPARTMENTS
        ============================================== */}

        {activeSection === "departments" && (
          <>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Department Management
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Create and manage departments
                    in the institution.
                  </p>
                </div>
              </div>

              <div style={styles.formCard}>
                <div style={styles.formHeader}>
                  <div style={styles.formIcon}>
                    {editingId ? "✎" : "+"}
                  </div>

                  <div>
                    <h3 style={styles.formTitle}>
                      {editingId
                        ? "Edit Department"
                        : "Add New Department"}
                    </h3>

                    <p style={styles.formSubtitle}>
                      {editingId
                        ? "Update department information."
                        : "Enter the details for the new department."}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  style={styles.formGrid}
                >
                  <div>
                    <label style={styles.label}>
                      Department Code
                    </label>

                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Example: CSE"
                      value={departmentCode}
                      onChange={(e) =>
                        setDepartmentCode(
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Department Name
                    </label>

                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Computer Science and Engineering"
                      value={departmentName}
                      onChange={(e) =>
                        setDepartmentName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={styles.primaryButton}
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Department"
                        : "Add Department"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={clearForm}
                        style={styles.secondaryButton}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Departments
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    {departments.length} department
                    {departments.length !== 1
                      ? "s"
                      : ""}{" "}
                    registered.
                  </p>
                </div>
              </div>
              

              <div style={styles.tableCard}>
                {loading ? (
                  <div style={styles.emptyState}>
                    Loading departments...
                  </div>
                ) : departments.length ===
                  0 ? (
                  <div style={styles.emptyState}>
                    No departments found.
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>
                            Code
                          </th>

                          <th style={styles.th}>
                            Department Name
                          </th>

                          <th style={styles.th}>
                            Status
                          </th>

                          <th style={styles.th}>
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {departments.map(
                          (department) => (
                            <tr
                              key={
                                department.id
                              }
                            >
                              <td style={styles.td}>
                                <strong>
                                  {
                                    department.department_code
                                  }
                                </strong>
                              </td>

                              <td style={styles.td}>
                                {
                                  department.department_name
                                }
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badge,
                                    background:
                                      department.active
                                        ? "#dcfce7"
                                        : "#f1f5f9",
                                    color:
                                      department.active
                                        ? "#15803d"
                                        : "#64748b",
                                  }}
                                >
                                  ●{" "}
                                  {department.active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <div style={styles.actionGroup}>
                                  <button
                                    style={styles.editButton}
                                    onClick={() =>
                                      handleEdit(
                                        department
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    style={
                                      department.active
                                        ? styles.dangerButton
                                        : styles.activateButton
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        department
                                      )
                                    }
                                  >
                                    {department.active
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ==============================================
            HOD MANAGEMENT
        ============================================== */}

        {activeSection === "hods" && (
          <>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    HOD Management
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Assign HODs to departments and
                    monitor their availability.
                  </p>
                </div>

                <div style={styles.countBadge}>
                  {hods.length} HOD
                  {hods.length !== 1
                    ? "s"
                    : ""}
                </div>
              </div>
              {/* ADD HOD FORM */}
<div style={styles.formCard}>
  <div style={styles.formHeader}>
    <div
      style={{
        ...styles.formIcon,
        background: "#ecfeff",
        color: "#0891b2",
      }}
    >
      +
    </div>

    <div>
      <h3 style={styles.formTitle}>
        {hodEditingId
          ? "Edit HOD"
          : "Add New HOD"}
      </h3>

      <p style={styles.formSubtitle}>
        {hodEditingId
          ? "Update HOD account details and department."
          : "Create an HOD account and assign a department."}
      </p>
    </div>
  </div>

  <form
    onSubmit={handleHodSubmit}
    style={styles.formGrid}
  >
    {/* HOD ID */}
    <div>
      <label style={styles.label}>
        HOD ID
      </label>

      <input
        style={styles.input}
        type="text"
        placeholder="Example: HOD001"
        value={hodId}
        onChange={(e) =>
          setHodId(
            e.target.value.toUpperCase()
          )
        }
      />
    </div>

    {/* HOD Name */}
    <div>
      <label style={styles.label}>
        HOD Name
      </label>

      <input
        style={styles.input}
        type="text"
        placeholder="Example: Dr. John Kumar"
        value={hodName}
        onChange={(e) =>
          setHodName(e.target.value)
        }
      />
    </div>

    {/* Password */}
    <div>
      <label style={styles.label}>
        Password
      </label>

      <input
        style={styles.input}
        type="password"
        placeholder={
          hodEditingId
            ? "Leave blank to keep current password"
            : "Enter password"
        }
        value={hodPassword}
        onChange={(e) =>
          setHodPassword(e.target.value)
        }
      />
    </div>

    {/* Department */}
    <div>
      <label style={styles.label}>
        Department
      </label>

      <select
        style={styles.select}
        value={hodDepartmentId}
        onChange={(e) =>
          setHodDepartmentId(
            e.target.value
          )
        }
      >
        <option value="">
          Select Department
        </option>

        {departments
          .filter(
            (department) =>
              department.active
          )
          .map((department) => (
            <option
              key={department.id}
              value={String(department.id)}
            >
              {department.department_code} -{" "}
              {department.department_name}
            </option>
          ))}
      </select>
    </div>

    {/* Buttons */}
    <div style={styles.formActions}>
      <button
        type="submit"
        disabled={hodSaving}
        style={{
          ...styles.primaryButton,
          background: "#0891b2",
        }}
      >
        {hodSaving
          ? "Saving..."
          : hodEditingId
          ? "Update HOD"
          : "Add HOD"}
      </button>

      <button
        type="button"
        onClick={clearHodForm}
        style={styles.secondaryButton}
      >
        {hodEditingId ? "Cancel" : "Clear"}
      </button>
    </div>
  </form>
</div>


              <div style={styles.tableCard}>
                {hodLoading ? (
                  <div style={styles.emptyState}>
                    Loading HODs...
                  </div>
                ) : hods.length === 0 ? (
                  <div style={styles.emptyState}>
                    No HODs found.
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>
                            HOD
                          </th>

                          <th style={styles.th}>
                            Department
                          </th>

                          <th style={styles.th}>
                            Availability
                          </th>

                          <th style={styles.th}>
                            Account
                          </th>

                          <th style={styles.th}>
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {hods.map((hod) => (
                          <tr key={hod.id}>
                            <td style={styles.td}>
                              <div style={styles.personCell}>
                                <div
                                  style={
                                    styles.personAvatar
                                  }
                                >
                                  {(hod.name ||
                                    "H")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {hod.name}
                                  </strong>

                                  <div
                                    style={
                                      styles.mutedText
                                    }
                                  >
                                    {hod.hod_id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td style={styles.td}>
                              <div>
                                <strong>
                                  {hod.departments
                                    ?.department_code ||
                                    "Not Assigned"}
                                </strong>

                                <div
                                  style={
                                    styles.mutedText
                                  }
                                >
                                  {hod.departments
                                    ?.department_name ||
                                    "No department assigned"}
                                </div>
                              </div>
                            </td>

                            <td style={styles.td}>
                              {(() => {
                                const info =
                                  getStatusInfo(
                                    hod.status ||
                                      "Available"
                                  );

                                return (
                                  <>
                                    <span
                                      style={{
                                        ...styles.badge,
                                        background:
                                          info.background,
                                        color:
                                          info.color,
                                      }}
                                    >
                                      {info.icon}{" "}
                                      {hod.status ||
                                        "Available"}
                                    </span>

                                    {hod.status ===
                                      "Away" &&
                                      hod.expectedReturnTime && (
                                        <div
                                          style={
                                            styles.mutedText
                                          }
                                        >
                                          Return:{" "}
                                          {
                                            hod.expectedReturnTime
                                          }
                                        </div>
                                      )}
                                  </>
                                );
                              })()}
                            </td>

                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.badge,
                                  background:
                                    hod.active
                                      ? "#dcfce7"
                                      : "#f1f5f9",
                                  color:
                                    hod.active
                                      ? "#15803d"
                                      : "#64748b",
                                }}
                              >
                                ●{" "}
                                {hod.active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            <td style={styles.td}>
                              <div
                                style={
                                  styles.actionGroup
                                }
                              >
                                <button
                                  style={
                                    styles.editButton
                                  }
                                  onClick={() =>
                                    handleHodEdit(
                                      hod
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  style={
                                    hod.active
                                      ? styles.dangerButton
                                      : styles.activateButton
                                  }
                                onClick={() =>
                                  handleHodStatusChange(
                                    hod
                                  )
                                }
                                >
                                  {hod.active
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>


          </>
        )}

        {/* ==============================================
            FACULTY MANAGEMENT
        ============================================== */}

        {activeSection === "faculty" && (
          <>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Faculty Management
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Add, edit and manage faculty
                    members.
                  </p>
                </div>

                <div style={styles.countBadge}>
                  {faculties.length} Faculty
                </div>
              </div>

              <div style={styles.formCard}>
                <div style={styles.formHeader}>
                  <div
                    style={{
                      ...styles.formIcon,
                      background:
                        "#f5f3ff",
                      color: "#7c3aed",
                    }}
                  >
                    {facultyEditingId
                      ? "✎"
                      : "+"}
                  </div>

                  <div>
                    <h3 style={styles.formTitle}>
                      {facultyEditingId
                        ? "Edit Faculty"
                        : "Add New Faculty"}
                    </h3>

                    <p style={styles.formSubtitle}>
                      {facultyEditingId
                        ? "Update faculty information."
                        : "Create a faculty account and assign a department."}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={
                    handleFacultySubmit
                  }
                  style={styles.formGrid}
                >
                  <div>
                    <label style={styles.label}>
                      Faculty ID
                    </label>

                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Example: FAC001"
                      value={facultyId}
                      onChange={(e) =>
                        setFacultyId(
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Faculty Name
                    </label>

                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Example: Dr. John Kumar"
                      value={facultyName}
                      onChange={(e) =>
                        setFacultyName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Password
                    </label>

                    <input
                      style={styles.input}
                      type="password"
                      placeholder={
                        facultyEditingId
                          ? "Leave blank to keep current password"
                          : "Enter password"
                      }
                      value={facultyPassword}
                      onChange={(e) =>
                        setFacultyPassword(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Department
                    </label>

                    <select
                      style={styles.select}
                      value={
                        facultyDepartmentId
                      }
                      onChange={(e) =>
                        setFacultyDepartmentId(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Department
                      </option>

                      {departments
                        .filter(
                          (department) =>
                            department.active
                        )
                        .map(
                          (department) => (
                            <option
                              key={
                                department.id
                              }
                              value={String(
                                department.id
                              )}
                            >
                              {
                                department.department_code
                              }{" "}
                              -{" "}
                              {
                                department.department_name
                              }
                            </option>
                          )
                        )}
                    </select>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="submit"
                      disabled={
                        facultySaving
                      }
                      style={{
                        ...styles.primaryButton,
                        background:
                          "#7c3aed",
                      }}
                    >
                      {facultySaving
                        ? "Saving..."
                        : facultyEditingId
                        ? "Update Faculty"
                        : "Add Faculty"}
                    </button>

                    {facultyEditingId && (
                      <button
                        type="button"
                        onClick={
                          clearFacultyForm
                        }
                        style={
                          styles.secondaryButton
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Faculty List
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Manage faculty accounts and
                    department assignments.
                  </p>
                </div>
              </div>

              <div style={styles.tableCard}>
                {facultyLoading ? (
                  <div style={styles.emptyState}>
                    Loading faculty...
                  </div>
                ) : faculties.length ===
                  0 ? (
                  <div style={styles.emptyState}>
                    No faculty found.
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>
                            Faculty
                          </th>

                          <th style={styles.th}>
                            Department
                          </th>

                          <th style={styles.th}>
                            Account Status
                          </th>

                          <th style={styles.th}>
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {faculties.map(
                          (faculty) => (
                            <tr
                              key={
                                faculty.id
                              }
                            >
                              <td style={styles.td}>
                                <div
                                  style={
                                    styles.personCell
                                  }
                                >
                                  <div
                                    style={{
                                      ...styles.personAvatar,
                                      background:
                                        "#f5f3ff",
                                      color:
                                        "#7c3aed",
                                    }}
                                  >
                                    {(
                                      faculty.name ||
                                      "F"
                                    )
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <strong>
                                      {
                                        faculty.name
                                      }
                                    </strong>

                                    <div
                                      style={
                                        styles.mutedText
                                      }
                                    >
                                      {
                                        faculty.faculty_id
                                      }
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td style={styles.td}>
                                {faculty.departments
                                  ? `${faculty.departments.department_code} - ${faculty.departments.department_name}`
                                  : "Not Assigned"}
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badge,
                                    background:
                                      faculty.active
                                        ? "#dcfce7"
                                        : "#f1f5f9",
                                    color:
                                      faculty.active
                                        ? "#15803d"
                                        : "#64748b",
                                  }}
                                >
                                  ●{" "}
                                  {faculty.active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <div
                                  style={
                                    styles.actionGroup
                                  }
                                >
                                  <button
                                    style={
                                      styles.editButton
                                    }
                                    onClick={() =>
                                      handleFacultyEdit(
                                        faculty
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    style={
                                      faculty.active
                                        ? styles.dangerButton
                                        : styles.activateButton
                                    }
                                    onClick={() =>
                                      handleFacultyStatusChange(
                                        faculty
                                      )
                                    }
                                  >
                                    {faculty.active
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
        {/* ==============================================
            ADMIN FACULTY REPORTS
        ============================================== */}

        {activeSection === "faculty-reports" && (
          <>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    📊 Faculty Reports
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    View faculty activity, timetable periods,
                    tasks and completion levels.
                  </p>
                </div>
              </div>

              {/* Report Filters */}
              <div style={styles.formCard}>
                <div style={styles.formHeader}>
                  <div
                    style={{
                      ...styles.formIcon,
                      background: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    📊
                  </div>

                  <div>
                    <h3 style={styles.formTitle}>
                      Generate Faculty Report
                    </h3>

                    <p style={styles.formSubtitle}>
                      Select a faculty member and report period.
                    </p>
                  </div>
                </div>

                <div style={styles.formGrid}>
              {/* Department */}
<div>
  <label style={styles.label}>
    Department
  </label>

  <select
    style={styles.select}
    value={adminReportDepartmentId}
    onChange={(e) => {
      setAdminReportDepartmentId(
        e.target.value
      );

      setAdminReportFacultyId("");

      setAdminFacultyReport(null);
    }}
  >
    <option value="">
      Select Department
    </option>

    {departments
      .filter(
        (department) => department.active
      )
      .map((department) => (
        <option
          key={department.id}
          value={String(department.id)}
        >
          {department.department_code} -{" "}
          {department.department_name}
        </option>
      ))}
  </select>
</div>

{/* Faculty */}
<div>
  <label style={styles.label}>
    Faculty
  </label>

  <select
    style={styles.select}
    value={adminReportFacultyId}
    disabled={!adminReportDepartmentId}
    onChange={(e) => {
      setAdminReportFacultyId(
        e.target.value
      );

      setAdminFacultyReport(null);
    }}
  >
    <option value="">
      {adminReportDepartmentId
        ? "Select Faculty"
        : "Select Department First"}
    </option>

    {faculties
      .filter(
        (faculty) =>
          faculty.active &&
          String(faculty.department_id) ===
            String(adminReportDepartmentId)
      )
      .map((faculty) => (
        <option
          key={faculty.id}
          value={String(faculty.id)}
        >
          {faculty.faculty_id} -{" "}
          {faculty.name}
        </option>
      ))}
  </select>
</div>

                  {/* From Date */}
                  <div>
                    <label style={styles.label}>
                      From Date
                    </label>

                    <input
                      type="date"
                      style={styles.input}
                      value={adminReportFromDate}
                      onChange={(e) => {
                        setAdminReportFromDate(
                          e.target.value
                        );
                        setAdminFacultyReport(null);
                      }}
                    />
                  </div>

                  {/* To Date */}
                  <div>
                    <label style={styles.label}>
                      To Date
                    </label>

                    <input
                      type="date"
                      style={styles.input}
                      value={adminReportToDate}
                      onChange={(e) => {
                        setAdminReportToDate(
                          e.target.value
                        );
                        setAdminFacultyReport(null);
                      }}
                    />
                  </div>

                  {/* Generate */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={
                        generateAdminFacultyReport
                      }
                      disabled={
                        adminReportLoading
                      }
                      style={{
                        ...styles.primaryButton,
                        background: "#2563eb",
                        width: "100%",
                      }}
                    >
                      {adminReportLoading
                        ? "Generating..."
                        : "Generate Report"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Report Result */}
            {adminFacultyReport && (
              <>
                <section style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <div>
                      <h2 style={styles.sectionTitle}>
                        {adminFacultyReport.faculty?.name ||
                          "Faculty"}
                      </h2>

                      <p
                        style={styles.sectionSubtitle}
                      >
                        {adminFacultyReport.faculty
                          ?.facultyId || ""}{" "}
                        •{" "}
                        {adminFacultyReport.faculty
                          ?.department ||
                          "Department not assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={styles.formCard}>
                      <div style={styles.mutedText}>
                        Total Tasks
                      </div>

                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          marginTop: "6px",
                        }}
                      >
                        {
                          adminFacultyReport.summary
                            ?.totalTasks
                        }
                      </div>
                    </div>

                    <div style={styles.formCard}>
                      <div style={styles.mutedText}>
                        L1
                      </div>

                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          color: "#dc2626",
                          marginTop: "6px",
                        }}
                      >
                        {
                          adminFacultyReport.summary
                            ?.l1Count
                        }
                      </div>
                    </div>

                    <div style={styles.formCard}>
                      <div style={styles.mutedText}>
                        L2
                      </div>

                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          color: "#ca8a04",
                          marginTop: "6px",
                        }}
                      >
                        {
                          adminFacultyReport.summary
                            ?.l2Count
                        }
                      </div>
                    </div>

                    <div style={styles.formCard}>
                      <div style={styles.mutedText}>
                        L3
                      </div>

                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 800,
                          color: "#16a34a",
                          marginTop: "6px",
                        }}
                      >
                        {
                          adminFacultyReport.summary
                            ?.l3Count
                        }
                      </div>
                    </div>
                  </div>

                  {/* Completion */}
                  <div style={styles.formCard}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <strong>
                        Completion
                      </strong>

                      <strong>
                        {
                          adminFacultyReport.summary
                            ?.completionPercentage
                        }
                        %
                      </strong>
                    </div>

                    <div
                      style={{
                        height: "10px",
                        background: "#e5e7eb",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              adminFacultyReport
                                .summary
                                ?.completionPercentage ||
                                0
                            )
                          )}%`,
                          height: "100%",
                          background: "#16a34a",
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* Daily P1-P8 Reports */}
                {(
                  adminFacultyReport.dailyReports ||
                  []
                ).map((dailyReport) => (
                  <section
                    style={styles.section}
                    key={dailyReport.date}
                  >
                    <div style={styles.sectionHeader}>
                      <div>
                        <h2
                          style={styles.sectionTitle}
                        >
                          {dailyReport.dayOfWeek}
                        </h2>

                        <p
                          style={
                            styles.sectionSubtitle
                          }
                        >
                          {dailyReport.date}
                        </p>
                      </div>
                    </div>

                    <div
                      style={styles.tableCard}
                    >
                      <div
                        style={styles.tableWrapper}
                      >
                        <table
                          style={styles.table}
                        >
                          <thead>
                            <tr>
                              <th
                                style={styles.th}
                              >
                                Period
                              </th>

                              <th
                                style={styles.th}
                              >
                                Time
                              </th>

                              <th
                                style={styles.th}
                              >
                                Activity
                              </th>

                              <th
                                style={styles.th}
                              >
                                Details
                              </th>

                              <th
                                style={styles.th}
                              >
                                Level
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(
                              dailyReport.periods ||
                              []
                            ).map((period) => (
                              <tr
                                key={
                                  `${dailyReport.date}-${period.periodNo}`
                                }
                              >
                                <td
                                  style={styles.td}
                                >
                                  P{period.periodNo}
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {period.time}
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  <span
                                    style={{
                                      ...styles.badge,
                                      background:
                                        period.activityType ===
                                        "Class"
                                          ? "#fee2e2"
                                          : period.activityType ===
                                            "Task"
                                          ? "#dbeafe"
                                          : "#dcfce7",
                                      color:
                                        period.activityType ===
                                        "Class"
                                          ? "#b91c1c"
                                          : period.activityType ===
                                            "Task"
                                          ? "#1d4ed8"
                                          : "#15803d",
                                    }}
                                  >
                                    {period.activityType}
                                  </span>
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {period.activityType ===
                                  "Class"
                                    ? `${period.subject || "Class"}${
                                        period.className
                                          ? ` - ${period.className}`
                                          : ""
                                      }${
                                        period.section
                                          ? ` (${period.section})`
                                          : ""
                                      }${
                                        period.room
                                          ? ` • ${period.room}`
                                          : ""
                                      }`
                                    : period.activityType ===
                                      "Task"
                                    ? period.taskName
                                    : "Free Period"}
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {period.statusLevel ? (
                                    <strong>
                                      {
                                        period.statusLevel
                                      }
                                    </strong>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                ))}

                {/* Task Details */}
                <section style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <div>
                      <h2
                        style={styles.sectionTitle}
                      >
                        Task Details
                      </h2>

                      <p
                        style={styles.sectionSubtitle}
                      >
                        Tasks recorded during the
                        selected report period.
                      </p>
                    </div>

                    <button
                      type="button"
                    onClick={() => {
  const report = adminFacultyReport;
  const faculty = report?.faculty || {};

  const doc = new jsPDF();

  const summary = report?.summary || {};

  // ==================================================
  // REPORT HEADER
  // ==================================================

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Faculty Activity Report",
    14,
    18
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Faculty Name: ${faculty.name || ""}`,
    14,
    28
  );

  doc.text(
    `Faculty ID: ${faculty.facultyId || ""}`,
    14,
    34
  );

  doc.text(
    `Department: ${faculty.department || ""}`,
    14,
    40
  );

  doc.text(
    `Report Period: ${report.from || ""} to ${
      report.to || ""
    }`,
    14,
    46
  );

  // ==================================================
  // SUMMARY TABLE
  // ==================================================

  autoTable(doc, {
    startY: 55,

    head: [[
      "Total Tasks",
      "L1",
      "L2",
      "L3",
      "Completion",
    ]],

    body: [[
      summary.totalTasks || 0,
      summary.l1Count || 0,
      summary.l2Count || 0,
      summary.l3Count || 0,
      `${summary.completionPercentage || 0}%`,
    ]],

    theme: "grid",

    styles: {
      fontSize: 9,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
    },

    headStyles: {
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
  });

  // ==================================================
  // P1-P8 DAILY ACTIVITY
  // ==================================================

  const dailyReports =
    report?.dailyReports || [];

  dailyReports.forEach(
    (dailyReport, index) => {

      // New page for every day
      doc.addPage();

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");

      doc.text(
        `P1-P8 Daily Activity`,
        14,
        18
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      doc.text(
        `${dailyReport.dayOfWeek || ""} - ${
          dailyReport.date || ""
        }`,
        14,
        25
      );

      const periodRows = (
        dailyReport.periods || []
      ).map((period) => {

        let activity = "";
        let details = "";
        let status = "";

        if (
          period.activityType === "Class"
        ) {
          activity = "Class";

          details =
            `${period.subject || ""}` +
            `${
              period.className
                ? ` | ${period.className}`
                : ""
            }` +
            `${
              period.section
                ? ` | ${period.section}`
                : ""
            }` +
            `${
              period.room
                ? ` | Room: ${period.room}`
                : ""
            }`;

          status = "CLASS";
        } else if (
          period.activityType === "Task"
        ) {
          activity = "Task";

          details =
            period.taskName || "";

          status =
            period.statusLevel || "";
        } else {
          activity = "Free";

          details =
            "No class or task";

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
        startY: 32,

        head: [[
          "Period",
          "Time",
          "Activity",
          "Details",
          "Status",
        ]],

        body: periodRows,

        theme: "grid",

        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: "middle",
        },

        headStyles: {
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },

        columnStyles: {
          0: {
            cellWidth: 18,
          },

          1: {
            cellWidth: 38,
          },

          2: {
            cellWidth: 25,
          },

          3: {
            cellWidth: 92,
          },

          4: {
            cellWidth: 25,
          },
        },
      });
    }
  );

  // ==================================================
  // TASK DETAILS
  // ==================================================

  doc.addPage();

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Task Details",
    14,
    18
  );

  const taskRows = (
    report?.tasks || []
  ).map((task) => [
    task.task_date || "",
    `P${task.period_no || ""}`,
    task.day_of_week || "",
    task.task_name || "",
    task.task_description || "",
    task.status_level || "",
  ]);

  autoTable(doc, {
    startY: 26,

    head: [[
      "Date",
      "Period",
      "Day",
      "Task",
      "Description",
      "Level",
    ]],

    body: taskRows,

    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },

    headStyles: {
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },

    columnStyles: {
      0: {
        cellWidth: 27,
      },

      1: {
        cellWidth: 20,
      },

      2: {
        cellWidth: 25,
      },

      3: {
        cellWidth: 48,
      },

      4: {
        cellWidth: 48,
      },

      5: {
        cellWidth: 20,
      },
    },
  });

  // ==================================================
  // SAVE
  // ==================================================

  doc.save(
    `Faculty_Report_${
      faculty.facultyId || "Faculty"
    }_${report.from || ""}_${
      report.to || ""
    }.pdf`
  );
}}
                      style={{
                        ...styles.primaryButton,
                        background: "#dc2626",
                      }}
                    >
                      Download PDF
                    </button>
                  </div>

                  <div style={styles.tableCard}>
                    {(
                      adminFacultyReport.tasks || []
                    ).length === 0 ? (
                      <div
                        style={styles.emptyState}
                      >
                        No tasks recorded for the
                        selected period.
                      </div>
                    ) : (
                      <div
                        style={styles.tableWrapper}
                      >
                        <table
                          style={styles.table}
                        >
                          <thead>
                            <tr>
                              <th
                                style={styles.th}
                              >
                                Date
                              </th>

                              <th
                                style={styles.th}
                              >
                                Day
                              </th>

                              <th
                                style={styles.th}
                              >
                                Period
                              </th>

                              <th
                                style={styles.th}
                              >
                                Task
                              </th>

                              <th
                                style={styles.th}
                              >
                                Level
                              </th>

                              <th
                                style={styles.th}
                              >
                                Description
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(
                              adminFacultyReport.tasks ||
                              []
                            ).map((task) => (
                              <tr
                                key={task.id}
                              >
                                <td
                                  style={styles.td}
                                >
                                  {
                                    task.task_date
                                  }
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {
                                    task.day_of_week
                                  }
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  P
                                  {
                                    task.period_no
                                  }
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {
                                    task.task_name
                                  }
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  <strong>
                                    {
                                      task.status_level
                                    }
                                  </strong>
                                </td>

                                <td
                                  style={styles.td}
                                >
                                  {
                                    task.task_description ||
                                    "—"
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </>
        )}
        {/* FOOTER */}

        <footer style={styles.footer}>
          <span>
            Faculty Availability & Academic
            Management System
          </span>

          <span>
            Admin Panel
          </span>
        </footer>
      </main>
    </div>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
  },

  sidebar: {
    width: "255px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #111827 0%, #172554 100%)",
    color: "#fff",
    padding: "24px 16px",
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },

  sidebarMobileOpen: {
    transform: "translateX(0)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 8px 28px",
  },

  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #6366f1, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.35)",
  },

  brandName: {
    fontSize: "16px",
    fontWeight: "800",
  },

  brandSub: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "3px",
  },

  navTitle: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#64748b",
    padding: "0 12px 10px",
    letterSpacing: "1px",
  },

  navButton: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#cbd5e1",
    padding: "13px 14px",
    borderRadius: "10px",
    marginBottom: "5px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  navButtonActive: {
    background:
      "linear-gradient(90deg, #4f46e5, #4338ca)",
    color: "#fff",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.25)",
  },

  sidebarBottom: {
    marginTop: "auto",
  },

  adminMiniCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    marginBottom: "10px",
  },

  avatarSmall: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #6366f1, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  adminMiniName: {
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "155px",
  },

  adminMiniRole: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  logoutButton: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#cbd5e1",
    padding: "11px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
  },

  mobileHeader: {
    display: "none",
  },

  menuButton: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
  },

  main: {
    marginLeft: "255px",
    width: "calc(100% - 255px)",
    minHeight: "100vh",
    padding: "28px 34px",
    boxSizing: "border-box",
  },

  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  breadcrumb: {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "5px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#172033",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    padding: "8px 14px 8px 8px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 3px 12px rgba(15,23,42,0.04)",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  profileName: {
    fontSize: "13px",
    fontWeight: "700",
  },

  profileRole: {
    fontSize: "10px",
    color: "#64748b",
    marginTop: "2px",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "13px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    padding: "13px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  messageClose: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: "18px",
  },

  welcomeCard: {
    borderRadius: "18px",
    padding: "26px",
    background:
      "linear-gradient(135deg, #4338ca 0%, #4f46e5 45%, #0891b2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    boxShadow:
      "0 15px 35px rgba(79,70,229,0.22)",
    marginBottom: "22px",
  },

  welcomeSmall: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    opacity: 0.75,
  },

  welcomeTitle: {
    margin: "8px 0 6px",
    fontSize: "25px",
  },

  welcomeText: {
    margin: 0,
    fontSize: "13px",
    opacity: 0.85,
  },

  welcomeIcon: {
    width: "75px",
    height: "75px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.13)",
    border:
      "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "900",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "25px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.05)",
    borderLeft: "1px solid #eef2f7",
    borderRight: "1px solid #eef2f7",
    borderBottom: "1px solid #eef2f7",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
  },

  statLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
  },

  statNumber: {
    fontSize: "25px",
    fontWeight: "800",
    marginTop: "2px",
  },

  statFooter: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "2px",
  },

  statusText: {
    fontSize: "14px",
    fontWeight: "800",
    marginTop: "5px",
  },

  section: {
    marginBottom: "24px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },

  quickCard: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    cursor: "pointer",
    textAlign: "left",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  quickIcon: {
    width: "43px",
    height: "43px",
    minWidth: "43px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
  },

  quickCard: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    cursor: "pointer",
    textAlign: "left",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  arrow: {
    marginLeft: "auto",
    color: "#94a3b8",
    fontSize: "20px",
  },

  availabilityCard: {
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  largeStatusDot: {
    width: "15px",
    height: "15px",
    minWidth: "15px",
    borderRadius: "50%",
    boxShadow:
      "0 0 0 6px rgba(79,70,229,0.07)",
  },

  availabilityLabel: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600",
  },

  availabilityStatus: {
    fontSize: "19px",
    fontWeight: "800",
    marginTop: "3px",
  },

  availabilityMessage: {
    fontSize: "12px",
    color: "#475569",
    marginTop: "5px",
  },

  returnTime: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "4px",
  },

  liveBadge: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#16a34a",
    background: "#dcfce7",
    padding: "6px 9px",
    borderRadius: "20px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "15px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  formIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
  },

  formTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
  },

  formSubtitle: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    padding: "11px 12px",
    fontSize: "13px",
    outline: "none",
    background: "#fff",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    padding: "11px 12px",
    fontSize: "13px",
    background: "#fff",
    outline: "none",
  },

  formActions: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "9px",
    marginTop: "2px",
  },

  primaryButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #4f46e5, #4338ca)",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "9px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow:
      "0 5px 12px rgba(79,70,229,0.2)",
  },

  secondaryButton: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#475569",
    padding: "11px 18px",
    borderRadius: "9px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "15px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "800",
    padding: "13px 15px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 15px",
    fontSize: "12px",
    color: "#334155",
    borderBottom: "1px solid #eef2f7",
    verticalAlign: "middle",
  },

  badge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  actionGroup: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
  },

  editButton: {
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  dangerButton: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#475569",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  activateButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  countBadge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "7px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  personCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  personAvatar: {
    width: "35px",
    height: "35px",
    minWidth: "35px",
    borderRadius: "10px",
    background: "#ecfeff",
    color: "#0891b2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "13px",
  },

  mutedText: {
    color: "#94a3b8",
    fontSize: "10px",
    marginTop: "3px",
  },

  emptyState: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
  },

  footer: {
    borderTop: "1px solid #e2e8f0",
    marginTop: "35px",
    padding: "18px 0 5px",
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "10px",
  },
};

// ==================================================
// RESPONSIVE CSS
// ==================================================

const responsiveStyle = document.createElement(
  "style"
);

responsiveStyle.innerHTML = `
  @media (max-width: 1000px) {
    .admin-dashboard-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 800px) {
    body {
      overflow-x: hidden;
    }
  }

  @media (max-width: 700px) {
    .admin-dashboard-mobile {
      display: block;
    }
  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "admin-dashboard-responsive-style"
  )
) {
  responsiveStyle.id =
    "admin-dashboard-responsive-style";

  document.head.appendChild(
    responsiveStyle
  );
}

export default AdminDashboard;