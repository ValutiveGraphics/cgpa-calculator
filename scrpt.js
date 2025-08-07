// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpa-form");
  const courseInputs = document.getElementById("course-inputs");
  const result = document.getElementById("result");
  const addCourseBtn = document.getElementById("add-course");

  // Add new course input row
  addCourseBtn.addEventListener("click", () => {
    const newRow = document.createElement("div");
    newRow.className = "course-row";
    newRow.innerHTML = `
      <input type="text" placeholder="Course Code (e.g. MTH101)" class="course-code" required />
      <select class="grade" required>
        <option value="">Grade</option>
        <option value="5">A</option>
        <option value="4">B</option>
        <option value="3">C</option>
        <option value="2">D</option>
        <option value="1">E</option>
        <option value="0">F</option>
      </select>
      <input type="number" placeholder="Units" class="units" min="1" max="6" required />
    `;
    courseInputs.appendChild(newRow);
  });

  // Handle CGPA calculation
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let totalUnits = 0;
    let totalPoints = 0;
    const rows = document.querySelectorAll(".course-row");

    rows.forEach((row) => {
      const grade = parseFloat(row.querySelector(".grade").value);
      const units = parseFloat(row.querySelector(".units").value);
      if (!isNaN(grade) && !isNaN(units)) {
        totalUnits += units;
        totalPoints += grade * units;
      }
    });

    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : 0;
    result.innerHTML = `<h2>Your CGPA is: <span>${cgpa}</span></h2>`;
  });
});
