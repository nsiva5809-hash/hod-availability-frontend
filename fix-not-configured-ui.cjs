const fs = require("fs");

const file = "src/App.jsx";
let c = fs.readFileSync(file, "utf8");

const oldCss = `          .student-status.default {
            background: #f1f5f9;
            color: #475569;
          }`;

const newCss = `          .student-status.default {
            background: #f1f5f9;
            color: #475569;
          }

          .student-status.not-configured {
            background: #ffffff;
            color: #475569;
            border: 1px solid #cbd5e1;
          }`;

if (!c.includes(oldCss)) {
  throw new Error("Student status CSS not found");
}

c = c.replace(oldCss, newCss);

const oldFacultyClass = `                                      : faculty.status ===
                                          "Not Available"
                                        ? "unavailable"
                                        : "default"`;

const newFacultyClass = `                                      : faculty.status ===
                                          "Not Available"
                                        ? "unavailable"
                                        : faculty.status ===
                                          "Not Configured"
                                        ? "not-configured"
                                        : "default"`;

if (!c.includes(oldFacultyClass)) {
  throw new Error("Faculty status class code not found");
}

c = c.replace(
  oldFacultyClass,
  newFacultyClass
);

const oldFacultyIcon = `                                      : faculty.status ===
                                        "Away"
                                      ? "🔵"
                                      : "🔴"`;

const newFacultyIcon = `                                      : faculty.status ===
                                        "Away"
                                      ? "🔵"
                                      : faculty.status ===
                                        "Not Configured"
                                      ? "⚪"
                                      : "🔴"`;

if (!c.includes(oldFacultyIcon)) {
  throw new Error("Faculty status icon code not found");
}

c = c.replace(
  oldFacultyIcon,
  newFacultyIcon
);

fs.writeFileSync(file, c, "utf8");

console.log(
  "Not Configured white status UI updated successfully."
);