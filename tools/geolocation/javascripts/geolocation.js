//////////////////////////////////////////////
//
// JAVASCRIPT GEOLOCATION MODULE
//
// Offer geolocation facilities to javascript scripts :
// 	* form autocompletion
//	* map rendering
//  * browser geolocation
// 	* address geolocation
//	* ...
//
// @author : Yves Gufflet 2022


wiki.debug.modules.geolocation = true; // activate or inactivate the console debug logging mode
wiki.debug.colors.geolocation = "red"; // color of debugging information

// Yeswiki geolocation object containing all about geolocation

$.extend (true, wiki, 
{
	map :
	{
		options :
		{
			maxZoom : 13.5,
			scrollWheelZoom : true,
		    zoomControl : true,
		    fullscreenControl : true,
		    fullscreenControlOptions :
		    {
		    	position:"topright",
		      	forceSeparateButton: true,
		      	title: _t('BAZ_FULLSCREEN'), // change the title of the button, default Full Screen
		      	titleCancel: _t('BAZ_BACK_TO_NORMAL_VIEW'), // change the title of the button when fullscreen is on, default Exit Full Screen
				content: '<i class="fa fa-expand" ></i>' // change the content of the button, can be HTML, default null
			}
        },
        maxZoom: 18
	},
	geolocation :
	{
		removeSameDisplayNames : true, // remove the entries that have the same display name
		geolocaterLimit : 5, // geolocater maximum entries returned 
		log : wiki.debug._logFunction ("geolocation"), // geolocation debug log function 
		countries : // World's countries with country code, name and bounding box
		[
			{ id : "AF", name : "Afghanistan", box : [60.53, 29.32, 75.16, 38.49] },
			{ id : "AO", name : "Angola", box : [11.64, -17.93, 24.08, -4.44] },
			{ id : "AL", name : "Albania", box : [19.3, 39.62, 21.02, 42.69] },
			{ id : "AE", name : "United Arab Emirates", box : [51.58, 22.5, 56.4, 26.06] },
			{ id : "AR", name : "Argentina", box : [-73.42, -55.25, -53.63, -21.83] },
			{ id : "AM", name : "Armenia", box : [43.58, 38.74, 46.51, 41.25] },
			{ id : "AQ", name : "Antarctica", box : [-180.0, -90.0, 180.0, -63.27] },
			{ id : "TF", name : "French Southern Territories", box : [68.72, -49.78, 70.56, -48.63] },
			{ id : "AU", name : "Australia", box : [113.34, -43.63, 153.57, -10.67] },
			{ id : "AT", name : "Austria", box : [9.48, 46.43, 16.98, 49.04] },
			{ id : "AZ", name : "Azerbaijan", box : [44.79, 38.27, 50.39, 41.86] },
			{ id : "BI", name : "Burundi", box : [29.02, -4.5, 30.75, -2.35] },
			{ id : "BE", name : "Belgium", box : [2.51, 49.53, 6.16, 51.48] },
			{ id : "BJ", name : "Benin", box : [0.77, 6.14, 3.8, 12.24] },
			{ id : "BF", name : "Burkina Faso", box : [-5.47, 9.61, 2.18, 15.12] },
			{ id : "BD", name : "Bangladesh", box : [88.08, 20.67, 92.67, 26.45] },
			{ id : "BG", name : "Bulgaria", box : [22.38, 41.23, 28.56, 44.23] },
			{ id : "BS", name : "Bahamas", box : [-78.98, 23.71, -77.0, 27.04] },
			{ id : "BA", name : "Bosnia and Herzegovina", box : [15.75, 42.65, 19.6, 45.23] },
			{ id : "BY", name : "Belarus", box : [23.2, 51.32, 32.69, 56.17] },
			{ id : "BZ", name : "Belize", box : [-89.23, 15.89, -88.11, 18.5] },
			{ id : "BO", name : "Bolivia", box : [-69.59, -22.87, -57.5, -9.76] },
			{ id : "BR", name : "Brazil", box : [-73.99, -33.77, -34.73, 5.24] },
			{ id : "BN", name : "Brunei", box : [114.2, 4.01, 115.45, 5.45] },
			{ id : "BT", name : "Bhutan", box : [88.81, 26.72, 92.1, 28.3] },
			{ id : "BW", name : "Botswana", box : [19.9, -26.83, 29.43, -17.66] },
			{ id : "CF", name : "Central African Republic", box : [14.46, 2.27, 27.37, 11.14] },
			{ id : "CA", name : "Canada", box : [-141.0, 41.68, -52.65, 73.23] },
			{ id : "CH", name : "Switzerland", box : [6.02, 45.78, 10.44, 47.83] },
			{ id : "CL", name : "Chile", box : [-75.64, -55.61, -66.96, -17.58] },
			{ id : "CN", name : "China", box : [73.68, 18.2, 135.03, 53.46] },
			{ id : "CI", name : "Ivory Coast", box : [-8.6, 4.34, -2.56, 10.52] },
			{ id : "CM", name : "Cameroon", box : [8.49, 1.73, 16.01, 12.86] },
			{ id : "CD", name : "Congo (Kinshasa)", box : [12.18, -13.26, 31.17, 5.26] },
			{ id : "CG", name : "Congo (Brazzaville)", box : [11.09, -5.04, 18.45, 3.73] },
			{ id : "CO", name : "Colombia", box : [-78.99, -4.3, -66.88, 12.44] },
			{ id : "CR", name : "Costa Rica", box : [-85.94, 8.23, -82.55, 11.22] },
			{ id : "CU", name : "Cuba", box : [-84.97, 19.86, -74.18, 23.19] },
			{ id : "CY", name : "Cyprus", box : [32.26, 34.57, 34.0, 35.17] },
			{ id : "CZ", name : "Czech Republic", box : [12.24, 48.56, 18.85, 51.12] },
			{ id : "DE", name : "Germany", box : [5.99, 47.3, 15.02, 54.98] },
			{ id : "DJ", name : "Djibouti", box : [41.66, 10.93, 43.32, 12.7] },
			{ id : "DK", name : "Denmark", box : [8.09, 54.8, 12.69, 57.73] },
			{ id : "DO", name : "Dominican Republic", box : [-71.95, 17.6, -68.32, 19.88] },
			{ id : "DZ", name : "Algeria", box : [-8.68, 19.06, 12.0, 37.12] },
			{ id : "EC", name : "Ecuador", box : [-80.97, -4.96, -75.23, 1.38] },
			{ id : "EG", name : "Egypt", box : [24.7, 22.0, 36.87, 31.59] },
			{ id : "ER", name : "Eritrea", box : [36.32, 12.46, 43.08, 18.0] },
			{ id : "ES", name : "Spain", box : [-9.39, 35.95, 3.04, 43.75] },
			{ id : "EE", name : "Estonia", box : [23.34, 57.47, 28.13, 59.61] },
			{ id : "ET", name : "Ethiopia", box : [32.95, 3.42, 47.79, 14.96] },
			{ id : "FI", name : "Finland", box : [20.65, 59.85, 31.52, 70.16] },
			{ id : "FJ", name : "Fiji", box : [-180.0, -18.29, 180.0, -16.02] },
			{ id : "FK", name : "Falkland Islands", box : [-61.2, -52.3, -57.75, -51.1] },
			{ id : "FR", name : "France", box : [-5.0, 42.5, 9.56, 51.15] },
			{ id : "GA", name : "Gabon", box : [8.8, -3.98, 14.43, 2.33] },
			{ id : "GB", name : "United Kingdom", box : [-7.57, 49.96, 1.68, 58.64] },
			{ id : "GE", name : "Georgia", box : [39.96, 41.06, 46.64, 43.55] },
			{ id : "GH", name : "Ghana", box : [-3.24, 4.71, 1.06, 11.1] },
			{ id : "GN", name : "Guinea", box : [-15.13, 7.31, -7.83, 12.59] },
			{ id : "GM", name : "Gambia", box : [-16.84, 13.13, -13.84, 13.88] },
			{ id : "GW", name : "Guinea Bissau", box : [-16.68, 11.04, -13.7, 12.63] },
			{ id : "GQ", name : "Equatorial Guinea", box : [9.31, 1.01, 11.29, 2.28] },
			{ id : "GR", name : "Greece", box : [20.15, 34.92, 26.6, 41.83] },
			{ id : "GL", name : "Greenland", box : [-73.3, 60.04, -12.21, 83.65] },
			{ id : "GT", name : "Guatemala", box : [-92.23, 13.74, -88.23, 17.82] },
			{ id : "GY", name : "Guyana", box : [-61.41, 1.27, -56.54, 8.37] },
			{ id : "HN", name : "Honduras", box : [-89.35, 12.98, -83.15, 16.01] },
			{ id : "HR", name : "Croatia", box : [13.66, 42.48, 19.39, 46.5] },
			{ id : "HT", name : "Haiti", box : [-74.46, 18.03, -71.62, 19.92] },
			{ id : "HU", name : "Hungary", box : [16.2, 45.76, 22.71, 48.62] },
			{ id : "ID", name : "Indonesia", box : [95.29, -10.36, 141.03, 5.48] },
			{ id : "IN", name : "India", box : [68.18, 7.97, 97.4, 35.49] },
			{ id : "IE", name : "Ireland", box : [-9.98, 51.67, -6.03, 55.13] },
			{ id : "IR", name : "Iran", box : [44.11, 25.08, 63.32, 39.71] },
			{ id : "IQ", name : "Iraq", box : [38.79, 29.1, 48.57, 37.39] },
			{ id : "IS", name : "Iceland", box : [-24.33, 63.5, -13.61, 66.53] },
			{ id : "IL", name : "Israel", box : [34.27, 29.5, 35.84, 33.28] },
			{ id : "IT", name : "Italy", box : [6.75, 36.62, 18.48, 47.12] },
			{ id : "JM", name : "Jamaica", box : [-78.34, 17.7, -76.2, 18.52] },
			{ id : "JO", name : "Jordan", box : [34.92, 29.2, 39.2, 33.38] },
			{ id : "JP", name : "Japan", box : [129.41, 31.03, 145.54, 45.55] },
			{ id : "KZ", name : "Kazakhstan", box : [46.47, 40.66, 87.36, 55.39] },
			{ id : "KE", name : "Kenya", box : [33.89, -4.68, 41.86, 5.51] },
			{ id : "KG", name : "Kyrgyzstan", box : [69.46, 39.28, 80.26, 43.3] },
			{ id : "KH", name : "Cambodia", box : [102.35, 10.49, 107.61, 14.57] },
			{ id : "KR", name : "South Korea", box : [126.12, 34.39, 129.47, 38.61] },
			{ id : "KW", name : "Kuwait", box : [46.57, 28.53, 48.42, 30.06] },
			{ id : "LA", name : "Laos", box : [100.12, 13.88, 107.56, 22.46] },
			{ id : "LB", name : "Lebanon", box : [35.13, 33.09, 36.61, 34.64] },
			{ id : "LR", name : "Liberia", box : [-11.44, 4.36, -7.54, 8.54] },
			{ id : "LY", name : "Libya", box : [9.32, 19.58, 25.16, 33.14] },
			{ id : "LK", name : "Sri Lanka", box : [79.7, 5.97, 81.79, 9.82] },
			{ id : "LS", name : "Lesotho", box : [27.0, -30.65, 29.33, -28.65] },
			{ id : "LT", name : "Lithuania", box : [21.06, 53.91, 26.59, 56.37] },
			{ id : "LU", name : "Luxembourg", box : [5.67, 49.44, 6.24, 50.13] },
			{ id : "LV", name : "Latvia", box : [21.06, 55.62, 28.18, 57.97] },
			{ id : "MA", name : "Morocco", box : [-17.02, 21.42, -1.12, 35.76] },
			{ id : "MD", name : "Moldova", box : [26.62, 45.49, 30.02, 48.47] },
			{ id : "MG", name : "Madagascar", box : [43.25, -25.6, 50.48, -12.04] },
			{ id : "MX", name : "Mexico", box : [-117.13, 14.54, -86.81, 32.72] },
			{ id : "MK", name : "Macedonia", box : [20.46, 40.84, 22.95, 42.32] },
			{ id : "ML", name : "Mali", box : [-12.17, 10.1, 4.27, 24.97] },
			{ id : "MM", name : "Myanmar", box : [92.3, 9.93, 101.18, 28.34] },
			{ id : "ME", name : "Montenegro", box : [18.45, 41.88, 20.34, 43.52] },
			{ id : "MN", name : "Mongolia", box : [87.75, 41.6, 119.77, 52.05] },
			{ id : "MZ", name : "Mozambique", box : [30.18, -26.74, 40.78, -10.32] },
			{ id : "MR", name : "Mauritania", box : [-17.06, 14.62, -4.92, 27.4] },
			{ id : "MW", name : "Malawi", box : [32.69, -16.8, 35.77, -9.23] },
			{ id : "MY", name : "Malaysia", box : [100.09, 0.77, 119.18, 6.93] },
			{ id : "NA", name : "Namibia", box : [11.73, -29.05, 25.08, -16.94] },
			{ id : "NC", name : "New Caledonia", box : [164.03, -22.4, 167.12, -20.11] },
			{ id : "NE", name : "Niger", box : [0.3, 11.66, 15.9, 23.47] },
			{ id : "NG", name : "Nigeria", box : [2.69, 4.24, 14.58, 13.87] },
			{ id : "NI", name : "Nicaragua", box : [-87.67, 10.73, -83.15, 15.02] },
			{ id : "NL", name : "Netherlands", box : [3.31, 50.8, 7.09, 53.51] },
			{ id : "NO", name : "Norway", box : [4.99, 58.08, 31.29, 70.92] },
			{ id : "NP", name : "Nepal", box : [80.09, 26.4, 88.17, 30.42] },
			{ id : "NZ", name : "New Zealand", box : [166.51, -46.64, 178.52, -34.45] },
			{ id : "OM", name : "Oman", box : [52.0, 16.65, 59.81, 26.4] },
			{ id : "PK", name : "Pakistan", box : [60.87, 23.69, 77.84, 37.13] },
			{ id : "PA", name : "Panama", box : [-82.97, 7.22, -77.24, 9.61] },
			{ id : "PE", name : "Peru", box : [-81.41, -18.35, -68.67, -0.06] },
			{ id : "PH", name : "Philippines", box : [117.17, 5.58, 126.54, 18.51] },
			{ id : "PG", name : "Papua New Guinea", box : [141.0, -10.65, 156.02, -2.5] },
			{ id : "PL", name : "Poland", box : [14.07, 49.03, 24.03, 54.85] },
			{ id : "PR", name : "Puerto Rico", box : [-67.24, 17.95, -65.59, 18.52] },
			{ id : "KP", name : "North Korea", box : [124.27, 37.67, 130.78, 42.99] },
			{ id : "PT", name : "Portugal", box : [-9.53, 36.84, -6.39, 42.28] },
			{ id : "PY", name : "Paraguay", box : [-62.69, -27.55, -54.29, -19.34] },
			{ id : "QA", name : "Qatar", box : [50.74, 24.56, 51.61, 26.11] },
			{ id : "RO", name : "Romania", box : [20.22, 43.69, 29.63, 48.22] },
			{ id : "RU", name : "Russia", box : [-180.0, 41.15, 180.0, 81.25] },
			{ id : "RW", name : "Rwanda", box : [29.02, -2.92, 30.82, -1.13] },
			{ id : "SA", name : "Saudi Arabia", box : [34.63, 16.35, 55.67, 32.16] },
			{ id : "SD", name : "Sudan", box : [21.94, 8.62, 38.41, 22.0] },
			{ id : "SS", name : "South Sudan", box : [23.89, 3.51, 35.3, 12.25] },
			{ id : "SN", name : "Senegal", box : [-17.63, 12.33, -11.47, 16.6] },
			{ id : "SB", name : "Solomon Islands", box : [156.49, -10.83, 162.4, -6.6] },
			{ id : "SL", name : "Sierra Leone", box : [-13.25, 6.79, -10.23, 10.05] },
			{ id : "SV", name : "El Salvador", box : [-90.1, 13.15, -87.72, 14.42] },
			{ id : "SO", name : "Somalia", box : [40.98, -1.68, 51.13, 12.02] },
			{ id : "RS", name : "Serbia", box : [18.83, 42.25, 22.99, 46.17] },
			{ id : "SR", name : "Suriname", box : [-58.04, 1.82, -53.96, 6.03] },
			{ id : "SK", name : "Slovakia", box : [16.88, 47.76, 22.56, 49.57] },
			{ id : "SI", name : "Slovenia", box : [13.7, 45.45, 16.56, 46.85] },
			{ id : "SE", name : "Sweden", box : [11.03, 55.36, 23.9, 69.11] },
			{ id : "SZ", name : "Swaziland", box : [30.68, -27.29, 32.07, -25.66] },
			{ id : "SY", name : "Syria", box : [35.7, 32.31, 42.35, 37.23] },
			{ id : "TD", name : "Chad", box : [13.54, 7.42, 23.89, 23.41] },
			{ id : "TG", name : "Togo", box : [-0.05, 5.93, 1.87, 11.02] },
			{ id : "TH", name : "Thailand", box : [97.38, 5.69, 105.59, 20.42] },
			{ id : "TJ", name : "Tajikistan", box : [67.44, 36.74, 74.98, 40.96] },
			{ id : "TM", name : "Turkmenistan", box : [52.5, 35.27, 66.55, 42.75] },
			{ id : "TL", name : "East Timor", box : [124.97, -9.39, 127.34, -8.27] },
			{ id : "TT", name : "Trinidad and Tobago", box : [-61.95, 10.0, -60.9, 10.89] },
			{ id : "TN", name : "Tunisia", box : [7.52, 30.31, 11.49, 37.35] },
			{ id : "TR", name : "Turkey", box : [26.04, 35.82, 44.79, 42.14] },
			{ id : "TW", name : "Taiwan", box : [120.11, 21.97, 121.95, 25.3] },
			{ id : "TZ", name : "Tanzania", box : [29.34, -11.72, 40.32, -0.95] },
			{ id : "UG", name : "Uganda", box : [29.58, -1.44, 35.04, 4.25] },
			{ id : "UA", name : "Ukraine", box : [22.09, 44.36, 40.08, 52.34] },
			{ id : "UY", name : "Uruguay", box : [-58.43, -34.95, -53.21, -30.11] },
			{ id : "US", name : "United States", box : [-125.0, 25.0, -66.96, 49.5] },
			{ id : "UZ", name : "Uzbekistan", box : [55.93, 37.14, 73.06, 45.59] },
			{ id : "VE", name : "Venezuela", box : [-73.3, 0.72, -59.76, 12.16] },
			{ id : "VN", name : "Vietnam", box : [102.17, 8.6, 109.34, 23.35] },
			{ id : "VU", name : "Vanuatu", box : [166.63, -16.6, 167.84, -14.63] },
			{ id : "PS", name : "West Bank", box : [34.93, 31.35, 35.55, 32.53] },
			{ id : "YE", name : "Yemen", box : [42.6, 12.59, 53.11, 19.0] },
			{ id : "ZA", name : "South Africa", box : [16.34, -34.82, 32.83, -22.09] },
			{ id : "ZM", name : "Zambia", box : [21.89, -17.96, 33.49, -8.24] },
			{ id : "ZW", name : "Zimbabwe", box : [25.26, -22.27, 32.85, -15.51] }
		],
		// Return the country code giving its name
		getCountryCode : function (pCountry)
		{
			var vNormalizedCountry = pCountry.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase();
		
			var vFound = wiki.geolocation.countries.find (function (pEntry)
			{
				return pEntry.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase() === vNormalizedCountry;
			});
			
			if (vFound) return vFound.id;
			else return undefined;
		},
		// Return the country's bounding box giving its name
		getCountryBox : function (pCountry)
		{
			var vNormalizedCountry = pCountry.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase();
		
			var vFound = wiki.geolocation.countries.find (function (pEntry)
			{
				return pEntry.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase() === vNormalizedCountry;
			});
			
			if (vFound) return vFound.box;
			else return undefined;
		},
		// Return the country name giving its country code
		getCountry : function (pCode)
		{			
			var vFound = wiki.geolocation.countries.find (function (pEntry)
			{
				return pEntry.id.toLowerCase() === pCode.toLowerCase ();
			});
			
			if (vFound) return vFound.name;
			else return undefined;
			
			return vCode;
		},
		// Return the format of the data : "array" or "FeatureCollection"
		getDataFormat : function (pData)
		{
			var vFormat = undefined;
		
			if (Array.isArray (pData)) vFormat = "array";
			else
			if (typeof (pData) == "object")
			{
				if (pData.type == "FeatureCollection") vFormat = "FeatureCollection";
			}
			else
				wiki.geolocation.log ("Cannot determine the data format of ", pData + ".");
				
			return vFormat;
		},
		// Return the array of geolocalized elements from the data
		getPlaces : function (pData, pType = undefined) // pType = json, geojson or geocodejson
		{
			var vFormat = undefined;
		
			switch (pType)
			{
				case "json" : 
					vFormat = "array";
				break;
				case "geojson" : 
				case "geocodejson" : 
					vFormat = "FeatureCollection";
				break;
				default : 
					vFormat = wiki.geolocation.getDataFormat (pData);
				break;
			}
		
			switch (vFormat)
			{
				case "array" :
					return pData;
				break;
				case "FeatureCollection" :
					return pData.features;
				break;
				default :
					wiki.geolocation.log ("Cannot get places from data : ", pData);
					return undefined;
				break;
			}
		},
		// Compute recursively the bounding box of input data (array of array of ... polygons or a single point)
		_getBoundingBox (pCoordinates)
		{
			var vBoundingBox = [ { lat : undefined, lng : undefined }, { lat : undefined, lng : undefined } ];
		
			// If pCoordinates is s a point
		
			if (!Array.isArray (pCoordinates[0])) 
			{
				return [ { lat : pCoordinates[1], lng : pCoordinates[0] }, { lat : pCoordinates[1], lng : pCoordinates[0] } ];
			}
	
			// If pCoordinates is an array of points or array of polygons
			
			var vSubBoundingBox;
		
			for (var i = 0 ; i < pCoordinates.length ; i++)
			{				
				vSubBoundingBox = wiki.geolocation._getBoundingBox (pCoordinates[i]);
								
				if ((vBoundingBox[0].lat && vSubBoundingBox[0].lat < vBoundingBox[0].lat) || !vBoundingBox[0].lat)
				{
					vBoundingBox[0].lat = vSubBoundingBox[0].lat;
				}
				
				if ((vBoundingBox[0].lng && vSubBoundingBox[0].lng < vBoundingBox[0].lng) || !vBoundingBox[0].lng)
				{
					vBoundingBox[0].lng = vSubBoundingBox[0].lng;
				}
				
				if ((vBoundingBox[1].lat && vSubBoundingBox[1].lat > vBoundingBox[1].lat) || !vBoundingBox[1].lat)
				{
					vBoundingBox[1].lat = vSubBoundingBox[1].lat;
				}
				
				if ((vBoundingBox[1].lng && vSubBoundingBox[1].lng > vBoundingBox[1].lng) || !vBoundingBox[1].lng)
				{
					vBoundingBox[1].lng = vSubBoundingBox[1].lng;
				}
			}

			return vBoundingBox;
		},
		// Return the bounding box of the data provived by the geolocation service or compute it from the data
		getBoundingBox : function (pData)
		{	
			wiki.geolocation.log ("* getBoundingBox", pData);
		
			var vRes;
		
			if (pData.bbox)
			{
				wiki.geolocation.log ("- bbox found");
				vRes = L.latLngBounds (L.latLng(pData.bbox[1], pData.bbox[0]), L.latLng (pData.bbox[3], pData.bbox[2]));
			}
			else
			if (pData.boundingbox)
			{
				wiki.geolocation.log ("- boundingbox found");
				vRes = L.latLngBounds (L.latLng(pData.boundingbox[0], pData.boundingbox[2]), L.latLng (pData.boundingbox[1], pData.boundingbox[3])); 
			}
			else
			if (vGeometry = wiki.geolocation.getGeometry (pData))
			{
				wiki.geolocation.log ("- geometry found");
				var vBoundingBox = wiki.geolocation._getBoundingBox (vGeometry.coordinates);
				
				vRes = L.latLngBounds (L.latLng(vBoundingBox[0].lat, vBoundingBox[0].lng), L.latLng (vBoundingBox[1].lat, vBoundingBox[1].lng));
			}
		
			wiki.geolocation.log ("- BoundingBox is ", vRes);
		
			return vRes;
		},
		// Set the bounding box of the data
		setBoundingBox : function (pData, pBoundingBox)
		{
			pData.bbox = pBoundingBox;
		},
		// Get the centroid of the data provided by the geolocation service or compute it from the bounding box
		getCentroid : function (pData, pUseBoundingBox = false)
		{
			wiki.geolocation.log ("* getCentroid", pData);
		
			var vRes = undefined;
		
			if (!pUseBoundingBox)
			{
				if (pData.lat && pData.lng)
					vRes = { lat : pData.lat, lng : pData.lng };
				else
				{
					var vGeometry = pData.geojson || pData.geometry;
					
					if (vGeometry && vGeometry.type == "Point")
					{
						vRes = { lat : vGeometry.coordinates[1], lng : vGeometry.coordinates[0] };
					}
				}
			}
			
			if (!vRes)
			{
				var vBoundingBox = wiki.geolocation.getBoundingBox (pData);
				
				if (vBoundingBox)
				{
					vRes = { lat : ((vBoundingBox._northEast.lat+vBoundingBox._southWest.lat)/2), lng : ((vBoundingBox._northEast.lng+vBoundingBox._southWest.lng)/2) };
				}
			}
					
			wiki.geolocation.log ("* Centroid is ", vRes);
					
			return vRes;
		},
		// Return the geolocation place ID of a single entry
		getPlaceID : function (pData)
		{
			var vRes = _t("GEOLOCATION_UNKWOWN_PLACEID");
		
			if (pData.place_id) vRes = pData.place_id;
			else
			if (pData.properties)
			{
				if (pData.properties.place_id) vRes = pData.properties.place_id;
				else
				if (pData.properties.geocoding && pData.properties.geocoding.place_id)
					vRes = pData.properties.geocoding.place_id;
			}

			return vRes;		
		},
		// Return the label of a single entry		
		getLabel : function (pData)
		{
			var vRes = "";
		
			if (pData.display_name) vRes = pData.display_name;
			else
			if (pData.properties)
			{
				if (pData.properties.display_name) vRes = pData.properties.display_name;
				else
				if (pData.properties.geocoding && pData.properties.geocoding.label)
					vRes = pData.properties.geocoding.label;
			}
			
			if (vRes == "")
			{
				var vCentroid = wiki.geolocation.getCentroid (pData);
				
				if (vCentroid)
					vRes = _t("GEOLOCATION_LATITUDE") + " = " + vCentroid.lat + ", " + _t("GEOLOCATION_LONGITUDE") + " = " + vCentroid.lng;
				else
					vRes = wiki.geolocation.getPlaceID (pData);
			}
			
			return vRes;
		},
		// Return the geometry of a single entry
		getGeometry : function (pData)
		{
			return pData.geojson || pData.geometry;
		},
		/////////////////////////////
		// geolocator class
		// A geolocator is used to geolocate an address
		// method : geolocate (see prototype)
		// @param :
		//	* pAddress : the adress as a <string> or as an <object> with the following optional string fields : street, postalCode, city, county, state, country
		//	* pOptions
		//		{
		//			limit : <number>, - maximum entries to return
		// 			found : <function> (pQuery, pData), - callback used when the searched address was found
		//			notfound : <function> (pQuery), - callback used when the searched address was found
		//			error : <function> (pQuery, pError) - callback used when a query went in error
		//		}
		// 
		/////////////////////////////
		geolocater : function (pAddress, pOptions)
		{
			 wiki.geolocation.log("* geolocater", pAddress, pOptions);
		
			var vMe = this;
		
			this.options =
			{ 
				query : ((typeof (pAddress) == "string")?pAddress:undefined),			// Query as a string
				limit : wiki.geolocation.geolocaterLimit,
				found : ((typeof (pOptions) == "function")?pOptions:undefined), 		// Callbacks
				notFound : ((typeof (pOptions) == "function")?pOptions:undefined),		//	...
				error : ((typeof (pOptions) == "function")?pOptions:undefined),			//	...
				street : "", 		// Query as object
				postalCode : "",	// ...
				city : "",			// ...
				county : "",		// ...
				state : "",			// ...
				country : "",		// ...
				data : undefined, 	// user-defined data to be sent back in callbacks
				geodataFormat : "geocodejson",
				queryOptions : "polygon_geojson=1&address_details=1" // Nominatim's query options				
			};

			// Extend options with given parameters

			if (typeof (pAddress) == "object") $.extend (this.options, pAddress);		
			if (typeof (pOptions) == "object") $.extend (this.options, pOptions);
		},
		////////////////////////////////////////////////////
		// Declare a set of adress inputs to be autocompleted
		// @params : 
		//	* pInputs : <object> with optional <jquery object> fields (fields's name are self explanatory)
		//		{
		//			street : <jquery object>
		//			postalCode : <jquery object>
		//			city : <jquery object>
		//			county : <jquery object>
		//			state : <jquery object>
		//			country : <jquery object>
		//		}
		//	* pOptions : <object>
		//		{
		//			selected : <function> (pInput, pValue) - callback used when one input's autocompleted entry was selected
		//		}
		//
		////////////////////////////////////////////////////
		autocomplete : function (pInputs, pOptions)
		{	
			wiki.geolocation.log("* autocomplete", pInputs, pOptions);
		
			var vOptions =
			{		
				selected : undefined // callblack (pInput, pValue)
			};
			
			$.extend (vOptions, pOptions);
		
			var vDefaultCountry = "France";
			
			// In order to clear fields when values are no more coherent,
			// we use one of the input to store the previous values
			
			var vStorage = pInputs.street || pInputs.postalCode || pInputs.city || pInputs.county || pInputs.state || pInputs.country; 
			
			var vInputs = pInputs;
			
			// Functions used to clear fields when they are no more coherent with other fields
			
			function resetCity ()
			{
				if (vInputs.postalCode) vInputs.postalCode.val("");
			   	if (vInputs.city) vInputs.city.val("");
			}
			
			function resetCounty ()
			{
				resetCity();
				if (vInputs.county) vInputs.county.val("");
			}

			function resetState ()
			{
				resetCounty();
				if (vInputs.state) vInputs.state.val("");
			}
			
			function resetCountry ()
			{
				resetState();
				if (vInputs.country) vInputs.country.val("");
			}
			
			// A builder for the callbacks used once the user selected an autocompleted entry
			
			function vAfterSelecter (pField)
			{
				var vField = pField;
								
				return function (pItem)
				{		
					 wiki.geolocation.log("* afterselecter", pItem, vField);
				
					// Reset infos which are no more coherent with previous values.
				
					if (pItem.city)
					{
						var vCity = vStorage.data ("geolocationCity");
						
						if (vCity && vCity !== pItem.city) resetCity();
						
						vStorage.data ("geolocationCity", pItem.city);
					}
					
					if (pItem.county)
					{
						var vCounty = vStorage.data ("geolocationCounty");
						
						if (vCounty && vCounty !== pItem.county) resetCounty();
						
						vStorage.data ("geolocationCounty", pItem.county);
					}
					
					if (pItem.state)
					{
						var vState = vStorage.data ("geolocationState");
						
						if (vState && vState !== pItem.state) resetState ();

						vStorage.data ("geolocationState", pItem.state);
					}
					
					if (pItem.country)
					{
						var vCountry = vStorage.data ("geolocationCountry");
						
						if (vCountry && vCountry !== pItem.country) resetCountry ();

						vStorage.data ("geolocationCountry", pItem.country);
					}
							
					// Update the inputs with the given information
				
					if (pInputs.postalCode && pItem.postalCode) pInputs.postalCode.val(pItem.postalCode);
				   	if (pInputs.city && pItem.city) pInputs.city.val(pItem.city);
					if (pInputs.county && pItem.county) pInputs.county.val (pItem.county);
					if (pInputs.state && pItem.state) pInputs.state.val (pItem.state);
				   	if (pInputs.country && pItem.country) pInputs.country.val(pItem.country);
						
					if (vOptions.selected) vOptions.selected (pInputs[vField], pInputs[vField].val ());
				}
			}
			
			// Initialize input's infos if text is alreadu present
			
			var t;
			
			if (vInputs.postalCode && (t = vInputs.postalCode.val().split () != ""))
				vStorage.data ("geolocationPostalCode", t);
			if (vInputs.city && (t = vInputs.city.val().split () != ""))
				vStorage.data ("geolocationCity", t);
			if (vInputs.county && (t = vInputs.county.val().split () != ""))
				vStorage.data ("geolocationCounty", t);
			if (vInputs.state && (t = vInputs.state.val().split () != ""))
				vStorage.data ("geolocationState", t);
			if (vInputs.country && (t = vInputs.country.val().split () != ""))
				vStorage.data ("geolocationCountry", t);
			
			// AUTOCOMPLETE STREET
			
			if (pInputs.street != undefined ) 
			{
				pInputs.street.removeAttr("autocomplete");
				
				/* ... NOT YET IMPLEMENTED */
			}

			// AUTOCOMPLETE POSTAL CODE

			if (pInputs.postalCode !== undefined)
			{
				pInputs.postalCode.attr("autocomplete", "off");
			
				var vPostalCodeSource = function(pInput, pCallback)
				{
					 wiki.geolocation.log("* vPostalCodeSource", pInput, pCallback);
				
					var vCountry = pInputs.country ? pInputs.country.val ().trim () : vDefaultCountry;			
					if (vCountry == "") vCountry = vDefaultCountry;
					var vCountryCode = wiki.geolocation.getCountryCode (vCountry);
				
					var vPostalCode = pInput.trim ();
				
					var vResults = [];
					
					switch (vCountry.toLowerCase ())
					{
						case "france" :
						{					
							if (vPostalCode.length === 5)
							{
								$.get("https://geo.api.gouv.fr/communes?codePostal=" + vPostalCode + "&fields=codesPostaux,departement,region")
								.done(function (pData)
								{
									if (pData.length > 0)
									{			        
										$.each(pData, function (pIndex, pValue)
									  	{								  													      	
											vResults.push
											({
												id: vPostalCode, 
												name: vPostalCode + " " + pValue.nom, 
												postalCode : vPostalCode, 
												cityCode : pValue.code, 
												city : pValue.nom, 
												countyCode : pValue.departement.code,
												county : pValue.departement.nom, 
												stateCode : pValue.region.code, 
												state : pValue.region.nom, 
												countryCode : vCountryCode,
												country : vCountry											
											 });
										});
							  		}
									else
									{
										vResults[0] = { id : pInput, name: _t('BAZ_POSTAL_CODE_NOT_FOUND', { input : pInput }) };
									} 
									
									pCallback (vResults);								
								});
							}
							else
							{
								vResults[0] = { id: pInput, name: _t('BAZ_POSTAL_CODE_HINT')};
								pCallback(vResults);
							}
						}
						break;
					}
					
					return vResults;
				}
			
				pInputs.postalCode.typeahead
				({
					source: vPostalCodeSource,
			  		minLength: 1, // The minimum length is controlled by source
					items: 'all',
					autoSelect: true,
					matcher : function (pItem)
					{
				 		if (pItem.id !== undefined)
				 		{
							return (pItem.id === this.query);
				 		}
				 		else
					 		return true;
				 	},
					afterSelect : vAfterSelecter ("postalCode")
				});
			}
			
			// AUTOCOMPLETE CITY
			
			if (pInputs.city !== undefined)
			{
				pInputs.city.attr("autocomplete", "off");
			
				var vCitySource = function(pInput, pCallback)
				{
					 wiki.geolocation.log("* vCitySource", pInput, pCallback);
					
					var vCountry = pInputs.country ? pInputs.country.val ().trim () : vDefaultCountry;			
					if (vCountry == "") vCountry = vDefaultCountry;
					var vCountryCode = wiki.geolocation.getCountryCode (vCountry);
				
					var vCity = pInput.trim ();
				
					var vResults = [];
					
					switch (vCountry.toLowerCase ())
					{
						case "france" :
						{					
							if (vCity.length >= 3)
							{
								$.get("https://geo.api.gouv.fr/communes?nom=" + vCity + "&fields=codesPostaux,departement,region")
								.done(function (pData)
								{
									if (pData.length > 0)
									{			        
										$.each(pData, function (pIndex, pValue)
									  	{
									  		var vCityCode = pValue.code;
									  		var vCity = pValue.nom;
									  		var vCounty = pValue.departement.nom;
									  		var vState = pValue.region.nom;
									  											
											$.each (pValue.codesPostaux, function (pIndex, pPostalCode)
											{				      	
												vResults.push 
												({
													id: pPostalCode, 
													name: pPostalCode + " " + pValue.nom, 
													postalCode : pPostalCode, 
													cityCode : pValue.code, 
													city : pValue.nom, 
													countyCode : pValue.departement.code,
													county : pValue.departement.nom, 
													stateCode : pValue.region.code, 
													state : pValue.region.nom, 
													countryCode : vCountryCode,
													country : vCountry											
												 });											
											});
										});
							  		}
									else
									{
										vResults[0] = { id : pInput, name: _t('BAZ_TOWN_NOT_FOUND', { input : pInput }) };
									} 
									
									pCallback (vResults);								
								});
							}
							else
							{
								vResults[0] = { id: pInput, name: _t('BAZ_TOWN_HINT')};
								pCallback(vResults);
							}
						}
						break;						
					}
				
					return vResults;
				}
			
				pInputs.city.typeahead
				({
					source: vCitySource,
			  		minLength: 1, // The minimum length is controlled by source
					items: 'all',
					autoSelect: true,
					matcher : function (pItem)
					{
				 		if (pItem.city !== undefined)
				 		{			 				 		
							return (pItem.city.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase().indexOf (this.query.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase()) != -1);
				 		}
				 		else
					 		return true;
				 	},
					afterSelect : vAfterSelecter ("city")
				});		
			}
			
			// AUTOCOMPLETE COUNTY
			
			if (pInputs.county !== undefined)
			{
				pInputs.county.attr("autocomplete", "off");
					
				var vCountySource = function(pInput, pCallback)
				{
					 wiki.geolocation.log("* vCountySource", pInput, pCallback);
				
					var vCountry = pInputs.country ? pInputs.country.val ().trim () : vDefaultCountry;			
					if (vCountry == "") vCountry = vDefaultCountry;
					var vCountryCode = wiki.geolocation.getCountryCode (vCountry);
				
					var vCounty = pInput.trim ();
				
					var vResults = [];
					
					switch (vCountry.toLowerCase ())
					{
						case "france" :
						{					
							if (vCounty.length >= 2)
							{
								var vInput = parseInt (vCounty);
								var vField = "code";
								
								if (isNaN (vInput)) 
								{
									vInput = vCounty;
									vField = "nom";
								}

								$.get("https://geo.api.gouv.fr/departements?" + vField + "=" + vInput + "&fields=region")
								.done(function (pData)
								{
									if (pData.length > 0)
									{			        
										$.each(pData, function (pIndex, pValue)
									  	{
											vResults.push
											({
													id: pValue.code, 
													name: pValue.nom + " (" + pValue.code + ")", 
													countyCode : pValue.code,
													county : pValue.nom, 
													stateCode : pValue.region.code, 
													state : pValue.region.nom, 
													countryCode : vCountryCode,
													country : vCountry											
											 });										
										});
							  		}
									else
									{
										vResults[0] = { id : pInput, name: _t('BAZ_COUNTY_NOT_FOUND', { input : pInput }) };
									} 
									
									pCallback (vResults);								
								});
							}
							else
							{
								vResults[0] = { id: pInput, name: _t('BAZ_COUNTY_HINT')};
								pCallback(vResults);
							}
						}
						break;						
					}
				
					return vResults;
				}
			
				pInputs.county.typeahead
				({
					source: vCountySource,
			  		minLength: 1, // The minimum length is controlled by source
					items: 'all',
					autoSelect: true,
					matcher : function (pItem)
					{
				 		if (pItem.county !== undefined)
				 		{			 				 		
				 			if (isNaN (this.query))			 					 		
								return (pItem.county.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase().indexOf (this.query.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase()) != -1);
							else
								return this.query == pItem.countyCode;
				 		}
				 		else
					 		return true;
				 	},
					afterSelect : vAfterSelecter ("county")
				});
			}
			
			// AUTOCOMPLETE STATE
			
			if (pInputs.state !== undefined)
			{
				pInputs.state.attr("autocomplete", "off");

				var vStateSource = function(pInput, pCallback)
				{
					 wiki.geolocation.log("* vStateSource", pInput, pCallback);
				
					var vCountry = pInputs.country ? pInputs.country.val ().trim () : vDefaultCountry;			
					if (vCountry == "") vCountry = vDefaultCountry;
					var vCountryCode = wiki.geolocation.getCountryCode (vCountry);
				
					if (vCountry == "") vCountry = vDefaultCountry;
				
					var vState = pInput.trim ();
				
					var vResults = [];
					
					switch (vCountry.toLowerCase ())
					{
						case "france" :
						{					
							if (vState.length >= 2)
							{
								$.get("https://geo.api.gouv.fr/regions?nom=" + vState)
								.done(function (pData)
								{
									if (pData.length > 0)
									{			        
										$.each(pData, function (pIndex, pValue)
									  	{
									  		var vState = pValue.nom;
									  		var vStateCode = pValue.code;
									  					      	
											vResults.push
											({
													id: pValue.code, 
													name: pValue.nom,  
													stateCode : pValue.code, 
													state : pValue.nom, 
													countryCode : vCountryCode,
													country : vCountry											
											 });	
										});
							  		}
									else
									{
										vResults[0] = { id : pInput, name: _t('BAZ_STATE_NOT_FOUND', { input : pInput }) };
									} 
									
									pCallback (vResults);								
								});
							}
							else
							{
								vResults[0] = { id: pInput, name: _t('BAZ_STATE_HINT')};
								pCallback(vResults);
							}
						}
						break;						
					}
				
					return vResults;
				}
			
				pInputs.state.typeahead
				({
					source: vStateSource,
			  		minLength: 1, // The minimum length is controlled by source
					items: 'all',
					autoSelect: true,
					matcher : function (pItem)
					{
				 		if (pItem.state !== undefined)
				 		{			 				 			
				 			return (pItem.state.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase().indexOf (this.query.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase()) != -1);					
				 		}
				 		else
					 		return true;
				 	},
					afterSelect : vAfterSelecter ("state")
				});
			}
			
			// AUTOCOMPLETE COUNTRY
			
			if (pInputs.country !== undefined)
			{
				pInputs.country .attr("autocomplete", "off");
				
				var vCountrySource = function(pInput, pCallback)
				{
					 wiki.geolocation.log("* vCountrySource", pInput, pCallback);				
				
					var vResults = wiki.geolocation.countries.map (function (v) { return { id : v.id, name : v.name, countryCode : v.id, country : v.name };});

					pCallback (vResults);
				}
			
				pInputs.country 
				.typeahead
				({
			  		source: vCountrySource,
			  		minLength: 1, // The minimum length is controlled by source
					items: 'all',
					autoSelect: true,
			  		matcher : function (pItem)
					{
				 		if (pItem.name !== undefined)
				 		{			 				 			
				 			return (pItem.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase().indexOf (this.query.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace (/[-]/g, " ").toLowerCase()) != -1);					
				 		}
				 		else
					 		return true;
				 	},
					afterSelect : vAfterSelecter ("country")
				});	
			}		
		},	
		///////////////////////////////
		// Get the browser geolocation
		// @params : 
		//	* pParameters = <function> (pLatitude, pLongitude) - callback used when coordinates were found
		//					or <object> - options to be used - see comments below
		/////////////////////////////
		browserGeolocation : function (pParameters)
		{
			wiki.geolocation.log("* browserGeolocation", pParameters);				
		
			var vOptions =
			{
				enableHighAccuracy: true,
				timeout: 60000,
				maximumAge: 0,		
				success : (typeof (pParameters) == "function")?pParameters:undefined,
				error : (typeof (pParameters) == "function")?pParameters:undefined
			};
		
			if (typeof (pParameters) == "object")
				$.extend (true, vOptions, pParameters);
		
			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition (
					function (pPosition)
				   	{	
			   			wiki.geolocation.log("* browserGeolocation success callback", pPosition);				
			   	
						if (vOptions.success) vOptions.success (pPosition);
					}, 
					function (pError)
					{					
						wiki.geolocation.log("* browserGeolocation error callback", pError);				
						
						if (vOptions.error) vOptions.error (pError);
					},
					vOptions);
			}	
			else
			{
				vOptions.success ();
			}
		},
		///////////////////////////
		// Create a leaflet map
		// @params
		//	* pID : <string> - ID of the HTML container element
		//	* pOptions : <object> - map creation options
		////////////////////////	
		map : function (pID, pOptions)
		{		
			wiki.geolocation.log("* Create map for #" + pID);		
		
			var vOptions = $.extend (true, {}, wiki.map.options,
			{				
				center : new L.latLng(pOptions.latitude?pOptions.latitude.val ():0, pOptions.longitude?pOptions.longitude.val ():0),
				zoom : 4
			});
			
			$.extend (true, vOptions, pOptions);
			
			wiki.geolocation.log(" - options : ", pOptions);
			
			var vContainer = $("#" + pID);
			
			var vMap = vContainer.ywGetMap ();
			
			// If the container's map object is not yet created, let's create it
			
			if (!vMap)
			{			
				vMap = new L.Map(pID, vOptions);

				var vProvider = L.tileLayer.provider(vOptions.provider, vOptions.credentials);

				vMap.addLayer(vProvider);
				
				vMap.setView (vOptions.center, vOptions.zoom);	
				
				vMap.ywTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(vMap);
								
				vMap.ywGeoJSONs = new Array ();
				vMap.ywMarkers = new Array ();
				
				$("#" + pID).ywSetMap (vMap);
			}
			
			// Return the container's map object
			
			return vMap;
		},
		//////////////////////////////////////
		// Declare a geolocalisation form with inputs that can autocomplete, button to geolocate and map to display geolocalised information of map
		//  @params
		//		pInputs = form objects				
		//		{ 
		//			street :
		//			street1 :
		//			street2 :
		//			postalCode :
		//			city :
		//			county :
		//			state :
		//			country :
		//			latitude : latitude jquery object
		//			longitude : longitude jquery object
		//			geolocate : geolocate button			
		//		}
		// 		pOptions = 
		//		{
		//			toAutocomplete : "postalCode, city, county, state, country", // Inputs to be autocompleted
		//			geolocateButton : undefined // The geolocation button
		//			loader : { image : wiki.ajax.loader.image, width : wiki.ajax.loader.width, height : wiki.ajax.loader.height } // loader
		//			autocomplete :
		//			{				
		//				selected : undefined // callback function (pInput, pValue) used when an autocompleted entry is selected
		//			},
		//			search :
		//			{
		//				found : undefined, 		// callback (pQuery, pData) used when the searched address was found
		//				notfound : undefined, 	// callback (pQuery) used when the searched address was found
		//				error : undefined		// callback (pQuery, pError) used when a query when in error
		//			},
		//			render :
		//			{
		//				mapID : undefined			// ID of the map container
		//				mapContainer : undefined,	// jQuery map object
		//				mapObject : undefined,		// leaflet map object
		//				marker : undefined,			// marker
		//				render : undefined			// callback (pData, vOptions)
		//				mapOptions : undefine		// Object to be passed as options for the map
		//			}
		//		}
		form : function (pInputs, pOptions)
		{
			wiki.geolocation.log("* form", pInputs, pOptions);		
		
			var vOptions = 
			{
				limit : 1, // Number of entries the form have to deal with
				geolocateNow : false, // Whether we want to geolocate at the end of form creation (need some valid values in latitude and longitude fields)
				renderNow : true, // Whether we want to render at the end of form creation (need some valid values in latitude and longitude fields)
				toAutocomplete : "street, postalCode, city, county, state, country", // Inputs to be autocompleted
				geolocateButton : undefined, // The geolocation button
				loader : // loader
				{ 
					image : wiki.ajax.loader.image, 
					width : wiki.ajax.loader.width, 
					height : wiki.ajax.loader.height
				}, 
				autocomplete :
				{				
					selected : undefined // callback function (pInput, pValue) used when an autocompleted entry is selected
				},
				search :
				{
					found : undefined, 		// callback (pQuery, pData) used when the searched address was found
					notfound : undefined, 	// callback (pQuery) used when the searched address was found
					error : undefined		// callback (pQuery, pError) used when a query when in error
				},
				render :
				{			
					inputs : pInputs,	
					mapID : undefined,
					mapOptions : undefined, 
					onRender : undefined		// callback (pData, vOptions) used at the end of the rendering process
				}
			};
				
			$.extend (true, vOptions, pOptions);
			
			var vMapContainer;
				
			if (vOptions.render.mapID) vMapContainer = $("#" + vOptions.render.mapID);
			if (vMapContainer.length == 0) vMapContainer = undefined;
				
			// Autocompletion work variables
				
			var vAutocompleteSplitted, vToAutocomplete;
			
			// The geolocation callback to be used when we want to search the address
		
			function vGeolocateCallback ()
			{				
				wiki.geolocation.log("* form vGeolocateCallback");		
				
				// Get a loader and display it

				wiki.geolocation.log("* form vGeolocateCallback get a loader");		
						
				var vLoader = vOptions.loader || {};
				
				if ((!vLoader || !vLoader.object) && vMapContainer)
				{				
					var vMapContainerLoader = vMapContainer.data ("geolocationLoader");
				
					if (vMapContainerLoader) $.extend (vLoader, vMapContainerLoader);			
				}
				
				if (!vLoader.object)
				{
					vLoader.object = $('<img class="geolocation-loader" src="' + vOptions.loader.image + '/>"');				
				}
					
				if (vMapContainer) vMapContainer.data ("geolocationLoader", vLoader);
					
				if (vMapContainer) vLoaderContainer = vMapContainer;
				else vLoaderContainer = $("body");

				var vLoaderContainerWidth = vLoaderContainer.width ();
				var vLoaderContainerHeight = vLoaderContainer.height ();
				vTop = (vLoaderContainerHeight-vLoader.width)/2;
				vLeft = (vLoaderContainerWidth-vLoader.height)/2;

				vLoader.object
				.appendTo (vLoaderContainer)
				.width (vLoader.width)
				.height (vLoader.height)
				.css ({position:"absolute", top: vTop, left:vLeft, zIndex:9999999})
				.show ();
				
				// Build the search adress to pass to the geolocater

				wiki.geolocation.log("* form vGeolocateCallback build the search");		

				var vAddress = {};

				var vStreet = (pInputs.street&&(pInputs.street instanceof jQuery)&&pInputs.street.length > 0?pInputs.street.val().trim ():"");
				var vStreet1 = (pInputs.street1&&(pInputs.street1 instanceof jQuery)&&pInputs.street1.length > 0?pInputs.street1.val().trim ():"");
				var vStreet2 = (pInputs.street2&&(pInputs.street2 instanceof jQuery)&&pInputs.street2.length > 0?pInputs.street2.val().trim ():"");
				var vPostalCode = (pInputs.postalCode&&(pInputs.postalCode instanceof jQuery)&&pInputs.postalCode.length > 0?pInputs.postalCode.val().trim ():"");
				var vCity = (pInputs.city&&(pInputs.city instanceof jQuery)&&pInputs.city.length > 0?pInputs.city.val().trim ():"");
				var vCounty = (pInputs.county&&(pInputs.county instanceof jQuery)&&pInputs.county.length > 0?pInputs.county.val().trim ():"");
				var vState = (pInputs.state&&(pInputs.state instanceof jQuery)&&pInputs.state.length > 0?pInputs.state.val().trim ():"");
				var vCountry = (pInputs.country&&(pInputs.country instanceof jQuery)&&pInputs.country.length > 0?pInputs.country.val().trim ():"");

				// Let's understand the way the user specify the address
					
				if (vPostalCode == "" && vCity == "" && vCounty == "" && vState == "" && vCountry == "")			
				{								
					// if there is nothing to search, let's see if we can retrieve a latitude and a longitude to render on the map
				
					if (vStreet == "" && vStreet1 == "" && vStreet2 == "")
					{
						var vLatitude = (pInputs.latitude)?parseFloat (pInputs.latitude):undefined;
						var vLongitude = (pInputs.longitude)?parseFloat (pInputs.longitude):undefined;						
						 
						// We can render something
						 
						if (vLatitude && vLongitude && vOptions.render.mapID)
						{
							wiki.geolocation.render ([ { lat : vLatitude, lng : vLongitude } ], vOptions.render);
						}			
						
						// "What else ?" - George
												
						return;									
					}
				
					// The user uses just bf_address, bf_address1 and/or bf_address2 to specify the address :				
					// Let's build a string query
					
					var vQuery
					
					vQuery = "";
					
					vQuery = vStreet;
					vQuery = (vQuery != ""?" ":"") + vStreet1;
					vQuery = (vQuery != ""?" ":"") + vStreet2;			
					
					vAddress.query = vQuery;	
				}	
				else
				{
					// The user use adress specific fields (street, postalcode, city, ...) :
					// Let's fill the address with the present fields

					vAddress.street = vStreet;
					vAddress.postalCode = vPostalCode;
					vAddress.city = vCity;
					vAddress.county = vCounty;
					vAddress.state = vState;
					vAddress.country = vCountry;
				}
		
				// Geolocate the search address
					
				// Callbacks function when the original query was found, not found or when a sub query went in error		
		
				// The-adress-was-found callback
		
				wiki.geolocation.log("* form vGeolocateCallback Geolocate the search address");		
		
				var vFound = function (pQuery, pData)
				{			
					wiki.geolocation.log("* form vGeolocateCallback Found callback", pQuery);	
				
					var vData = pData;
				
					// If there is several results, we will prompt the user to choose the appropriate one

					if (vData.length > 1)
					{									
						// First, let's (optionnaly) remove the entries with the same display names so that the user can choose between different choices
						
						if (wiki.geolocation.removeSameDisplayNames) 
							vData = vData.filter ((pEntry1, pIndex) => vData.findIndex ( (pEntry2) => wiki.geolocation.getLabel (pEntry2) === wiki.geolocation.getLabel (pEntry1)) === pIndex );
					
						// If there is still several results, lets'prompt the user which one to choose
					
						if (vData.length > 1)
						{					
							var vText = "";
					
							// Let's build the prompt dialog text
					
							for (var i = 0 ; i < vData.length ; i++)
							{
								vText += "  " + (i+1) + " - \"" + wiki.geolocation.getLabel(vData[i]) + "\"\n\n";
							}

							// Let's ask the user which entry to choose until a valid answer is given or cancel button was clicked
						
							var vNum = -1;
						
							while (vNum == -1)
							{
								var vAnswer = prompt (_t("GEOLOCATION_SEVERAL_GEOLOCATIONS_FOUND", { text : vText }), "");

								// If the user canceled, there is nothing more to do

								if (vAnswer === undefined || vAnswer === null) return;

								// Let's check the validity of the answer
								
								vNum = parseInt (vAnswer);
								
								if (isNaN (vNum) || vNum < 1 || vNum > vData.length)
								{
									vNum = -1;
									alert (_t("GEOLOCATION_SEVERAL_GEOLOCATIONS_FOUND_INVALID_CHOICE", { max : vData.length }));
								}
								else
								{
									// Once it's done, place the choosen result in first position...
								
									var vNewData = [];
									vNewData.push (vData[vNum-1]);
									vData = vData.splice (vNum-1, 1);
									vNewData = vNewData.concat (vData);									   						
								}			
							}			
						}		
					}

					// Let's limit the data to treat
					
					vData = vData.slice (0, vOptions.limit);
					
					// Treat the data
					
					for (var i = 0 ; i < vData.length ; i++)
					{							
						// If we have searched a country, we need to recompute the bounding box to include only the country area and not the administrative area
						// returned by nominatim service.
						// We also update the latitude and longitude to the center of the bounding box
					
						if (pQuery.partial.street == "" && 
							pQuery.partial.postalCode == "" && 
							pQuery.partial.city == "" && 
							pQuery.partial.county == "" && 
							pQuery.partial.state == "" && 
							pQuery.partial.country != "")
						{
							// Let's get the boundinn box...
						
							var vBox = wiki.geolocation.getCountryBox (pQuery.partial.country);
							
							// ...update the data
							
							wiki.geolocation.setBoundingBox (vData[i], vBox);
														
							vData[i].lat = (parseFloat (vBox[3])+parseFloat (vBox[1]))/2+"";
							vData[i].lng = (parseFloat (vBox[2])+parseFloat (vBox[0]))/2+"";
						}
						
						// Update the latitude and longitude inputs
			  			
			  			var vLatitude;
			  			var vLongitude;
			  		
			  			if (Array.isArray (pInputs.latitude) && pInputs.latitude[i])
			  			{
			  				vLatitude = pInputs.latitude[i];
			  			}
			  			else
				  			vLatitude = pInputs.latitude;
				  			
			  			if (Array.isArray (pInputs.longitude) && pInputs.longitude[i])
			  			{
			  				vLongitude = pInputs.longitude[i];
			  			}
			  			else
				  			vLongitude = pInputs.longitude;
				  		
			  			var vCentroid = wiki.geolocation.getCentroid (vData[i]);
			  			
			  			if (vCentroid)
			  			{
							if (vLatitude) vLatitude.val (vCentroid.lat);
				  			if (vLongitude) vLongitude.val (vCentroid.lng);
			  			}			  		
					}
					
					// Save the data to the bf_geodata hidden field so that it can be retrieved later
					
					if (pInputs.geodata) pInputs.geodata.val (JSON.stringify (vData));
					
					// Render the data to the map
				
					wiki.geolocation.render (vData, vOptions.render);
			  			
			  		// We can now hide the loader
			  			
					vLoader.object.hide ();
					
					// If there is a search found callback, let's call it now
					
					if (vOptions.search.found) vOptions.search.found (pQuery, vData);
				}
				
				// The-adress-was-not-found callback
				
				var vNotFound = function (pQuery)
				{
					wiki.geolocation.log("* form vGeolocateCallback Not found callback");	
				
					alert(_t("BAZ_GEOLOC_NOT_FOUND"));

					wiki.geolocation.render ([], vOptions.render);
					
					vLoader.object.hide ();
				}			
								
				// A-query-returns-an-error callback
								
				var vError = function (pQuery, pError)
				{
					wiki.geolocation.log("* form vGeolocateCallback Error callback");	
				
					wiki.geolocation.render ([], vOptions.render);
									
					alert(_t('BAZ_MAP_ERROR',{msg:pMessage}));					
						
					vLoader.object.hide ();
				}

				// Let's build the geolocater options...

				var vGeolocaterOptions = {};
				
				$.extend (true, vGeolocaterOptions, vOptions.search);
				$.extend (true, vGeolocaterOptions, { found : vFound, notFound : vNotFound, error : vError });
				
				// and launch the search.
		
				wiki.geolocation.log("* form vGeolocateCallback Launch the search");	
		
				vGeolocater = new wiki.geolocation.geolocater (vAddress, vGeolocaterOptions);

				vGeolocater.geolocate ();
			}
			
			// Autocompletion :
			
			// Select the inputs to autocomplete
			
			vAutocompleteSplitted = (vOptions.toAutocomplete.trim()!==""?vOptions.toAutocomplete.split (",").map (x => x.trim()):[]);
				
			vToAutocomplete =
			{
				street : (vAutocompleteSplitted.includes ("street")&&pInputs.street&&pInputs.street.length > 0?pInputs.street:undefined),
				street1 : (vAutocompleteSplitted.includes ("street1")&&pInputs.street1&&pInputs.street1.length > 0?pInputs.street1:undefined),
				street2 : (vAutocompleteSplitted.includes ("street2")&&pInputs.street2&&pInputs.street2.length > 0?pInputs.street2:undefined),			
				postalCode : (vAutocompleteSplitted.includes ("postalCode")&&pInputs.postalCode&&pInputs.postalCode.length > 0?pInputs.postalCode:undefined),
				city : (vAutocompleteSplitted.includes ("city")&&pInputs.city&&pInputs.city.length > 0?pInputs.city:undefined),
				county : (vAutocompleteSplitted.includes ("county")&&pInputs.county&&pInputs.county.length > 0?pInputs.county:undefined),
				state : (vAutocompleteSplitted.includes ("state")&&pInputs.state&&pInputs.state.length > 0?pInputs.state:undefined),
				country : (vAutocompleteSplitted.includes ("country")&&pInputs.country&&pInputs.country.length > 0?pInputs.country:undefined)			
			};
			
			// Let's declare the autocompletion for the selected inputs and with the geolocateCallback to be used when a autocomplete entry is selected
			
			wiki.geolocation.log("* form vGeolocateCallback Declare autocomplete");	
			
			vOptions.autocomplete.selected = vGeolocateCallback;
			
			wiki.geolocation.autocomplete (vToAutocomplete, vOptions.autocomplete)		
			
			// Geolocation button
			
			// Let's launch the geolocation callback when the user click on the geolocation button
			
			wiki.geolocation.log("* form vGeolocateCallback Bind the geolocate button");	
			
			pInputs.geolocate.on ("click", vGeolocateCallback);
			
			wiki.geolocation.log("* form vGeolocateCallback Click the geolocate button");	
			
			// If we want to geolocate or render map with coordinates at form creation, it is time to do it
			
			if (vOptions.geolocateNow) pInputs.geolocate.click ();
			else (vOptions.renderNow)
			{
				var vLatitude = (pInputs.latitude)?parseFloat (pInputs.latitude.val()):undefined;
				var vLongitude = (pInputs.longitude)?parseFloat (pInputs.longitude.val()):undefined;
				var vGeoData = (pInputs.geodata)?pInputs.geodata.val():undefined;												
				
				if (vGeoData) vGeoData = JSON.parse (vGeoData);
						 
				// We can render something
						 
				if (vOptions.render.mapID)
				{				
					var vRenderOptions = $.extend (true, {}, vOptions.render, { mapOptions : { zoom : wiki.geolocation.getZoomForAddress (pInputs) }});
				
					if (vGeoData)
						wiki.geolocation.render (vGeoData, vRenderOptions);
					else
					if (vLatitude && vLongitude)				
						wiki.geolocation.render ([ { lat : vLatitude, lng : vLongitude } ], vRenderOptions);
				}			
			}
		},
		clearMap (pMap)
		{
			var vMapObject;
		
			if (pMap instanceof L.Map)
			{
				vMapObject = pMap;
			}
			else
			if (pMap instanceof jQuery)
			{
				vMapObject = pMap.ywGetMap ();
			}
			else
			if (typeof (pMap) == "string")
			{
				vMapObject = $("#" + pMap).ywGetMap ();
			}
			
			if (vMapObject == undefined) return;
			
			for (var i = 0 ; i < vMapObject.ywGeoJSONs.length; i++)
			{
				vMapObject.removeLayer (vMapObject.ywGeoJSONs[i]);
			}

			for (var i = 0 ; i < vMapObject.ywMarkers.length; i++)
			{
				vMapObject.removeLayer (vMapObject.ywMarkers[i]);
			}
			
			vMapObject.ywGeoJSONs = new Array ();
			vMapObject.ywMarkers = new Array ();		
		},
		////////////////////
		// Render the data on a map depending on options
		// @params
		//	* pData : <array> of <object> - the data to render. The Object format is the one used by openstreetmap's service
		//	* pOptions : <object> - renderinf options (see comments below)
		/////////////////
		render : function (pData, pOptions)
		{
			wiki.geolocation.log("* render", pData, pOptions);	
		
			var vOptions =
			{
				inputs : undefined, // associative array containing latitude and longitude inputs
				popup : 
				{
					enabled : false,
					html : function ( pPoint, pData )
					{// /^-?[\d]{1,3}(?:.\d+)?$/
						return (`<div class="input-group" style="margin-bottom: 10px">
									<span class="input-group-addon">Lat</span> 
									<input type="text" class="form-control geolocation-render-popup-latitude" pattern='-?\\\d{1,3}(?:\\\.\\\d+)?' value="${pPoint.lat}" />
									<span class="input-group-addon">Lon</span>
									<input type="text" class="form-control geolocation-render-popup-longitude" pattern="-?\\\d{1,3}(?:\\\.\\\d+)?" value="${pPoint.lng}" />
								</div>` + (vOptions.marker.options.draggable?`<div class="text-center">${vOptions.marker.texts.adjust}</div>`:``));
					},
					options :
					{
		                closeButton: false, 
		                closeOnClick: false,
		                minWidth: 300
		            }
				},
				marker : 
				{
					texts : 
					{
						adjust : "Ajustez la position du marqueur si besoin"			
					},
					options : 
					{
						draggable : false
					}
				},		
				mapID : undefined, // The map container element's ID as <string>
				limit : 1,	// Limit of entries to render
				mapOptions : wiki.map.options,// Map creation options
				onRender : undefined // <function> (pData, vOptions) - callback used after rendering
			};
				
			$.extend (true, vOptions, pOptions);
					
			// Let's get the map container
					
			var vMapID = vOptions.mapID;
			var vMapContainer = $("#" + vMapID);
			if (vMapContainer && vMapContainer.length == 0)
			{
				console.log ("Error : cannot find the container #" + vMapID);
				vMapContainer = undefined;
			}
									
			var vMapObject;
											
			// Let's get the map object of the map container
							
			if (vMapContainer)
			{					
				vMapObject = vMapContainer.ywGetMap ();
			}
		
			// If we still doesn't have it, let's create it with the specified options
		
			if (!vMapObject)
			{
				vMapObject = wiki.geolocation.map (vMapID, vOptions.mapOptions);
			}

			L.setOptions (vMapObject, vOptions.mapOptions);
			
			// Let's clear the map
			
			wiki.geolocation.clearMap (vMapObject);
			
			// Let's limit the number of data to render

			var vData = pData.slice (0, vOptions.limit);

			for (var i = 0 ; i < vData.length ; i++)
			{			
				var vPlace = vData[i];
				
				wiki.geolocation.log ("Place : ", vPlace);
				
				var vGeometry = wiki.geolocation.getGeometry (vPlace);
				
				if (vGeometry && vGeometry.type !== "Point")
				{
					var vGeoJSON = L.geoJSON(vGeometry);
					
					vMapObject.ywGeoJSONs.push (vGeoJSON);
				}

				// Let's get the centroid

				var vCentroid = wiki.geolocation.getCentroid (vPlace);
					
				if (vCentroid)
				{				
					var vMarker = L.marker (L.latLng (vCentroid.lat, vCentroid.lng), vOptions.marker.options);
					
					if (vOptions.popup.enabled)
					{
						vMarker.bindPopup(typeof(vOptions.popup.html == "function")?vOptions.popup.html(vMarker.getLatLng()):vOptions.popup.html, vOptions.popup.options).openPopup();

						$("body").on ("keyup keypress", ".geolocation-render-popup-latitude,.geolocation-render-popup-longitude", 
							function()
							{
								wiki.geolocation.log("* map keyup keypress", arguments);				
									
								//var pattern = /^-?[\d]{1,3}[.][\d]+$/;
								var pattern = /^-?[\d]{1,3}(?:.\d+)?$/
								var thisVal = $(this).val();
								if(!thisVal.match(pattern)) $(this).val($(this).val().replace(/[^\d.]/g,''));
							})
						.on ("blur", ".geolocation-render-popup-latitude,.geolocation-render-popup-longitude", 
							function ()
							{
								wiki.geolocation.log("* map blur", arguments);				
								
								var vLatitude = $(".geolocation-render-popup-latitude").val(); 
								var vLongitude = $(".geolocation-render-popup-longitude").val();
								
								if (vOptions.inputs&&vOptions.inputs.latitude) vOptions.inputs.latitude.val(vLatitude);
		   		                if (vOptions.inputs&&vOptions.inputs.longitude) vOptions.inputs.longitude.val(vLongitude);
								
								var point = L.latLng(vLatitude, vLongitude);
								
								vMarker.setLatLng(point);
									
								vMapObject.invalidateSize();
									
								vMapObject.panTo(point, {animate:true}).zoomIn();
							});
					}

					if (vOptions.marker.options.draggable)
					{					
						vMarker.on("dragend", function(pEvent)
						{
			                this.openPopup();
			                var changedPos = pEvent.target.getLatLng();
			                if (vOptions.inputs&&vOptions.inputs.latitude) vOptions.inputs.latitude.val(changedPos.lat);
	   		                if (vOptions.inputs&&vOptions.inputs.longitude) vOptions.inputs.longitude.val(changedPos.lng);
			                $('.geolocation-render-popup-latitude').val(changedPos.lat);
			                $('.geolocation-render-popup-longitude').val(changedPos.lng);
			            });			            
			        }
					
					vMapObject.ywMarkers.push (vMarker);
				}
					
				// Let's set the bounding box if we get it.

				wiki.geolocation.log ("- The map container size is " + vMapContainer.width () + "x" + vMapContainer.height ());

				if (vMapContainer.is (":visible"))
					wiki.geolocation.log ("- The map container is visible");
				else
					wiki.geolocation.log ("- The map container is invisible");

				var vBoundingBox = wiki.geolocation.getBoundingBox (vPlace);

				if (vBoundingBox)
				{																	
					wiki.geolocation.log ("- Update pan and bounds using the bounding box", vBoundingBox);
										
					vMapObject.invalidateSize();
										
					if (vCentroid) vMapObject.panTo( [ vCentroid.lat, vCentroid.lng ], { animate : false });

					vMapObject.fitBounds (vBoundingBox);
				}						
				else
				{
					wiki.geolocation.log ("- Update pan and bounds using zoom option and centroid", vOptions.mapOptions.zoom, vCentroid);

					vMapObject.invalidateSize();

					if (vOptions.mapOptions.zoom) vMapObject.setZoom (vOptions.mapOptions.zoom);
						
					if (vCentroid) vMapObject.panTo( [ vCentroid.lat, vCentroid.lng ], { animate : true });				
				}											
			}
			
			var i;
			
			for (i = 0 ; i < vMapObject.ywGeoJSONs.length ; i++)			
			{
				vMapObject.addLayer (vMapObject.ywGeoJSONs[i]);
			}
			
			for (i = 0 ; i < vMapObject.ywMarkers.length ; i++)			
			{
				vMapObject.addLayer (vMapObject.ywMarkers[i]);
			}
			/*
								vSelected.boundingbox
			map.fitBounds
			geocodedmarkerRefresh( L.latLng( lat, lon ) );
			geojson
			
			
			 function geocodedmarkerRefresh( point )
		        {
		            if (geocodedmarker) map.removeLayer(geocodedmarker);
		            geocodedmarker = L.marker(point, {draggable:true}).addTo(map);
		            
		            map.setView(point, 18);
		            // map.panTo( geocodedmarker.getLatLng(), {animate:true});
		            $(\'#bf_latitude\').val(point.lat);
		            $(\'#bf_longitude\').val(point.lng);
		    
				    geocodedmarker.bindPopup(popupHtml( geocodedmarker.getLatLng() ), {
		                closeButton: false, 
		                closeOnClick: false,
		                minWidth: 300
		            }).openPopup();
		    
		            geocodedmarker.on("dragend",function(ev){
		                this.openPopup();
		                var changedPos = ev.target.getLatLng();
		                $(\'#bf_latitude\').val(changedPos.lat);
		                $(\'#bf_longitude\').val(changedPos.lng);
		                $(\'.bf_latitude\').val(changedPos.lat);
		                $(\'.bf_longitude\').val(changedPos.lng);
		            });
		        }
			
	var point = L.latLng('.$value[$this->getLatitudeField()].', '.$value[$this->getLongitudeField()]

if (vOptions.marker)
			{
				vOptions.marker.setLatLng([vLatitude, vLongitude]);
			}
			else			
			{
				vOptions.marker = L.marker([pLatitude, pLongitude]).addTo(pMap);
			}

		    geocodedmarker = L.marker(point, {draggable:true}).addTo(map);
						    map.panTo( geocodedmarker.getLatLng(), {animate:true});
						    geocodedmarker.bindPopup(popupHtml( point ), {closeButton: false, closeOnClick: false});
						    geocodedmarker.on("dragend",function(ev){
						        this.openPopup(point);
						        var changedPos = ev.target.getLatLng();
						        $(\'#bf_latitude\').val(changedPos.lat);
						        $(\'#bf_longitude\').val(changedPos.lng);
						        $(\'.bf_latitude\').val(changedPos.lat);
						        $(\'.bf_longitude\').val(changedPos.lng);
						    });
						    ';
						}
					}

			
						
						$(\'body\').on(\'change\', \'.bf_latitude, .bf_longitude\', function(e) {
						    if ($(this).is(":invalid")) {
						        $(\'#bf_latitude\').val(\'\');
						        $(\'#bf_longitude\').val(\'\');
						        alert(_t(\'BAZ_NOT_VALID_GEOLOC_FORMAT\'));
						    } else {
						        $(\'#bf_latitude\').val($(\'.bf_latitude\').val());
						        $(\'#bf_longitude\').val($(\'.bf_longitude\').val());
						        geocodedmarker.setLatLng([$(\'.bf_latitude\').val(), $(\'.bf_longitude\').val()]);
						        map.panTo( geocodedmarker.getLatLng(), {animate:true});
						    }
						});';

	var point = L.latLng('.$value[$this->getLatitudeField()].', '.$value[$this->getLongitudeField()].');
		            geocodedmarker = L.marker(point, {draggable:true}).addTo(map);
		            map.panTo( geocodedmarker.getLatLng(), {animate:true});
		            geocodedmarker.bindPopup(popupHtml( point ), {closeButton: false, closeOnClick: false});
		            geocodedmarker.on("dragend",function(ev){
		                this.openPopup(point);
		                var changedPos = ev.target.getLatLng();
		                $(\'#bf_latitude\').val(changedPos.lat);
		                $(\'#bf_longitude\').val(changedPos.lng);
		                $(\'.bf_latitude\').val(changedPos.lat);
		                $(\'.bf_longitude\').val(changedPos.lng);
		            });

*/
			
			if (vOptions.onRender) vOptions.onRender (vData, vOptions);			
		},
		////////////
		// Return a map zoom that depend on the given adress fields
		// @params
		//	* The adress : <object> with optional <string> or <jquery object> fields : street, postalCode, city, county, state, country
		//		(when a field is used, we determine if it has to be taken into account by checking its value)
		//	* The map container size (not used yet, usefull ?)
		getZoomForAddress : function (pAddress, pContainerSize)
		{
			wiki.geolocation.log("* getZoomForAddress", pAddress, pContainerSize);	
		
			var vAddress = {};
			var vKey;
			var vValue;
		
			// Convert if necessary the <jquery object> as <string>
		
		 	for (vKey in pAddress)
		 	{
				if (pAddress.hasOwnProperty(vKey))
				{
				 	vValue = pAddress [vKey];
				
					if (typeof (vValue) == "string")
					   vValue = vValue.trim();
					else
	  				if (vValue instanceof jQuery && vValue.length > 0)
						vValue = vValue.eq(0).val ().trim();
						
					vAddress[vKey]=vValue;
				}
			}
		
			// Return a zoom depending on given adress fields
		
			var vRes = 10;
		
			if (vAddress.street) vRes = 14;
			else if (vAddress.postalCode || vAddress.city) vRes = 10;
			else if (vAddress.county) vRes = 8;
			else if (pAddress.state) vRes = 6;
			else if (pAddress.country) vRes = 4;
			
			wiki.geolocation.log ("- Selected zoom = " + vRes);
			
			return vRes;	
		}
	}
});

//////////////////////////////
// Methods of the geolocater object
//////////////////////////////

$.extend (wiki.geolocation.geolocater.prototype,
{
	// Run the geolocation with the internal parameters
	geolocate : function () 
	{	
		 wiki.geolocation.log("* geolocater.geolocate");		
		
		var vOptions = this.options;				

		this._index = 0;
		
		if (vOptions.query === undefined)
		{						
			this._address = 
			[	
				{ key : "street", value : vOptions.street },
				{ key : "postalCode", value : vOptions.postalCode },
				{ key : "city", value : vOptions.city },
				{ key : "county", value : vOptions.county },
				{ key : "state", value : vOptions.state },
				{ key : "country", value : vOptions.country }
			];
				
			this._originalQuery =
			{ 
				street : vOptions.street, 
				postalCode : vOptions.postalCode, 
				city : vOptions.city, 
				county : vOptions.county, 
				state : vOptions.state, 
				country : vOptions.country, 
				data : vOptions.data
			};
			
			this._partialQuery = {};
			
			$.extend (this._partialQuery, this._originalQuery);
			
			this._originalQuery.original = true; 	// indicates to the user if the complete address was found
			this._partialQuery.original = false;	// or if some address fields where removed to be able to geolocate		
			this._returnedQuery = this._originalQuery; // At this point, we intend to return the successfull original request
		}
		
		this._loadQuery ();			
	},	
	// (private) : load a query and call subqueries when not found
	_loadQuery : function ()
	{
		 wiki.geolocation.log("* _loadQuery");	
	
		var vMe = this;	
		var vOptions = this.options;
		
		if (vOptions.query != undefined)
		{
			this._query = vOptions.query;
		
			if (this._index == 0)
			{			
				$.when ($.get("https://nominatim.openstreetmap.org/search?q=" + vOptions.query + "&format=" + vOptions.geodataFormat + (vOptions.queryOptions?"&" + vOptions.queryOptions:"")))
				.then (function () { vMe._ajaxSuccess.apply(vMe, arguments); }, function () { vMe._ajaxError.apply(vMe, arguments) });
			}
			else
			{
				this._notFound ();
			}
		}
		else
		{
			var vOmitNext = true;

			this._query = "";

			for (var i = this._index ; i < this._address.length ; i++)
			{		
				if (this._address [i].value.trim() !== "")
				{				
					this._query += (this._query!==""?"&":"") + this._address [i].key + "=" + encodeURIComponent(this._address [i].value);
					vOmitNext = false;
				}
				else
				if (vOmitNext == true)
				{
					// The field value is empty, let's ignore it, update the next query index and the partial query object
					this._index++; 					
					this._partialQuery [this._address [i].key] = "";
				}
			}

			if (this._query == "")
			{
				this._notFound (); // All attempts failed. Let's inform the user
			}
			else
			{
				wiki.geolocation.log ("Geolocate query : ", this._query);
			
				$.when ($.get("https://nominatim.openstreetmap.org/search?" + this._query + "&format=" + vOptions.geodataFormat + (vOptions.queryOptions?"&" + vOptions.queryOptions:"")))
				.then (function () { vMe._ajaxSuccess.apply(vMe, arguments); }, function () { vMe._ajaxError.apply(vMe, arguments) });
			}			
		}			
	},	
	// (private) Found callback
	_found : function (pData, pTextStatus, pJQXHR)
	{	
		wiki.geolocation.log("* _found", pData, pTextStatus, pJQXHR);	
	
		var vMe = this;
		var vOptions = vMe.options;

		wiki.geolocation.log ("Geolocation query : ", { query : this._query, original : this._originalQuery, partial : this._partialQuery }, "returns : ", pData);

		// Keep only vOptions.limit entries

		var vData = pData.slice (0, vOptions.limit);

		// let's pass the data to the found callback

   		if (vOptions.found) vOptions.found ({ query : this._query, original : this._originalQuery, partial : this._partialQuery }, vData);	   	
	},
	// (private) Not found callback
	_notFound : function (pData, pTextStatus, pJQXHR)
	{    		 
		wiki.geolocation.log("* _notFound", pData, pTextStatus, pJQXHR);	
	
		var vOptions = this.options;

		wiki.geolocation.log ("Geolocation query : ", { query : this._query, original : this._originalQuery, partial : this._partialQuery }, "returns nothing.");
	
	   	if (vOptions.notFound) vOptions.notFound ({ query : this._query, original : this._originalQuery, partial : this._partialQuery }, { text : pTextStatus, jqXHR : pJQXHR });
	},
	// (private) Error callback
	_error : function ( pJQXHR, pTextStatus, pErrorThrown )		
	{		
		wiki.geolocation.log("* _Error", pJQXHR, pTextStatus, pErrorThrown);	
	
		var vOptions = this.options;

		wiki.geolocation.log ("Geolocation query : ", { query : this._query, original : this._originalQuery, partial : this._partialQuery }, "returns an error :", pTextStatus, pErrorThrown);
	
		if (vOptions.error) vOptions.error ({ query : this._query, original : this._originalQuery, partial : this._partialQuery }, { jqXHR : pJQXHR, text : pTextStatus, exception : pErrorThrown } );
	},
	// (private) AJAX success callback
	_ajaxSuccess : function (pData, pTextStatus, pJQXHR)
	{
		wiki.geolocation.log("* _ajaxSuccess", pData, pTextStatus, pJQXHR);	
	
		var vData = wiki.geolocation.getPlaces (pData);
	
		if (vData.length > 0)
		{
			this._found (vData, pTextStatus, pJQXHR);
		}					
		else
		{
			wiki.geolocation.log ("Query fails :", this._query, "Checking for a simplified query.");

			this._returnQuery = this._partialQuery;

			this._index++;
			
			this._loadQuery ();
		}			
	},
	// (private) AJAX error callback
	_ajaxError : function (pJQXHR, pTextStatus, pErrorThrown)
	{
		wiki.geolocation.log("* _ajaxError", pJQXHR, pTextStatus, pErrorThrown);	
	
		this._error (pJQXHR, pTextStatus, pErrorThrown);
				
		this._index++;
				
		this._loadQuery ();
	}					
});		
