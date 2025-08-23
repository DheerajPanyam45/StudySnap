# StudySnap - AI Flashcard & Quiz Generator

A modern web application that transforms text input into interactive flashcards and multiple-choice quizzes using AI. Perfect for students and professionals who want to create effective study materials from their notes instantly.

## 🌟 Features

- **✨ AI-Powered Generation**: Converts any text into 12-15 flashcards and 10 multiple-choice questions
- **🎯 Dual Learning Modes**: Switch between flashcard review and quiz testing
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Real-time Processing**: Get your study materials in seconds
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **⌨️ Keyboard Navigation**: Full keyboard support for efficient studying
- **📊 Progress Tracking**: Score tracking and performance feedback in quiz mode

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Google Gemini API key

### Installation

1. **Clone or download the project**
   ```bash
   cd StudySnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How It Works

1. **Input Text**: Paste your lecture notes, articles, or any educational content (minimum 50 characters)
2. **AI Processing**: Our AI analyzes the text and extracts key concepts
3. **Content Generation**: 
   - Creates 12-15 Q&A flashcards for review
   - Generates 10 multiple-choice questions for testing
4. **Interactive Learning**: Switch between flashcard and quiz modes for comprehensive study

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: Google Gemini Pro API
- **Styling**: Modern CSS with custom properties and responsive design

## 📝 API Endpoints

- `POST /api/generate` - Generate flashcards and quiz from text
- `GET /api/health` - Health check endpoint

## 🎨 UI Features

- **Flashcard Mode**: 
  - Flip cards to reveal answers
  - Navigate with Previous/Next buttons or arrow keys
  - Progress indicator showing current card position

- **Quiz Mode**:
  - Multiple-choice questions with 4 options each
  - Immediate feedback with explanations
  - Progress bar and score tracking
  - Option to retake quiz

## ⌨️ Keyboard Shortcuts

- **Flashcard Mode**:
  - `←/→` Arrow keys: Navigate between cards
  - `Space/Enter`: Flip current card
  
- **Quiz Mode**:
  - `1-4` Number keys: Select answers
  
- **Global**:
  - `Ctrl+Tab`: Switch between modes

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3000)

### Gemini Settings

The application uses Gemini 1.5 Flash with these parameters:
- **Model**: gemini-1.5-flash (Google's latest fast language model)
- **Input**: Direct text prompts
- **Output**: JSON-formatted educational content

## 🚀 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-restart)

### Project Structure

```
StudySnap/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .github/
│   └── copilot-instructions.md
└── public/               # Static frontend files
    ├── index.html        # Main HTML file
    ├── styles.css        # CSS styling
    └── script.js         # Frontend JavaScript
```

## 🎯 Sample API Prompt Template

Here's the structured prompt used to generate consistent responses:

```javascript
const generatePrompt = (text) => {
  return `You are an educational content generator. From the following text, generate both flashcards and multiple-choice questions.

TEXT TO ANALYZE:
${text}

Please respond with a JSON object in this exact format:
{
  "flashcards": [
    {
      "question": "Question text here",
      "answer": "Answer text here"
    }
  ],
  "quiz": [
    {
      "question": "Question text here", 
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

REQUIREMENTS:
- Generate exactly 12-15 flashcards covering key concepts
- Generate exactly 10 multiple-choice questions
- For MCQs: provide 4 options each, with correctAnswer being the index (0-3) of the correct option
- Make questions clear and educational
- Ensure answers are factually accurate based on the provided text
- Include brief explanations for quiz answers
- Focus on the most important concepts and facts from the text

Respond only with the JSON object, no additional text.`;
};
```

## 🔮 Future Enhancements

- **📄 PDF Upload**: Support for PDF document processing
- **👤 User Accounts**: Save and manage personal flashcard collections
- **🧠 Spaced Repetition**: Implement SRS algorithm for optimal learning
- **📤 Export Options**: Export to Anki, Quizlet, or PDF formats
- **📊 Analytics**: Detailed progress tracking and learning analytics
- **🌐 Offline Mode**: Progressive Web App capabilities
- **🎨 Themes**: Customizable color schemes and themes

## 🐛 Troubleshooting

### Common Issues

1. **Gemini API Key Error**
   - Ensure your API key is correctly set in `.env`
   - Get your key from https://makersuite.google.com/app/apikey
   - Check your Google Cloud project has Gemini API enabled

2. **Text Too Short Error**
   - Provide at least 50 characters of meaningful text
   - Avoid very repetitive or simple content

3. **Network Errors**
   - Check your internet connection
   - Verify Gemini API status

### Error Messages

The application provides user-friendly error messages for:
- Invalid or missing API key
- Insufficient API quota
- Network connectivity issues
- Malformed responses


## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

---

**Built with ❤️ for better learning experiences**
