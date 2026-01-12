// This wrapper ensures the HTML is fully loaded before the JS runs
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const syllabusInput = document.getElementById('syllabusUpload');
    const gradebookInput = document.getElementById('gradebookUpload');
    const rowsContainer = document.getElementById('grade-rows-container');
    const addManualBtn = document.getElementById('addRowBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const finalDisplay = document.getElementById('finalGradeDisplay');

    // --- 1. THE ADD ROW FUNCTION ---
    function addRow(category = "", weight = "", score = "") {
        const row = document.createElement('div');
        row.className = 'grade-row';
        row.innerHTML = `
            <input type="text" placeholder="Category" class="cat-name" value="${category}">
            <input type="number" placeholder="Weight %" class="weight-input" value="${weight}">
            <input type="number" placeholder="Score %" class="score-input" value="${score}">
            <button class="remove-btn" type="button">✕</button>
        `;

        // Make the 'X' button work
        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
        });

        rowsContainer.appendChild(row);
    }

    // --- 2. BUTTON EVENT LISTENERS ---

    // Manual Add Button
    if (addManualBtn) {
        addManualBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents page from refreshing
            addRow();
        });
    }

    // Calculate Button
    if (calculateBtn) {
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
    }

    // File Upload / OCR Logic
    [syllabusInput, gradebookInput].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                analyzeBtn.disabled = !(syllabusInput.files[0] && gradebookInput.files[0]);
            });
        }
    });

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            document.getElementById('loading').classList.remove('hidden');
            
            try {
                const sText = await performOCR(syllabusInput.files[0]);
                const gText = await performOCR(gradebookInput.files[0]);

                // Clear existing rows before auto-filling
                rowsContainer.innerHTML = '';

                // Basic Regex Parsing
                const weightMatch = sText.matchAll(/([a-zA-Z\s]+).+?(\d+)%/g);
                for (const match of weightMatch) {
                    addRow(match[1].trim(), match[2], "");
                }
            } catch (error) {
                console.error("OCR Error:", error);
                alert("There was an error scanning the images.");
            } finally {
                document.getElementById('loading').classList.add('hidden');
            }
        });
    }

    async function performOCR(file) {
        const worker = await Tesseract.createWorker('eng');
        const ret = await worker.recognize(file);
        await worker.terminate();
        return ret.data.text;
    }

    // Initialize with one empty row on start
    addRow();
});