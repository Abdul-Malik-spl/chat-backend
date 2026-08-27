// const { log } = require('console');
const express = require('express');
const {v4:uuidv4}=require("uuid")
const app = express();
const {Server}=require('socket.io')
const http = require('http')

const server=http.createServer(app)
const io=new Server(server,{cors:{origin:"*",methods:["GET","POST"]}})
let user=[]
let message=[]

app.get("/", (req, res) => {
  res.send("Chat backend is running");
});

io.on("connection",(socket)=>{
   
    socket.on("join",(userName)=>{
        let time=new Date().toLocaleTimeString()
        // console.log(time)
     const id = uuidv4()
     user.push({id,userName})
     io.emit("users",user.map((user)=>(user.userName)))
     message.push({userName:"system",message:`${userName} join`,time})
     io.emit("message",message)
    })
socket.on("message",(msg)=>{
     let time=new Date().toLocaleTimeString()
message.push({...msg,time})
 io.emit("message",message)
})

socket.on("logout",(name)=>{
     let time=new Date().toLocaleTimeString()
    user = user.filter(u => u.userName !== name);

    io.emit("users", user.map(u => u.userName));

    message.push({userName:"system", message:`${name} left`,time});
    io.emit("message", message);
});

socket.on("clear",(userName)=>{
  if(userName === "abdulad"){ 
    user = [];
    message = [];
    io.emit("users", []);
    io.emit("message", []);
       io.sockets.sockets.forEach((s)=>{
      s.disconnect(true);
    });
  }
})

    // console.log("user connected",user.map((user)=>(user.userName)))
})

const PORT = process.env.PORT || 2000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});