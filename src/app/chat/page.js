'use client';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import './page.css'; // if you want extra custom styling

export default function HomePage() {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-md-4 col-lg-3 p-0 border-end bg-light">
          <Sidebar />
        </div>
        <div className="col-md-8 col-lg-9 p-0">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
