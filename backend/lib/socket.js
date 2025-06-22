import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
})
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}
const userSocketMap = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('A User Connected with this socket and userId', socket.id, userId)

    if (userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));



    socket.on('disconnect', () => {
        console.log('A User Disconnected with this socket and userId', socket.id, userId)
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})
export {io, app, server} 