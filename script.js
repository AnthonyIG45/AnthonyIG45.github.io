const analyzeBtn = document.getElementById('analyzeBtn');
const syllabusInput = document.getElementById('syllabusUpload');
const gradebookInput = document.getElementById('gradebookUpload');
const rowsContainer = document.getElementById('grade-rows-container');
const addManualBtn = document.getElementById('addRowBtn');
const calculateBtn = document.getElementById('calculateBtn');
const finalDisplay = document.getElementById('finalGradeDisplay');

let ocrState = { weights: {}, scores: {} };

// 1. Enable Analyze button
[syllabusInput, gradebookInput].forEach(input => {
    input.addEventListener('change', () => {
        analyzeBtn.disabled = !(syllabusInput.files[0] && gradebookInput.files[0]);
    });
});

// 2. Add Row Function (The "Workhorse")
function addRow(category = "", weight = "", score = "") {
    const row = document.createElement('div');
    row.className = 'grade-row';
    row.innerHTML = `
        <input type="text" placeholder="Category" class="cat-name" value="${category}">
        <input type="number" placeholder="Weight %" class="weight-input" value="${weight}">
        <input type="number" placeholder="Score %" class="score-input" value="${score}">
        <button class="remove-btn">✕</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    rowsContainer.appendChild(row);
}

// 3. Manual Row Button
addManualBtn.addEventListener('click', () => addRow());

// 4. Analysis Logic (OCR)
analyzeBtn.addEventListener('click', async () => {
    document.getElementById('loading').classList.remove('hidden');
    
    const sText = await performOCR(syllabusInput.files[0]);
    const gText = await performOCR(gradebookInput.files[0]);

    // Simple Regex Parsing
    const weightMatch = sText.matchAll(/([a-zA-Z\s]+).+?(\d+)%/g);
    const scoreMatch = gText.matchAll(/(\d+)\s*\/\s*(\d+)/g);

    rowsContainer.innerHTML = ''; // Clear existing

    // Combine results into UI rows
    for (const match of weightMatch) {
        addRow(match[1].trim(), match[2], "");
    }

    document.getElementById('loading').classList.add('hidden');
});

async function performOCR(file) {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(file);
    await worker.terminate();
    return ret.data.text;
}

// 5. Final Calculation
calculateBtn.addEventListener('click', () => {
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

    finalDisplay.innerText = totalGrade.toFixed(2) + "%";
});

// Initialize with one empty row
addRow();