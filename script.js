const calculateBtn = document.getElementById('calculateBtn');
const resultDisplay = document.getElementById('resultDisplay');

calculateBtn.addEventListener('click', function() {
    // Grab all rows
    const weights = document.querySelectorAll('.weight-input');
    const scores = document.querySelectorAll('.score-input');
    
    let totalGrade = 0;
    let totalWeight = 0;

    for (let i = 0; i < weights.length; i++) {
        const w = parseFloat(weights[i].value) || 0;
        const s = parseFloat(scores[i].value) || 0;

        // Math: (Weight * (Score / 100))
        totalGrade += (w * (s / 100));
        totalWeight += w;
    }

    // Display result
    if (totalWeight > 100) {
        resultDisplay.innerText = `Warning: Total weight is ${totalWeight}% (Over 100%)`;
    } else {
        resultDisplay.innerText = `Total Grade: ${totalGrade.toFixed(2)}% / ${totalWeight}%`;
    }
});

// Clear button logic
document.getElementById('clearBtn').addEventListener('click', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = "");
    resultDisplay.innerText = "Total Grade: 0%";
});