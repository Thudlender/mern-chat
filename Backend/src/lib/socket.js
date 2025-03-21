import { Server } from "socket.io"
import http from "http";
import express from "express"
import { log } from "console";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    },
});




const userSocketMap = {}; // {userId:socketId}
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A User connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("friendRequestSent", (friendId)=>{
        const receiverSockedId = getReceiverSocketId(friendId);
        if(receiverSockedId) {
            io.to(receiverSockedId).emit("friendRequestReceived",) /////////////////////
        }
    })

    socket.on("disconnect", () => {
        console.log("A User disconnected", socket.id);
        delete userSocketMap[userId];
    });
})

export { io, app, server };