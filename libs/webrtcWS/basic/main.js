var peers;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

var usersButton = document.querySelector('button#usersButton');
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
        peers.closeConnection();
    },

    // --- On WebRTC Message --- //
    onMessage: function(data){
        dataChannelReceive.value = data.msg;
        console.info('MSG from RemoteID: ' + data.remoteID);
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

// --- Get WS Users --- //
usersButton.onclick = function(){
    for (i = 0; i < $this.users.length; i++) {
        peers.connect(peers.users[i].remoteID);
        //peers.connect(peers.users[0].remoteID);
    }

    window.UI.openConnection();
}

// --- Open Connection --- //
startButton.onclick = function(){


    //var options = { video: false, audio: false, datachannel: true }
    //peers.connect(options);
    peers.connect(0);

    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    //peers.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    var msg = dataChannelSend.value;
    var sendData = msg.replace(/"/g, "'")
    peers.sendData(sendData);
}

// --------------------------------------- WEBRTC ------------------------------------ //

document.addEventListener('DOMContentLoaded', function(){

    peers = new PeersRTC();

// ------------------------------------ DATA CHANNELS -------------------------------------- //

    peers.on('message', function(msg){
        window.UI.onMessage(msg);
    });

// ------------------------------------- COMMON CALLS -------------------------------------  //

    peers.on('status', function(status){
        if(status.type === 'datachannel'){
            if (status.state === 'open') {
                window.UI.openConnection();
            } else if (status.state === 'closed') {
                window.UI.closeConnection();
            }
        }
        console.info('Channel state is: ' + status.state + " / Order: " + status.order);
    });

    peers.on('system', function(system){
        if(system.type === 'local' & system.status === 'connected'){
            startButton.disabled = false;
            console.info("LOCAL user / LocalID: " + system.localID + " / " + system.status);
        } else if(system.type === 'remote'){
            if(peers.peerConnection != null){ window.UI.closeConnection(); }
            console.info("REMOTE user / RemoteID: " + system.remoteID + " / " + system.status);
        }
    });

    peers.on('error', function(report){
        if(report.type === 'local'){
            console.warn("LOCAL Error / LocalID: " + report.localID + " / " + report.error);
        } else {
            console.warn("REMOTE Error / RemoteID: " + report.remoteID + " / " + report.error);
        }
    });

// ----------------------------------------------------------------------------------------- //

});
