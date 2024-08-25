import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
// import io from socket.io-client
import {io} from "socket.io-client"
function App() {
  // create socket with server url
  const socket = useMemo(()=>io("http://localhost:3000"),[])
  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  // messages array
  const [messages, setMessages] = useState([])
  // room name
  const [roomName, setRoomName] = useState("");
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected: ", socket.id)
      setSocketId(socket.id)
    })
    // listening to updates on event `welcome`
    socket.on("welcome",data=>{
      console.log("Received from circuit-->",data)
    })
    // listening to updates on event `received`
    socket.on("received",data=>{
      console.log("Received from broadcast.emit-->",data)
      setMessages(messages=>[...messages,data])
    })

    return ()=>{
      socket.disconnect()
    }
  },[])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", {message, room})
    setMessage("")
  }
  // handle room join 
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }}/>
      {/* <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography> */}
      {/* display socket id */}
      <Typography variant="h2" component="div" gutterBottom>
        {socketId}
      </Typography>
      {/* join room form */}
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      {/* message form */}
      <Box sx={{ height: 100 }}/>
      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e=>setMessage(e.target.value)} id="outlined-basic" label="Enter your message" variant="outlined" />
        <TextField value={room} onChange={e=>setRoom(e.target.value)} id="outlined-basic" label="Enter room id" variant="outlined" />
        <Button variant="contained" type="submit"> submit </Button>
      </form>
      <Box sx={{ height: 100 }}/>
      <Stack spacing={2}>
        {
          messages.map((msg, index)=>(
            <Typography key={index} variant="h6" component="div" gutterBottom>
              {msg}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App
