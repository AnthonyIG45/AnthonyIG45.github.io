const container = document.getElementById('grade-rows-container');
const addBtn = document.getElementById('addRowBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultDisplay = document.getElementById('resultDisplay');

// Function to create a new row
function createRow() {
    const row = document.createElement('div');
    row.className = 'grade-row';

    row.innerHTML = `
        <input type="text" placeholder="Category" class="cat-name">
        <input type="number" placeholder="Weight %" class="weight-input">
        <input type="number" placeholder="Score %" class="score-input">
        <button class="remove-btn">×</button>
    `;

    // Make the delete button work
    row.querySelector('.remove-btn').addEventListener('click', () => {
        row.remove();
    });

    container.appendChild(row);
}

// Add an initial row on page load
createRow();

// Add row when button is clicked
addBtn.addEventListener('click', createRow);

// Calculation Logic (remains similar, but grabs current rows)
calculateBtn.addEventListener('click', function() {
    const weights = document.querySelectorAll('.weight-input');
    const scores = document.querySelectorAll('.score-input');
    
    let totalGrade = 0;
    let totalWeight = 0;

    for (let i = 0; i < weights.length; i++) {
        const w = parseFloat(weights[i].value) || 0;
        const s = parseFloat(scores[i].value) || 0;
        totalGrade += (w * (s / 100));
        totalWeight += w;
    }

    resultDisplay.innerText = `Total Grade: ${totalGrade.toFixed(2)}% (out of ${totalWeight}% accounted for)`;
});

// Clear All
document.getElementById('clearBtn').addEventListener('click', () => {
    container.innerHTML = '';
    createRow();
    resultDisplay.innerText = "Total Grade: 0%";
});