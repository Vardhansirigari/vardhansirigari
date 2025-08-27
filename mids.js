
// Initialize jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
const formInputs = {
    subject: document.getElementById('subject'),
    branches: document.getElementById('branches'),
    monthYear: document.getElementById('monthYear'),
    btechYear: document.getElementById('btechYear'),
    midExam: document.getElementById('midExam'),
    semExam: document.getElementById('semExam'),
    partAMarks: document.getElementById('partAMarks'),
    partBMarks: document.getElementById('partBMarks'),
    examFrom: document.getElementById('Exam_From'),
    examEnds: document.getElementById('Exam_Ends'),
    examdate: document.getElementById('Exam_Date'),
    course: document.getElementById('course')

};


// Question inputs
const questionInputs = {};
const coInputs = {};

// Initialize question and CO inputs
for (let i = 1; i <= 5; i++) {
    questionInputs[`q${i}`] = document.getElementById(`q${i}`);
    coInputs[`co${i}`] = document.getElementById(`co${i}`);
}

for (let i = 6; i <= 11; i++) {
    questionInputs[`q${i}`] = document.getElementById(`q${i}`);
    coInputs[`co${i}`] = document.getElementById(`co${i}`);
}

const previewContainer = document.getElementById('questionPaperPreview');
const exportPdfBtn = document.getElementById('exportPdf');
const printVersionBtn = document.getElementById('printVersion');
const exportTextBtn = document.getElementById('exportText');

// Utility function for text-based formatting (alternative export option)
function formatQuestionWithPrefix(prefix, text, coTag, maxLen = 90) {
    if (!text.trim()) return '';
    const lines = [];
    const words = text.split(' ');
    let currentLine = prefix;

    for (const word of words) {
        if ((currentLine + ' ' + word).length <= maxLen) {
            currentLine += (currentLine === prefix ? '' : ' ') + word;
        } else {
            if (currentLine !== prefix) {
                lines.push(currentLine);
                currentLine = ' '.repeat(prefix.length) + word;  // This line positions text below question number
            } else {
                lines.push(currentLine + ' ' + word);
                currentLine = ' '.repeat(prefix.length);
            }
        }
    }

    if (currentLine.trim()) {
        lines.push(currentLine);
    }

    // Add CO tag aligned to the right side
    if (coTag.trim()) {
        const lastLine = lines[lines.length - 1];
        const spaceForCO = maxLen - lastLine.length;

        if (spaceForCO >= coTag.length + 1) {
            // Add CO tag to the same line, right-aligned
            const padding = ' '.repeat(spaceForCO - coTag.length);
            lines[lines.length - 1] = lastLine + padding + coTag;
        } else {
            // Add CO tag on a separate line, right-aligned
            const padding = ' '.repeat(maxLen - coTag.length);
            lines.push(padding + coTag);
        }
    }

    return lines.join('\n');
}

// Text-based question paper generation (for plain text export)
function generateQuestionPaperText() {
    const subject = formInputs.subject.value || 'SUBJECT NAME';
    const branches = formInputs.branches.value || 'BRANCHES';
    const monthYear = formInputs.monthYear.value || 'MONTH-YEAR';
    const btechYear = formInputs.btechYear.value || 'I';
    const midExam = formInputs.midExam.value || 'I';
    const semExam = formInputs.semExam.value || 'I';
    const partAMarks = formInputs.partAMarks.value || '10';
    const partBMarks = formInputs.partBMarks.value || '20';

    function centerLine(text, width = 90) {
        const padding = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(padding) + text;
    }

    function centerRightAlign(centerText, rightText, totalWidth = 90) {
        const spaceForRight = rightText.length + 1;
        const maxCenterWidth = totalWidth - spaceForRight;
        const centerPadding = Math.max(0, Math.floor((maxCenterWidth - centerText.length) / 2));
        const centerPart = ' '.repeat(centerPadding) + centerText;
        const remaining = totalWidth - centerPart.length - rightText.length;
        return centerPart + ' '.repeat(Math.max(1, remaining)) + rightText;
    }

    let paperContent = '';

    // Header
    paperContent += centerLine('[CMR ENGINEERING COLLEGE : HYDERABAD UGC AUTONOMOUS]') + '\n\n';
    paperContent += centerLine(`${btechYear}-B.TECH ${semExam}-SEM ${midExam}-MID-Examinations, ${monthYear}`) + '\n\n';
    paperContent += centerLine(`SUBJECT: ${subject.toUpperCase()}`) + '\n';
    paperContent += centerLine(` ${branches.toUpperCase()}`) + '\n\n';

    // PART-A
    paperContent += centerRightAlign('PART-A', `(${partAMarks} Marks)`) + '\n\n';
    paperContent += centerLine('Answer all Questions in PART-A') + '\n\n';

    // PART-A Questions
    for (let i = 1; i <= 5; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value ? `(${coInputs[`co${i}`].value})` : '';
        if (question.trim()) {
            const formattedQuestion = formatQuestionWithPrefix(`${i}. `, question, coTag);
            paperContent += formattedQuestion + '\n\n';
        }
    }

    // PART-B
    paperContent += centerRightAlign('PART-B', `(${partBMarks} Marks)`) + '\n\n';
    paperContent += centerLine('Answer any FOUR Questions in PART-B') + '\n\n';

    // PART-B Questions
    for (let i = 6; i <= 11; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value ? `(${coInputs[`co${i}`].value})` : '';
        if (question.trim()) {
            const formattedQuestion = formatQuestionWithPrefix(`${i}. `, question, coTag);
            paperContent += formattedQuestion + '\n\n';
        }
    }

    return paperContent;
}

// Export as plain text file
function exportAsText() {
    const textContent = generateQuestionPaperText();
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_paper.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate Question Paper Content as HTML
function generateQuestionPaperHTML() {
    const subject = formInputs.subject.value || 'SUBJECT NAME';
    const branches = formInputs.branches.value || 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING';
    const monthYear = formInputs.monthYear.value || 'MONTH-YEAR';
    const btechYear = formInputs.btechYear.value || 'I';
    const midExam = formInputs.midExam.value || 'I';
    const semExam = formInputs.semExam.value || 'I';
    const partAMarks = formInputs.partAMarks.value || '10';
    const partBMarks = formInputs.partBMarks.value || '20';
    const totalMarks = Number(partAMarks) + Number(partBMarks);
    const examFrom = formatTime(formInputs.examFrom.value) || '10:00 AM';
    const examEnds = formatTime(formInputs.examEnds.value) || '12:00 PM';
    const examDate = formInputs.examdate.value || '01-01-2023';
    const course = formInputs.course.value || 'CSE';


    let htmlContent = `
                <div class="paper-header">
                    <img src="cmr_logo.png" alt="CMR Engineering College Logo" class="logo">
                    <div class="subject-details">${branches.toUpperCase()}</div>
                    <div class="exam-details">${btechYear}-B.TECH ${semExam}-SEM ${midExam}-MID- Examinations, ${monthYear}</div>
                    <div class="subject-details">SUBJECT: ${subject.toUpperCase()}</div>
                    <span></span>
                    
                </div>
                <div class="Exam-header">
                    <div class="left-header">
                        <div><strong>Time:</strong> ${examFrom} To ${examEnds}</div>
                        <div><strong>Branch:</strong>${course}</div>
                    </div>
                    <div class="right-header">
                        <div><strong>Date:</strong> ${examDate}</div>
                        <div><strong>Max Marks:</strong> ${totalMarks}</div>
                    </div>
                
                </div>
                   


                
                <div class="instructions">
                    <span class="instruction">Note: Question paper contains two parts, Part-A and   Part- B.</span>
                    <br>
                    <span >Part-A is compulsory which carries 10 marks. </span>
                    <br>
                    <span >Answer all questions in part-A</span>
                    <br>
                    <span >Answer any 4 questions in part-B.</span>
                    <br>
                    <span >Each question carries5 marks.</span>
                </div>
                <div class="part-header">
                    <span></span>
                    <span class="part-title">PART-A</span>
                    <span class="part-marks">(${partAMarks} Marks)</span>
                </div>

               
            `;

    // PART-A Questions
    for (let i = 1; i <= 5; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value;
        if (question.trim()) {
            htmlContent += `
                        <div class="question-item-part-a">
                            <div class="question-content-part-a">
                                <span class="question-number">${i}.</span>${question}
                            </div>
                            <div class="co-tag">${coTag ? `(${coTag})` : ''}</div>
                        </div>
                    `;
        }
    }

    // PART-B
    htmlContent += `
                <div class="part-header">
                    <span></span>
                    <span class="part-title">PART-B</span>
                    <span class="part-marks">(${partBMarks} Marks)</span>
                </div>

               
            `;

    // PART-B Questions
    for (let i = 6; i <= 11; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value;
        if (question.trim()) {
            htmlContent += `
                        <div class="question-item-part-b">
                            <div class="question-content-part-b">
                                <span class="question-number">${i}.</span>
                                <div class="question-text-container">${question}</div>
                            </div>
                            <div class="co-tag">${coTag ? `(${coTag})` : ''}</div>
                        </div>
                    `;
        }
    }

    return htmlContent;
}

// Update Preview
function updatePreview() {
    const htmlContent = generateQuestionPaperHTML();
    previewContainer.innerHTML = htmlContent;
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    let [hour, minute] = timeStr.split(':').map(Number);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
}
// Add event listeners for live preview
function addEventListeners() {
    // Form inputs
    Object.values(formInputs).forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });

    // Question inputs
    Object.values(questionInputs).forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });

    // CO inputs
    Object.values(coInputs).forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });
}

// Improved PDF Export Function
function exportToPDF() {
    const doc = new jsPDF();

    // Set font
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    // Get A4 dimensions in mm
    const pageWidth = 210;  // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;      // 20mm margin
    const maxWidth = pageWidth - (2 * margin);
    const lineHeight = 6;

    let yPosition = margin;

    // Helper function to add text with proper positioning
    function addText(text, align = 'left', fontSize = 12, fontStyle = 'normal') {
        doc.setFontSize(fontSize);
        doc.setFont('times', fontStyle);

        const textWidth = doc.getTextWidth(text);
        let xPosition = margin;

        if (align === 'center') {
            xPosition = (pageWidth - textWidth) / 2;
        } else if (align === 'right') {
            xPosition = pageWidth - margin - textWidth;
        }

        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }

        doc.text(text, xPosition, yPosition);
        yPosition += lineHeight;
    }

    // Add content
    const subject = formInputs.subject.value || 'SUBJECT NAME';
    const branches = formInputs.branches.value || 'BRANCHES';
    const monthYear = formInputs.monthYear.value || 'MONTH-YEAR';
    const btechYear = formInputs.btechYear.value || 'I';
    const midExam = formInputs.midExam.value || 'I';
    const partAMarks = formInputs.partAMarks.value || '10';
    const partBMarks = formInputs.partBMarks.value || '20';

    // Header
    addText('[CMR ENGINEERING COLLEGE : HYDERABAD UGC AUTONOMOUS]', 'center', 14, 'bold');
    yPosition += 3;
    addText(`I-B.TECH ${btechYear}-SEM (R22) ${btechYear}-MID-${midExam} Examinations, ${monthYear}`, 'center', 12, 'bold');
    yPosition += 3;
    addText(`SUBJECT: ${subject.toUpperCase()}`, 'center', 12, 'bold');
    addText(`${branches.toUpperCase()}`, 'center', 12, 'bold');
    yPosition += 0;

    // PART-A Header
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    const partAText = 'PART-A';
    const partAMarksText = `(${partAMarks} Marks)`;
    const partAWidth = doc.getTextWidth(partAText);
    const partAMarksWidth = doc.getTextWidth(partAMarksText);

    doc.text(partAText, (pageWidth - partAWidth) / 2, yPosition);
    doc.text(partAMarksText, pageWidth - margin - partAMarksWidth, yPosition);
    yPosition += lineHeight + 2;

    addText('Answer all Questions in PART-A', 'center', 11, 'italic');
    yPosition += 3;

    // PART-A Questions
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    for (let i = 1; i <= 5; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value;
        if (question.trim()) {
            const questionText = `${i}. ${question}`;
            const coText = coTag ? `(${coTag})` : '';

            // Check if we need a new page
            if (yPosition > pageHeight - margin - 10) {
                doc.addPage();
                yPosition = margin;
            }

            // Add question text
            doc.text(questionText, margin, yPosition);

            // Add CO tag aligned to right
            if (coText) {
                const coWidth = doc.getTextWidth(coText);
                doc.text(coText, pageWidth - margin - coWidth, yPosition);
            }

            yPosition += lineHeight + 2;
        }
    }

    yPosition += 5;

    // PART-B Header
    doc.setFont('times', 'bold');
    const partBText = 'PART-B';
    const partBMarksText = `(${partBMarks} Marks)`;
    const partBWidth = doc.getTextWidth(partBText);
    const partBMarksWidth = doc.getTextWidth(partBMarksText);

    doc.text(partBText, (pageWidth - partBWidth) / 2, yPosition);
    doc.text(partBMarksText, pageWidth - margin - partBMarksWidth, yPosition);
    yPosition += lineHeight + 2;

    addText('Answer any FOUR Questions in PART-B', 'center', 11, 'italic');
    yPosition += 3;

    // PART-B Questions
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    for (let i = 6; i <= 11; i++) {
        const question = questionInputs[`q${i}`].value;
        const coTag = coInputs[`co${i}`].value;
        if (question.trim()) {
            const questionText = `${i}. ${question}`;
            const coText = coTag ? `(${coTag})` : '';

            // Check if we need a new page
            if (yPosition > pageHeight - margin - 15) {
                doc.addPage();
                yPosition = margin;
            }

            // Handle multi-line questions
            const lines = doc.splitTextToSize(questionText, maxWidth - 30); // Leave space for CO tag

            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                if (yPosition > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }

                doc.text(lines[lineIndex], margin, yPosition);
                yPosition += lineHeight;
            }

            // Add CO tag aligned to right on the last line
            if (coText) {
                const coWidth = doc.getTextWidth(coText);
                doc.text(coText, pageWidth - margin - coWidth, yPosition - lineHeight);
            }

            yPosition += 3; // Extra spacing between questions
        }
    }

    // Save the PDF
    doc.save('question_paper.pdf');
}

// Print Function
function printVersion() {
    window.print();
}

// Initialize the application
function init() {
    addEventListeners();
    updatePreview(); // Initial preview

    // Add button event listeners
    exportPdfBtn.addEventListener('click', exportToPDF);
    printVersionBtn.addEventListener('click', printVersion);
    exportTextBtn.addEventListener('click', exportAsText);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

function formatTextWithLineBreaks(text) {
    return text.replace(/\n/g, '<br>');
}

// Example usage when rendering Part-A questions
function renderPartAQuestion(questionText, targetElement) {
    targetElement.innerHTML = formatTextWithLineBreaks(questionText);
}

// Example usage when rendering Part-B questions
function renderPartBQuestion(questionText, targetElement) {
    targetElement.innerHTML = formatTextWithLineBreaks(questionText);
}

