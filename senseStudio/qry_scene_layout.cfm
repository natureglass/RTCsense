<cfparam name="url.s" default="0">

<cfscript>
	foo.sceneID = url.s;
</cfscript>

<cfquery name="qryUserScenes" datasource="#application.datasource.rtcsense#">
	SELECT [id],[sceneID],[name]
	FROM [scene_code]
	WHERE [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
	AND [preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="0">
</cfquery>

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
		[sceneID] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#foo.sceneID#">
	AND
		[userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
	AND
		[preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="0">
</cfquery>

<cfquery name="qrySceneResources" datasource="#application.datasource.rtcsense#">
	SELECT [name], [uri]
	FROM [scene_resources]
	WHERE [id] IN (<cfqueryparam cfsqltype="cf_sql_integer" list="true" value="#qryScene.resources#">)
</cfquery>

<cfset temp = QueryAddRow(qrySceneResources)>

<cfif qryScene.recordCount EQ 0>
	<cfquery name="qryScene" datasource="#application.datasource.rtcsense#">
		SELECT TOP 1
			[id], [sceneID],
			[name], [code],
			[created],[updated],
			[resources], [referenceID]
		FROM [scene_code] WHERE [id] = <cfqueryparam cfsqltype="cf_sql_varchar" value="0">
	</cfquery>
</cfif>

<cfscript>

	scene = {};

	if(qryScene.id NEQ 0){
		scene.name = qryScene.name;
	} else {
		scene.name = '';
	}

	scene.id   = qryScene.id;
	scene.sceneID   = qryScene.sceneID;
	scene.code = qryScene.code;

</cfscript>
