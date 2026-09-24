import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const API_URL = "https://hod-availability-backend.onrender.com";

function App() {
  // =========================
  // INITIAL PAGE
  // =========================

  const getInitialPage = () => {
    const path = window.location.pathname;

    if (path === "/admin") {
      return "admin-login";
    }

    if (path === "/faculty") {
      return "faculty-login";
    }

    if (path === "/viewer") {
      return "viewer";
    }

    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

  // =========================
  // HOD STATE
  // =========================

  const [hodId, setHodId] = useState("");
  const [hodPassword, setHodPassword] = useState("");
  const [hodError, setHodError] = useState("");
  const [hodLoading, setHodLoading] = useState(false);

  const [hodUser, setHodUser] = useState(() => {
    const saved = sessionStorage.getItem("hodUser");

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  // =========================
  // HOD AVAILABILITY STATUS STATE
  // =========================

  const [hodStatus, setHodStatus] = useState(null);
  const [hodStatusMessage, setHodStatusMessage] = useState("");
  const [hodExpectedReturn, setHodExpectedReturn] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  // =========================
  // FACULTY STATE
  // =========================

  const [facultyId, setFacultyId] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyError, setFacultyError] = useState("");
  const [facultyLoading, setFacultyLoading] = useState(false);

  const [facultyUser, setFacultyUser] = useState(() => {
    const saved = sessionStorage.getItem("facultyUser");

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

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
            hodId: hodId,
            password: hodPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setHodError(
          data.error || "Invalid HOD ID or password."
        );
        return;
      }

      sessionStorage.setItem("hodToken", data.token);

      sessionStorage.setItem(
        "hodUser",
        JSON.stringify(data.user)
      );

      setHodUser(data.user);
      setPage("hod-dashboard");
    } catch (error) {
      console.error("HOD login error:", error);
      setHodError("Unable to connect to the server.");
    } finally {
      setHodLoading(false);
    }
  };

  // =========================
  // HOD LOGOUT
  // =========================

  const handleHodLogout = () => {
    sessionStorage.removeItem("hodToken");
    sessionStorage.removeItem("hodUser");

    setHodUser(null);
    setHodId("");
    setHodPassword("");
    setHodStatus(null);
    setHodStatusMessage("");
    setHodExpectedReturn("");
    setStatusError("");
    setStatusSuccess("");
    setPage("home");

    window.history.pushState({}, "", "/");
  };

  // =========================
  // HOD STATUS: FETCH
  // =========================

  const fetchHodStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      const data = await response.json();

      if (response.ok) {
        setHodStatus(data.status || "Available");
        setHodStatusMessage(data.message || "");
        setHodExpectedReturn(data.expectedReturnTime || "");
      }
    } catch (error) {
      console.error("Fetch status error:", error);
    }
  };

  // =========================
  // HOD STATUS: UPDATE
  // =========================

  const handleUpdateStatus = async (newStatus) => {
    setStatusError("");
    setStatusSuccess("");
    setStatusLoading(true);

    try {
      const token = sessionStorage.getItem("hodToken");

      const response = await fetch(`${API_URL}/api/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          message: hodStatusMessage,
          expectedReturnTime:
            newStatus === "Unavailable" ? hodExpectedReturn : "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusError(data.error || "Unable to update status.");
        return;
      }

      setHodStatus(data.status);
      setHodStatusMessage(data.message || "");
      setHodExpectedReturn(data.expectedReturnTime || "");
      setStatusSuccess("Status updated successfully.");
    } catch (error) {
      console.error("Update status error:", error);
      setStatusError("Unable to connect to the server.");
    } finally {
      setStatusLoading(false);
    }
  };

  // Fetch current status whenever the HOD dashboard is shown
  useEffect(() => {
    if (page === "hod-dashboard") {
      fetchHodStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // =========================
  // FACULTY LOGIN
  // =========================

  const handleFacultyLogin = async (e) => {
    e.preventDefault();

    setFacultyError("");

    if (!facultyId || !facultyPassword) {
      setFacultyError(
        "Please enter Faculty ID and password."
      );
      return;
    }

    setFacultyLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/faculty-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            facultyId: facultyId,
            password: facultyPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFacultyError(
          data.error || "Invalid Faculty ID or password."
        );
        return;
      }

      sessionStorage.setItem(
        "facultyToken",
        data.token
      );

      sessionStorage.setItem(
        "facultyUser",
        JSON.stringify(data.user)
      );

      setFacultyUser(data.user);
      setPage("faculty-dashboard");

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
        "Unable to connect to the server."
      );
    } finally {
      setFacultyLoading(false);
    }
  };

  // =========================
  // FACULTY LOGOUT
  // =========================

  const handleFacultyLogout = () => {
    sessionStorage.removeItem("facultyToken");
    sessionStorage.removeItem("facultyUser");

    setFacultyUser(null);
    setFacultyId("");
    setFacultyPassword("");
    setPage("home");

    window.history.pushState({}, "", "/");
  };

  // =========================
  // ADMIN LOGIN
  // =========================

  const handleAdminLogin = (user) => {
    console.log("Admin logged in:", user);

    sessionStorage.setItem(
      "adminUser",
      JSON.stringify(user)
    );

    setPage("admin-dashboard");

    window.history.pushState(
      {},
      "",
      "/admin"
    );
  };

  // =========================
  // ADMIN LOGOUT
  // =========================

  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");

    setPage("home");

    window.history.pushState({}, "", "/");
  };

  // =========================
  // HOME
  // =========================

  if (page === "home") {
    return (
      <div className="login-page">
        <div className="login-card">

          <h1>HOD Availability System</h1>

          <p className="login-subtitle">
            Select your login
          </p>

          <button
            onClick={() => {
              setPage("hod-login");

              window.history.pushState(
                {},
                "",
                "/"
              );
            }}
          >
            HOD Login
          </button>

          <button
            onClick={() => {
              setPage("faculty-login");

              window.history.pushState(
                {},
                "",
                "/faculty"
              );
            }}
            style={{ marginTop: "12px" }}
          >
            Faculty Login
          </button>

          <button
            onClick={() => {
              setPage("admin-login");

              window.history.pushState(
                {},
                "",
                "/admin"
              );
            }}
            style={{ marginTop: "12px" }}
          >
            Admin Login
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // HOD LOGIN
  // =========================

  if (page === "hod-login") {
    return (
      <div className="login-page">
        <div className="login-card">

          <h1>HOD Login</h1>

          <p className="login-subtitle">
            HOD Availability System
          </p>

          <form onSubmit={handleHodLogin}>

            <label>HOD ID</label>

            <input
              type="text"
              placeholder="Enter HOD ID"
              value={hodId}
              onChange={(e) =>
                setHodId(e.target.value)
              }
              autoComplete="username"
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={hodPassword}
              onChange={(e) =>
                setHodPassword(e.target.value)
              }
              autoComplete="current-password"
            />

            {hodError && (
              <div className="login-error">
                {hodError}
              </div>
            )}

            <button
              type="submit"
              disabled={hodLoading}
            >
              {hodLoading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <button
            onClick={() => {
              setPage("home");

              window.history.pushState(
                {},
                "",
                "/"
              );
            }}
            style={{ marginTop: "12px" }}
          >
            ← Back
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // FACULTY LOGIN
  // =========================

  if (page === "faculty-login") {
    return (
      <div className="login-page">
        <div className="login-card">

          <h1>Faculty Login</h1>

          <p className="login-subtitle">
            Faculty Availability System
          </p>

          <form onSubmit={handleFacultyLogin}>

            <label>Faculty ID</label>

            <input
              type="text"
              placeholder="Enter Faculty ID"
              value={facultyId}
              onChange={(e) =>
                setFacultyId(e.target.value)
              }
              autoComplete="username"
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={facultyPassword}
              onChange={(e) =>
                setFacultyPassword(e.target.value)
              }
              autoComplete="current-password"
            />

            {facultyError && (
              <div className="login-error">
                {facultyError}
              </div>
            )}

            <button
              type="submit"
              disabled={facultyLoading}
            >
              {facultyLoading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <button
            onClick={() => {
              setPage("home");

              window.history.pushState(
                {},
                "",
                "/"
              );
            }}
            style={{ marginTop: "12px" }}
          >
            ← Back
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // ADMIN LOGIN
  // =========================

  if (page === "admin-login") {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
      />
    );
  }

  // =========================
  // HOD DASHBOARD
  // =========================

  if (page === "hod-dashboard") {
    return (
      <div className="login-page">
        <div className="login-card">

          <h1>HOD Dashboard</h1>

          <p className="login-subtitle">
            Welcome, {hodUser?.name || "HOD"}
          </p>

          <p>
            Current Status:{" "}
            {hodStatus === "Available"
              ? "🟢 Available"
              : hodStatus === "Unavailable"
              ? "🔴 Unavailable"
              : "Loading..."}
          </p>

          <label>Status Message (optional)</label>

          <input
            type="text"
            placeholder="e.g. In a meeting"
            value={hodStatusMessage}
            onChange={(e) =>
              setHodStatusMessage(e.target.value)
            }
          />

          {hodStatus === "Unavailable" && (
            <>
              <label>Expected Return</label>

              <input
                type="text"
                placeholder="e.g. 3:00 PM"
                value={hodExpectedReturn}
                onChange={(e) =>
                  setHodExpectedReturn(e.target.value)
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
            <div style={{ color: "green", marginTop: "8px" }}>
              {statusSuccess}
            </div>
          )}

          <button
            onClick={() => handleUpdateStatus("Available")}
            disabled={statusLoading}
            style={{ marginTop: "12px" }}
          >
            Mark as Available
          </button>

          <button
            onClick={() => handleUpdateStatus("Unavailable")}
            disabled={statusLoading}
            style={{ marginTop: "12px" }}
          >
            Mark as Unavailable
          </button>

          <button
            onClick={handleHodLogout}
            style={{ marginTop: "12px" }}
          >
            Logout
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // FACULTY DASHBOARD
  // =========================

  if (page === "faculty-dashboard") {
    return (
      <div className="login-page">
        <div className="login-card">

          <h1>Faculty Dashboard</h1>

          <p className="login-subtitle">
            Welcome,{" "}
            {facultyUser?.name || "Faculty"}
          </p>

          <p>
            Faculty ID:{" "}
            {facultyUser?.facultyId || "-"}
          </p>

          <p>
            Department:{" "}
            {facultyUser?.department?.code || "-"}
          </p>

          <p>
            {facultyUser?.department?.name || ""}
          </p>

          <button onClick={handleFacultyLogout}>
            Logout
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (page === "admin-dashboard") {
    let adminUser = null;

    try {
      adminUser = JSON.parse(
        sessionStorage.getItem(
          "adminUser"
        ) || "null"
      );
    } catch {
      adminUser = null;
    }

    return (
      <AdminDashboard
        adminUser={adminUser}
        onLogout={handleAdminLogout}
      />
    );
  }

  // =========================
  // FALLBACK
  // =========================

  return null;
}

export default App;
