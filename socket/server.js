const { Server } = require("socket.io");

const io = new Server({cors:"http://localhost:5173"});

let onlineUsers = [];
io.on("connection",(socket)=>{
    console.log("Connected to Socket",socket.id);
    // listen to connection
    socket.on("addNewUser",(userId)=>{
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId:socket.id
        })
    io.emit("getOnlineUsers",onlineUsers)
})

    socket.on("sendMessage",(msg)=>{
        const user = onlineUsers.find((u)=> u.userId === msg.recipientId);
        if(user){
            io.to(user.socketId).emit("getMessage",msg)
        }
    })
    socket.on("disconnect",()=>{
        onlineUsers = onlineUsers.filter(user=>user.socketId !== socket.id);
        io.emit("getOnlineUsers",onlineUsers)
    })
})

io.listen(3000);