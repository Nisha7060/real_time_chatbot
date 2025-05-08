💬 Realtime Chat App
A full-stack real-time chat application built using Next.js (Frontend & Backend APIs) and Node.js WebSocket Server. It supports real-time one-to-one messaging, contact-based chats, media messages, read/unread status, and an intuitive UI similar to WhatsApp.

📌 Table of Contents
Features

Tech Stack

Project Structure

Installation

Usage

API Overview

WebSocket Events



✨ Features
✅ User Authentication (Login/Logout)

🧑‍🤝‍🧑 Contact Mapping and Chat Initiation

💬 One-to-One Messaging

🔔 Real-time Messaging via WebSocket

👁️ Message Read/Unread Status

🖼️ Image/Media Message Support

📁 Organized chat list by latest message

📊 Unread message count per contact

🛠 Tech Stack
Frontend
Next.js with functional components

Tailwind CSS / CSS Modules

WebSocket Client for real-time communication

UUID for unique message identification

Backend
Node.js + Express.js

WebSocket / WS or Socket.IO

Prisma ORM for database operations

PostgreSQL / MySQL as database

📁 Project Structure

real_time_chatbot/
├── prisma/                     # Prisma schema and migrations
│   └── schema.prisma
├── public/                     # Static assets (audio, icons, etc.)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (for DB & auth)
│   │   ├── chat/               # Chat UI page
│   │   ├── login/              # Login UI page
│   │   ├── page.js             # Main entry (redirect or landing)
│   │   └── layout.js           # Global layout component
│   ├── web-chat/               # Chat components and context
│   │   ├── components/         # Reusable UI components
│   │   ├── ChatContext.js      # Global chat context provider
│   │   ├── active-sound.mp3    # Message sound
│   │   └── styles.css          # Styles
│   ├── lib/                    # Utilities (e.g., DB client, helpers)
│   ├── socket/                 # WebSocket server
│   │   ├── eventHandlers.js    # Socket event logic
│   │   ├── events/             # Event constants/types
│   │   └── socketServer.js     # Socket server logic
├── .env                        # Environment variables
├── next.config.mjs            # Next.js config
├── server.js                  # WebSocket server starter (calls socketServer.js)
├── README.md


⚙️ Environment Setup
1. Environment Variables (.env)

DATABASE_URL="mysql://root:@localhost:3306/chat_db"
NODE_ENV="development"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
AUTH_SECRET="Use your Key"
WEBSOCKET_CHAT_URL="ws://localhost:5000"


🧰 Installation
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/yourname/chat-app.git
cd chat-app
2. Setup Backend
bash
Copy
Edit
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
3. Setup Frontend
bash
Copy
Edit
cd ../client
npm install
npm start
🚀 Usage
Open http://localhost:3000 to access the app.

Login with your credentials.

Start chatting with mapped contacts.

View read receipts, send media, and get real-time updates.

🔄 WebSocket Events
From Client → Server
SendChat: Send new message

Read: Mark message as read

From Server → Client
Incoming: New message received

Report: Message status updated to "read"

