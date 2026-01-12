const analyzeBtn = document.getElementById('analyzeBtn');
const syllabusInput = document.getElementById('syllabusUpload');
const gradebookInput = document.getElementById('gradebookUpload');

let state = { syllabusText: "", gradebookText: "", weights: {}, grades: {} };

// Enable button only when both files are uploaded
[syllabusInput, gradebookInput].forEach(input => {
    input.addEventListener('change', () => {
        analyzeBtn.disabled = !(syllabusInput.files[0] && gradebookInput.files[0]);
    });
});

analyzeBtn.addEventListener('click', async () => {
    document.getElementById('loading').classList.remove('hidden');
    
    // Perform OCR on both images
    state.syllabusText = await performOCR(syllabusInput.files[0]);
    state.gradebookText = await performOCR(gradebookInput.files[0]);

    processData();
});

async function performOCR(file) {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(file);
    await worker.terminate();
    return ret.data.text;
}

function processData() {
    const syllabusLines = state.syllabusText.split('\n');
    const gradebookLines = state.gradebookText.split('\n');

    // 1. Extract Weights (Looking for "Category ... 30%")
    const weightRegex = /([a-zA-Z\s]+).+?(\d+)%/;
    syllabusLines.forEach(line => {
        const match = line.match(weightRegex);
        if (match) {
            const cat = normalizeCategory(match[1]);
            state.weights[cat] = parseFloat(match[2]) / 100;
        }
    });

    // 2. Extract Grades (Looking for "Score / Total")
    const gradeRegex = /(\d+)\s*\/\s*(\d+)/;
    gradebookLines.forEach(line => {
        const match = line.match(gradeRegex);
        if (match) {
            const score = parseFloat(match[1]);
            const total = parseFloat(match[2]);
            const percent = (score / total) * 100;
            
            // Basic Keyword matching for category
            const cat = detectCategory(line, Object.keys(state.weights));
            if (!state.grades[cat]) state.grades[cat] = [];
            state.grades[cat].push(percent);
        }
    });

    displayResults();
}

function normalizeCategory(text) {
    text = text.toLowerCase().trim();
    if (text.includes("quiz")) return "quizzes";
    if (text.includes("exam") || text.includes("test")) return "exams";
    if (text.includes("hw") || text.includes("home")) return "homework";
    return text;
}

function detectCategory(line, categories) {
    line = line.toLowerCase();
    for (let cat of categories) {
        if (line.includes(cat)) return cat;
    }
    return "other";
}

function displayResults() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');
    
    let totalGrade = 0;
    let totalWeight = 0;

    for (let cat in state.weights) {
        if (state.grades[cat]) {
            const avg = state.grades[cat].reduce((a, b) => a + b, 0) / state.grades[cat].length;
            totalGrade += avg * state.weights[cat];
            totalWeight += state.weights[cat];
        }
    }

    const final = totalWeight > 0 ? (totalGrade / totalWeight).toFixed(2) : 0;
    document.getElementById('finalGradeDisplay').innerText = `Final Calculated Grade: ${final}%`;
}