const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// const server = require(('http')).createServer(app);
const io = require("socket.io")(5001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const config = require("./config/key");

const {Chat} = require("./models/Chat");

const mongoose = require("mongoose");
const connect = ()=>{
  mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
}

connect();

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));


io.on('connection', socket => {
  socket.emit("hello", "world");
  socket.on('inputChatMessage', async msg => {
        const newChat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type })
        await newChat.save();
        const chat = await Chat.find({ "_id": newChat._id }).populate("sender")
        socket.emit("message",chat)
  });
  console.log("connected");
});

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});