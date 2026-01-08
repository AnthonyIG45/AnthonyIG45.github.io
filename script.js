const weightInput = document.getElementById('weight');
const scoreInput = document.getElementById('score');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const message = document.getElementById('displayMessage');

submitBtn.addEventListener('click', function() {
    // 1. Get the values and convert them to numbers
    const weightValue = parseFloat(weightInput.value);
    const scoreValue = parseFloat(scoreInput.value);

    // 2. Validate that inputs are not empty
    if (isNaN(weightValue) || isNaN(scoreValue)) {
        message.innerText = "Please enter valid numbers in both boxes.";
        return;
    }

    // 3. The Math:
    // Convert 80 to 0.8: (scoreValue / 100)
    // Multiply by weight: (weightValue * (scoreValue / 100))
    const result = weightValue * (scoreValue / 100);

    // 4. Display the result as a whole number
    message.innerText = `This assignment contributes ${result.toFixed(2)}% to your total grade.`;
});

clearBtn.addEventListener('click', function() {
    weightInput.value = "";
    scoreInput.value = "";
    message.innerText = "Enter values to see your result.";
});