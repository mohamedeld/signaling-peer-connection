const socket = io.connect('https://localhost:8080/')
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

    // create offer
    try{
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
    }catch(error){
        console.log(error);
    }
}

const createPeerConnection = async ()=>{
    return new Promise(async (resolve, reject)=>{
        peerConnection = await new RTCPeerConnection(peerConfiguration);
        localStream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track,localStream);
        })

        peerConnection.addEventListener('icecandidate',(e)=>{
            console.log('Ice candidate found')
            console.log(e)
        })
        resolve();
    })

}


document.getElementById("call").addEventListener("click",call);