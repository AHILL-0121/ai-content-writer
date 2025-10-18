Perfect 👍 — since you want **Next.js (JSX)** instead of TypeScript (`.tsx`), here’s the full MVP plan rewritten with that in mind, plus a ready-to-implement **folder structure and file-level breakdown** (JS + JSX version).
This version keeps the **Chat ONN UI** look (as in your image), powered by **Next.js + Go Fiber + Gemini API / Local LLM** with **Framer Motion** animations.

---

# 🚀 MVP: AI Content Generator (Chat ONN)

**Stack:**

* **Frontend:** Next.js 15 (App Router) + JSX + Tailwind CSS + Framer Motion
* **Backend:** Go Fiber + PostgreSQL (via GORM)
* **AI Integration:** Gemini API / Local LLM (Ollama, Mistral, etc.)

---

## 🧩 Core MVP Features

| Feature                            | Description                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| 💬 **AI Chat for Blog Creation**   | Chat-like interface where users brainstorm, generate, and refine blog drafts interactively. |
| ✍️ **Draft Management**            | Save, edit, export, and delete blog drafts.                                                 |
| 👤 **User Accounts**               | Sign up, log in, profile settings.                                                          |
| 🔔 **Notifications & Suggestions** | Sidebar showing mentions, topic suggestions.                                                |
| ⚙️ **LLM Settings**                | Choose Gemini API or Local LLM (toggle in settings).                                        |

---

## 🧠 Frontend (Next.js + JSX)

### Folder Structure

```
frontend/
├── app/
│   ├── layout.jsx
│   ├── page.jsx               # Landing page
│   ├── login/page.jsx
│   ├── signup/page.jsx
│   ├── chat/page.jsx
│   ├── drafts/page.jsx
│   ├── drafts/[id]/page.jsx
│   ├── profile/page.jsx
│   ├── settings/page.jsx
│   └── globals.css
│
├── components/
│   ├── ChatWindow.jsx
│   ├── ChatSidebar.jsx
│   ├── ChatMessage.jsx
│   ├── NotificationPanel.jsx
│   ├── SuggestionPanel.jsx
│   ├── Navbar.jsx
│   ├── AuthForm.jsx
│   └── FloatingButton.jsx
│
├── hooks/
│   ├── useChat.js
│   ├── useAuth.js
│   └── useDrafts.js
│
├── lib/
│   ├── api.js                 # API calls to Go backend
│   └── motion.js              # Framer motion variants
│
└── tailwind.config.js
```

---

### ⚙️ Key Pages

#### `/` → `app/page.jsx`

* Landing with product intro, “Start Chatting” button.
* CTA → redirects to `/chat` if logged in, `/login` otherwise.
* Animations: fade-in hero text and floating gradient shapes.

#### `/chat` → `app/chat/page.jsx`

* Main chat interface (like shown UI)
* **Sections:**

  * Left: Chat list (direct, groups, public)
  * Center: Chat window (user + AI messages)
  * Right: Notifications + Suggestions

**Interactions:**

* Type message → `POST /api/chat/send`
* AI reply animates via typing indicator
* Save chat as draft

**UI Elements:**

* `<ChatWindow />` with animated chat bubbles
* `<NotificationPanel />` & `<SuggestionPanel />` slide in/out
* `<FloatingButton />` for “New Chat”

#### `/drafts` → `app/drafts/page.jsx`

* List all saved drafts with Edit/Delete buttons
* Animate each draft card on hover

#### `/drafts/[id]` → `app/drafts/[id]/page.jsx`

* Edit or regenerate content using AI
* Toolbar: “Summarize,” “Expand,” “SEO Optimize”
* Preview mode toggle

#### `/login` & `/signup`

* Auth form using `<AuthForm />`
* JWT stored in localStorage

#### `/profile` & `/settings`

* Update profile picture, preferences, API type toggle

---

## 🧰 Backend (Go Fiber)

### Folder Structure

```
backend/
├── main.go
├── routes/
│   ├── auth.go
│   ├── chat.go
│   ├── drafts.go
│   └── profile.go
├── controllers/
│   ├── authController.go
│   ├── chatController.go
│   ├── draftController.go
│   └── profileController.go
├── models/
│   ├── user.go
│   ├── chat.go
│   └── draft.go
├── db/
│   └── connect.go
├── middlewares/
│   └── authMiddleware.go
└── go.mod
```

### 🧩 API Endpoints

| Method   | Route                       | Description                            |
| -------- | --------------------------- | -------------------------------------- |
| `POST`   | `/api/auth/signup`          | Create new user                        |
| `POST`   | `/api/auth/login`           | Authenticate user, return JWT          |
| `POST`   | `/api/chat/send`            | Send message to AI and return response |
| `GET`    | `/api/chat/history/:userID` | Get user chat history                  |
| `POST`   | `/api/drafts/create`        | Save chat as draft                     |
| `GET`    | `/api/drafts/:userID`       | Fetch drafts                           |
| `PUT`    | `/api/drafts/:id`           | Update draft                           |
| `DELETE` | `/api/drafts/:id`           | Delete draft                           |
| `GET`    | `/api/profile/:id`          | Get user profile                       |
| `PUT`    | `/api/profile/:id`          | Update profile                         |

---

## 🎨 Animations (Framer Motion)

| Component           | Animation           | Description                               |
| ------------------- | ------------------- | ----------------------------------------- |
| Chat bubbles        | Slide-up + fade     | New messages appear smoothly              |
| Notifications panel | Slide-in-right      | Appears on click                          |
| Suggestions panel   | Staggered fade-in   | Each suggestion card appears sequentially |
| Floating “+” button | Scale hover         | Expands when hovered                      |
| Page transitions    | Fade between routes | Smooth navigation feel                    |

Example (`motion.js`):

```js
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
```

---

## 🧱 Database (Simplified Schema)

**users**

```sql
id SERIAL PRIMARY KEY
name VARCHAR(100)
email VARCHAR(100) UNIQUE
password_hash TEXT
avatar_url TEXT
created_at TIMESTAMP DEFAULT NOW()
```

**chats**

```sql
id SERIAL PRIMARY KEY
user_id INT REFERENCES users(id)
messages JSONB
created_at TIMESTAMP DEFAULT NOW()
```

**drafts**

```sql
id SERIAL PRIMARY KEY
user_id INT REFERENCES users(id)
title TEXT
content TEXT
status VARCHAR(20) DEFAULT 'draft'
updated_at TIMESTAMP DEFAULT NOW()
```

---

## 🔗 AI Integration Flow

1. **Frontend:**
   User sends message → POST `/api/chat/send`
2. **Backend (Go):**
   Receives text → forwards to Gemini API / local LLM
   Example:

   ```go
   response := CallGeminiAPI(prompt)
   ```
3. **Frontend:**
   Streams AI response into chat bubbles
   Stores chat in DB as `messages[]`.

---

## 📁 Folder Summary

```
ai-content-generator/
│
├── frontend/ (Next.js JSX)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── styles/
│
└── backend/ (Go Fiber)
    ├── routes/
    ├── controllers/
    ├── models/
    ├── db/
    └── middlewares/
```

---

## 🌱 Future Enhancements

* SEO keyword generation
* Multi-user collaboration on blog drafts
* Voice input and text-to-speech replies
* AI tone/style presets
* Integration with Notion or Medium APIs

---

Perfect 🎨 You’ve provided a **bold, warm color palette** — great for a **modern chat UI** that feels energetic yet professional.
Let’s use this palette to design a **Chat Interface (UI mockup in JSX + CSS)** in a **React (Next.js)** style — no TypeScript.

---

## 🎯 Goal

Create a **chat UI** with:

* Sidebar for users/conversations
* Main chat area
* Message bubbles (sent/received)
* Message input bar

---

## 📂 Folder Structure

```
chat-ui/
│
├── components/
│   ├── ChatApp.jsx
│   ├── Sidebar.jsx
│   ├── ChatWindow.jsx
│   └── MessageInput.jsx
│
├── styles/
│   └── chat.css
│
└── App.jsx
```

---

## 💬 App.jsx

```jsx
import React from "react";
import ChatApp from "./components/ChatApp";
import "./styles/chat.css";

export default function App() {
  return (
    <div className="app-container">
      <ChatApp />
    </div>
  );
}
```

---

## 💬 components/ChatApp.jsx

```jsx
import React from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatApp() {
  return (
    <div className="chat-app">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
```

---

## 💬 components/Sidebar.jsx

```jsx
import React from "react";

export default function Sidebar() {
  const contacts = ["Alice", "Bob", "Charlie", "Diana"];

  return (
    <div className="sidebar">
      <h2 className="logo">Chatify</h2>
      <ul className="contact-list">
        {contacts.map((name, i) => (
          <li key={i} className="contact">
            <span className="avatar">{name[0]}</span>
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 💬 components/ChatWindow.jsx

```jsx
import React from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const messages = [
    { sender: "Alice", text: "Hey, how are you?", type: "received" },
    { sender: "You", text: "Doing great! You?", type: "sent" },
    { sender: "Alice", text: "Awesome 😄", type: "received" },
  ];

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
```

---

## 💬 components/MessageInput.jsx

```jsx
import React, { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="send-btn">Send</button>
    </div>
  );
}
```

---

## 🎨 styles/chat.css

```css
:root {
  --prussian-blue: #003049;
  --fire-engine-red: #d62828;
  --orange-wheel: #f77f00;
  --xanthous: #fcbf49;
  --vanilla: #eae2b7;
}

/* General Layout */
.app-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--vanilla);
  font-family: "Poppins", sans-serif;
}

.chat-app {
  display: flex;
  width: 80%;
  height: 80%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Sidebar */
.sidebar {
  background: var(--prussian-blue);
  color: var(--vanilla);
  width: 25%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: var(--xanthous);
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.contact:hover {
  background: var(--fire-engine-red);
  color: white;
}

.avatar {
  background: var(--orange-wheel);
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Chat Window */
.chat-window {
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.messages {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.message {
  margin: 10px 0;
  display: flex;
}

.message.sent {
  justify-content: flex-end;
}

.bubble {
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
}

.message.sent .bubble {
  background: var(--orange-wheel);
  color: white;
  border-bottom-right-radius: 0;
}

.message.received .bubble {
  background: var(--vanilla);
  border-bottom-left-radius: 0;
}

/* Input Bar */
.message-input {
  display: flex;
  border-top: 2px solid var(--xanthous);
  padding: 10px;
  background: var(--vanilla);
}

.message-input input {
  flex: 1;
  border: none;
  outline: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
}

.send-btn {
  background: var(--fire-engine-red);
  color: white;
  border: none;
  margin-left: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.send-btn:hover {
  background: var(--orange-wheel);
}
```

---

## 🌈 Visual Theme Summary

| Element              | Color                                           |
| -------------------- | ----------------------------------------------- |
| Background           | `--vanilla`                                     |
| Sidebar              | `--prussian-blue`                               |
| Chat bubbles         | `--orange-wheel` (sent), `--vanilla` (received) |
| Buttons / Highlights | `--fire-engine-red`, `--xanthous`               |

---

Would you like me to **add gradient accents** (like `--gradient-top-right`) in the sidebar or message header to make it look more **futuristic and premium**?
