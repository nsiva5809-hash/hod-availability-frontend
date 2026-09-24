import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const API_URL = "https://hod-availability-backend.onrender.com";

function App() {
  // Detect direct URL
  const getInitialPage = () => {
    const path = window.location.pathname;

    if (path === "/admin") {
      return "admin-login";
    }

    if (path === "/viewer") {
      return "viewer";
    }

    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

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

  const handleHodLogout = () => {
    sessionStorage.removeItem("hodToken");
    sessionStorage.removeItem("hodUser");

    setHodUser(null);
    setHodId("");
    setHodPassword("");
    setPage("home");

    window.history.pushState({}, "", "/");
  };

  const handleAdminLogin = (user) => {
    console.log("Admin logged in:", user);

    sessionStorage.setItem(
      "adminUser",
      JSON.stringify(user)
    );

    setPage("admin-dashboard");

    window.history.pushState({}, "", "/admin");
  };

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
              window.history.pushState({}, "", "/");
            }}
          >
            HOD Login
          </button>

          <button
            onClick={() => {
              setPage("admin-login");
              window.history.pushState({}, "", "/admin");
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
              onChange={(e) => setHodId(e.target.value)}
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
              window.history.pushState({}, "", "/");
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
            HOD dashboard is ready.
          </p>

          <button onClick={handleHodLogout}>
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
      sessionStorage.getItem("adminUser") || "null"
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
}

export default App;