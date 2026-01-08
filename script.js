const container = document.getElementById('grade-rows-container');
const addBtn = document.getElementById('addRowBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultDisplay = document.getElementById('resultDisplay');
const weightWarning = document.getElementById('weightWarning');

// Function to create a new row dynamically
function createRow() {
    const row = document.createElement('div');
    row.className = 'grade-row';

    row.innerHTML = `
        <input type="text" placeholder="Category Name" class="cat-name">
        <input type="number" placeholder="Weight %" class="weight-input">
        <input type="number" placeholder="Score %" class="score-input">
        <button class="remove-btn" title="Remove row">✕</button>
    `;

    // Setup the specific delete button for this row
    row.querySelector('.remove-btn').addEventListener('click', () => {
        row.remove();
        calculateGrade(); // Recalculate when a row is removed
    });

    container.appendChild(row);
}

// Function to perform the math
function calculateGrade() {
    const weights = document.querySelectorAll('.weight-input');
    const scores = document.querySelectorAll('.score-input');
    
    let totalPointsEarned = 0;
    let totalWeightPercent = 0;

    for (let i = 0; i < weights.length; i++) {
        const w = parseFloat(weights[i].value) || 0;
        const s = parseFloat(scores[i].value) || 0;

        // Math: Weight * (Score as decimal)
        totalPointsEarned += (w * (s / 100));
        totalWeightPercent += w;
    }

    resultDisplay.innerText = `Total Grade: ${totalPointsEarned.toFixed(2)}%`;
    
    // Provide feedback on total weight
    if (totalWeightPercent > 100) {
        weightWarning.innerText = `Total weight is ${totalWeightPercent}% (Exceeds 100%)`;
    } else if (totalWeightPercent < 100 && totalWeightPercent > 0) {
        weightWarning.innerText = `Accounted for ${totalWeightPercent}% of total grade.`;
    } else {
        weightWarning.innerText = "";
    }
}

// Add one starting row on load
createRow();

// Event Listeners
addBtn.addEventListener('click', createRow);
calculateBtn.addEventListener('click', calculateGrade);

document.getElementById('clearBtn').addEventListener('click', () => {
    container.innerHTML = '';
    createRow();
    resultDisplay.innerText = "Total Grade: 0.00%";
    weightWarning.innerText = "";
});