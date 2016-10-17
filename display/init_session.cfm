<cfparam name="url.s" default="0">
<cfparam name="session.userID" default="1">

<cfquery datasource="#application.datasource.rtcsense#" name="RTCprofile">
	SELECT TOP 1
		[userID],
		[username],
		[status],
		[email],
		[colors],
		[theme],
		[header_pattern],
		[shadows],
		[about],
		[language],
		[twitter],
		[googleplus],
		[pinterest],
		[facebook],
		[linkedin],
		[paypal],
		[phone],
		[position],
		[company],
		[name],
		[header_style],
		[friendCount],
		[followingCount],
		[streamsCount],
		[projectsCount],
		[teamsCount],
		[ideasCount],
		[avatar]
	FROM [profile_view]
	WHERE [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
</cfquery>

<cfquery datasource="#application.datasource.rtcsense#" name="user_stars">
	SELECT
		[userID]
	FROM [user_stars]
	WHERE [ideaUserID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
		OR [projectUserID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
		OR [teamUserID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
		OR [commentUserID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
</cfquery>

<cfset session.sceneID = url.s>
<cfset session.colors = RTCprofile.colors>
<cfset session.theme = RTCprofile.theme>
<cfset session.avatar = RTCprofile.avatar>
<cfset session.header_style = RTCprofile.header_style>
<cfset session.header_pattern = RTCprofile.header_pattern>
<cfset session.shadows = RTCprofile.shadows>
<cfset session.name = RTCprofile.name>
<cfset session.company = RTCprofile.company>
<cfset session.position = RTCprofile.position>
<cfset session.email = RTCprofile.email>
<cfset session.phone = RTCprofile.phone>
<cfset session.paypal = RTCprofile.paypal>
<cfset session.linkedin = RTCprofile.linkedin>
<cfset session.facebook = RTCprofile.facebook>
<cfset session.pinterest = RTCprofile.pinterest>
<cfset session.googleplus = RTCprofile.googleplus>
<cfset session.twitter = RTCprofile.twitter>
<cfset session.language = RTCprofile.language>
<cfset session.about = RTCprofile.about>
<cfset session.username = RTCprofile.username>
<cfset session.status = RTCprofile.status>
<cfset session.userID = RTCprofile.userID>
<cfset session.friendCount = RTCprofile.friendCount>
<cfset session.streamsCount = RTCprofile.streamsCount>
<cfset session.projectsCount = RTCprofile.projectsCount>
<cfset session.teamsCount = RTCprofile.teamsCount>
<cfset session.ideasCount = RTCprofile.ideasCount>
<cfset session.followingCount = RTCprofile.followingCount>
<cfset session.stars = user_stars.recordCount>
