document.addEventListener('DOMContentLoaded', () => {
  const courseInputs = document.getElementById('course-inputs');
  const addCourseBtn = document.getElementById('add-course');
  const form = document.getElementById('cgpa-form');
  const resultDiv = document.getElementById('result');

  // Function to create a new course input row
  function createCourseRow() {
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `
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
    courseInputs.appendChild(row);
  }

  // Add first row on load
  createCourseRow();

  // Add new course row on button click
  addCourseBtn.addEventListener('click', createCourseRow);

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const rows = document.querySelectorAll('.course-row');
    let totalPoints = 0;
    let totalUnits = 0;

    rows.forEach((row) => {
      const grade = parseInt(row.querySelector('.grade').value);
      const units = parseInt(row.querySelector('.units').value);

      if (!isNaN(grade) && !isNaN(units)) {
        totalPoints += grade * units;
        totalUnits += units;
      }
    });

    if (totalUnits === 0) {
      resultDiv.textContent = 'Please enter valid courses and units.';
    } else {
      const cgpa = (totalPoints / totalUnits).toFixed(2);
      resultDiv.innerHTML = `<h2>Your CGPA is: ${cgpa}</h2>`;
    }
  });
});
