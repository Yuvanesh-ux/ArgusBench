import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  const token = localStorage.getItem('accessToken');
  socket = io('/', {
    path: '/socket.io',
    transports: ['websocket'],
    autoConnect: true,
    withCredentials: true,
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


