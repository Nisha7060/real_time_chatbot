'use client';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId, onReceive) => {
  const socketRef = useRef();

  useEffect(() => {
    const socket = io({
      path: '/api/socket',
    });

    socketRef.current = socket;

    socket.emit('Register', { userId });

    socket.on('ReceiveChat', (msg) => {
      console.log('Message received:', msg);
      onReceive(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (data) => {
    socketRef.current.emit('SendChat', data);
  };

  return { sendMessage };
};

export default useSocket;
