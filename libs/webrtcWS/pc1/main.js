var peer;

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var startVideoButton = document.querySelector('button#startVideoButton');
var connectButton = document.querySelector('button#connectButton');
var closeButton = document.querySelector('button#closeButton');

// ---------------------------- UI --------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        connectButton.disabled = true;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        closeButton.disabled = true;
        connectButton.disabled = false;
    },

    // --- On Local Stream --- //
    onLocalStream: function(stream){
        connectButton.disabled = false;
        localVideo.src = window.URL.createObjectURL(stream);
    },

    // --- On Remote Stream --- //
    onRemoteStream: function(stream){
        closeButton.disabled = false;
        connectButton.disabled = true;
        remoteVideo.src = window.URL.createObjectURL(stream);
    }

};

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
connectButton.onclick = function(){
    closeButton.disabled = false;
    peer.openConnection();
    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    peer.closeConnection();
    window.UI.closeConnection();
}

// --- Starting WebCam --- //
startVideoButton.onclick = function(){
    startVideoButton.disabled = true;
    peer.startUserMedia({ video: true, audio: true });
}

// --------------------- WebRTC CallBacks -------------------------- //

document.addEventListener('DOMContentLoaded', function(){

    var options = {
         video: true,
         audio: true,
         datachannel: false
    }

    peer = new PeersRTC(options);

// ------------------------- STREAMS ------------------------------- //

    peer.on('stream', function(data){
        if(data.event === "local"){ // Local Video Received
            if(localVideo){
                window.UI.onLocalStream(data.stream);
            }
        } else { // Remote Video Received
            if(remoteVideo){
                window.UI.onRemoteStream(data.stream);
            }
        }
    });

    peer.on('status', function(status){
        if(status.event === 'stream'){
            if(status.state === 'close'){
                peer.closeConnection();
                closeButton.disabled = true;
                connectButton.disabled = false;
            }
            console.warn('Remote Stream Status: ' + status.event);
            console.log('uuid: ' + status.uuid);

        } else if(status.event === 'websockets'){

            if(status.type === 'local' & status.status === 'connected'){
                console.info(status.type + " WebSockets: " + status.status + " with LocalID: " + status.localID);
            } else if(status.type === 'remote' & status.status === 'connected'){
                if(peer.peerConnection != null){ peer.closeConnection(); }
                console.info(status.type + " WebSockets: " + status.status + " with remoteID: " + status.remoteID);
            }

        }
    });

    peer.on('error', function(report){
      console.warn(report.type + " / " + report.error);
    });

// ----------------------------------------------------------------- //

});
