<cfparam name="form.sceneID" default="0">

<cfquery name="qryScene" datasource="#application.datasource.rtcsense#">
	SELECT TOP 1 [resources]
	FROM [scene_code]
	WHERE [sceneID] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneID#">
	AND [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
	AND [preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="0">
</cfquery>

<cfquery name="qrySceneResources" datasource="#application.datasource.rtcsense#">
	SELECT [name], [uri]
	FROM [scene_resources]
	WHERE [id] IN (<cfqueryparam cfsqltype="cf_sql_integer" list="true" value="#qryScene.resources#">)
</cfquery>

[<cfoutput query="qrySceneResources">
    {
        "name"  : "#qrySceneResources.name#",
        "uri"   : "#qrySceneResources.uri#"
    },
	<!--- <cfif qrySceneResources.recordCount NEQ qrySceneResources.currentRow>,</cfif> --->
</cfoutput>{"name"  : "","uri"   : ""}]
