<cfswitch expression = "#fusebox.fuseaction#">

    <cfcase value="basic">
        <cfinclude template="libs/webRTC_basic/index.cfm">
        <cfinclude template="sensePlayer/inc_websockets.cfm">
    </cfcase>

    <cfcase value="webrtc">
        <cfinclude template="libs/webRTCws/index.cfm">
        <cfinclude template="sensePlayer/inc_websockets.cfm">
    </cfcase>

	<!--- --------------------------------------------- --->
	<!--- -------------- RTCsense Studio -------------- --->

  	<cfcase value="studio">
		<cfinclude template="senseStudio/display/dsp_document_head.cfm">
		<cfinclude template="senseStudio/qry_scene_layout.cfm">
		<cfinclude template="senseStudio/dsp_scene_layout.cfm">
        <cfinclude template="senseStudio/display/inc_footer.cfm">
		<cfinclude template="senseStudio/display/dsp_document_foot.cfm">
	</cfcase>

  	<cfcase value="saveScene">
		<cfinclude template="senseStudio/act_scene_save.cfm">
	</cfcase>

  	<cfcase value="loadScene">
		<cfinclude template="senseStudio/qry_scene_load.cfm">
	</cfcase>

    <cfcase value="loadSelectedScene">
		<cfinclude template="senseStudio/act_scene_load.cfm">
	</cfcase>

    <cfcase value="loadSceneResources">
        <cfinclude template="senseStudio/act_resources_load.cfm">
    </cfcase>

	<!--- -------------- RTCsense Player -------------- --->
	<!--- --------------------------------------------- --->

  	<cfcase value="iframe">
		<cfinclude template="dsp_iframe.cfm">
	</cfcase>

  	<cfcase value="play">
        <cfinclude template="display/init_session.cfm">
		<cfinclude template="sensePlayer/qry_scene_container.cfm">
		<cfinclude template="sensePlayer/dsp_scene_container.cfm">
        <cfinclude template="sensePlayer/inc_websockets.cfm">
	</cfcase>

	<cfcase value="detectrtc">
		<cfinclude template="dsp_detectRTC.cfm">
	</cfcase>

  	<cfcase value="stick">
		<cfinclude template="dsp_stick.cfm">
	</cfcase>

  	<cfcase value="iphone">
		<cfinclude template="dsp_iphone_video.cfm">
	</cfcase>

  	<cfcase value="motion">
		<cfinclude template="dsp_motion.cfm">
	</cfcase>

  	<cfcase value="detect">
		<cfinclude template="dsp_detect.cfm">
	</cfcase>

  	<cfcase value="screen">
		<cfinclude template="dsp_screen.cfm">
	</cfcase>

  	<cfcase value="test">
		<cfinclude template="dsp_test.cfm">
	</cfcase>

  	<cfcase value="share">
		<cfinclude template="dsp_share.cfm">
	</cfcase>

  	<cfcase value="fx">
		<cfinclude template="dsp_rtcsense_fx.cfm">
	</cfcase>

	<!--- -------- websockets --------------- --->

  <cfcase value="chat-ping">
		<cfinclude template="server/chat-ping.cfm">
	</cfcase>

  <cfcase value="getUsers">
		<cfinclude template="server/act_getusers.cfm" />
	</cfcase>

    <!--- ----------------------------- --->

  	<cfcase value="home">
		<cfinclude template="dsp_layout_home.cfm">
	</cfcase>

	<cfdefaultcase>
		<cflocation url="?fa=home" addtoken="no">
	</cfdefaultcase>

</cfswitch>
