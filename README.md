# 💬 Realtime Chat App

A full-stack real-time chat application built using **Next.js** (frontend & backend APIs) and a custom **Node.js WebSocket server**. It supports real-time one-to-one messaging, contact-based chats, media messages, read/unread status, and an intuitive UI inspired by WhatsApp.

---

## 📌 Table of Contents

- [✨ Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [📁 Project Structure](#-project-structure)  
- [⚙️ Environment Setup](#️-environment-setup)  
- [🧰 Installation](#-installation)  
- [🚀 Usage](#-usage)  
- [🔄 WebSocket Events](#-websocket-events)

---

## ✨ Features

- ✅ User Authentication (Login/Logout)  
- 🧑‍🤝‍🧑 Contact Mapping and Chat Initiation  
- 💬 One-to-One Messaging  
- 🔔 Real-time Messaging via WebSocket  
- 👁️ Message Read/Unread Status  
- 🖼️ Image/Media Message Support  
- 📁 Organized Chat List by Latest Message  
- 📊 Unread Message Count per Contact  

---

## 🛠 Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) (App Router)
- Tailwind CSS / CSS Modules
- WebSocket Client for real-time updates
- UUID for unique message IDs

### Backend

- Node.js with Express.js
- WebSocket (`ws`) or Socket.IO
- Prisma ORM
- PostgreSQL / MySQL

---

## 📁 Project Structure

```bash
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



---

## ⚙️ Environment Setup

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="mysql://root:@localhost:3306/chat_db"
NODE_ENV="development"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
AUTH_SECRET="your_auth_secret_key"
WEBSOCKET_CHAT_URL="ws://localhost:5000"

🧰 Installation
1. Clone the Repository
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
npm run dev
🚀 Usage
Open your browser and go to: http://localhost:3000

Login using your credentials

Start chatting with your contacts

Enjoy real-time updates, media messages, and read receipts

🔄 WebSocket Events
Client → Server
Event	Description
SendChat	Send a new chat message
Read	Mark message as "read"

Server → Client
Event	Description
Incoming	A new message is received
Report	A message is marked as "read"

