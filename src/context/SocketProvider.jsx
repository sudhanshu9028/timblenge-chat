'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Defer socket connection to avoid blocking initial render
    // Use requestIdleCallback or setTimeout to delay connection
    const connectSocket = () => {
      const s = io(); // open your socket once
      socketRef.current = s;
      setSocket(s);
    };

    // Delay socket connection until after initial render
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(connectSocket, { timeout: 2000 });
        return () => {
          cancelIdleCallback(id);
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } else {
        const timeoutId = setTimeout(connectSocket, 100);
        return () => {
          clearTimeout(timeoutId);
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext); 