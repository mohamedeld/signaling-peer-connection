const userName = `Mohamed-${Math.floor(Math.random() * 100000)}`;
const password = 'x';

document.querySelector('#user-name').innerHTML = userName;


const socket = io.connect('https://localhost:8080/',{
    auth:{
        userName,
        password
    }
})
const localVideoEl = document.getElementById("local-video");
const remoteVideoEl = document.getElementById("remote-video");

let localStream;
let remoteStream;

let peerConnection;
let didIOffer = false;
let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

const fetchUserMedia = async ()=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            })
            localVideoEl.srcObject = stream;
            localStream = stream;
            resolve();
        }catch(error){
            console.log(error);
            reject();
        }
    })
}

const call = async (e)=>{
    await fetchUserMedia();

    await createPeerConnection();

    // create offer
    try{
        const offer = await peerConnection.createOffer();
       await peerConnection.setLocalDescription(offer);
        didIOffer=true;
        socket.emit('newOffer',offer)
    }catch(error){
        console.log(error);
    }
}

const createAnswer = async (offerObj)=>{
    await fetchUserMedia();
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer({})
    await peerConnection.setLocalDescription(answer);
    offerObj.answer = answer;
    const offerIceCandidates = await socket.emitWithAck("newAnswer",offerObj);
    offerIceCandidates?.forEach((c)=>{
        peerConnection?.addIceCandidate(c);
    })
}


const addAnswer = async (offerObj)=>{
if (!offerObj || !offerObj.answer) {
        console.error('Invalid answer object received:', offerObj);
        return;
    }
    await peerConnection.setRemoteDescription(offerObj?.answer);
    
}
const createPeerConnection = async (offerObj)=>{
    return new Promise(async (resolve, reject)=>{
        peerConnection = await new RTCPeerConnection(peerConfiguration);
        
        remoteStream = new MediaStream();
        remoteVideoEl.srcObject = remoteStream;
        
        localStream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track,localStream);
        })



        peerConnection.addEventListener('icecandidate',(e)=>{
            if(e.candidate){
                socket.emit("sendICECandidatetoSignalServer",{
                    iceCandidate:e.candidate,
                    iceUserName:userName,
                    didIOffer
                })
            }
        })  
        
        peerConnection.addEventListener('track',(e)=>{
            const remoteStream = e.streams[0];
            remoteStream.getTracks().forEach((track)=>{
                remoteVideoEl.srcObject = remoteStream;
                remoteStream.addTrack(track,remoteStream);
            })
        })
        if(offerObj){
           await peerConnection.setRemoteDescription(offerObj?.offer)
        }
        resolve();
    })
}

const addNewIceCandidate = (iceCandidate)=>{
    peerConnection.addIceCandidate(iceCandidate).then(()=>{
        console.log("added ice candidate")
    }).catch((error)=>{
        console.log(error)
    })
}

document.getElementById("call").addEventListener("click",call);