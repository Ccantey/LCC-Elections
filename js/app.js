var activeTab = {
  selection:"USPRS",
  geography:"cty",
  name:"COUNTYNAME"
};
var zoomThreshold = 9;
var data;
var geocoder = null;

function initialize(){

	$("#map").height('800px');
	southWest = new mapboxgl.LngLat( -104.7140625, 41.86956);
    northEast = new mapboxgl.LngLat( -84.202832, 50.1487464);
    //bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    bounds = new mapboxgl.LngLatBounds(southWest,northEast);

    // mapboxgl.accessToken = 'Your Mapbox access token';
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g';

	map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/ccantey/ciqxtkg700003bqnleojbxy8t',
		center: [-93.6678,46.50],
		maxBounds:bounds,		
		zoom: 6
	});

    // map.addControl(new mapboxgl.Navigation({
    // 	position:'top-right'
    // }));

    // geocoder = new google.maps.Geocoder; //ccantey.dgxr9hbq
    geocoder = new mapboxgl.Geocoder();
    map.on('load', function () {

    	// add vector source:
	    map.addSource('electionResults', {
	        type: 'vector',
	        url: 'mapbox://ccantey.91kks197'
	    });
	    //vs add geojson source, a bit slower than vector. A php geojson source will be even slower due to browser cache:
	    // map.addSource('hse2012_vtd2015', {
		   //      "type": "geojson",
		   //      "data": "./data/hse2012_vtd2015.json"
		   //  });

	    // map.addSource('house-labels', {
	    //     type: 'vector',
	    //     url: 'mapbox://ccantey.6o2kxpgh'
	    // });       

        //pass activeTab in somehow or another - like activeTab +'TOTAL'
        
        
        

        var layers = [
            //name, minzoom, maxzoom, filter, paint fill-color, stops, paint fill-opacity, stops
	        [
		        'cty',                                 //layers[0] = id
		        3,                                     //layers[1] = minzoom
		        zoomThreshold,                         //layers[2] = maxzoom
		        ['==', 'UNIT', 'cty'],                 //layers[3] = filter
		        activeTab.selection+'TOTAL',           //layers[4] = fill-color property
		        [[100, 'steelblue'],[5000, 'brown']],  //layers[5] = fill-color stops
		        activeTab.selection+'TOTAL',           //layers[6] = fill-opacity property
		        [                                      //layers[7] = fill-opacity stops (based on MN population)
		            [0, 0.2],
		            [16700, 0.3],
		            [53000, 0.4],
		            [142000, 0.5],
		            [275000, 0.65],
		            [700000, .75]
		        ],                                     
		        'white'                                //layers[8] = outline color
	        ], 

   	        ['vtd', zoomThreshold, 20, ['==', 'UNIT', 'vtd'], activeTab.selection+'TOTAL', [[6000, 'steelblue']], activeTab.selection+'TOTAL', [[0, 0.2],[385, 0.3],[940, 0.4],[1575, 0.5],[2350, 0.65],[6000, .75]], 'white'],
   	        ['vtd-hover', zoomThreshold, 20, ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]], 'USPRSTOTAL', [[6000, 'orange']], activeTab.selection+'TOTAL', [[6000, .75]], 'white'],
            ['cty-hover', 3, zoomThreshold, ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]], 'USPRSTOTAL', [[6000, 'orange']], activeTab.selection+'TOTAL', [[6000, .75]], 'white']
	    ];      

        layers.forEach(addLayer)

	});//end map on load
} //end initialize

function changeData(activetab){
    // selection = map.querySourceFeatures('2012results-cty-hover', {sourceLayer:'AllResults', filter: ['has','COUNTYNAME']})
	// showResults(activeTab, feature.properties);
	var layer = [
	    [activeTab.geography,          3, zoomThreshold, ['==', 'UNIT', activeTab.geography], activeTab.selection+'TOTAL', [[100, 'steelblue'],[5000, 'brown']], activeTab.selection+'TOTAL', [[0, 0.2],[16700, 0.3],[53000, 0.4],[142000, 0.5],[275000, 0.65],[700000, .75]], 'white'],
        [activeTab.geography+'-hover', 3, zoomThreshold, ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, ""]], 'USPRSTOTAL', [[6000, 'orange']], activeTab.selection+'TOTAL', [[6000, .75]], 'white']
    ];

	layer.forEach(addLayer)
}

function classifyData(results){
	// console.log(results.data);
	var sum = 0;
	var numberOfBreaks = 5;
	var classBreaks = 0;
	var stops = [];

    // var winner = results.data.map(function(geography){
    // 	    // console.log(geography)
    // 	    keys = Object.keys(geography), largest = Math.max.apply(null, keys.map(x => geography[x])) result = keys.reduce((result, key) => { if (geography[key] === largest){ result.push(key); } return result; }, []);
    // 	     // if (geography.geographicProfile.usprsr > geography.geographicProfile.usprsdfl){
    // 	     // 	console.log ("R");
    // 	     // } else {
    // 	     // 	console.log("DFL")
    // 	     // }
    //     });
    // console.log(winner)
		// 
	for (var objects in results.data){

		//if(!layers.hasOwnProperty(key)) continue;
		// console.log(results.data[objects].geographicProfile.totvoting)
		var obj = results.data[objects].geographicProfile;
		// console.log(obj.totvoting)
		sum += obj.totvoting
	}
    

    // console.log(stops);
	return stops;

}

// function getLayerProperties(){
// 	var relatedFeatures = map.querySourceFeatures('electionResults', {
//             sourceLayer: 'AllResults',
//             filter: ['==', 'UNIT', activeTab.geography]
//         });   
// 		//console.log(relatedFeatures.length)

// 	var unique = {};
// 	var distinct = [];
// 		for (var i in relatedFeatures){
// 		  //console.log(states[i].properties.name);
//          if( typeof(relatedFeatures[i].properties[activeTab.name]) == "undefined"){
//           distinct.push(relatedFeatures[i].properties[activeTab.name]);
//           }
//           unique[relatedFeatures[i].properties[activeTab.name]] = relatedFeatures[i].properties;
// 		}

// 	classifyData(unique);

// 	Object.keys(unique).length;
// }

// function classifyData(layersArray){
// 	var sum = 0;
// 	for (var objects in layersArray){
// 		//if(!layers.hasOwnProperty(key)) continue;
// 		var obj = layersArray[objects];
// 		//console.log(obj.TOTVOTING)
// 		sum += obj.TOTVOTING
// 	}
// 	console.log(sum);

// 	return sum;
// }

function addLayer(layer) {
	         map.addLayer({
		        "id": "2012results-"+ layer[0],
		        "type": "fill",
		        "source": "electionResults",
		        "source-layer": "AllResults", //layer name in studio
		        "minzoom":layer[1],
		        'maxzoom': layer[2],
		        'filter': layer[3],
		        "layout": {},
		        "paint": {
		            "fill-color": 'steelblue',
		            "fill-opacity": {
		            	property: layer[6],
		            	stops: layer[7]
		            },
		            "fill-outline-color": layer[8]
		        }
	         });


}; 


function showResults(activeTab, feature){
    // console.log(feature)
	var content = '';
	var geography = '';

	if (feature.PCTNAME.length < 1){
		geography = "<th>County: </th><td>"+feature.COUNTYNAME+"</td>";
	} else {
		geography = "<th>Voting Precint: </th><td>"+feature.PCTNAME+"</td>";
	}

	switch (activeTab.selection) {
    case "USPRS": 
        content += "<tr>"+geography+"</tr>";
        content += "<tr><th>U.S. President: </th><td> At-large</td></tr>";      
        break;
    case "USSEN":
        content += "<tr>"+geography+"</tr>";
        content += "<tr><th>U.S. Senate: </th><td> At-large</td></tr>";
        break;
    case "USREP":
        // content += "<tr>"+geography+"</tr>";
        content += "<tr><th>Congressional District: </th><td> " + feature.CONGDIST+ "</td></tr>";
        break;
    case "MNSEN":
        // content += "<tr>"+geography+"</tr>";
	    // content += "<tr><th>Legislative District: </th><td> " + feature.MNLEGDIST+ "</td></tr>";
	    content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
        break;
    case "MNLEG":
        // content += "<tr>"+geography+"</tr>";
	    content += "<tr><th>Legislative District: </th><td> " + feature.MNLEGDIST+ "</td></tr>";
	    // content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
        break;
    }

    //add all "activetab" results into a tempory object (pres, senate, etc..)
    var tempObject = {};
	for (var prop in feature){
		var substring = prop.search(activeTab.selection);
		if(substring !== -1){
            tempObject[prop] = feature[prop];
		}
	}
	// sort the results, which returns an array
	var resultsArray = sortObjectProperties(tempObject);

    //display the results in the results div
	for (var i=0; i < resultsArray.length; i++){
		if (resultsArray[i][1] > 0){ 
		  content += "<tr><th>"+resultsArray[i][0]+": </th><td> " + resultsArray[i][1]+ "</td></tr>";
		  document.getElementById('features').innerHTML = content;
		}
	}
}

function sortObjectProperties(obj){
    // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]
    // sort items by value
    sortable.sort(function(a, b)
    {
      return b[1]-a[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function mapResults(feature){
	console.log(feature.layer.id)

	// map.setFilter("2012results-"+activeTab.geography, ['all', ['==', 'UNIT', activeTab.geography], ["!=", activeTab.name, feature.properties[activeTab.name]]]);
 //    map.setFilter("2012results-"+activeTab.geography+"-hover", ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]);
        var relatedFeatures = map.querySourceFeatures('2012results-vtd-hover', {
            sourceLayer: 'electionResults',
            filter: ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]
        });
       console.log(relatedFeatures)

	switch (feature.layer.id) {
	    case "2012results-vtd":
	        map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",feature.properties.VTD]]);
            map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",feature.properties.VTD]]);
	        break;
	    case "2012results-vtd-hover":
	        break;
	    default:
	        map.setFilter("2012results-"+activeTab.geography, ['all', ['==', 'UNIT', activeTab.geography], ["!=", activeTab.name, feature.properties[activeTab.name]]]);
            map.setFilter("2012results-"+activeTab.geography+"-hover", ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]);


    }
}

//submit search text box - removed button for formatting space
function keypressInBox(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode                        
        e.preventDefault();
        geoCodeAddress(geocoder);
    };
}

function geoCodeAddress(geocoder) {
    var address = document.getElementById('address').value;
    // anatomy of Mapbox GL Geocoder
    // https://api.mapbox.com/geocoding/v5/mapbox.places/1414%20skyline%20rd%2C%20eagan.json?country=us&proximity=38.8977%2C%2077.0365&bbox=-104.7140625%2C%2041.86956%2C-84.202832%2C%2050.1487464&types=address%2Clocality%2Cplace&autocomplete=true&access_token=pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g 

    var geocoderURL  = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/';
        geocoderURL += address + '.json?access_token=' + mapboxgl.accessToken;

    mapboxgl.util.getJSON(geocoderURL, function(err, result) {
        var topResult = result.features[0];
        addMarker(topResult.geometry.coordinates);
	      map.flyTo({
	      	center:topResult.geometry.coordinates,
	      	zoom:12,
	      	speed:1.75
	      })
    });
    return false;
}

function addMarker(e){
	// console.log([e.lngLat.lng, e.lngLat.lat])
    console.log(map.getLayer('pointclick'));

    if (typeof map.getSource('pointclick') !== "undefined" ){ 
			console.log('remove previous marker');
			map.removeLayer('pointclick');		
			map.removeSource('pointclick');
		}
	//add marker
	 map.addSource("pointclick", {
  		"type": "geojson",
  		"data": {
    		"type": "Feature",
    		"geometry": {
      			"type": "Point",
      			"coordinates": e
    		},
    		"properties": {
      			"title": "mouseclick",
      			"marker-symbol": "myMarker-Blue-Shadow"
    		}
  		}
	});

    map.addLayer({
        "id": "pointclick",
        type: 'symbol',
        source: 'pointclick',
        "layout": {
        	"icon-image": "{marker-symbol}",
        	"icon-size":1,
        	"icon-offset": [0, -13]
        },
        "paint": {}
    });
}

