document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpa-form");
  const result = document.getElementById("result");
  const addCourseBtn = document.getElementById("add-course");
  const clearBtn = document.getElementById("clear-data");
  const exportBtn = document.getElementById("export-csv");
  const darkModeOnBtn = document.getElementById("dark-on");
  const darkModeOffBtn = document.getElementById("dark-off");
  const progressFill = document.getElementById("progress-fill");

  function calculateCGPA() {
    const units = document.querySelectorAll(".unit");
    const grades = document.querySelectorAll(".grade");

    let totalPoints = 0;
    let totalUnits = 0;

    units.forEach((unitInput, index) => {
      const unit = parseFloat(unitInput.value);
      const grade = grades[index].value;

      if (!isNaN(unit) && grade) {
        const point = getPointFromGrade(grade);
        totalPoints += unit * point;
        totalUnits += unit;
      }
    });

    const cgpa = totalUnits ? (totalPoints / totalUnits).toFixed(2) : 0.0;
    result.textContent = `Your CGPA is: ${cgpa}`;

    const percentage = totalUnits > 0 ? Math.min((totalUnits / 25) * 100, 100) : 0;
    progressFill.style.width = percentage + "%";
  }

  function getPointFromGrade(grade) {
    const points = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
    return points[grade.toUpperCase()] || 0;
  }

  function addCourseRow() {
    const courseRow = document.createElement("div");
    courseRow.classList.add("course-row");

    courseRow.innerHTML = `
      <input type="text" class="course" placeholder="Course Title" required />
      <input type="number" class="unit" placeholder="Unit" min="0" required />
      <select class="grade" required>
        <option value="">Grade</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
      </select>
      <button type="button" class="delete-course">Remove</button>
    `;

    form.insertBefore(courseRow, result);

    courseRow.querySelector(".unit").addEventListener("input", calculateCGPA);
    courseRow.querySelector(".grade").addEventListener("change", calculateCGPA);
    courseRow.querySelector(".delete-course").addEventListener("click", () => {
      courseRow.remove();
      calculateCGPA();
    });
  }

  function clearData() {
    const courseRows = document.querySelectorAll(".course-row");
    courseRows.forEach(row => row.remove());
    result.textContent = "Your CGPA is: 0.00";
    progressFill.style.width = "0%";
  }

  function exportToCSV() {
    let csv = "Course,Unit,Grade\\n";
    document.querySelectorAll(".course-row").forEach(row => {
      const course = row.querySelector(".course").value;
      const unit = row.querySelector(".unit").value;
      const grade = row.querySelector(".grade").value;
      csv += `${course},${unit},${grade}\\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cgpa_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  addCourseBtn.addEventListener("click", addCourseRow);
  clearBtn.addEventListener("click", clearData);
  exportBtn.addEventListener("click", exportToCSV);
  darkModeOnBtn.addEventListener("click", () => document.body.classList.add("dark-mode"));
  darkModeOffBtn.addEventListener("click", () => document.body.classList.remove("dark-mode"));

  // Initial row
  addCourseRow();
});
