<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# StudySnap - AI Flashcard & Quiz Generator - Copilot Instructions

This is StudySnap, an AI-powered flashcard and quiz generator web application that converts text input into interactive learning materials.

## Project Structure
- **Backend**: Node.js + Express server with Google Gemini API integration
- **Frontend**: Vanilla HTML, CSS, and JavaScript with modern responsive design
- **Features**: Flashcard generation, quiz mode with MCQs, interactive UI

## Key Components
- `/server.js` - Express server with Google Gemini API integration
- `/public/index.html` - Main frontend application
- `/public/styles.css` - Modern responsive CSS with CSS custom properties
- `/public/script.js` - Frontend JavaScript with state management

## Development Guidelines
- Use modern ES6+ JavaScript features
- Follow responsive design principles
- Maintain accessibility standards
- Use semantic HTML structure
- Keep CSS organized with custom properties
- Handle errors gracefully with user-friendly messages
- Implement loading states for better UX

## API Integration
- Google Gemini Pro for content generation
- Structured prompts for consistent JSON responses
- Error handling for API quotas and authentication
- Rate limiting considerations

## Future Enhancements
- PDF upload functionality
- User authentication and data persistence
- Spaced repetition system (SRS)
- Export capabilities (Anki, Quizlet)
- Advanced analytics and progress tracking
