export default function MessageBubble({ message }) {
    const isMe = message.from === 'me';
    return (
      <div className={`max-w-xs p-2 rounded ${isMe ? 'ml-auto bg-green-100' : 'mr-auto bg-gray-200'}`}>
        {message.text}
      </div>
    );
  }
  