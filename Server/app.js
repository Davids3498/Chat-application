import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoute from './routes/Routes.js';
import dotenv from 'dotenv'
import msgRoute from './routes/MessagesRoute.js';
import { Server, Socket } from 'socket.io';

// making  application
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoute)
app.use('/api/messages', msgRoute)
try {
    const result = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("DB conneceted successfull");
    const server = app.listen(process.env.PORT, () => {
        console.log("Server running!");
    });
    const io = new Server(server,{
        cors:{
            origin:'http://localhost:3000',
            Credentials: true
        }
    })
    global.onlineUsers = new Map();

    io.on('connection',(socket)=>{
        global.chatSocket = socket;
        socket.on('add-user', (userID)=>{
            onlineUsers.set(userID,socket.id)
        })

        socket.on('send-msg',(data)=>{
            // console.log(data);
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit('msg-recived',data.message)
            }
        })
    })
}
catch (err) {
    console.log(err);
};