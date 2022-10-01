<?php
///////////////////////////////////////////////
//
// {{ Geolocation }} action
// 
// Display and edit current user geolocation information used in bazar sorting and filtering
//
// @params (* necessary fields)
//	    user : the user, default to the logged user
//		output : 
//			- "init" (default) : initialize session variables with geolocation user information
//			- "coordinates" : output the current user's latitude and longitude in URL parameters (ie : lat=<latitude>&lon=<longitude>) or JSON format
//			- "address" : output all the geolocation user's profile information available (street, street1, street2, postal code, city, county, state, country, latitude, longitude) in URL parameters or JSON format
//			- "profile" : output the user's profile geolocation information using the provided template
//			- "position" : position form to set the current user's position
//			- "range" : range form to set the current range filter
//		fieldstreet : name of the field from which we will retrieve the street - default to bf_adresse
//		fieldstreet1 : name of the field from which we will retrieve the street - default to bf_adresse1
//		fieldstreet2 : name of the field from which we will retrieve the street1 - default to bf_adresse2
//		fieldpostalcode : name of the field from which we will retrieve the postal code - default to bf_code_postal
//      fieldcity : name of the field from which we will retrieve the city - default to bf_ville
//      fieldcounty : name of the field from which we will retrieve the county - default to bf_pays
//      fieldstate : name of the field from which we will retrieve the state - default to bf_departement
//      fieldcountry : name of the field from which we will retrieve the country - default to bf_region
//      fieldlatitude : name of the field from which we will retrieve the latitude - default to bf_latitude
//      fieldlongitude : name of the field from which we will retrieve the longitude - default to bf_longitude
// 		format : output format used for "profile" and "center" output : possibles values are "url" or "json"
//		showcoordinates : indicates if we want to display latitude and longitude information while displaying user profile information (output = "profile")
//		silent : disable display of a message when something went wrong (default to true)
//		template : template used for rendering
//		classcontainer : class of the main container used in templates
//		classbutton : class of the buttons used in templates
//		iconvalidate : icon used in template for validate button
//		iconnolimit : icon used in template for infinite range button
//		icongeolocation : icon used in template for geolocation button  
//
// Author : Yves Gufflet - 2022
//
///////////////////////////////////////////////

namespace YesWiki\Geolocation;

use YesWiki\Core\YesWikiAction;
use YesWiki\Bazar\Service\BazarListService;
use YesWiki\Core\Service\TemplateEngine;

/////////////////////////////////////////
//
// The GeolocationAction class
//
/////////////////////////////////////////

class GeolocationAction extends YesWikiAction
{
	////////////////////////////////////////
    // Method to prepare args, optionnal
    //
         
    public function formatArguments($arg)
    {		
    	// Let's retrieve the template service for further use
    
		$this->templateEngine = $this->getService(TemplateEngine::class);

		// By default, this action apply to the logged user : let's get his name
	
		$vUser = $this->wiki->getUser ();
	
		if (!empty ($vUser) && isset ($vUser["name"])) 
		{
			$vUserName = $vUser["name"];
		}
		else
		{
			$vUserName = "";
		}
	
		// "output" parameter indicates what this action is intended to do : 
		// init, center, address, profile, position, range
		// Let's get it

		$vOutput = $arg['output']??$_GET['output']??"profile";

		if (!in_array (strtolower ($vOutput), [ "init", "coordinates", "address", "profile", "position", "range", "form" ])) 
		{
			$vOutput = "profile";
		}
		
		// Template to be used for rendering

		$vTemplate = empty ($arg['template']) || empty (basename($arg['template'])) || !$this->templateEngine->hasTemplate("@geolocation/".basename($arg['template']))
						? ($vOutput == "position"?'position.twig':($vOutput == "range"?"range.twig":($vOutput == "profile"?"profile.twig":basename($arg['template']))))
		                : basename($arg['template']);

		// Range used for bazar filtering : maximal distance from the user geolocation to a bazar element
		
		$vRange = isset($_SESSION['geolocation'])&&isset($_SESSION['geolocation']["range"])?$_SESSION['geolocation']["range"]:"-1";
		
		if (($vRange === "") || floatval ($vRange) == -1)
		{
			$vRange = "-1"; // Infinite distance, no filtering
		}
	
		// Return the arguments
		
        return
        [
            'user' => empty($arg['user'])?$vUserName:$arg['user'],       
            'fieldstreet' => isset($arg['fieldstreet'])?$arg['fieldstreet']:"bf_adresse",
            'fieldstreet1' => isset($arg['fieldstreet1'])?$arg['fieldstreet1']:"bf_adresse1",            
            'fieldstreet2' => isset($arg['fieldstreet2'])?$arg['fieldstreet2']:"bf_adresse2",            
            'fieldpostalcode' => isset($arg['fieldpostalcode'])?$arg['fieldpostalcode']:"bf_code_postal",            
            'fieldcity' => isset($arg['fieldcity'])?$arg['fieldcity']:"bf_ville",            
            'fieldcounty' => isset($arg['fieldcounty'])?$arg['fieldcounty']:"bf_departement",            
            'fieldstate' => isset($arg['fieldstate'])?$arg['fieldstate']:"bf_region",            
            'fieldcountry' => isset($arg['fieldcountry'])?$arg['fieldcountry']:"bf_pays",            
            'fieldlatitude' => isset($arg['fieldlatitude'])?$arg['fieldlatitude']:"bf_latitude",            
            'fieldlongitude' => isset($arg['fieldlongitude'])?$arg['fieldlongitude']:"bf_longitude",            
            "silent" => isset($arg['silent'])?$arg['silent']=="true":true,
        	"output" => $vOutput,
	       	"format" => isset($arg['format'])?$arg['format']:"url",
	       	"range" => $vRange,
	       	"text" => $arg['text']??$arg["url"]??"",
	       	"url" => $arg['url']??"",
        	"showcoordinates" => isset($arg['showcoordinates'])?$arg['showcoordinates']:"true",        	
            'classcontainer' => !empty($arg['classcontainer'])  ? $arg['classcontainer'] : '',
            'classbutton' => !empty($arg['classbutton'])  ? $arg['classbutton'] : 'btn btn-primary',                   
            'iconvalidate' => !empty($arg['iconvalidate'])  ? $arg['iconvalidate'] : 'fas fa-check',
            'iconnolimit' => !empty($arg['iconnolimit'])  ? $arg['iconnolimit'] : 'fas fa-infinity',
            'icongeolocation' => !empty($arg['icongeolocation'])  ? $arg['icongeolocation'] : 'fas fa-map-marker-alt',
            'template' => $vTemplate
		];
    }

	////////////////////////////////////////
    // Method to execute the action
    //

    public function run()
    {
    	// If there is not yet a session variable to store the geolocation, let's create it
    
	    if (!isset ($_SESSION ["geolocation"])) $_SESSION ["geolocation"] = [];
    
   		// Let's see if the action is called by itself to update the parameters ("submit form")
          
		if (isset ($_POST ["latitude"]) && isset ($_POST ["longitude"]) && isset ($_POST ["mode"]))
		{	
	     	// We want to update latitude, longitude and geolocation mode
			
			// Let's ensure given values are correct
			
			$vLatitude = floatval($_POST["latitude"]);
			$vLongitude = floatval($_POST["longitude"]);			
			$vGeodata = !empty($_POST["geodata"])?json_decode($_POST["geodata"]):null;
			
			switch ($_POST["mode"])
			{
				case "user" : 
				case "address" :
				case "browser" : 
				case "coordinates" : 
					$vMode = $_POST["mode"];
				break; //it's OK
				default : 					
					$vMode = "user"; // It's not OK : use "user" mode as default
			};

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//		Avertissement : Les superglobales $_GET et $_REQUEST sont déjà décodées. 
			//		Utiliser urldecode() sur un élément de $_GET ou $_REQUEST peut avoir des conséquences inattendues et dangereuses.
			//		source : https://www.php.net/manual/fr/function.urldecode.php
			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		    

			$vParameters = isset($_POST["parameters"])?json_decode (urldecode($_POST["parameters"]), true):[];
				
			// Set the session variables
				
			$_SESSION ["geolocation"]["latitude"] = $vLatitude;
			$_SESSION ["geolocation"]["longitude"] = $vLongitude;
			$_SESSION ["geolocation"]["geodata"] = $vGeodata;
			$_SESSION ["geolocation"]["mode"] = $vMode;
			$_SESSION ["geolocation"]["parameters"] = $vParameters;
			
// 			IT SHOULD BE BETTER TO DISPLAY A MESSAGE : the following didn't work
//			echo ("<div class='alert alert-success'>Votre position a été modifiée. Vous devez recharger la page pour visualiser les changements.</div>");			
//			$_SESSION['message'] = "Votre position a été modifiée.";
//			$this->wiki->SetMessage ("Votre position a été modifiée.");
//        $this->wiki->Redirect(preg_replace('/(&|\\\?)$/m', '', preg_replace('/(&|\\\?)action=logout(&)?/', '$1', $this->arguments['loggedouturl'])));

			// Reset the POST variable before reloading the page
	
			$_POST = array(); 
					
			// Reload the page. We take into account if we were in an iframe or not.
					
			echo ('<script>if (window.self != window.top) {window.top.location = window.top.location.href;} else {window.location = window.location.href;}</script>');
			
			return;
		}

		// We want to update the range :

		if (isset ($_POST ["range"]))
		{		
			// Handle infinite range
			
			
			if ($_POST ["range"] == "")
				$vRange = "-1";
			else
				$vRange = floatval ($_POST ["range"]);

			$_SESSION ["geolocation"]["range"] = $vRange;

			// Reset the POST variable before reloading the page

			$_POST = array();

			// Reload the page. We take into account if we were in an iframe or not.
/*
			if (testUrlInIframe())			
				return '<div class="alert alert-success">Le rayon kilométrique a bien été enregistré.</div>';
			else
			{
				$this->wiki->SetMessage("Le rayon kilométrique a bien été enregistré");
				$this->arguments["range"] = $vRange;
			}
*/
			echo ('<script>if (window.self != window.top) {window.top.location = window.top.location.href;} else {window.location = window.location.href;}</script>');
			
			//return;
		}

		// We want to launch the action with the given parameters :

	    // Let's retrieve bazar service for further use.
	    
		$vBazarListService = $this->getService(BazarListService::class);

		// Let's retrive necessary user name and profile forms ids

		$vUserName = $this->arguments ["user"];
		
			// Let's get valid ids for user profile possible forms
		$vProfileIDs = $GLOBALS['wiki']->GetConfigValue ("profile_ids");
		 
        $vIDs = array_values(array_map(function ($vId) { return trim ($vId); }, $vProfileIDs));

		// If we got both

        if (!empty ($vUserName) && !empty ($vIDs))
		{ 		
			// Let's retrieve the user profile from the specified form ids
		
			$vEntries = $vBazarListService->getEntries(["idtypeannonce" => $vIDs, "user" => $vUserName ]);

			$vCount = count ($vEntries);

			if ($vCount == 1) 
			{			
				// We found it
			
				// Let's extract all geolocation information
			
				$vFilters = 
				[ 
					$this->arguments["fieldstreet"],
					$this->arguments["fieldstreet1"],					
					$this->arguments["fieldstreet2"],					
					$this->arguments["fieldpostalcode"],
					$this->arguments["fieldcity"],										
					$this->arguments["fieldcounty"],
					$this->arguments["fieldstate"],
					$this->arguments["fieldcountry"],
					$this->arguments["fieldlatitude"],
					$this->arguments["fieldlongitude"],
					"bf_geodata"
				];
					
				$vUserGeoData = array_filter
				(
   					$vEntries[0],
					function ($vValue, $vKey) use ($vFilters) { return in_array ($vKey, $vFilters) && !empty($vValue); },
				    ARRAY_FILTER_USE_BOTH
				);

				if (!empty ($vUserGeoData["bf_geodata"])) $vUserGeoData["bf_geodata"] = json_decode ($vUserGeoData["bf_geodata"]);

				// If the current geolocation is not set, we set it to the "user" mode (ie : user's profile geolocation) with the user profile latitude and longitude
				
				if (!isset ($_SESSION ["geolocation"]["mode"])) $_SESSION ["geolocation"]["mode"] = "user";
				if (!isset ($_SESSION ["geolocation"]["parameters"])) $_SESSION ["geolocation"]["parameters"] = [];
				if (!isset ($_SESSION ["geolocation"]["latitude"])) $_SESSION ["geolocation"]["latitude"] = $vUserGeoData[$this->arguments["fieldlatitude"]];
				if (!isset ($_SESSION ["geolocation"]["longitude"])) $_SESSION ["geolocation"]["longitude"] = $vUserGeoData[$this->arguments["fieldlongitude"]];
				if (!isset ($_SESSION ["geolocation"]["geodata"])) $_SESSION ["geolocation"]["geodata"] = $vUserGeoData["bf_geodata"];
				if (!isset ($_SESSION ["geolocation"]["range"])) $_SESSION ["geolocation"]["range"] = 100;

				// Let's see what the action is intended to do and do it.

				switch ($this->arguments["output"])
				{
					// Return a link that reference an url with the user's profile geolocation data included in a POST request
					
					case "form" : 
							
						$vUID = rand ();
							
						$vOutput = '<a style="cursor:pointer" onclick="$(\'#geolocation_url_form_' . $vUID . '\').submit ()">'.
										'<span title="' . (!empty($this->arguments["title"])?_t($this->arguments["title"]):"") . '">' . (!empty($this->arguments["text"])?_t($this->arguments["text"]):"") . '</span>' .
										'<form name="geolocation_url_form_' . $vUID . '" enctype="multipart/form-data" id="geolocation_url_form_' . $vUID . '" class="geolocation_url_form" method="post" action="' . $this->arguments["url"] . '" novalidate style="display:none">' .
											'<input name="' . $this->arguments["fieldstreet"] . '" value="' . ($vUserGeoData[$this->arguments["fieldstreet"]]??"") . '" style="display:none"></input>' .										
											'<input name="' . $this->arguments["fieldstreet1"] . '" value="' . ($vUserGeoData[$this->arguments["fieldstreet1"]]??"") . '" style="display:none"></input>' .										
											'<input name="' . $this->arguments["fieldstreet2"] . '" value="' . ($vUserGeoData[$this->arguments["fieldstreet2"]]??"") . '" style="display:none"></input>' .
	 										'<input name="' . $this->arguments["fieldpostalcode"] . '" value="' . ($vUserGeoData[$this->arguments["fieldpostalcode"]]??"") . '" style="display:none"></input>' .
	 										'<input id="geolocation_form_city" name="' . $this->arguments["fieldcity"] . '" value="' . ($vUserGeoData[$this->arguments["fieldcity"]]??"") . '" style="display:none"></input>' .
	 										'<input name="' . $this->arguments["fieldcounty"] . '" value="' . ($vUserGeoData[$this->arguments["fieldcounty"]]??"") . '" style="display:none"></input>' .
	 										'<input name="' . $this->arguments["fieldstate"] . '" value="' . ($vUserGeoData[$this->arguments["fieldstate"]]??"") . '" style="display:none"></input>' .
	 										'<input name="' . $this->arguments["fieldcountry"] . '" value="' . ($vUserGeoData[$this->arguments["fieldcountry"]]??"") . '" style="display:none"></input>' .
	// 										'<input name="' . $this->arguments["fieldlatitude"] . '" value="' . ($vUserGeoData[$this->arguments["fieldlatitude"]]??"") . '" style="display:none"></input>' .
	// 										'<input name="' . $this->arguments["fieldlongitude"] . '" value="' . ($vUserGeoData[$this->arguments["fieldlongitude"]]??"") . '" style="display:none"></input>' .
	// 										"<input name='bf_geodata' value='" . (json_encode($vUserGeoData["bf_geodata"])) . "' style='display:none'></input>" .
	 										'<input name="geolocation[' . $this->arguments["fieldlatitude"] . ']" value="' . $vUserGeoData[$this->arguments["fieldlatitude"]] . '" style="display:none"></input>' .
											'<input name="geolocation[' . $this->arguments["fieldlongitude"] . ']" value="' . $vUserGeoData[$this->arguments["fieldlongitude"]] . '" style="display:none"></input>' .
											"<input name='geolocation[bf_geodata]' value='" . (!empty($vUserGeoData["bf_geodata"])?json_encode($vUserGeoData["bf_geodata"]):"") . "' style='display:none'></input>" .										
										'</form>' .
									'</a>';

					break;
				
					// Return current user's latitude and longitude (as lat and lon) in url parametes or json format		    	

					case "coordinates" :	
						$vOutputData = [ "lat" => $_SESSION ["geolocation"]["latitude"], "lon" => $_SESSION ["geolocation"]["longitude"]];
						
						switch ($this->arguments["format"])
						{
							case "url" : // url format
								$vOutput = (http_build_query ($vOutputData));
							break;
							case "json" : // json format
							default :
								$vOutput = json_encode ($vOutputData);								
							break;
						}	
					break;
					
					// return complete user's profile geolocation data in url parameters or json format
						
					case "address" : 
						
						//$vOutputData = array_map (function ($pValue) { return urlencode ($pValue); }, $vUserGeoData);
										
						switch ($this->arguments["format"])
						{
							case "url" : // url format
								$vGeolocation = [ $this->arguments["fieldlatitude"] => $vUserGeoData[$this->arguments["fieldlatitude"]], $this->arguments["fieldlongitude"] =>  $vUserGeoData[$this->arguments["fieldlongitude"]]];								
								$vGeolocationString = urlencode (json_encode ($vGeolocation));
							
								unset ($vUserGeoData["bf_geodata"]);
							
								$vOutput = (http_build_query ($vUserGeoData)) . "&geolocation=" . $vGeolocationString;
							break;
							case "json" : // json format
							default :
								$vOutput = json_encode ($vUserGeoData);								
							break;
						}											
					break;
					
					// return a form used to modify the current position
					
					case "position" : 
							
				    	$vMapProvider = $GLOBALS['wiki']->config['baz_provider'];
						$vMapProviderId = $GLOBALS['wiki']->config['baz_provider_id'];
						$vMapProviderPass = $GLOBALS['wiki']->config['baz_provider_pass'];
						if (!empty($vMapProviderId) && !empty($vMapProviderPass))
						{
							if ($vMapProvider == 'MapBox')
							{
								$vMapProviderCredentials = [ "id" => $vMapProviderId, "accessToken" => $vMapProviderPass ];
							}
							else
							{
								$vMapProviderCredentials = [ "app_id" => $mapProviderId, "app_code" => $mapProviderPass ];
							}
						}
						else
						{
							$vMapProviderCredentials = [];
						}

						$vOutput = $this->render("@geolocation/{$this->arguments['template']}",
					    [
					    	"javascript_data" => 
					    	[
						    	"user_geolocation" => 
						    	[
									"street" => $vUserGeoData[$this->arguments["fieldstreet"]],
									"street1" => $vUserGeoData[$this->arguments["fieldstreet1"]],
									"street2" => $vUserGeoData[$this->arguments["fieldstreet2"]],																		
									"postalCode" => $vUserGeoData[$this->arguments["fieldpostalcode"]],																		
									"city" => $vUserGeoData[$this->arguments["fieldcity"]],																		
									"county" => $vUserGeoData[$this->arguments["fieldcounty"]],																		
									"state" => $vUserGeoData[$this->arguments["fieldstate"]],																		
									"country" => $vUserGeoData[$this->arguments["fieldcountry"]],																		
									"latitude" => $vUserGeoData[$this->arguments["fieldlatitude"]],																		
									"longitude" => $vUserGeoData[$this->arguments["fieldlongitude"]],
									"geodata" => $vUserGeoData["bf_geodata"]
						    	],
						    	"current_geolocation" => $_SESSION ["geolocation"] ,						    	
						    	'provider' => $vMapProvider,
					    		'credentials' => $vMapProviderCredentials,
					    	],
					    	'class_container' => $this->arguments["classcontainer"],
   					    	'class_button' => $this->arguments["classbutton"],
					    	'icon_validate' => $this->arguments["iconvalidate"],
					    	'icon_nolimit' => $this->arguments["iconnolimit"],
					    	'icon_geolocation' => $this->arguments["icongeolocation"]
					    ]);					   
					break;
					
					// return a form used to modify the current range
					
					case "range" : 
						$vOutput = $this->render("@geolocation/{$this->arguments['template']}",
					    [
   					    	"range" => $this->arguments["range"],
					    	'class_container' => $this->arguments["classcontainer"],
   					    	'class_button' => $this->arguments["classbutton"],
					    	'icon_validate' => $this->arguments["iconvalidate"],
					    	'icon_nolimit' => $this->arguments["iconnolimit"],
					    	'icon_geolocation' => $this->arguments["icongeolocation"]
					    ]);		
					break;		

					// return rendered user's geolocation profile
								
					case "profile" :
					{
						$vOutput = $this->render("@geolocation/{$this->arguments['template']}", 		
						[ 
							'street' =>  $vUserGeoData[$this->arguments["fieldstreet"]]??"",
							'street1' =>  $vUserGeoData[$this->arguments["fieldstreet1"]]??"", 
							'street2' =>  $vUserGeoData[$this->arguments["fieldstreet2"]]??"", 														 
							'postalcode' =>  $vUserGeoData[$this->arguments["fieldpostalcode"]]??"", 
							'city' =>  $vUserGeoData[$this->arguments["fieldcity"]]??"",
							'county' =>  $vUserGeoData[$this->arguments["fieldcounty"]]??"",  
							'state' =>  $vUserGeoData[$this->arguments["fieldstate"]]??"", 
							'country' =>  $vUserGeoData[$this->arguments["fieldcountry"]]??"", 
							'latitude' =>  $vUserGeoData[$this->arguments["fieldlatitude"]]??"", 
							'longitude' => $vUserGeoData[$this->arguments["fieldlongitude"]]??"",
							'showcoordinates' => $this->arguments["showcoordinates"] // do we display latitude and longitude : true or false
						]);
					}
					break;			
					
					// We went there for initialization. There is nothing to return
							
					case "init" :
					default :
						$vOutput = "";
					break;
				}
				
				return $vOutput;		
		    }
		    if ($vCount > 1)
		    {
			    if (!$this->arguments ["silent"])
			    	return '<div class="alert alert-danger">' . _t('GEOLOCATION_ACTION_MULTIPLE_GEOLOCATION_PER_USER', [ 'count' => $vCount, 'user' => $vUserName, "ids" => implode (", ", $vIDs) ]) . '</div>';
			    else
					return "";
		    }
		    else // ERROR : We were unable to find the user's geolocation profile
		    {
		    	if (!$this->arguments ["silent"])
			    	return '<div class="alert alert-danger">' . _t('GEOLOCATION_ACTION_CANNOT_RETRIEVE_GEOLOCATION_INFORMATION', [ 'user' => $vUserName, "ids" => implode (", ", $vIDs) ]) . '</div>';
			    else
					return "";			    
		    }   
		} 
		
		// Missing user and ids
		
    	if (!$this->arguments ["silent"])		
	    	return '<div class="alert alert-danger">'. _t('GEOLOCATION_ACTION_MISSING_USER_OR_IDS') . '</div>';
	    else
	    	return "";
	}
}
