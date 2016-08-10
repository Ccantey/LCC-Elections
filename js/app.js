var activeTab = {
  selection:"USPRS",
  geography:"cty",
  name:"COUNTYNAME"
};
var zoomThreshold = 9;
var fillColors = ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'];
var breaks = [0, 385, 940, 1572, 2340, 6000];
var selection = {};

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
		style: 'mapbox://styles/mapbox/light-v9',
		center: [-93.6678,46.50],
		maxBounds:bounds,		
		zoom: 6
	});

    map.addControl(new mapboxgl.Navigation({
    	position:'top-right'
    }));
    // geocoder = new google.maps.Geocoder; //ccantey.dgxr9hbq

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
        var breaks = setBreaks();

        var layers = [
            //name, minzoom, maxzoom, filter, paint fill-color, stops, paint fill-opacity, stops
	        ['cty', 3, zoomThreshold, ['==', 'UNIT', 'cty'], activeTab.selection+'TOTAL', [[100, 'steelblue'],[5000, 'brown']], activeTab.selection+'TOTAL', [[0, 0.2],[16700, 0.3],[53000, 0.4],[142000, 0.5],[275000, 0.65],[700000, .75]], 'white'],
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
	//['vtd', zoomThreshold, 20, ['==', 'UNIT', 'vtd'], activeTab.selection+'TOTAL', [[6000, 'steelblue']], activeTab.selection+'TOTAL', [[0, 0.2],[385, 0.3],[940, 0.4],[1575, 0.5],[2350, 0.65],[6000, .75]], 'white']
	console.log('switched tabs - change data');
}

function setBreaks(){

}

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
		            "fill-color": {
		            	property: layer[4], 
		            	stops: layer[5]
		            },
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
        content += "<tr>"+geography+"</tr>";
        content += "<tr><th>Congressional District: </th><td> " + feature.CONGDIST+ "</td></tr>";
        break;
    case "MNSEN":
        content += "<tr>"+geography+"</tr>";
	    // content += "<tr><th>Legislative District: </th><td> " + feature.MNLEGDIST+ "</td></tr>";
	    content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
        break;
    case "MNLEG":
        content += "<tr>"+geography+"</tr>";
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

	map.setFilter("2012results-"+activeTab.geography, ['all', ['==', 'UNIT', activeTab.geography], ["!=", activeTab.name, feature.properties[activeTab.name]]]);
    map.setFilter("2012results-"+activeTab.geography+"-hover", ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]);


	// switch (feature.layer.id) {
	//     case "2012results-cty": 
 //            map.setFilter("2012results-cty", ['all', ['==', 'UNIT', 'cty'], ["!=", "COUNTYNAME",feature.properties.COUNTYNAME]]);
 //            map.setFilter("2012results-cty-hover", ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME",feature.properties.COUNTYNAME]]);                
 //            // var query = map.querySourceFeatures('2012results-cty', {sourceLayer:'AllResults', filter: ['has','COUNTYNAME']})
 //            // console.log(query)     
	//         break;
	//     case "2012results-cty-hover":
	//         break;

 //        case "2012results-cng": 
 //            map.setFilter("2012results-cng", ['all', ['==', 'UNIT', 'cng'], ["!=", "CONGDIST",feature.properties.CONGDIST]]);
 //            map.setFilter("2012results-cng-hover", ['all', ['==', 'UNIT', 'cng'], ["==", "CONGDIST",feature.properties.CONGDIST]]);                
 //            // var query = map.querySourceFeatures('2012results-cty', {sourceLayer:'AllResults', filter: ['has','COUNTYNAME']})
 //            // console.log(query)     
	//         break;
	//     case "2012results-cng-hover":
	//         break;	

	//     case "2012results-vtd":
	//         map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",feature.properties.VTD]]);
 //            map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",feature.properties.VTD]]);
	//         break;
	//     case "2012results-vtd-hover":
	//         break;
 //    }
}