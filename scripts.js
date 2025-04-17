const localVideoEl = document.getElementById("local-video");
const remoteVideoEl = document.getElementById("remote-video");

let localStream;
let remoteStream;

let peerConnection;

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


const call = async (e)=>{
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    })
    localVideoEl.srcObject = stream;
    localStream = stream;

    await createPeerConnection();
}

const createPeerConnection = async ()=>{
    return new Promise((resolve, reject)=>{
        peerConnection = new RTCPeerConnection(peerConfiguration);
    })
}


document.getElementById("call").addEventListener("click",call);