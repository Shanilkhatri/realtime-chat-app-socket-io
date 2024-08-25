import express from "express"
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors"
const PORT = 3000;
const app = express()

// create server instance and initialize it with our app
const server = createServer(app)


// initialize the circuit for socket
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "POST"],
        credentials:true
    }
})

app.use(cors)
// basic entry route to check everything's fine
app.get('/',(req,res)=>{
    res.send("Hello world bhai!")
})
// log whenever a socket connect's to circuit
io.on("connection",(socket)=>{
    console.log("user connected with id: ",socket.id)
    // here welcome is an event and the string ahead is the data 
    // we are sending
    socket.emit("welcome","Welcome to the server friend")

    // `message` event listener
    socket.on('message',({room,message})=>{
        if(room!=""){
            socket.to(room).emit("received",message)
        }else{
            socket.broadcast.emit("received",data)
        }
    })
    // `join-room` event listener
    socket.on("join-room",(room)=>{
        console.log("user joined room: ",room)
        socket.join(room)
    })
})
// log whenever a socket disconnects
io.on("disconnect",()=>{
    console.log("user disconnected with id: ",socket.id)
})
server.listen(PORT, ()=>{
    console.log("Running on port: ",PORT)
})