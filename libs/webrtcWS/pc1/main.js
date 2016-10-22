var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var peerConnection;
var uuid;

var peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
};

var startButton = document.getElementById('startButton');
var callButton = document.getElementById('callButton');
var hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
startButton.disabled = true;
startButton.onclick = initLocalDevice;
callButton.onclick = function(){ call(true); }
hangupButton.onclick = hangup;

function initWebRTC( data ){
    if(data.status === "connected" & data.event === "local"){
        console.log(data.event + " - " + data.status + " - " + data.localID);
        startButton.disabled = false;
    } else if(data.status === "disconnected" & data.event === "remote"){
        console.log(data.event + " - " + data.status + " - " + data.localID);
        if(peerConnection != null){ stopRemoteVideo(); }
    }
}

function initLocalDevice(){

    startButton.disabled = true;

    uuid = uuid();

    console.log(uuid);

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

function getUserMediaSuccess(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
    callButton.disabled = false;
}

function call(isCaller) {
    callButton.disabled = true;
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.onaddstream = gotRemoteStream;
    peerConnection.addStream(localStream);

    if(isCaller) {
        peerConnection.createOffer().then(createdDescription).catch(errorHandler);
    }
}

function gotMessageFromServer(data) {
    if(!peerConnection){
        call(false);
    }

    var signal = JSON.parse(data.msg);

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
    } else if(signal.status === "hangup"){
        stopRemoteVideo();
    }
}

function stopRemoteVideo(){
    hangupButton.disabled = true;
    peerConnection.close();
    peerConnection = null;
    remoteVideo.pause();
    remoteVideo.load();
    callButton.disabled = false;
}

function gotIceCandidate(event) {
    if(event.candidate != null) {
        window.webSockets.send(JSON.stringify({'ice': event.candidate, 'uuid': uuid}));
    }
}

function createdDescription(description) {
    peerConnection.setLocalDescription(description).then(function() {
        window.webSockets.send(JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
    }).catch(errorHandler);
}

function gotRemoteStream(event) {
    console.log('got remote stream');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
    hangupButton.disabled = false;
}

function hangup() {
  stopRemoteVideo();
  window.webSockets.send(JSON.stringify({'status': 'hangup', 'uuid': uuid}));
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
