var localVideo;
var remoteVideo;
var peerConnection;
var uuid;

var peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
};

function wsSend(sendMSG){
    ws.publish("chat", {
        remoteID: window.clientID, msg: sendMSG }
    );
};

function receiveMessage(objData){
    if(objData.data.type === 'message'){        
        gotMessageFromServer(objData.data.msg);
    }
}

function cfWSupdates(status, wsUserID){
    if(status === "connected"){

        console.log(status + " - " + wsUserID);

        uuid = uuid();

        localVideo = document.getElementById('localVideo');
        remoteVideo = document.getElementById('remoteVideo');

        var constraints = {
            video: true,
            audio: true,
        };

        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
        } else {
            alert('Your browser does not support getUserMedia API');
        }

    }
}

function getUserMediaSuccess(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
}

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.onaddstream = gotRemoteStream;
    peerConnection.addStream(localStream);

    if(isCaller) {
        peerConnection.createOffer().then(createdDescription).catch(errorHandler);
    }
}

function gotMessageFromServer(message) {
    if(!peerConnection) start(false);

    var signal = JSON.parse(message);

    // Ignore messages from ourself
    if(signal.uuid == uuid) return;

    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
            // Only create answers in response to offers
            if(signal.sdp.type == 'offer') {
                peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
            }
        }).catch(errorHandler);
    } else if(signal.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
    }
}

function gotIceCandidate(event) {
    if(event.candidate != null) {
        //ws.publish("chat", JSON.stringify({'ice': event.candidate, 'uuid': uuid}));
        wsSend(JSON.stringify({'ice': event.candidate, 'uuid': uuid}));
    }
}

function createdDescription(description) {
    peerConnection.setLocalDescription(description).then(function() {
        wsSend(JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
        //ws.publish("chat", JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
    }).catch(errorHandler);
}

function gotRemoteStream(event) {
    console.log('got remote stream');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function errorHandler(error) {
    console.log(error);
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
