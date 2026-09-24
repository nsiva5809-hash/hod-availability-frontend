const fs = require("fs");

const file = "src/App.jsx";
let c = fs.readFileSync(file, "utf8");

if (c.includes("{/* FACULTY TASK MANAGEMENT */}")) {
  console.log("Faculty Task UI already exists.");
  process.exit(0);
}

const ui = `
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
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            taskDate: e.target.value,
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
        Day
      </label>

      <select
        value={taskForm.dayOfWeek}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            dayOfWeek: e.target.value,
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
        {timetableDays.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
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
        {Object.entries(periodTimes).map(([period, times]) => (
          <option key={period} value={period}>
            P{period} — {times[0]} to {times[1]}
          </option>
        ))}
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
        !taskForm.taskDate ||
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

`;

const logoutMarker = "          {/* LOGOUT */}";

const logoutIndex = c.indexOf(logoutMarker);

if (logoutIndex === -1) {
  console.error("Faculty logout marker not found.");
  process.exit(1);
}

c =
  c.slice(0, logoutIndex) +
  ui +
  "\n" +
  c.slice(logoutIndex);

fs.writeFileSync(file, c);

console.log("Faculty Task UI added successfully.");