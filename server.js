const fs = require("fs");
const https = require("https");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname));
const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

const server = https.createServer({
    key,
    cert
},app);

const io = socketio(server);
io.on('connection',(socket)=>{
    socket.on('')
})
server.listen(8080,()=>{
    console.log(`Server is running on port 8080`);
})
