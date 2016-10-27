var peer;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

// -------------------------------------- UI ACTIONS --------------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        startButton.disabled = true;
        sendButton.disabled = false;
        closeButton.disabled = false;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        dataChannelSend.value = '';
        dataChannelReceive.value = '';
        dataChannelSend.disabled = true;
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
        peer.closeConnection();
    },

    // --- On WebRTC Message --- //
    onMessage: function(data){
        dataChannelReceive.value = data.msg;
        console.info('MSG from RemoteID: ' + data.remoteID);
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

// --- Open Connection --- //
startButton.onclick = function(){

    var options = { video: false, audio: false, datachannel: true }
    peer.connect(options);

    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    //peer.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    var msg = dataChannelSend.value;
    var sendData = msg.replace(/"/g, "'")
    peer.sendData(sendData);
}

// --------------------------------------- WEBRTC ------------------------------------ //

document.addEventListener('DOMContentLoaded', function(){

    peer = new PeersRTC();

// ------------------------------------ DATA CHANNELS -------------------------------------- //

    peer.on('message', function(msg){
        window.UI.onMessage(msg);
    });

// ------------------------------------- COMMON CALLS -------------------------------------  //

    peer.on('status', function(status){
        if(status.type === 'datachannel'){
            if (status.state === 'open') {
                window.UI.openConnection();
            } else if (status.state === 'closed') {
                window.UI.closeConnection();
            }
        }
        console.info('Channel state is: ' + status.state + " / Order: " + status.order);
    });

    peer.on('system', function(system){
        if(system.type === 'local' & system.status === 'connected'){
            startButton.disabled = false;
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
