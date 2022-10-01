(function ()
{
	// script used for the modify position's template position.twig

	// GLOBAL VARIABLES

	// When document is ready	

	window.addEventListener("load", function(event)
	{
		wiki.geolocation.log ("POSITION.JS start. gFromAction = ", gFromAction);	
	
		// gFromAction is a variable defined in the position.twig template
		// and initialized by the geolocation action.
	
		var	gUserGeolocation = gFromAction.user_geolocation;		
		var	gCurrentGeolocation = gFromAction.current_geolocation;	
		var gGeolocationMode = gCurrentGeolocation.mode;
		var gGeolocationParameters = { user : [], browser : [], address : [ ], coordinates : [] };

		gGeolocationParameters [gCurrentGeolocation.mode] = gCurrentGeolocation.parameters;

		var gMapOptions = 
		{
			scrollWheelZoom : false,
			zoomControl : true,
			provider : gFromAction.provider,
			credentials : gFromAction.credentials
		};

		var gStreet = $("#geolocation_rue");
		var gPostalCode = $("#geolocation_code_postal");
		var gCity = $("#geolocation_ville");
		var gCounty = $("#geolocation_departement");
		var gState = $("#geolocation_region");
		var gCountry = $("#geolocation_pays");		
		var gLatitude = $("#geolocation_latitude");
		var gLongitude = $("#geolocation_longitude");
		var gMap = $("#geolocation_map");
		var gUser = $("#geolocation_user");
		var gBrowser = $("#geolocation_browser");
		var gAddress = $("#geolocation_address");		
		var gCoordinates = $("#geolocation_coordinates");
		var gGeoData = $("#geolocation_geodata");
		
		function setGeolocationMode (pMode)
		{
			$("#geolocation_mode").val (pMode);
			gGeolocationMode = pMode;
		}
			
		function setAddressMode ()
		{
			wiki.geolocation.log ("* setAddressMode");
			
			setGeolocationMode ("address");

			var vMapObject = gMap.ywGetMap ();

			var vGeoData = gGeoData.val ();

			gGeolocationParameters.address =
			{
				street : gStreet.val ().trim(),
				postalCode : gPostalCode.val ().trim(),
				city : gCity.val ().trim(),
				county : gCounty.val ().trim(),
				state : gState.val ().trim(),
				country : gCountry.val ().trim(),
				latitude : parseFloat (gLatitude.val ()) + "",
				longitude : parseFloat (gLongitude.val ()) + "",
				geodata : (vGeoData?JSON.parse (vGeoData):undefined),
				zoom : vMapObject.getZoom ()
			};			
		}

		function setCoordinatesMode ()
		{
			wiki.geolocation.log ("* setCoordinatesMode");
			
			setGeolocationMode ("coordinates");

			var vMapObject = gMap.ywGetMap ()

			gGeolocationParameters.coordinates = 
			{
				zoom : vMapObject.getZoom (),
				latitude : parseFloat (gLatitude.val ()) + "",
				longitude : parseFloat (gLongitude.val ()) + ""
			};					
		}

		function setUserMode ()
		{
			wiki.geolocation.log ("* setUserMode");
			
			setGeolocationMode ("user");

			var vMapObject = gMap.ywGetMap ()

			var vGeoData = gGeoData.val ();

			gGeolocationParameters.user = 
			{
				geodata : (vGeoData?JSON.parse (vGeoData):undefined),
				zoom : vMapObject.getZoom (),				
			}
		}
		
		function setBrowserMode ()
		{	
			wiki.geolocation.log ("* setBrowserMode");
			
			setGeolocationMode ("browser");

			var vMapObject = gMap.ywGetMap ()

			gGeolocationParameters.browser = 
			{
				zoom : vMapObject.getZoom ()
			}
		}

		// Handle navigation

		$(".geolocation-nav").click (function ()
		{
			$(".geolocation-nav").removeClass ("geolocation-nav-selected");
			$(this).addClass ("geolocation-nav-selected");
			$(".geolocation_parameters").hide ();
			$("#" + $(this).attr ("data-target")).show ();
			
			return true;
		});

		// Handle user geolocation

		$(".geolocation-nav[data-target=geolocation_user]").click (function ()
		{					
			gLatitude.val (gUserGeolocation.latitude);
			gLongitude.val (gUserGeolocation.longitude);
			gGeoData.val (gUserGeolocation.geodata?JSON.stringify (gUserGeolocation.geodata):"")
		
			var vRenderWhat;
		
			if (gUserGeolocation.geodata)	
			{
				vRenderWhat = gUserGeolocation.geodata;
			}
			else
			if (gUserGeolocation.latitude && gUserGeolocation.longitude)
			{
				vRenderWhat = [ { lat : gUserGeolocation.latitude, lng : gUserGeolocation.longitude } ];
			}
			
			if (vRenderWhat)		
				wiki.geolocation.render
				(				
					vRenderWhat, 
					{
						mapID : "geolocation_map",
						mapOptions : 	
						{
							zoom : (parseFloat (gGeolocationParameters.user.zoom) || wiki.geolocation.getZoomForAddress (gUserGeolocation))
						}
					}
				);
		});

		// - Initialize user panel
	
		$("#geolocation_user")
		.html ("<div>" + 
					"<span><b>" + _t("GEOLOCATION_PROFILE_POSITION") +"</b></span><br>" +			
					(gUserGeolocation.street && gUserGeolocation.street.trim() !== ""?"<span>" + gUserGeolocation.street + "</span><br>":"") +
					(gUserGeolocation.postalCode && gUserGeolocation.postalCode.trim() !== ""?"<span>" + gUserGeolocation.postalCode + "</span> ":"") +
					(gUserGeolocation.city && gUserGeolocation.city.trim() !== ""?"<span>" + gUserGeolocation.city + "</span><br>":"") +
					(gUserGeolocation.county && gUserGeolocation.county.trim() !== ""?"<span>" + gUserGeolocation.county + "</span><br>":"") +					
					(gUserGeolocation.state && gUserGeolocation.state.trim() !== ""?"<span>" + gUserGeolocation.state + "</span><br>":"") +
					(gUserGeolocation.country && gUserGeolocation.country.trim() !== ""?"<span>" + gUserGeolocation.country + "</span><br>":"") +
					"<span>" + _t("GEOLOCATION_LATITUDE") + " = " + gUserGeolocation.latitude + "</span><br>" +
					"<span>" + _t("GEOLOCATION_LONGITUDE") + " = " + gUserGeolocation.longitude + "</span>" +
				"<div>");

		// Handle browser geolocation

		$(".geolocation-nav[data-target=geolocation_browser]").click (function ()
		{			
			gBrowser.html ("<b>" + _t("GEOLOCATION_PLEASE_WAIT") + "</b><br>" + _t("GEOLOCATION_LESS_THAN_1MN"));

			wiki.geolocation.browserGeolocation (
			{	
				enableHighAccuracy: true,
				timeout: 60000,
				maximumAge: 0,
				success : function (pPosition)
				{		
					var vLatitude = pPosition.coords.latitude;
					var vLongitude = pPosition.coords.longitude;
				
					gBrowser.html ("<b>" + _t("GEOLOCATION_DETECTED_COORDINATES") + "</b><br>" + _t("GEOLOCATION_LATITUDE") + " = " + vLatitude + "<br>" + _t("GEOLOCATION_LONGITUDE") + " = " + vLongitude);
				
					gLatitude.val (vLatitude);
					gLongitude.val (vLongitude);
				
					var vRenderOptions = 
					{
						mapID : "geolocation_map",
						mapOptions : $.extend (gMapOptions, { zoom : parseFloat(gGeolocationParameters.browser.zoom) }),
					}
						
					wiki.geolocation.render ([ { lat : vLatitude, lng : vLongitude } ], vRenderOptions);
					
					setBrowserMode ();
				},
				error : function (pError)
				{
					gBrowser.html ("<i>" + _t("GEOLOCATION_BROWSER_UNABLE_TO_DETECT") + "</i>");
				}
			})
		});	
		
		// Handle address geolocation
		
		$(".geolocation-nav[data-target=geolocation_address]").click (function ()
		{									
			var vLat = parseFloat (gGeolocationParameters.address.latitude);
			var vLng = parseFloat (gGeolocationParameters.address.longitude);
			var vGeoData = gGeolocationParameters.address.geodata;
			
			gStreet.val (gGeolocationParameters.address.street);
			gPostalCode.val (gGeolocationParameters.address.postalCode);
			gCity.val (gGeolocationParameters.address.city);
			gCounty.val (gGeolocationParameters.address.county);
			gState.val (gGeolocationParameters.address.state);
			gCountry.val (gGeolocationParameters.address.country);		
	
			var vRenderWhat;
		
			if (vGeoData)	
			{
				vRenderWhat = vGeoData;
			}
			else
			if (vLat && vLng)
			{
				vRenderWhat = [ { lat : vLat, lng : vLng } ];
			}
			
			if (vRenderWhat)
				wiki.geolocation.render
				(				
					vRenderWhat,
					{					
						mapID : "geolocation_map",
						mapOptions : $.extend (gMapOptions, 	
						{
							zoom : parseFloat(gGeolocationParameters.address.zoom) || wiki.geolocation.getZoomForAddress (gUserGeolocation)	
						})
					}
				);			
		});
		
		// Initialize address panel
	
		var vInputs =
		{
			street : gStreet,
			postalCode : gPostalCode,
			city : gCity,
			county : gCounty,
			state : gState,
			country : gCountry,
			latitude : gLatitude,
			longitude : gLongitude,
			geolocate : $("#geolocation_geolocate_address"),
			geodata : gGeoData
		}; 
	
		wiki.geolocation.form (
		vInputs,
		{			
			search : 
			{ 
				found : setAddressMode
			},
			render : 
			{ 
				mapID : "geolocation_map",
				mapOptions : $.extend (gMapOptions, { zoom : wiki.geolocation.getZoomForAddress (vInputs)})
			}
		});	
					
		// Handle coordinates geolocation

		$(".geolocation-nav[data-target=geolocation_coordinates]").click (function ()
		{								
			$("#geolocation_geolocate_coordinates").click ();
		});	

		$("#geolocation_geolocate_coordinates").click (function ()		
		{		
			wiki.geolocation.render 
			(
				[{ 
					lat : $("#geolocation_latitude").val (), 
					lng : $("#geolocation_longitude").val () 
			 	}],
			 	{	
			 		onRender : setCoordinatesMode,
				 	mapID : "geolocation_map", 
					mapOptions : $.extend (gMapOptions, 
					{ 						
						zoom : gGeolocationParameters["coordinates"].zoom
					})
				}
			);
		});

		// Handle form submit
		
		$("#geolocation_validate")
		.click (function ()
		{
			switch (gGeolocationMode)
			{
				case "user" :
					setUserMode ();
				break;
				case "browser" :
					setBrowserMode ();
				break;
				case "address" :
					setAddressMode ();
				break;
				case "coordinates" :
					setCoordinatesMode ();
				break;
			}
		
			$("#geolocation_mode_parameters").val (encodeURI (JSON.stringify (gGeolocationParameters[gGeolocationMode])));
			
			$("#geolocation_form").submit ();
		});
		
		gLatitude.val (gCurrentGeolocation.latitude);
		gLongitude.val (gCurrentGeolocation.longitude);
	
		wiki.geolocation.log ("latitude = ", gCurrentGeolocation.latitude);
		wiki.geolocation.log ("longitude = ", gCurrentGeolocation.longitude);

		switch (gGeolocationMode)
		{
			case "user" :													
				$(".geolocation-nav[data-target=geolocation_user]").click ();
			break;
			case "browser" :
				$(".geolocation-nav[data-target=geolocation_browser]").click ();
			break;
			case "address" :						
				$(".geolocation-nav[data-target=geolocation_address]").click ();
			break;
			case "coordinates" :				
				$(".geolocation-nav[data-target=geolocation_coordinates]").click ();			
			break;
		}
	});

 }());





