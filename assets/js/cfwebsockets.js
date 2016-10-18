var AdvancedSocket = {
    autoConnect     : true,
    name            : 'ws',
    channels        : ["chat"],
    clientID        : 0,
    clientInfo      : {},
    doMessage       : 'receiveMessage',
    timer           : 0,
    pingURL         : '?fa=chat-ping',
    onlineCount     : 30 * 1000,
    offlineCount    : 5 * 1000,
    reconnectCount  : .5 * 1000,
    timerCount      : 0,
    debug           : false,
    status          : '',
    statusLabel     : document.getElementById('status-message'),

    init : function(){
        AdvancedSocket.log('init');
        // Setup Listeners
        window.addEventListener('connectionerror', function(e) {
            AdvancedSocket.log('Event','connectionerror',e);
            AdvancedSocket.disconnected();
        });

        window.addEventListener('goodconnection', function(e) {
            AdvancedSocket.log('Event','goodconnection',e);
            AdvancedSocket.connected();
        });

        window.addEventListener('requireconnection', function(e) {
            AdvancedSocket.log('Event','requireconnection',e);
        });

        window.addEventListener('offline', function(e) {
            AdvancedSocket.disconnected();
            // if we go fully offline kill any pending timer
            AdvancedSocket.log('Event','offline',e);
        }, false);

        window.addEventListener('online', function(e) {
			AdvancedSocket.log('Event','online',e);
			// restart connection check
			AdvancedSocket.checkConnection();
        }, false);

		// set default count
		AdvancedSocket.timerCount = AdvancedSocket.onlineCount;

		AdvancedSocket.ping(AdvancedSocket.pingURL);

		AdvancedSocket.checkConnection();
    },

    checkConnection : function(){
        clearTimeout(AdvancedSocket.timer);
        if (navigator.onLine && AdvancedSocket.pingURL !== '' && AdvancedSocket.autoConnect){
            AdvancedSocket.log('checkConnection');
            AdvancedSocket.timer = setTimeout(function() { AdvancedSocket.ping(AdvancedSocket.pingURL); } , AdvancedSocket.timerCount);
        }
    },

    fireEvent  : function(name, data) {
        var e = document.createEvent("Event");
        e.initEvent(name, true, true);
        e.data = data;
        window.dispatchEvent(e);
    },

    ping : function (url){
        AdvancedSocket.log('ping');

        var xhr             = new XMLHttpRequest(),
            noResponseTimer = setTimeout(function(){
                xhr.abort();
                // fire event
                AdvancedSocket.fireEvent("connectiontimeout", {});
            }, 5000);

        xhr.onreadystatechange = function(){

            if (xhr.readyState != 4){
                return;
            }

            if (xhr.status == 200){
                if (JSON.parse(xhr.response).success === true){
                    // fire event
                    AdvancedSocket.fireEvent("goodconnection", {});
                } else {
                    // fire event
                    AdvancedSocket.fireEvent("requireconnection", {});
                    // force reconnect if our connection is not even open

                    if(window[AdvancedSocket.name] != null){
                    //if (!window[AdvancedSocket.name].isConnected())
                        AdvancedSocket.forceReconnect();
                    }
                }
                clearTimeout(noResponseTimer);
            }
            else
            {
                // fire event
                AdvancedSocket.fireEvent("connectionerror", {});
            }

            AdvancedSocket.checkConnection();
        };
        // when we do our ping we pass in our client ID
        xhr.open("GET",url + '&id=' + AdvancedSocket.clientID  + '&ts=' + new Date().getTime());
        xhr.send();
    },

    onMessage : function(obj){

        AdvancedSocket.log('onMessage',obj.type,obj.reqType,obj);

        // let store our clientID
        if (obj.reqType === 'welcome'){
        	globalWsID = obj.clientid;
            AdvancedSocket.clientID = obj.clientid;
            AdvancedSocket.connecting();
        }

        if (obj.reqType === 'authenticate'){
            if(obj.code == -1) {
                AdvancedSocket.log("Authentication failed");
            } else if(obj.code == 0) {
                AdvancedSocket.connectWS();
                // set our autoconnect to true after running initial connect
                AdvancedSocket.autoConnect = true;
                AdvancedSocket.checkConnection();
            }
            AdvancedSocket.connected();
        }

        if (obj.reqType === 'subscribe'){
            AdvancedSocket.connected();
        }

        if (obj.type === 'data'){
            // force reconnect
            if (obj.data === 'FORCE-RECONNECT'){
                window.setTimeout(AdvancedSocket.forceReconnect, AdvancedSocket.reconnectCount);
            }

            // if we defined a global doMessage function
            if (AdvancedSocket.doMessage && typeof window[AdvancedSocket.doMessage] === 'function'){
                window[AdvancedSocket.doMessage](obj);
            }
            // notify user to create required notification
            else {
                AdvancedSocket.log('Create a doMessage function and pass it in the data-do-message attribute of the body')
            }
        }
    },

    onOpen : function(obj){
        AdvancedSocket.log('onOpen',obj);
        // if we need to re-authenticate (fired on a force reconnect)
        if(window.AdvancedSocket.clientInfo.username && AdvancedSocket.autoConnect){
            AdvancedSocket.autoConnect = false;
            window[AdvancedSocket.name].authenticate(window.AdvancedSocket.clientInfo.username,'');
        }
    },

    onClose : function(obj){
        // when an error occurs from the websocket
        AdvancedSocket.log('onClose',obj);
    },

    onError : function(obj){
        // when an error occurs in the websocket
        AdvancedSocket.log('onError',obj);
    },

    connectWS : function(){
        AdvancedSocket.log('connectWS');
        AdvancedSocket.channels.forEach(function(value,index){
            AdvancedSocket.log('Connecting to ' + value + ' : ' + (index+1) + ' of ' + AdvancedSocket.channels.length);
            var params = {clientInfo:window.AdvancedSocket.clientInfo};
            // send username info if in clientInfo struct
            if (window.AdvancedSocket.clientInfo.username)
                params.username = window.AdvancedSocket.clientInfo.username;
            window[AdvancedSocket.name].subscribe(value,params)
        })
    },

    forceReconnect : function(){
        AdvancedSocket.log('forceReconnect');
        window[AdvancedSocket.name].closeConnection();
        window[AdvancedSocket.name].openConnection();
    },

    disconnected : function(){
        cfWSupdates('disconnected');

        AdvancedSocket.log('disconnected');
        // speed up timer to check
        AdvancedSocket.timerCount = AdvancedSocket.offlineCount;
        if (AdvancedSocket.statusLabel){
            //AdvancedSocket.statusLabel.className = 'uk-badge uk-badge-danger text-center';
            AdvancedSocket.statusLabel.innerHTML = 'we are disconnected ..';
        }

        AdvancedSocket.status = 'disconnected';
    },

    connecting : function(){
        cfWSupdates('connecting');

        AdvancedSocket.log('connecting');
        if (AdvancedSocket.statusLabel){

            //AdvancedSocket.statusLabel.className = 'uk-badge uk-badge-warning text-center';
            AdvancedSocket.statusLabel.innerHTML = 'we are connecting ..';
            // set the username into our Client Info
            // AdvancedSocket.clientInfo.username = globalUserName;
            AdvancedSocket.clientInfo.userID = globalUserID;
            AdvancedSocket.clientInfo.sceneID = window.sceneID;
            ws.authenticate(window.sceneID, globalUserID);
        }

        AdvancedSocket.status = 'connecting';
    },

    connected : function (){
      
        if(AdvancedSocket.status !== 'connected'){
          cfWSupdates('connected');
        }

        AdvancedSocket.log('connected');
        // return back to normal
        AdvancedSocket.timerCount = AdvancedSocket.onlineCount;
        if (AdvancedSocket.statusLabel){
            //AdvancedSocket.statusLabel.className = 'uk-badge uk-badge-success text-center';
            AdvancedSocket.statusLabel.innerHTML = 'we are connected ..';
        }

        AdvancedSocket.status = 'connected';
    },

    log : function(){
        if (AdvancedSocket.debug === true)
            console.log(Array.prototype.slice.call(arguments));
    }

};

// initialize
AdvancedSocket.init();
