import React from 'react';
import './Sidebar.css'; // optional for custom CSS

export default function Sidebar() {
  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom bg-white">
        <h5>Chats</h5>
        <input className="form-control" type="text" placeholder="Search contacts..." />
      </div>
      <div className="overflow-auto flex-grow-1 bg-white">
        {/* Example contact list */}
        {[...Array(10)].map((_, idx) => (
          <div key={idx} className="p-3 border-bottom contact-item">
            <strong>Contact {idx + 1}</strong>
            <div className="text-muted small">Last message preview...</div>
          </div>
        ))}
      </div>
    </div>
  );
}
