// Global state
let flashcards = [];
let quizQuestions = [];
let currentFlashcardIndex = 0;
let currentQuizIndex = 0;
let quizScore = 0;
let selectedAnswer = null;
let isQuizActive = false;

// DOM elements
const elements = {
    // Sections
    inputSection: document.getElementById('inputSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    errorSection: document.getElementById('errorSection'),
    
    // Input
    textInput: document.getElementById('textInput'),
    generateBtn: document.getElementById('generateBtn'),
    charCounter: document.getElementById('charCounter'),
    
    // Mode toggle
    flashcardsTab: document.getElementById('flashcardsTab'),
    quizTab: document.getElementById('quizTab'),
    
    // Flashcards
    flashcardsView: document.getElementById('flashcardsView'),
    flashcard: document.getElementById('flashcard'),
    flashcardInner: document.getElementById('flashcardInner'),
    flashcardQuestion: document.getElementById('flashcardQuestion'),
    flashcardAnswer: document.getElementById('flashcardAnswer'),
    currentFlashcard: document.getElementById('currentFlashcard'),
    totalFlashcards: document.getElementById('totalFlashcards'),
    prevFlashcard: document.getElementById('prevFlashcard'),
    nextFlashcard: document.getElementById('nextFlashcard'),
    
    // Quiz
    quizView: document.getElementById('quizView'),
    currentQuestion: document.getElementById('currentQuestion'),
    totalQuestions: document.getElementById('totalQuestions'),
    progressFill: document.getElementById('progressFill'),
    quizQuestion: document.getElementById('quizQuestion'),
    optionsContainer: document.getElementById('optionsContainer'),
    quizFeedback: document.getElementById('quizFeedback'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    explanation: document.getElementById('explanation'),
    nextQuestion: document.getElementById('nextQuestion'),
    finishQuiz: document.getElementById('finishQuiz'),
    
    // Quiz results
    quizResults: document.getElementById('quizResults'),
    finalScore: document.getElementById('finalScore'),
    correctAnswers: document.getElementById('correctAnswers'),
    totalQuizQuestions: document.getElementById('totalQuizQuestions'),
    retakeQuiz: document.getElementById('retakeQuiz'),
    
    // Actions
    generateNewBtn: document.getElementById('generateNewBtn'),
    
    // Error
    errorMessage: document.getElementById('errorMessage'),
    tryAgainBtn: document.getElementById('tryAgainBtn')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCharCounter();
});

// Event listeners
function initializeEventListeners() {
    // Input section
    elements.textInput.addEventListener('input', updateCharCounter);
    elements.generateBtn.addEventListener('click', generateContent);
    
    // Mode toggle
    elements.flashcardsTab.addEventListener('click', () => switchMode('flashcards'));
    elements.quizTab.addEventListener('click', () => switchMode('quiz'));
    
    // Flashcards
    elements.flashcard.addEventListener('click', flipCard);
    elements.prevFlashcard.addEventListener('click', previousFlashcard);
    elements.nextFlashcard.addEventListener('click', nextFlashcard);
    
    // Quiz
    elements.nextQuestion.addEventListener('click', nextQuizQuestion);
    elements.finishQuiz.addEventListener('click', finishQuiz);
    elements.retakeQuiz.addEventListener('click', retakeQuiz);
    
    // Actions
    elements.generateNewBtn.addEventListener('click', resetApp);
    elements.tryAgainBtn.addEventListener('click', resetApp);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

// Character counter
function updateCharCounter() {
    const text = elements.textInput.value;
    const charCount = text.length;
    elements.charCounter.textContent = `${charCount} characters`;
    
    elements.generateBtn.disabled = charCount < 50;
    
    if (charCount < 50) {
        elements.charCounter.style.color = 'var(--error-color)';
    } else {
        elements.charCounter.style.color = 'var(--text-secondary)';
    }
}

// Generate content
async function generateContent() {
    const text = elements.textInput.value.trim();
    
    if (text.length < 50) {
        showError('Please provide at least 50 characters of text.');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate content');
        }
        
        if (!data.flashcards || !data.quiz || data.flashcards.length === 0 || data.quiz.length === 0) {
            throw new Error('Invalid response format from server');
        }
        
        flashcards = data.flashcards;
        quizQuestions = data.quiz;
        
        initializeFlashcards();
        initializeQuiz();
        showResults();
        
    } catch (error) {
        console.error('Error generating content:', error);
        showError(error.message || 'Failed to generate content. Please try again.');
    }
}

// Show/hide sections
function showLoading() {
    hideAllSections();
    elements.loadingSection.style.display = 'block';
}

function showResults() {
    hideAllSections();
    elements.resultsSection.style.display = 'block';
}

function showError(message) {
    hideAllSections();
    elements.errorMessage.textContent = message;
    elements.errorSection.style.display = 'block';
}

function hideAllSections() {
    elements.inputSection.style.display = 'none';
    elements.loadingSection.style.display = 'none';
    elements.resultsSection.style.display = 'none';
    elements.errorSection.style.display = 'none';
}

// Mode switching
function switchMode(mode) {
    // Update tab buttons
    elements.flashcardsTab.classList.toggle('active', mode === 'flashcards');
    elements.quizTab.classList.toggle('active', mode === 'quiz');
    
    // Show/hide views
    elements.flashcardsView.style.display = mode === 'flashcards' ? 'block' : 'none';
    elements.quizView.style.display = mode === 'quiz' ? 'block' : 'none';
    
    // Reset quiz if switching to quiz mode
    if (mode === 'quiz' && !isQuizActive) {
        resetQuiz();
    }
}

// Flashcards functionality
function initializeFlashcards() {
    currentFlashcardIndex = 0;
    elements.totalFlashcards.textContent = flashcards.length;
    updateFlashcard();
    updateFlashcardNavigation();
}

function updateFlashcard() {
    if (flashcards.length === 0) return;
    
    const card = flashcards[currentFlashcardIndex];
    elements.flashcardQuestion.textContent = card.question;
    elements.flashcardAnswer.textContent = card.answer;
    elements.currentFlashcard.textContent = currentFlashcardIndex + 1;
    
    // Reset flip state
    elements.flashcard.classList.remove('flipped');
}

function flipCard() {
    elements.flashcard.classList.toggle('flipped');
}

function previousFlashcard() {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        updateFlashcard();
        updateFlashcardNavigation();
    }
}

function nextFlashcard() {
    if (currentFlashcardIndex < flashcards.length - 1) {
        currentFlashcardIndex++;
        updateFlashcard();
        updateFlashcardNavigation();
    }
}

function updateFlashcardNavigation() {
    elements.prevFlashcard.disabled = currentFlashcardIndex === 0;
    elements.nextFlashcard.disabled = currentFlashcardIndex === flashcards.length - 1;
}

// Quiz functionality
function initializeQuiz() {
    elements.totalQuestions.textContent = quizQuestions.length;
    elements.totalQuizQuestions.textContent = quizQuestions.length;
}

function resetQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    selectedAnswer = null;
    isQuizActive = true;
    
    // Hide results, show questions
    elements.quizResults.style.display = 'none';
    elements.quizFeedback.style.display = 'none';
    elements.nextQuestion.style.display = 'none';
    elements.finishQuiz.style.display = 'none';
    
    updateQuizQuestion();
}

function updateQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        finishQuiz();
        return;
    }
    
    const question = quizQuestions[currentQuizIndex];
    
    // Update progress
    elements.currentQuestion.textContent = currentQuizIndex + 1;
    const progress = ((currentQuizIndex) / quizQuestions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    
    // Update question
    elements.quizQuestion.textContent = question.question;
    
    // Update options
    elements.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        elements.optionsContainer.appendChild(optionElement);
    });
    
    // Reset feedback
    elements.quizFeedback.style.display = 'none';
    selectedAnswer = null;
}

function selectOption(index) {
    if (selectedAnswer !== null) return; // Already answered
    
    selectedAnswer = index;
    const question = quizQuestions[currentQuizIndex];
    const options = elements.optionsContainer.children;
    
    // Disable all options
    Array.from(options).forEach((option, i) => {
        option.classList.add('disabled');
        
        if (i === question.correctAnswer) {
            option.classList.add('correct');
        } else if (i === selectedAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    // Show feedback
    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
        quizScore++;
    }
    
    showQuizFeedback(isCorrect, question.explanation);
    
    // Show navigation
    if (currentQuizIndex < quizQuestions.length - 1) {
        elements.nextQuestion.style.display = 'inline-flex';
    } else {
        elements.finishQuiz.style.display = 'inline-flex';
    }
}

function showQuizFeedback(isCorrect, explanation) {
    elements.quizFeedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    elements.feedbackIcon.className = `feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`;
    elements.feedbackIcon.innerHTML = isCorrect ? 
        '<i class="fas fa-check-circle"></i>' : 
        '<i class="fas fa-times-circle"></i>';
    
    elements.feedbackText.textContent = isCorrect ? 
        'Correct!' : 
        'Incorrect';
    
    elements.explanation.textContent = explanation || '';
    elements.quizFeedback.style.display = 'block';
}

function nextQuizQuestion() {
    currentQuizIndex++;
    selectedAnswer = null;
    elements.nextQuestion.style.display = 'none';
    updateQuizQuestion();
}

function finishQuiz() {
    isQuizActive = false;
    
    // Calculate final score
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    // Update results
    elements.finalScore.textContent = percentage;
    elements.correctAnswers.textContent = quizScore;
    
    // Update progress to 100%
    elements.progressFill.style.width = '100%';
    
    // Show results
    elements.quizResults.style.display = 'block';
    elements.quizFeedback.style.display = 'none';
    elements.finishQuiz.style.display = 'none';
}

function retakeQuiz() {
    resetQuiz();
}

// Reset app
function resetApp() {
    // Reset state
    flashcards = [];
    quizQuestions = [];
    currentFlashcardIndex = 0;
    currentQuizIndex = 0;
    quizScore = 0;
    selectedAnswer = null;
    isQuizActive = false;
    
    // Reset input
    elements.textInput.value = '';
    updateCharCounter();
    
    // Reset mode
    switchMode('flashcards');
    
    // Show input section
    hideAllSections();
    elements.inputSection.style.display = 'block';
}

// Keyboard navigation
function handleKeyboard(event) {
    if (elements.resultsSection.style.display === 'none') return;
    
    // Flashcards mode
    if (elements.flashcardsView.style.display !== 'none') {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                previousFlashcard();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextFlashcard();
                break;
            case ' ':
            case 'Enter':
                event.preventDefault();
                flipCard();
                break;
        }
    }
    
    // Quiz mode
    if (elements.quizView.style.display !== 'none' && selectedAnswer === null) {
        const keyNumber = parseInt(event.key);
        if (keyNumber >= 1 && keyNumber <= 4) {
            event.preventDefault();
            selectOption(keyNumber - 1);
        }
    }
    
    // Mode switching
    if (event.key === 'Tab' && event.ctrlKey) {
        event.preventDefault();
        const currentMode = elements.flashcardsTab.classList.contains('active') ? 'flashcards' : 'quiz';
        switchMode(currentMode === 'flashcards' ? 'quiz' : 'flashcards');
    }
}

// Utility functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
