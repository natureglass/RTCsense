<script src="sensePlayer/js/cfwebsockets.js"></script>
<script src="libs/webrtc/js/adapter.js"></script>
 <script src="assets/js/common.js"></script>
<script src="sensePlayer/js/cfwebrtcMulti.js"></script>

<cfwebsocket 	name		= "ws"
				onMessage	= "AdvancedSocket.onMessage"
				onOpen		= "AdvancedSocket.onOpen"
				onClose		= "AdvancedSocket.onClose"
				onError		= "AdvancedSocket.onError">
