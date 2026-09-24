const fs = require("fs");

const file = "src/App.jsx";
let c = fs.readFileSync(file, "utf8");

const oldFunction = `const getFreeTaskPeriods = (dateValue, editingPeriod = null) => {
  const day = getDayFromTaskDate(dateValue);

  if (!day) {
    return [];
  }

  const occupiedPeriods = facultyTimetable
    .filter(
      (item) =>
        item.day_of_week === day &&
        Number(item.period_no) !== Number(editingPeriod)
    )
    .map((item) => Number(item.period_no));

  return Object.keys(periodTimes)
    .map(Number)
    .filter(
      (periodNo) => !occupiedPeriods.includes(periodNo)
    );
};`;

const newFunction = `const getFreeTaskPeriods = (dateValue, editingPeriod = null) => {
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
};`;

if (!c.includes(oldFunction)) {
  console.error("Existing getFreeTaskPeriods function not found.");
  process.exit(1);
}

c = c.replace(oldFunction, newFunction);

fs.writeFileSync(file, c);

console.log(
  "Faculty task period conflict logic updated successfully."
);