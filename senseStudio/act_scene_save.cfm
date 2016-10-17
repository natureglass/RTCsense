<cfparam name="form.sceneName" default="Preview">
<cfparam name="form.sceneCode" default="">
<cfparam name="form.sceneResources" default="">
<cfparam name="form.userSceneID" default="0">
<cfparam name="form.sceneID" default="0">
<cfparam name="form.preview" default="false">
<cfparam name="form.reload" default="false">

<cfset resourcesListID = "">
<cfset saveType = "">
<cfset sceneCodeID = form.sceneID>

<!--- ------------ PARSING RESOURCES ------------ --->
<cfloop index="resource" list="#FORM['sceneResources[]']#">

	<cfquery datasource="#Application.datasource.rtcsense#" name="sceneResources">
		SELECT
			 [id] as resourceID
			,[uri]
		FROM [scene_resources]
		WHERE [uri] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#resource#">
	</cfquery>

	<cfif sceneResources.recordCount EQ 0>

		<cfquery datasource="#Application.datasource.rtcsense#" name="sceneResources">
			INSERT INTO [scene_resources]
			(
				 [uri]
				,[name]
			) VALUES (
				 <cfqueryparam cfsqltype="cf_sql_varchar" value="#resource#" maxlength="150">
				,<cfqueryparam cfsqltype="cf_sql_varchar" value="#ListLast(resource,"/")#" maxlength="50">
			)
			SELECT @@IDENTITY AS resourceID
		</cfquery>

	</cfif>

	<cfset resourcesListID = ListAppend(resourcesListID, sceneResources.resourceID)>

</cfloop>

<!--- ------------ GENERATING RANDOM SCENEID ------------ --->
<cfset charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-">
<cfset pwdSize = 8>
<cfset sceneID = "">
<cfloop index="char" from="1" to="#pwdSize#">
	<cfset randNum = RandRange(1, Len(charSet)-1, "SHA1PRNG")>
	<cfset sceneID = sceneID & Mid(charSet, randNum, 1)>
</cfloop>

<cfif form.preview EQ "false">
	<cfif sceneCodeID EQ 0>

		<!--- ------------ INSERTING NEW SCENE ------------ --->
		<cfquery name="sceneCode" datasource="#application.datasource.rtcsense#" result="codeInsert">
		    INSERT INTO [scene_code] (
					 [sceneID]
					,[name]
					,[code]
					,[created]
					,[resources]
					,[userID]
				) VALUES (
					 <cfqueryparam cfsqltype="cf_sql_varchar" value="#sceneID#">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneName#" maxlength="50">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneCode#">
					,<cfqueryparam cfsqltype="cf_sql_date" value="#now()#">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#resourcesListID#">
					,<cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
				) SELECT @@IDENTITY AS id
		</cfquery>

		<cfset saveType = "NEW">
		<cfset sceneCodeID = sceneID>

	<cfelse>

		<!--- ------------ UPDATING EXISTING SCENE ------------ --->
		<cfquery name="sceneCode" datasource="#application.datasource.rtcsense#">
			UPDATE
				[scene_code]
	        SET
				 [name] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneName#" maxlength="50">
				,[code]	= <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneCode#">
				,[updated] = <cfqueryparam cfsqltype="cf_sql_date" value="#now()#">
				,[resources] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#resourcesListID#">
			WHERE [sceneID] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#sceneCodeID#">
			AND [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
			AND [preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="0">
		</cfquery>

		<cfset saveType = "UPDATED">

	</cfif>

</cfif>

<cfif form.preview EQ "true">

	<!--- ------------ CHECKING FOR PREVIEW DB ENTRY ------------ --->
	<cfquery datasource="#Application.datasource.rtcsense#" name="scenePreview">
		SELECT TOP 1 [sceneID] FROM [scene_code]
		WHERE [userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
		AND [preview] = <cfqueryparam cfsqltype="cf_sql_varchar" value="1">
	</cfquery>

	<cfif scenePreview.recordCount EQ 0>

		<!--- ------------ INSERINTG PREVIEW SCENE ------------ --->
		<cfquery name="sceneCode" datasource="#application.datasource.rtcsense#" result="codeInsert">
		    INSERT INTO [scene_code] (
					 [sceneID]
					,[name]
					,[code]
					,[created]
					,[resources]
					,[userID]
					,[preview]
				) VALUES (
					 <cfqueryparam cfsqltype="cf_sql_varchar" value="#sceneCodeID#">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneName#" maxlength="50">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneCode#">
					,<cfqueryparam cfsqltype="cf_sql_date" value="#now()#">
					,<cfqueryparam cfsqltype="cf_sql_varchar" value="#resourcesListID#">
					,<cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
					,<cfqueryparam cfsqltype="cf_sql_integer" value="1">
				) SELECT @@IDENTITY AS id
		</cfquery>

	<cfelse>

		<!--- ------------ UPDATING PREVIEW SCENE ------------ --->
		<cfquery name="sceneCode" datasource="#application.datasource.rtcsense#">
			UPDATE [scene_code]
			SET
				 [sceneID] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#sceneCodeID#">
				,[name] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneName#" maxlength="50">
				,[code]	= <cfqueryparam cfsqltype="cf_sql_varchar" value="#form.sceneCode#">
				,[updated] = <cfqueryparam cfsqltype="cf_sql_date" value="#now()#">
				,[resources] = <cfqueryparam cfsqltype="cf_sql_varchar" value="#resourcesListID#">
			WHERE
				[userID] = <cfqueryparam cfsqltype="cf_sql_integer" value="#session.userID#">
			AND
				[preview] = <cfqueryparam cfsqltype="cf_sql_integer" value="1">
		</cfquery>

	</cfif>

</cfif>

<!--- ------------ RETURN STATUS ------------ --->
<cfoutput>{"status":"ok", "type": "#saveType#","id": #form.userSceneID#, "sceneID": "#sceneCodeID#", "name": "#form.sceneName#", "preview" : "#form.preview#", "reload" : "#form.reload#" }</cfoutput>
