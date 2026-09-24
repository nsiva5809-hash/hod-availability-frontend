import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function AdminDashboard({ adminUser, onLogout }) {
  // ==================================================
  // DEPARTMENTS
  // ==================================================

  const [departments, setDepartments] = useState([]);

  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // ==================================================
  // HODS
  // ==================================================

  const [hods, setHods] = useState([]);
  const [hodLoading, setHodLoading] = useState(false);

  // ==================================================
  // HOD AVAILABILITY
  // ==================================================

  const [hodAvailability, setHodAvailability] = useState({
    status: "Loading...",
    message: "",
    expectedReturnTime: "",
  });

  const [statusLoading, setStatusLoading] = useState(false);

  // ==================================================
  // FACULTY
  // ==================================================

  const [faculties, setFaculties] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultySaving, setFacultySaving] = useState(false);

  const [facultyEditingId, setFacultyEditingId] =
    useState(null);

  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyPassword, setFacultyPassword] =
    useState("");
  const [facultyDepartmentId, setFacultyDepartmentId] =
    useState("");

  // ==================================================
  // MESSAGES
  // ==================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // LOAD DEPARTMENTS
  // ==================================================

  const loadDepartments = async () => {
    setLoading(true);

    try {
      const token =
        sessionStorage.getItem("adminToken");

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
          data.error ||
            "Unable to load departments"
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
      const token =
        sessionStorage.getItem("adminToken");

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
          data.error ||
            "Unable to load HODs"
        );
      }

      setHods(data);
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
      const token =
        sessionStorage.getItem("adminToken");

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
          data.error ||
            "Unable to load faculty"
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
  // LOAD HOD AVAILABILITY
  // ==================================================

  const loadHodAvailability = async () => {
    setStatusLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/status`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load HOD availability"
        );
      }

      setHodAvailability({
        status:
          data.status || "Not Available",
        message: data.message || "",
        expectedReturnTime:
          data.expectedReturnTime || "",
      });
    } catch (error) {
      console.error(
        "HOD availability error:",
        error
      );

      setHodAvailability({
        status: "Unable to load",
        message: "",
        expectedReturnTime: "",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // ==================================================
  // LOAD ALL DATA
  // ==================================================

  useEffect(() => {
    loadDepartments();
    loadHods();
    loadFaculties();
    loadHodAvailability();

    const interval = setInterval(() => {
      loadHodAvailability();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==================================================
  // CLEAR DEPARTMENT FORM
  // ==================================================

  const clearForm = () => {
    setDepartmentCode("");
    setDepartmentName("");
    setEditingId(null);
  };

  // ==================================================
  // ADD / UPDATE DEPARTMENT
  // ==================================================

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
      const token =
        sessionStorage.getItem("adminToken");

      const url = editingId
        ? `${API_URL}/api/admin/departments/${editingId}`
        : `${API_URL}/api/admin/departments`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentCode:
            departmentCode.trim(),
          departmentName:
            departmentName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save department"
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

  // ==================================================
  // EDIT DEPARTMENT
  // ==================================================

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // ACTIVATE / DEACTIVATE DEPARTMENT
  // ==================================================

  const handleStatusChange = async (
    department
  ) => {
    setError("");
    setSuccess("");

    try {
      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/departments/${department.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
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
  // ASSIGN HOD TO DEPARTMENT
  // ==================================================

  const handleAssignDepartment = async (
    hod,
    departmentId
  ) => {
    setError("");
    setSuccess("");

    if (!departmentId) {
      return;
    }

    try {
      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/hods/${hod.id}/department`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departmentId:
              Number(departmentId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to assign department"
        );
      }

      setSuccess(
        `Department assigned to ${hod.name} successfully.`
      );

      await loadHods();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ==================================================
  // ACTIVATE / DEACTIVATE HOD
  // ==================================================

  const handleHodStatusChange = async (
    hod
  ) => {
    setError("");
    setSuccess("");

    try {
      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/hods/${hod.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
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
          data.error ||
            "Unable to change HOD status"
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
  // CLEAR FACULTY FORM
  // ==================================================

  const clearFacultyForm = () => {
    setFacultyId("");
    setFacultyName("");
    setFacultyPassword("");
    setFacultyDepartmentId("");
    setFacultyEditingId(null);
  };

  // ==================================================
  // ADD / UPDATE FACULTY
  // ==================================================

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
      setError(
        "Please select a department."
      );
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
        departmentId:
          Number(facultyDepartmentId),
      };

      // Password is required when adding.
      // During editing it is optional.
      if (facultyPassword) {
        body.password = facultyPassword;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
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
      console.error(error);
      setError(error.message);
    } finally {
      setFacultySaving(false);
    }
  };

  // ==================================================
  // EDIT FACULTY
  // ==================================================

  const handleFacultyEdit = (faculty) => {
    setFacultyId(
      faculty.faculty_id || ""
    );

    setFacultyName(
      faculty.name || ""
    );

    setFacultyPassword("");

    setFacultyDepartmentId(
      faculty.department_id != null
        ? String(faculty.department_id)
        : ""
    );

    setFacultyEditingId(faculty.id);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // ACTIVATE / DEACTIVATE FACULTY
  // ==================================================

  const handleFacultyStatusChange = async (
    faculty
  ) => {
    setError("");
    setSuccess("");

    try {
      const token =
        sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/faculty/${faculty.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            active: !faculty.active,
          }),
        }
      );

      const data = await response.json();

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
      console.error(error);
      setError(error.message);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    sessionStorage.removeItem(
      "adminToken"
    );

    sessionStorage.removeItem(
      "adminUser"
    );

    onLogout();
  };

  // ==================================================
  // STATUS DISPLAY HELPERS
  // ==================================================

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "#2e7d32";

      case "In Meeting":
        return "#f57c00";

      case "Away":
        return "#1565c0";

      case "Not Available":
        return "#c62828";

      default:
        return "#555";
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case "Available":
        return "#e8f5e9";

      case "In Meeting":
        return "#fff3e0";

      case "Away":
        return "#e3f2fd";

      case "Not Available":
        return "#ffebee";

      default:
        return "#f5f5f5";
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="login-page">
      <div
        className="login-card"
        style={{
          maxWidth: "1100px",
          width: "95%",
        }}
      >
        <h1>Admin Dashboard</h1>

        <p className="login-subtitle">
          Welcome,{" "}
          {adminUser?.name ||
            "Administrator"}
        </p>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        {error && (
          <div
            className="login-error"
            style={{
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}

        <hr />

        {/* ==================================================
            DEPARTMENT MANAGEMENT
        ================================================== */}

        <h2>Department Management</h2>

        <p>
          Add and manage departments in
          the institution.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Department Code
          </label>

          <input
            type="text"
            placeholder="Example: CSE"
            value={departmentCode}
            onChange={(e) =>
              setDepartmentCode(
                e.target.value.toUpperCase()
              )
            }
          />

          <label>
            Department Name
          </label>

          <input
            type="text"
            placeholder="Example: Computer Science and Engineering"
            value={departmentName}
            onChange={(e) =>
              setDepartmentName(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            disabled={saving}
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
              style={{
                marginTop: "10px",
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <hr />

        {/* ==================================================
            DEPARTMENT LIST
        ================================================== */}

        <h2>Departments</h2>

        {loading ? (
          <p>
            Loading departments...
          </p>
        ) : departments.length === 0 ? (
          <p>
            No departments found. Add your
            first department above.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Code
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Department Name
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Status
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
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
                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {
                          department.department_code
                        }
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {
                          department.department_name
                        }
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        {department.active
                          ? "Active"
                          : "Inactive"}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleEdit(
                              department
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              department
                            )
                          }
                          style={{
                            marginLeft:
                              "8px",
                          }}
                        >
                          {department.active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <hr />

        {/* ==================================================
            HOD MANAGEMENT
        ================================================== */}

        <h2>HOD Management</h2>

        <p>
          Manage HODs, assign them to
          departments, and monitor their
          current availability.
        </p>

        {hodLoading ? (
          <p>Loading HODs...</p>
        ) : hods.length === 0 ? (
          <p>No HODs found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    HOD ID
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Name
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Department
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Current Status
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Expected Return
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Account Status
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {hods.map((hod) => (
                  <tr
                    key={hod.id}
                  >
                    <td
                      style={
                        tableCellStyle
                      }
                    >
                      {hod.hod_id}
                    </td>

                    <td
                      style={
                        tableCellStyle
                      }
                    >
                      {hod.name}
                    </td>

                    <td
                      style={
                        tableCellStyle
                      }
                    >
                      <select
                        value={
                          hod.department_id !=
                          null
                            ? String(
                                hod.department_id
                              )
                            : ""
                        }
                        onChange={(e) =>
                          handleAssignDepartment(
                            hod,
                            e.target
                              .value
                          )
                        }
                        disabled={
                          !hod.active
                        }
                        style={{
                          padding:
                            "8px",
                          width:
                            "100%",
                        }}
                      >
                        <option value="">
                          Select Department
                        </option>

                        {departments
                          .filter(
                            (
                              department
                            ) =>
                              department.active
                          )
                          .map(
                            (
                              department
                            ) => (
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
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      {statusLoading ? (
                        <span>
                          Loading...
                        </span>
                      ) : (
                        <span
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "6px 12px",
                            borderRadius:
                              "20px",
                            background:
                              getStatusBackground(
                                hodAvailability.status
                              ),
                            color:
                              getStatusColor(
                                hodAvailability.status
                              ),
                            fontWeight:
                              "bold",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {hodAvailability.status ===
                          "Available"
                            ? "🟢 Available"
                            : hodAvailability.status ===
                              "In Meeting"
                            ? "🟠 In Meeting"
                            : hodAvailability.status ===
                              "Away"
                            ? "🔵 Away"
                            : hodAvailability.status ===
                              "Not Available"
                            ? "🔴 Not Available"
                            : hodAvailability.status}
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      {hodAvailability.status ===
                        "Away" &&
                      hodAvailability.expectedReturnTime
                        ? hodAvailability.expectedReturnTime
                        : "—"}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      {hod.active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      <button
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================================================
            HOD AVAILABILITY INFORMATION
        ================================================== */}

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background:
              "#f5f5f5",
            borderRadius: "8px",
            border:
              "1px solid #ddd",
          }}
        >
          <strong>
            HOD Availability
          </strong>

          <p
            style={{
              marginBottom: "5px",
            }}
          >
            The current status is
            automatically refreshed
            every 10 seconds.
          </p>

          {hodAvailability.message && (
            <p
              style={{
                marginBottom: "5px",
              }}
            >
              <strong>
                Message:
              </strong>{" "}
              {
                hodAvailability.message
              }
            </p>
          )}
        </div>

        <hr />

        {/* ==================================================
            FACULTY MANAGEMENT
        ================================================== */}

        <h2>Faculty Management</h2>

        <p>
          Add, edit, activate, or
          deactivate faculty members and
          assign them to departments.
        </p>

        {/* ==================================================
            FACULTY FORM
        ================================================== */}

        <form
          onSubmit={
            handleFacultySubmit
          }
        >
          <label>
            Faculty ID
          </label>

          <input
            type="text"
            placeholder="Example: FAC001"
            value={facultyId}
            onChange={(e) =>
              setFacultyId(
                e.target.value.toUpperCase()
              )
            }
          />

          <label>
            Faculty Name
          </label>

          <input
            type="text"
            placeholder="Example: Dr. John Kumar"
            value={facultyName}
            onChange={(e) =>
              setFacultyName(
                e.target.value
              )
            }
          />

          <label>
            Password
          </label>

          <input
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

          <label>
            Department
          </label>

          <select
            value={facultyDepartmentId}
            onChange={(e) =>
              setFacultyDepartmentId(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
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
              ))}
          </select>

          <button
            type="submit"
            disabled={
              facultySaving
            }
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
              style={{
                marginTop: "10px",
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <hr />

        {/* ==================================================
            FACULTY LIST
        ================================================== */}

        <h2>Faculty List</h2>

        {facultyLoading ? (
          <p>
            Loading faculty...
          </p>
        ) : faculties.length ===
          0 ? (
          <p>
            No faculty found. Add your
            first faculty member above.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Faculty ID
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Name
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Department
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
                    Account Status
                  </th>

                  <th
                    style={
                      tableHeaderStyle
                    }
                  >
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
                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {
                          faculty.faculty_id
                        }
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {faculty.name}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {faculty.departments
                          ? `${faculty.departments.department_code} - ${faculty.departments.department_name}`
                          : "Not Assigned"}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        {faculty.active
                          ? "Active"
                          : "Inactive"}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleFacultyEdit(
                              faculty
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleFacultyStatusChange(
                              faculty
                            )
                          }
                          style={{
                            marginLeft:
                              "8px",
                          }}
                        >
                          {faculty.active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <hr />

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// ==================================================
// TABLE STYLES
// ==================================================

const tableHeaderStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f5f5f5",
};

const tableCellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default AdminDashboard;