'use client';
import './globals.css'; // your own styles
import { ChatProvider } from "./web-chat/ChatContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ChatProvider >
        {children}
        </ChatProvider>
        {/* ✅ Bootstrap JS from CDN (load after content) */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
        </body>
    </html>
  );
}
