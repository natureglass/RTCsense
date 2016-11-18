var peers;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

var connectToAll = document.querySelector('button#connectToAll');
var disconnectAll = document.querySelector('button#disconnectAll');
var showUsers = document.querySelector('button#showUsers');
var sendButton = document.querySelector('button#sendButton');

// -------------------------------------- UI ACTIONS --------------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        sendButton.disabled = false;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = true;
        dataChannelSend.focus();
        sendButton.disabled = true;
    },

    disconnectPeer: function(remoteID){
        peers.disconnect(remoteID, function(id){
            console.info("Peer " + id + " disconnected!");
        });
    },

    // --- On WebRTC Message --- //
    onMessage: function(data){
        dataChannelReceive.value = data.msg;
        console.info('MSG from RemoteID: ' + data.remoteID);
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

//     //var options = { video: false, audio: false, datachannel: true }
//     //peers.connect(options);

// --- Get WS Users --- //
connectToAll.onclick = function(){
    for (i = 0; i < $this.users.length; i++) {
        peers.connect(peers.users[i].remoteID);
    }

    window.UI.openConnection();
}


disconnectAll.onclick = function(){

    peers.disconnect(function(id){
        console.info("Peer " + id + " disconnected!");
    });

}

// --- Show Users Array --- //
showUsers.onclick = function(){
    console.info(peers.users);
    console.info(peers.peerConnections);
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

    // Incoming Messages
    peers.on('message', function(msg){
        window.UI.onMessage(msg);
    });

    // Incoming Connections
    peers.on('connection', function(conn){

        if(conn.type === 'peer'){
            if(conn.state === 'stable'){
                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML += " Peer"; }
                window.UI.openConnection();
            } else if(conn.state === 'closed'){
                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML = conn.remoteID; }
                window.UI.closeConnection();
            }
        }

        if(conn.type === 'datachannel'){
            if(conn.state === 'open'){
                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML += " -> " + conn.order; }
            }
        }

        console.info(conn.type + ' state is: ' + conn.state + " / Order: " + conn.order);

    });

// ------------------------------------- COMMON CALLS -------------------------------------  //

    peers.on('status', function(status){

        console.warn(status.type + ' state is: ' + status.state + " / Order: " + status.order);

    });

    peers.on('system', function(system){

        if(system.type === 'local' & system.status === 'connected'){

            document.getElementById("myClientID").innerHTML = system.localID;
            connectToAll.disabled = false;
            console.info("LOCAL user / LocalID: " + system.localID + " / " + system.status);

        } else if(system.type === 'remote'){

            if(system.status === "connected") {

                document.getElementById("connectedUsersLog").innerHTML += "<li class='connectToUser' userID='" + system.remoteID + "' id='user_" + system.remoteID + "'> " + system.remoteID + "</li><a href='javascript:void(0)' onclick='window.UI.disconnectPeer(" + system.remoteID + "); return false;'>X</a>";

                // This is a nice trick for Dynamic Element Binding!
                var links = document.querySelector('#connectedUsersLog').getElementsByTagName('li');
      			for (var i = 0; i < links.length; i++) {
      				var link = links[i]; link.onclick = onUserClick;
      			}

            } else if(system.status === "disconnected") {
                var userElem = document.getElementById("user_" + system.remoteID);
                if(userElem){
                    var nextElem = userElem.nextSibling;
                    nextElem.remove(); userElem.remove();
                }
            }

            console.info("REMOTE user / RemoteID: " + system.remoteID + " / " + system.status);

        }

    });

    peers.on('error', function(report){
        if(report.type === 'local'){
            console.error("LOCAL Error / LocalID: " + report.localID + " / " + report.error);
        } else {
            console.error("REMOTE Error / RemoteID: " + report.remoteID + " / " + report.error);
        }
    });

// ----------------------------------------------------------------------------------------- //
  function onUserClick(){

      var userID = parseInt(this.getAttribute('userID'));

      console.info("Connecting to: " + userID);

      var options = {
          datachannel: { send: true, receive : true },
          video: { send: false, receive : false },
          audio: { send: false, receive : false },
      }

      if(window.clientID == userID){ alert("Conflict on Create! 2"); }

      peers.connect(userID, options);
  }

});
