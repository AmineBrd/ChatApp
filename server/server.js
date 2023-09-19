const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute")
const messageRoute = require("./routes/messageRoute")
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);


const port = process.env.PORT || 5000;
const url = process.env.ATLAS_URL;

app.listen(port ,()=>{
    console.log(`Server is running on port: ${port}`)
})

mongoose.connect(url ,{
    useNewUrlParser:true,
    useUnifiedTopology: true 
}).then(()=>{
    console.log("MongoDB connection established.")
}).catch(e=>{
    console.error("MongoDB connection failed: ",e.message)
})