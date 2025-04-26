
socket.on("availableOffers",offers=>{
    createOfferEls(offers);
})

socket.on("newOfferWaiting",offers=>{
    createOfferEls(offers);
})

socket.on("answerResponse",offerObj=>{
    addAnswer(offerObj)
})
function createOfferEls(offers){
    const answerEl = document.querySelector("#answer");
    offers?.forEach((o)=>{
        const newOfferEl = document.createElement("div");
        newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o?.offerUserName}</button>`;
        newOfferEl.addEventListener('click',()=> createAnswer(o))
        answerEl.appendChild(newOfferEl)
    })
}


socket.on("receivedICECandidateFromServer",iceCandidate=>{
    addNewIceCandidate(iceCandidate)
})