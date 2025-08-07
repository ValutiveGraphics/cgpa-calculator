document.addEventListener('DOMContentLoaded', () => {
  const courseInputs = document.getElementById('course-inputs');
  const addCourseBtn = document.getElementById('add-course');
  const form = document.getElementById('cgpa-form');
  const resultDiv = document.getElementById('result');
  const semesterSelect = document.getElementById('semester-select');
  const clearDataBtn = document.getElementById('clear-data');
  const exportCSVBtn = document.getElementById('export-csv');
  const progressFill = document.querySelector('.progress-fill');
  const toggleDarkMode = document.querySelector('.toggle-dark-mode');

  // Toggle dark mode with on/off button
  toggleDarkMode.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggleDarkMode.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
  });

  function saveSession() {
    const data = Array.from(document.querySelectorAll('.course-row')).map(row => ({
      code: row.querySelector('.course-code').value,
      grade: row.querySelector('.grade').value,
      units: row.querySelector('.units').value
    }));
    const semester = semesterSelect.value;
    localStorage.setItem('cgpa-data', JSON.stringify({ semester, data }));
  }

  function loadSession() {
    const stored = localStorage.getItem('cgpa-data');
    if (stored) {
      const { semester, data } = JSON.parse(stored);
      semesterSelect.value = semester;
      data.forEach(item => createCourseRow(item.code, item.grade, item.units));
    } else {
      createCourseRow();
    }
  }

  clearDataBtn.addEventListener('click', () => {
    localStorage.removeItem('cgpa-data');
    courseInputs.innerHTML = '';
    resultDiv.innerHTML = '';
    createCourseRow();
    updateProgress(0);
  });

  function createCourseRow(code = '', grade = '', units = '') {
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `
      <input type="text" placeholder="Course Code (e.g. MTH101)" class="course-code" value="${code}" required />
      <select class="grade" required>
        <option value="">Grade</option>
        <option value="5" ${grade === '5' ? 'selected' : ''}>A</option>
        <option value="4" ${grade === '4' ? 'selected' : ''}>B</option>
        <option value="3" ${grade === '3' ? 'selected' : ''}>C</option>
        <option value="2" ${grade === '2' ? 'selected' : ''}>D</option>
        <option value="1" ${grade === '1' ? 'selected' : ''}>E</option>
        <option value="0" ${grade === '0' ? 'selected' : ''}>F</option>
      </select>
      <input type="number" placeholder="Units" class="units" min="1" max="6" value="${units}" required />
      <button type="button" class="delete-course">Remove</button>
    `;

    row.querySelector('.delete-course').addEventListener('click', () => {
      row.remove();
      saveSession();
      calculateCGPA();
    });

    ['input', 'change'].forEach(evt => {
      row.addEventListener(evt, () => {
        calculateCGPA();
      });
    });

    courseInputs.appendChild(row);
  }

  addCourseBtn.addEventListener('click', () => {
    createCourseRow();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    calculateCGPA();
  });

  function calculateCGPA() {
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
      updateProgress(0);
    } else {
      const cgpa = (totalPoints / totalUnits).toFixed(2);
      resultDiv.innerHTML = `<h2>${semesterSelect.value}: Your CGPA is: ${cgpa}</h2>`;
      updateProgress((cgpa / 5) * 100);
    }

    saveSession();
  }

  function updateProgress(percent) {
    progressFill.style.width = `${percent}%`;
  }

  exportCSVBtn.addEventListener('click', () => {
    const rows = document.querySelectorAll('.course-row');
    let csv = 'Course Code,Grade,Units\n';

    rows.forEach((row) => {
      const code = row.querySelector('.course-code').value;
      const grade = row.querySelector('.grade').value;
      const units = row.querySelector('.units').value;
      csv += `${code},${grade},${units}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cgpa_data.csv';
    a.click();
  });

  loadSession();
});
