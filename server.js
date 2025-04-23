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

const offers = [
    // offer username
    // offer 
    // offer iceCandidate
    // answer username 
    // answer
    // answer iceCandidate

]

const connectedSocket = []

const io = socketio(server);
io.on('connection',(socket)=>{
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;

    if(password !== "x"){
        socket.disconnect(true);
        return;
    }
    connectedSocket.push({
        socketId:socket?.id,
        userName
    })
    socket.on('newOffer',(newOffer)=>{
        offers.push({
            offerUserName:userName,
            offer:newOffer,
            offerIceCandidates:[],
            answer:null,
            answerUserName:null,
            answerIceCandidates:[]
        })
        socket.broadcast.emit("newOfferWaiting",offers?.slice(-1))
    })
})
server.listen(8080,()=>{
    console.log(`Server is running on port 8080`);
})
