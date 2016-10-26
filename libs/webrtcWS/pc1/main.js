var peer;

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var startVideoButton = document.querySelector('button#startVideoButton');
var connectButton = document.querySelector('button#connectButton');
var closeButton = document.querySelector('button#closeButton');

// -------------------------------------- UI ACTIONS --------------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        connectButton.disabled = true;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        closeButton.disabled = true;
        connectButton.disabled = false;
        peer.closeConnection();
    },

    // --- On Local Stream --- //
    onLocalStream: function(event){
        connectButton.disabled = false;
        localVideo.src = window.URL.createObjectURL(event.stream);
        console.info('LocaID: ' + event.localID);
    },

    // --- On Remote Stream --- //
    onRemoteStream: function(event){
        closeButton.disabled = false;
        connectButton.disabled = true;
        remoteVideo.src = window.URL.createObjectURL(event.stream);
        console.info('remoteID: ' + event.remoteID);
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

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

// --------------------------------------- WEBRTC ------------------------------------ //

document.addEventListener('DOMContentLoaded', function(){

    var options = {
         video: true,
         audio: true,
         datachannel: false
    }

    peer = new PeersRTC(options);

// -------------------------------------- STREAMS ------------------------------------ //

    peer.on('stream', function(data){
        if(data.event === "local"){ // Local Video Received
            if(localVideo){
                window.UI.onLocalStream(data);
            }
        } else { // Remote Video Received
            if(remoteVideo){
                window.UI.onRemoteStream(data);
            }
        }
    });

// ------------------------------------- COMMON CALLS -------------------------------------  //

    peer.on('status', function(status){
        if(status.type === 'stream'){
            console.info('Remote Stream status: ' + status.state);
            if (status.state === 'close') {
                window.UI.closeConnection();
            }
        }
    });

    peer.on('system', function(system){
        if(system.type === 'local' & system.status === 'connected'){
            console.info("LOCAL user / LocalID: " + system.localID + " / " + system.status);
        } else if(system.type === 'remote'){
            if(peer.peerConnection != null){ window.UI.closeConnection(); }
            console.info("REMOTE user / RemoteID: " + system.remoteID + " / " + system.status);
        }
    });

    peer.on('error', function(report){
        if(report.type === 'local'){
            console.warn("LOCAL Error / LocalID: " + report.localID + " / " + report.error);
        } else {
            console.warn("REMOTE Error / RemoteID: " + report.remoteID + " / " + report.error);
        }
    });

// ----------------------------------------------------------------------------------------- //

});
