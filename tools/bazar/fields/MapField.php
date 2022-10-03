<?php

namespace YesWiki\Bazar\Field;

use Psr\Container\ContainerInterface;

/**
 * @Field({"map", "carte_google"})
 */
class MapField extends BazarField
{
    protected $latitudeField;
    protected $longitudeField;
    protected $autocomplete;

    protected const FIELD_LATITUDE_FIELD = 1;
    protected const FIELD_LONGITUDE_FIELD = 2;
    protected const FIELD_AUTOCOMPLETE_POSTALCODE = 4;
    protected const FIELD_AUTOCOMPLETE_CITY = 5;
    protected const FIELD_AUTOCOMPLETE_COUNTY = 6;
    protected const FIELD_AUTOCOMPLETE_STATE = 7;
    protected const FIELD_AUTOCOMPLETE_COUNTRY = 9;

    public function __construct(array $values, ContainerInterface $services)
    {
        parent::__construct($values, $services);

		$this->geodataField = "bf_geodata";

        $this->latitudeField = $values[self::FIELD_LATITUDE_FIELD] ?? 'bf_latitude';
        $this->longitudeField = $values[self::FIELD_LONGITUDE_FIELD] ?? 'bf_longitude';
        $this->autocomplete =
        [
        	"street" => "bf_adresse",
        	"street1" => "bf_adresse1",
        	"street2" => "bf_adresse2",
        	"postalCode" => trim ($values[self::FIELD_AUTOCOMPLETE_POSTALCODE]??""),
	 		"city" => trim ($values[self::FIELD_AUTOCOMPLETE_CITY]??""),
	  		"county" => trim ($values[self::FIELD_AUTOCOMPLETE_COUNTY]??""),
	 		"state" => trim ($values[self::FIELD_AUTOCOMPLETE_STATE]??""),
  			"country" => trim ($values[self::FIELD_AUTOCOMPLETE_COUNTRY]??"")
  		];

        $this->propertyName = 'geolocation';
        $this->label = $this->propertyName;
    }

    protected function getValue($entry)
    {
        $value = $entry[$this->propertyName] ?? (isset ($_REQUEST[$this->propertyName])?$_REQUEST[$this->propertyName]:[]) ?? $this->default;

        // backward compatibility with former `carte_google` propertyName
        if (empty($value)) {
            if (!empty($entry['carte_google'])) {
                $value = explode('|', $entry['carte_google']);
                if (empty($value[0]) || empty($value[1])) {
                    $value = null;
                } else {
                    $value = [
                        $this->getLatitudeField() => $value[0],
                        $this->getLongitudeField()=> $value[1]
                    ];
                }
            } elseif (!empty($entry[$this->getLatitudeField()]) && !empty($entry[$this->getLongitudeField()])) {
                $value = [
                    $this->getLatitudeField() => $entry[$this->getLatitudeField()],
                    $this->getLongitudeField()=> $entry[$this->getLongitudeField()],
                    "bf_geodata"=> (!empty($entry[$this->geodataField])?$entry[$this->geodataField]:null)
                ];
            }
        }
        return $value;
    }

    protected function renderInput($pEntry, $pOptions = null)
    {    
        $vValue = $this->getValue($pEntry);
		$vAutocomplete = $this->autocomplete;
	   	
        // on recupere d eventuels id et token pour les providers en ayant besoin
        $vMapProvider = $GLOBALS['wiki']->config['baz_provider'];
        $vMapProviderId = $GLOBALS['wiki']->config['baz_provider_id'];
        $vMapProviderPass = $GLOBALS['wiki']->config['baz_provider_pass'];
   
        if (!empty($vMapProviderId) && !empty($vMapProviderPass))
        {
            if ($vMapProvider == 'MapBox')
            {
                $vMapProviderCredentials = '{id: \''.$vMapProviderId .'\', accessToken: \'' . $vMapProviderPass.'\'}';
            }
            else
            {
                $vMapProviderCredentials = '{ app_id: \''.$vMapProviderId.'\', app_code: \''.$vMapProviderPass.'\'}';
            }
        }
        else
        {
            $vMapProviderCredentials = '';
        }
        
      //  $pOptions = ["form_uid" => "uid" ];
        
        $vGeolocationScript =
		'document.addEventListener("DOMContentLoaded", function()' .
		'{' .
			'var vStreet = ' . (!empty($vAutocomplete["street"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["street"] . '\']")':'undefined') . ';' .
			'var vStreet1 = ' . (!empty($vAutocomplete["street1"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["street1"] . '\']")':'undefined') . ';' .
			'var vStreet2 = ' . (!empty($vAutocomplete["street1"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["street2"] . '\']")':'undefined') . ';' .
			'var vPostalCode = ' . (!empty($vAutocomplete["postalCode"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["postalCode"] . '\']")':'undefined') . ';' .
			'var vCity = ' . (!empty($vAutocomplete["city"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["city"] . '\']")':'undefined') . ';' .
			'var vCounty = ' . (!empty($vAutocomplete["county"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["county"] . '\']")':'undefined') . ';' .
			'var vState = ' . (!empty($vAutocomplete["state"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["state"] . '\']")':'undefined') . ';' .
			'var vCountry = ' . (!empty($vAutocomplete["country"])?'$("form[uid=' . $pOptions["form_uid"] . '] input[name=\'' . $vAutocomplete["country"] . '\']")':'undefined') . ';' .
			'var vGeolocateButton = $("form[uid=' . $pOptions["form_uid"] . '] .btn-geolocate-address");' .
			'var vLatitude = $("form[uid=' . $pOptions["form_uid"] . '] #' . $this->latitudeField . '");' .
			'var vLongitude = $("form[uid=' . $pOptions["form_uid"] . '] #' . $this->longitudeField . '");' .
			'var vGeodata = $("form[uid=' . $pOptions["form_uid"] . '] #' . $this->geodataField . '");' .				

			'vLatitude.val ("' . $vValue[$this->latitudeField] . '");' . 
			'vLongitude.val ("' . $vValue[$this->longitudeField] .'");' .
			'vGeodata.val (\'' . (!empty($vValue[$this->geodataField])?$vValue[$this->geodataField]:null) .'\');' .
			
			'wiki.geolocation.form' .
			'({' . 
				'street : vStreet,' . 
				'street1 : vStreet1,' . 
				'street2 : vStreet2,' .
				'postalCode : vPostalCode,' .
				'city : vCity,' .
				'county : vCounty,' .
				'state : vState,' . 
				'country : vCountry,' .
				'latitude : vLatitude,' .
				'longitude : vLongitude,' .
				'geolocate : vGeolocateButton,' .	
				'geodata : vGeodata' .			
			'},' .
			'{' .
				'toAutocomplete : "postalCode, city, county, state, country",' .
				'render :' .
				'{' .
					'popup :' .
					'{' .
						'enabled : true,' .						
						'options :' .
						'{' .
							'closeButton: false,' .
		                	'closeOnClick: false,' .
		                	'minWidth: 300' .
		                '}' .
					'},' .
					'marker :' .
					'{' .
						'texts : { adjust :"' . _t('BAZ_ADJUST_MARKER_POSITION') . '"}, ' .
						'options : ' .
						'{' .
							'draggable : true' .
						'}' .
					'},' .	
					'mapID : "osmmapform",' .
					'mapOptions : ' .
					'{' .
						'scrollWheelZoom : ' . $GLOBALS['wiki']->config['baz_wheel_zoom'] . ', ' .
				        'zoomControl : ' . $GLOBALS['wiki']->config['baz_show_nav'] . ',' .
						'center : [' . $GLOBALS['wiki']->config['baz_map_center_lat'] . ', ' . $GLOBALS['wiki']->config['baz_map_center_lon'] . '], ' .
						'zoom : ' . $GLOBALS['wiki']->config['baz_map_zoom'] . ", " .
						'provider : "' . $vMapProvider . '", ' .
						'providerCredential : "' . $vMapProviderCredentials . '", ' .
						'draggable : true, ' .
						'error : function () { alert(_t("BAZ_GEOLOC_NOT_FOUND")); }' .
					'}' .
				'}' .
			'})' .
		'})';
				
        $GLOBALS['wiki']->AddCSSFile('styles/vendor/leaflet/leaflet.css');
        $GLOBALS['wiki']->AddCSSFile('styles/vendor/leaflet-fullscreen/leaflet-fullscreen.css');
        $GLOBALS['wiki']->AddJavascriptFile('javascripts/vendor/leaflet/leaflet.min.js');
        $GLOBALS['wiki']->AddJavascriptFile('javascripts/vendor/leaflet-providers/leaflet-providers.js');        
   		$GLOBALS['wiki']->AddJavascriptFile('javascripts/vendor/leaflet-fullscreen/leaflet-fullscreen.js');
        $GLOBALS['wiki']->AddJavascriptFile('tools/geolocation/javascripts/geolocation.js');
        $GLOBALS['wiki']->AddJavascript($vGeolocationScript);

        return $this->render("@bazar/inputs/map.twig", [
            'latitude' => is_array($vValue) && !empty($vValue[$this->getLatitudeField()]) ? $vValue[$this->getLatitudeField()] : null,
            'longitude' => is_array($vValue) && !empty($vValue[$this->getLongitudeField()]) ? $vValue[$this->getLongitudeField()] : null,
            'geodata'	=> is_array($vValue) && !empty($vValue[$this->geodataField])?$vValue[$this->geodataField]:null
        ]);
    }
    public function formatValuesBeforeSave($entry)
    {
        return $this->formatValuesBeforeSaveIfEditable($entry, false);
    }

    public function formatValuesBeforeSaveIfEditable($entry, bool $isCreation = false)
    {
        if (!$this->canEdit($entry, $isCreation)) {
            // retrieve value from value because redefined with right value
            $values = $this->getValue($entry);
            if (empty($values)) {
                if (isset($entry[$this->getLatitudeField()])) {
                    unset($entry[$this->getLatitudeField()]);
                }
                if (isset($entry[$this->getLongitudeField()])) {
                    unset($entry[$this->getLongitudeField()]);
                }
                if (isset($entry[$this->geodataField])) {
                    unset($entry[$this->geodataField]);
                }
            } else {
                $entry[$this->getPropertyName()] = $values;
                $entry[$this->getLatitudeField()] = $values[$this->getLatitudeField()];
                $entry[$this->getLongitudeField()] = $values[$this->getLatitudeField()];
                $entry[$this->geodataField] = $values[$this->geodataField];
            }
        }
        if (!empty($entry[$this->getLatitudeField()]) && !empty($entry[$this->getLongitudeField()])) {
            $entry[$this->getPropertyName()] = [
                $this->getLatitudeField() => $entry[$this->getLatitudeField()],
                $this->getLongitudeField() => $entry[$this->getLongitudeField()]
            ];
            return [
            $this->getPropertyName() => $entry[$this->getPropertyName()],
            $this->getLatitudeField() => $entry[$this->getLatitudeField()],
            $this->getLongitudeField() => $entry[$this->getLongitudeField()],
            $this->geodataField => $entry[$this->geodataField],
            'fields-to-remove' => ['carte_google']
          ];
        } else {
            return [
          'fields-to-remove' => [
            $this->getPropertyName(),
            $this->getLatitudeField(),
            $this->getLongitudeField(),
            $this->geodataField,
            'carte_google'
            ]
        ];
        }
    }

    protected function renderStatic($entry)
    {
        return null;
    }

    // GETTERS. Needed to use them in the Twig syntax

    public function getLatitudeField()
    {
        return $this->latitudeField;
    }

    public function getLongitudeField()
    {
        return $this->longitudeField;
    }

    public function getAutocomplete()
    {
        return $this->autocomplete;
    }

    public function jsonSerialize()
    {
        return array_merge(
            parent::jsonSerialize(),
            [
              'latitudeField' => $this->getLatitudeField(),
              'longitudeField' => $this->getLongitudeField(),
              'autocomplete' => $this->getAutocomplete(),
            ]
        );
    }
}
