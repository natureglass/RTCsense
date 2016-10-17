<cfoutput>

<script type="text/javascript">
	globalUserID = "#session.userID#";
	globalUserName = "#session.username#";
	globalName = "#session.name#";
</script>

</cfoutput>

<cfwebsocket 	name		= "ws"
				onMessage	= "AdvancedSocket.onMessage"
				onOpen		= "AdvancedSocket.onOpen"
				onClose		= "AdvancedSocket.onClose"
				onError		= "AdvancedSocket.onError">
