# PulseChat — Real-Time Ephemeral Multi-Room Chat Application

A fast, private, and feature-rich real-time chat application built with **React 18**, **Node.js**, **Express**, and **Socket.IO**. Designed with a modern dark-mode glassmorphic interface, PulseChat enables interactive multi-room communication with rich media support while strictly honoring an **ephemeral zero-backend-storage** architecture.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Zero-Backend Storage Architecture](#zero-backend-storage-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Running the Application](#running-the-application)
- [Socket.IO Events & Protocol](#socketio-events--protocol)
- [Environment Variables](#environment-variables)
- [Build & Testing](#build--testing)
- [Deployment](#deployment)
- [License](#license)

---

## 🌟 Overview

PulseChat is designed for instant, spontaneous conversations across distinct rooms (e.g., `#general`, `#gaming`, `#tech`). Users can join any room simply by picking a display name and room name, or by opening a shared invite link. 

Unlike traditional chat platforms that log conversations to persistent databases or cloud storage buckets, **PulseChat operates completely in-memory**. All text, reactions, stickers, and images are broadcast as ephemeral WebSocket events and vanish once users leave or refresh their session.

---

## ✨ Key Features

### 1. Modern Glassmorphic UI / UX
- **Contemporary Dark Theme**: Sleek `#0d0e17` background with ambient glowing gradients, frosted glass blur, and custom slim scrollbars.
- **Dynamic Avatar Generation**: Computes unique deterministic gradient colors and initials for each user without requiring external avatar services.
- **Join Experience**: Fast room entry with interactive popular room chips (`#general`, `#gaming`, `#tech`, `#music`, `#chill`) and live avatar preview.
- **Message Bubbles**: Clean bubble styling differentiating current user (indigo gradient) from peers (dark slate), complete with timestamps and auto-linkified URLs.

### 2. Room Presence & Members Option
- **Slide-Over Members Drawer**: Toggleable from the header (`👥 Members (N)`) on all devices (mobile, tablet, desktop).
- **Live Online Indicators**: Pulsing status indicators and participant count.
- **Member Search**: Instant client-side filter for room participants.
- **One-Click Invite Link**: Generates a shareable URL (`/?room=room-name`) copied to the clipboard with visual confirmation.

### 3. Ephemeral Rich Chat (Zero Storage)
- **Client-Side Image Compression**: Selected files are resized and compressed client-side via HTML5 Canvas into lightweight base64 Data URLs (<250KB) before transmission.
- **Drag-and-Drop & Clipboard Paste**: Drag image files directly onto the chat window or press `Ctrl+V` / `Cmd+V` with a copied screenshot.
- **Image Lightbox**: Click any shared image for full-screen inspection with a download option.
- **Integrated Emoji Picker**: Searchable emoji panel powered by `emoji-picker-react`.
- **SVG Sticker Packs**: Curated high-expression reaction stickers (Party, Fire, Mind Blown, Cool, Love, Rocket, etc.) with instant 1-click sending.

### 4. Interactive Feedback & Utilities
- **Real-Time Typing Indicators**: Debounced `"Alice is typing..."` notifications with pulsing dots.
- **Message Reactions**: Quick-hover emoji reaction bar (👍, ❤️, 😂, 🔥, 🚀, 👏) with live multi-user reaction counters.
- **Web Audio Sound Effects**: Subtle, synthesized notification chimes generated through the browser's native Web Audio API (with a mute toggle in the header).
- **In-Chat Message Search**: Instant filtering of messages within the active room session.
- **Export Chat Session**: Download active conversation transcripts as clean `.txt` logs.

---

## 🔒 Zero-Backend Storage Architecture

```
[ Client A ]                                   [ Socket.IO Relay Server ]                 [ Client B ]
     │                                                     │                                   │
     ├── 1. Selects image / Pastes screenshot              │                                   │
     ├── 2. HTML5 Canvas compresses to Data URL (<250KB)   │                                   │
     ├── 3. socket.emit('sendMessage', { type: 'image' }) ─┼──────────────────────────────────>│
     │      (Relayed in-memory only — NO disk/DB writes)   │                                   │
     │                                                     │                                   ├── 4. Displays inline
     │                                                     │                                   │      image + Lightbox
     │                                                     │                                   │
     │<── 5. socket.emit('typing', { isTyping: true }) ────┼─ socket.broadcast.to(room) ───────┤
     │       ("Bob is typing..." animated indicator)       │                                   │
     │                                                     │                                   │
     │<── 6. socket.emit('messageReaction', { ... }) ──────┼─ io.to(room).emit(...) ───────────┤
     │       (Real-time emoji reaction counter updates)    │                                   │
```

- **No Database**: Neither MongoDB, PostgreSQL, SQLite, nor Redis is required.
- **No File Storage**: Images are not uploaded to AWS S3, Cloudinary, or local disk directories.
- **Relay-Only Server**: The backend only maintains an active user array (`users = []`) in memory to route socket rooms and broadcast updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) (Hooks, Functional Components)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Real-Time Client**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Emoji Engine**: [emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react) & [react-emoji](https://www.npmjs.com/package/react-emoji)
- **Audio**: Web Audio API (native browser synthesis)
- **Scrolling**: `react-scroll-to-bottom`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Server**: [Express](https://expressjs.com/)
- **WebSocket Engine**: [Socket.IO](https://socket.io/) (configured with 5MB in-memory buffer)
- **Middleware**: [CORS](https://www.npmjs.com/package/cors)

---

## 📂 Project Structure

```text
chatApplication/
├── README.md                           # Main project documentation
├── package.json                        # Optional workspace root script helper
│
├── server/                             # Backend Service
│   ├── index.js                        # Express + Socket.IO server & event handlers
│   ├── router.js                       # Healthcheck HTTP route
│   ├── users.js                        # In-memory room & user state management
│   ├── package.json                    # Backend dependencies & start scripts
│   └── node_modules/
│
└── frontend/                           # React Frontend Application
    ├── package.json                    # Frontend dependencies & scripts
    ├── public/
    │   ├── index.html                  # HTML entry template
    │   └── manifest.json
    └── src/
        ├── App.js                      # Route definitions (/ and /chat)
        ├── App.test.js                 # Automated unit tests
        ├── index.js                    # React 18 createRoot bootstrap
        ├── index.css                   # Global styling & custom scrollbars
        │
        ├── components/
        │   ├── Join/                   # Landing screen (avatar preview, room chips)
        │   │   ├── Join.js
        │   │   └── Join.css
        │   ├── Chat/                   # Main chat container & socket lifecycle
        │   │   ├── Chat.js
        │   │   └── Chat.css
        │   ├── InfoBar/                # Header (member toggle, search, sound, export)
        │   │   ├── InfoBar.js
        │   │   └── InfoBar.css
        │   ├── Input/                  # Multi-action input (emoji, stickers, image, paste)
        │   │   ├── Input.js
        │   │   └── Input.css
        │   ├── Message/                # Message bubbles (images, reactions, timestamps)
        │   │   ├── Message.js
        │   │   └── Message.css
        │   ├── Messages/               # Auto-scroll list & typing indicator
        │   │   ├── Messages.js
        │   │   └── Messages.css
        │   ├── ActiveUser/             # Slide-out Members Drawer with online indicators
        │   │   ├── ActiveUser.js
        │   │   └── ActiveUser.css
        │   └── Lightbox/               # Full-screen image preview modal
        │       ├── ImageLightbox.js
        │       └── ImageLightbox.css
        │
        └── utils/
            ├── imageCompressor.js      # Client-side Canvas image resizer & compressor
            ├── avatarHelper.js         # Deterministic avatar initials & color generator
            ├── soundEffects.js         # Web Audio API notification sound generator
            └── stickers.js             # Scalable SVG sticker collection
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.0.0 or later recommended)
- **npm** (v8.0.0 or later)

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/chatApplication.git
   cd chatApplication
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

### Running the Application

For local development, run the server and frontend in two separate terminal windows:

#### Terminal 1 — Start Backend Server
```bash
cd server
npm start
```
*The server will start on [http://localhost:5000](http://localhost:5000)*

#### Terminal 2 — Start Frontend Client
```bash
cd frontend
npm start
```
*The React app will open automatically at [http://localhost:3000](http://localhost:3000)*

> [!TIP]
> The frontend dynamically detects when it is running on `localhost` and connects automatically to `http://localhost:5000`. When deployed, it seamlessly falls back to the configured production URL.

---

## 📡 Socket.IO Events & Protocol

| Event Name | Direction | Payload Structure | Description |
| :--- | :--- | :--- | :--- |
| `join` | Client ➔ Server | `{ name: string, room: string }` | Enters a room and requests membership. |
| `sendMessage` | Client ➔ Server | `{ type: 'text'\|'image'\|'sticker', text?: string, mediaUrl?: string, sticker?: object }` | Sends an ephemeral message to the active room. |
| `message` | Server ➔ Client | `{ id: string, user: string, text?: string, type: string, mediaUrl?: string, sticker?: object, timestamp: string, reactions?: object }` | Broadcasts new message to all room members. |
| `typing` | Client ➔ Server | `{ isTyping: boolean }` | Informs server of user keystroke activity. |
| `userTyping` | Server ➔ Client | `{ user: string, isTyping: boolean }` | Broadcasts typing state to peers in the room. |
| `messageReaction` | Bidirectional | `{ messageId: string, emoji: string, user?: string }` | Adds or toggles an emoji reaction on a message. |
| `roomData` | Server ➔ Client | `{ room: string, users: Array<{ id, name, room }> }` | Updates the active member list for the room. |
| `disconnect` | Client ➔ Server | *none* | Removes the user from memory and notifies the room. |

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory if you wish to override the backend endpoint:

```env
REACT_APP_SERVER_URL=http://localhost:5000
```

### Backend (`server/.env`)
Create a `.env` file in the `server/` directory:

```env
PORT=5000
```

---

## 🧪 Build & Testing

### Running Frontend Unit Tests
```bash
cd frontend
npm test -- --watchAll=false
```

### Creating Production Build
```bash
cd frontend
npm run build
```
Generates an optimized production bundle in `frontend/build/`.

---

## 🚢 Deployment

### 1. Backend Deployment (Render, Railway, Fly.io, Heroku)
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- Set `PORT` environment variable (defaults to 5000 if omitted).

### 2. Frontend Deployment (Vercel, Netlify, Render Static)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- Add environment variable `REACT_APP_SERVER_URL` pointing to your deployed backend URL.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
