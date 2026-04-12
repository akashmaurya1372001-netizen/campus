import { Server } from 'socket.io';
export let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins for development
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    return io;
};
//# sourceMappingURL=socket.js.map