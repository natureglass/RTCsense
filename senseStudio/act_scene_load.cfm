<cfparam name="form.sceneID" default="0">
<cfparam name="form.isPreview" default="0">

<cfquery name="qryScene" datasource="#application.datasource.rtcsense#">
	SELECT TOP 1
		 [id]
		,[sceneID]
		,[name]
		,[created]
		,[updated]
		,[resources]
		,[code]
		,[referenceID]
	FROM
		[scene_code]
	WHERE
		[sceneID] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneID#">
		<cfif form.sceneID NEQ 0>
			AND [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
		</cfif>
	AND
		[preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="#form.isPreview#">
</cfquery>

<cfoutput>#qryScene.code#</cfoutput>
