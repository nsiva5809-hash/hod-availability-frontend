const fs = require("fs");

const file = "src/App.jsx";
let c = fs.readFileSync(file, "utf8");

let changed = false;

if (c.includes("department.department_code")) {
  c = c.replace(
    /department\.department_code/g,
    "department.code"
  );
  changed = true;
}

if (c.includes("department.department_name")) {
  c = c.replace(
    /department\.department_name/g,
    "department.name"
  );
  changed = true;
}

if (!changed) {
  console.error(
    "Student department field names were not found."
  );
  process.exit(1);
}

fs.writeFileSync(file, c);

console.log(
  "Student department dropdown fixed successfully."
);