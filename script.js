const button = document.getElementById("myButton");

button.addEventListener("click", function () {
    alert("You clicked the button!");
});


// Get references to the elements
const inputField = document.getElementById('userInput');
const actionButton = document.getElementById('myButton');
const message = document.getElementById('displayMessage');

// Add the event listener
actionButton.addEventListener('click', function() {
    // Capture the current text inside the input box
    const textValue = inputField.value;

    // Check if the input is empty or has text
    if (textValue.trim() === "") {
        message.innerText = "Please type something first!";
    } else {
        message.innerText = "You typed: " + textValue;
    }
});