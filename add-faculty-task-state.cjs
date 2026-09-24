const fs = require("fs");

const path = "src/App.jsx";
let content = fs.readFileSync(path, "utf8");

const marker = `const [editingPeriod, setEditingPeriod] = useState(null);`;

if (!content.includes(marker)) {
  console.log("Faculty timetable state marker not found.");
  process.exit(1);
}

const block = `const [facultyTasks, setFacultyTasks] = useState([]);
const [facultyTasksLoading, setFacultyTasksLoading] = useState(false);
const [facultyTasksError, setFacultyTasksError] = useState("");
const [facultyTasksSuccess, setFacultyTasksSuccess] = useState("");
const [editingTaskId, setEditingTaskId] = useState(null);

const [taskForm, setTaskForm] = useState({
  taskDate: "",
  dayOfWeek: "Monday",
  periodNo: "1",
  taskName: "",
  taskDescription: "",
  statusLevel: "L1",
});

`;

content = content.replace(
  marker,
  marker + "\\n\\n" + block
);

fs.writeFileSync(path, content, "utf8");

console.log("Faculty Task state added successfully.");