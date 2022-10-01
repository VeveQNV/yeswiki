<?php

namespace YesWiki\Geolocation\Service;

class GeolocationService
{
    public function __construct()
    {
    }
    
    static public function geodesiqueDistance ($pGeolocationA, $pGeolocationB, $pLatitudeField = "bf_latitude", $pLongitudeField = "bf_longitude")
	{
		// if at least one of the object is not geolocated, the distance is 0
		
		if (empty ($pGeolocationA)) return -1;
		else if (!isset ($pGeolocationA[$pLatitudeField]) || !isset ($pGeolocationA[$pLongitudeField])) return -1;
		
		if (empty ($pGeolocationB)) return -1;
		else if (!isset ($pGeolocationB[$pLatitudeField]) || !isset ($pGeolocationB[$pLongitudeField])) return -1;
		
		// It is not the case : let's compute the geodesique distance
		
		// Radius in Km

		$radiusEarthKm = 6371.07103;
		
		// Convert degrees to radians 

		$radiusLatFrom = $pGeolocationA[$pLatitudeField] * (pi() /180);
		$radiusLatTo = $pGeolocationB[$pLatitudeField] * (pi() /180);

		// Radian difference (latitudes)

		$latDiff = $radiusLatTo - $radiusLatFrom;

		// Radian difference (longitudes)

		$lngDiff = ($pGeolocationB[$pLongitudeField] - $pGeolocationA[$pLongitudeField]) * (pi() /180);

		// Distance

		$vDistance = 2 * $radiusEarthKm * sin(sqrt(sin($latDiff/2) * sin($latDiff/2) + cos($radiusLatFrom) * cos($radiusLatTo) * sin($lngDiff/2)*sin($lngDiff/2)));

		return $vDistance;
	}
	
	static function getZoomForAddress ($pStreet = null, $pPostalCode = null, $pCity = null, $pCounty = null, $pState = null, $pCountry = null, $vWidth = null, $vHeight = null)
	{
		if (!empty ($pStreet)) return 14;
		if (!empty ($pPostalCode) || !empty ($pCity)) return 10;
		if (!empty ($pCounty)) return 8;
		if (!empty ($pState)) return 6;	
		if (!empty ($pCountry)) return 4;

		return 10;
	}
}
