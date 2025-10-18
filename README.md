# AI Content Generator - Chat ONN

A complete AI-powered content generation platform with a modern chat interface built with Next.js and Go Fiber.

## 📸 Screenshots

### Chat Interface with Ollama (Local LLM)
![Chat with Ollama](https://via.placeholder.com/800x450/003049/FCBF49?text=Chat+ONN+-+Ollama+Local+AI)
*Replace with your screenshot: Upload to GitHub or image hosting service and update the URL above*

### Chat Interface with Gemini API
![Chat with Gemini](https://via.placeholder.com/800x450/003049/F77F00?text=Chat+ONN+-+Gemini+AI)
*Replace with your screenshot: Upload to GitHub or image hosting service and update the URL above*

**To add your own screenshots:**
1. Take screenshots of your app in action
2. Upload to GitHub: Create an `assets` folder in your repo and add images
3. Replace the URLs above with: `./assets/screenshot-ollama.png` and `./assets/screenshot-gemini.png`

## 🚀 Features

- 💬 **AI Chat Interface** - Natural conversation flow for content creation
- 🤖 **Dual AI Support** - Switch between Gemini API and Ollama (local LLM)
- 📝 **Markdown Support** - Bold text formatting and code blocks with syntax highlighting
- ✍️ **Draft Management** - Save, edit, and manage your content drafts
- 👤 **User Authentication** - Secure signup/login with JWT
- ✏️ **Chat Management** - Edit chat titles and delete conversations
- � **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Beautiful UI** - Modern design with Inter font and Framer Motion animations
- ⚡ **Real-time Responses** - Fast AI responses with loading indicators
- 💾 **Collapsible Sidebar** - Toggle sidebar for more screen space

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18** (JSX)
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Inter Font** - Modern typography for text
- **Fira Code** - Monospace font for code blocks
- **Custom Color Palette** - Prussian Blue, Fire Engine Red, Orange Wheel, Xanthous, Vanilla

### Backend
- **Go Fiber** - Fast HTTP framework
- **MongoDB** - NoSQL Database
- **JWT** - Authentication (7-day expiration)
- **Gemini API** - Google's AI model
- **Ollama** - Local LLM support (llama3.1:latest)
- **godotenv** - Environment configuration

## 📂 Project Structure

```
Content Generation/
├── backend/
│   ├── main.go
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── db/
│   └── go.mod
│
├── frontend/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── chat/
│   │   ├── drafts/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── profile/
│   │   └── settings/
│   ├── components/
│   │   ├── ChatWindow.jsx
│   │   ├── ChatSidebar.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── MessageInput.jsx
│   │   ├── NotificationPanel.jsx
│   │   ├── SuggestionPanel.jsx
│   │   ├── Navbar.jsx
│   │   ├── AuthForm.jsx
│   │   ├── FloatingButton.jsx
│   │   └── SkeletonCard.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── motion.js
│   └── package.json
│
└── PLAN/
    └── plan.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Go 1.21+
- MongoDB 5.0+ (running locally or MongoDB Atlas)
- Ollama (optional, for local LLM) - [Download Ollama](https://ollama.ai)

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Create a `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content_generator
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AI Configuration
USE_GEMINI=false
GEMINI_API_KEY=your-gemini-api-key-here

USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:latest
```

3. Install Ollama (if using local LLM):
```powershell
# Download from https://ollama.ai
# Pull the llama3.1 model
ollama pull llama3.1:latest
```

3. Install Ollama (if using local LLM):
```powershell
# Download from https://ollama.ai
# Pull the llama3.1 model
ollama pull llama3.1:latest
```

4. Install Go dependencies:
```powershell
go mod download
```

5. Run the server:
```powershell
go run main.go
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```powershell
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/send` - Send message to AI (supports model selection)
- `GET /api/chat/history` - Get user chat history
- `GET /api/chat/:id` - Get specific chat with messages
- `PUT /api/chat/:id/title` - Update chat title
- `DELETE /api/chat/:id` - Delete chat and all messages

### Drafts
- `POST /api/drafts/create` - Create draft
- `GET /api/drafts` - Get all drafts
- `GET /api/drafts/:id` - Get specific draft
- `PUT /api/drafts/:id` - Update draft
- `DELETE /api/drafts/:id` - Delete draft

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## 🎨 Color Palette

- **Prussian Blue** (#003049) - Primary dark
- **Fire Engine Red** (#D62828) - Accent/alerts
- **Orange Wheel** (#F77F00) - Primary action
- **Xanthous** (#FCBF49) - Secondary accent
- **Vanilla** (#EAE2B7) - Background/light

## 🔧 Configuration

### AI Model Selection

The app supports two AI modes that can be switched in real-time from the UI:

#### 1. **Ollama (Local LLM)** - Recommended for privacy and offline use
- Install Ollama from [ollama.ai](https://ollama.ai)
- Pull a model: `ollama pull llama3.1:latest`
- Set in `.env`: `USE_OLLAMA=true` and `OLLAMA_MODEL=llama3.1:latest`
- Benefits: Free, private, works offline, no API costs

#### 2. **Gemini API** - Google's cloud AI
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Set in `.env`: `USE_GEMINI=true` and `GEMINI_API_KEY=your-key`
- Benefits: Fast, powerful, no local resources needed

### Database Migration

MongoDB collections are automatically created on first run:
- `users` - User accounts with authentication
- `chats` - Chat sessions with AI
- `messages` - Individual messages within chats
- `drafts` - Saved content drafts

### Markdown Formatting

The chat interface supports:
- **Bold text**: Use `**text**` for bold formatting
- **Code blocks**: Use triple backticks with language
  ````
  ```python
  def hello():
      print("Hello World")
  ```
  ````

## 🚀 Deployment

### Backend
```powershell
cd backend
go build -o app.exe
./app.exe
```

### Frontend
```powershell
cd frontend
npm run build
npm start
```

## 📝 Development

### Adding New Features

1. Backend: Add routes in `routes/`, controllers in `controllers/`, models in `models/`
2. Frontend: Add pages in `app/`, components in `components/`
3. Use skeleton loading for async operations
4. Follow the color palette for consistent UI

### Code Style

- Frontend: JSX with functional components and hooks
- Backend: Go with clean architecture pattern
- Always include error handling
- Use Framer Motion for animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Go Fiber for the fast backend
- Framer Motion for smooth animations
- The open-source community

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Go Fiber**
