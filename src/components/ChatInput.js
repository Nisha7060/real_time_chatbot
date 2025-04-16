import React from 'react';

export default function ChatInput() {
  return (
    <div className="border-top p-2 bg-light">
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Type a message..." />
        <button className="btn btn-success">Send</button>
      </div>
    </div>
  );
}
