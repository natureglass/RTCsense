<cfparam name="url.s" default="0">
<cfparam name="url.prev" default="false">

<cfscript>
	foo.sceneID = url.s;
	foo.prev = url.prev;
	foo.isPrev = 0;
</cfscript>

<cfif foo.prev EQ true>
	<cfset foo.isPrev = 1>
</cfif>

<!--- ------------ GETTING SCENE CODE ------------ --->

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
		AND [preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="#foo.isPrev#">
</cfquery>


<!--- ------------ GETTING RESOURCES ------------ --->


<cfquery name="qrySceneResources" datasource="#application.datasource.rtcsense#">
	SELECT [name], [uri]
	FROM [scene_resources]
	WHERE [id] IN (<cfqueryparam cfsqltype="cf_sql_integer" list="true" value="#qryScene.resources#">)
</cfquery>