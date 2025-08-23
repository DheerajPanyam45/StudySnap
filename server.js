require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Gemini configuration
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sample API prompt template for generating flashcards and quiz
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

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate flashcards and quiz from text
app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ 
        error: 'Please provide at least 50 characters of text for meaningful content generation.' 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.' 
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(generatePrompt(text));
    const response = await result.response;
    let content = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    if (content.includes('```')) {
      content = content.replace(/```\s*/g, '');
    }
    
    try {
      const parsedContent = JSON.parse(content);
      res.json(parsedContent);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', content);
      res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.' 
      });
    }

  } catch (error) {
    console.error('Error generating content:', error);
    
    if (error.message?.includes('API_KEY_INVALID')) {
      res.status(401).json({ 
        error: 'Invalid Gemini API key. Please check your configuration.' 
      });
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      res.status(429).json({ 
        error: 'Gemini API quota exceeded. Please check your API usage.' 
      });
    } else {
      res.status(500).json({ 
        error: 'An error occurred while generating content. Please try again.' 
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 StudySnap - AI Flashcard & Quiz Generator`);
});
