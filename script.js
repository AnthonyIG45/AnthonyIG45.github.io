function calculateGrade(weight, total) {
    const weightNum = parseFloat(weight);
    const totalNum = parseFloat(total);

    if (isNaN(weightNum) || isNaN(totalNum) || totalNum === 0) {
        return "Invalid input";
    }

    const percentage = (weightNum / totalNum) * 100;
    return percentage.toFixed(2);
}


const weightInput = document.getElementById('weight');
const totalInput = document.getElementById('total');
const actionButton = document.getElementById('myButton');
const message = document.getElementById('displayMessage');

actionButton.addEventListener('click', function() {
    const weight = weightInput.value;
    const total = totalInput.value;

    if (weight === "" || total === "") {
        message.innerText = "Please fill out both boxes!";
    } else {
        message.innerText = `The grade is ${calculateGrade(weight, total)}!`;
    }
});