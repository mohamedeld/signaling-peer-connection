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

    if(offers?.length){
        socket.emit("availableOffers",offers)
    }
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
    socket.on("newAnswer",(offerObj)=>{
        const socketToAnswer = connectedSocket?.find(s=> s?.userName === offerObj?.offerUserName);
        if(!socketToAnswer){
            console.log("not socket ")
            return;
        }
        
        const socketToAnswerId = socketToAnswer?.socketId;
        const offerToUpdate= offers?.find((o)=> o?.offerUserName === offerObj?.offerUserName);
        if(!offerToUpdate){
            console.log("not offer ")

            return;
        }

        offerToUpdate.answer = offerObj?.answer;
        offerToUpdate.answerUserName = userName;
        socket.to(socketToAnswerId).emit("answerResponse",offerToUpdate)
    })
    socket.on("sendICECandidatetoSignalServer", iceCandidateObj=>{
        const {iceCandidate,iceUserName,didIOffer} = iceCandidateObj;
        if(didIOffer){
            const offerInOffers = offers?.find((o)=> o?.offerUserName === iceUserName);
            
            if(offerInOffers){
                offerInOffers.offerIceCandidates.push(iceCandidate);
            }
        }
    })
})
server.listen(8080,()=>{
    console.log(`Server is running on port 8080`);
})
