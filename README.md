# AI Content Generator - Chat ONN

A complete AI-powered content generation platform with a modern chat interface built with Next.js and Go Fiber.

## 🚀 Features

- 💬 **AI Chat Interface** - Natural conversation flow for content creation
- ✍️ **Draft Management** - Save, edit, and manage your content drafts
- 👤 **User Authentication** - Secure signup/login with JWT
- 🔔 **Notifications** - Stay updated with mentions and suggestions
- 💡 **Smart Suggestions** - AI-powered topic and content suggestions
- 🎨 **Beautiful UI** - Modern design with Framer Motion animations
- ⚡ **Skeleton Loading** - Smooth loading states throughout the app

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18** (JSX)
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Custom Color Palette** - Prussian Blue, Fire Engine Red, Orange Wheel, Xanthous, Vanilla

### Backend
- **Go Fiber** - Fast HTTP framework
- **PostgreSQL** - Database
- **GORM** - ORM for Go
- **JWT** - Authentication
- **Gemini API** / **Local LLM** - AI integration

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
- PostgreSQL 14+

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Copy the environment file and configure it:
```powershell
cp .env.example .env
```

3. Edit `.env` with your database credentials:
```
PORT=8080
DATABASE_URL=host=localhost user=postgres password=postgres dbname=content_generator port=5432 sslmode=disable
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
```

4. Install dependencies:
```powershell
go mod download
```

5. Run the server:
```powershell
go run main.go
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Copy the environment file:
```powershell
cp .env.example .env
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
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get user chat history
- `GET /api/chat/:id` - Get specific chat
- `DELETE /api/chat/:id` - Delete chat

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

### Database Migration

The database schema will be automatically created on first run. Tables include:
- `users` - User accounts
- `chats` - Chat sessions with messages
- `drafts` - Saved content drafts

### AI Integration

The app supports two AI modes:
1. **Gemini API** - Set `GEMINI_API_KEY` in backend `.env`
2. **Local LLM** - Configure your local LLM endpoint (Ollama, Mistral, etc.)

Toggle between modes in the Settings page.

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
