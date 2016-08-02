var activeTab = "USPRS";
var zoomThreshold = 9;
var fillColors = ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'];
var breaks = [0, 385, 940, 1572, 2340, 6000];


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
	    map.addSource('AllResults', {
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


        // Display the election data in multiple layers, each filtered to a range of
        // count values. Each range gets a different paint properties.
        // from https://www.mapbox.com/mapbox-gl-js/example/cluster/

        //pass activeTab in somehow or another - like activeTab +'TOTAL'
        var breaks = setBreaks();

        var layers = [
            //name, minzoom, maxzoom, filter, paint fill-color, stops, paint fill-opacity, stops
	        ['cty', 3, zoomThreshold, ['==', 'UNIT', 'cty'], activeTab+'TOTAL', [[100, 'steelblue'],[5000, 'brown']], activeTab+'TOTAL', [[0, 0.2],[16700, 0.3],[53000, 0.4],[142000, 0.5],[275000, 0.65],[700000, .75]], 'white'],
   	        ['vtd', zoomThreshold, 20, ['==', 'UNIT', 'vtd'], activeTab+'TOTAL', [[6000, 'steelblue']], activeTab+'TOTAL', [[0, 0.2],[385, 0.3],[940, 0.4],[1575, 0.5],[2350, 0.65],[6000, .75]], 'white'],
   	        ['vtd-hover', zoomThreshold, 20, ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]], 'USPRSTOTAL', [[6000, 'green']], activeTab+'TOTAL', [[6000, .75]], 'white'],
            ['cty-hover', 3, zoomThreshold, ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]], 'USPRSTOTAL', [[6000, 'green']], activeTab+'TOTAL', [[6000, .75]], 'white']


	    ];      

        layers.forEach(function (layer) {
	         map.addLayer({
		        "id": "2012results-"+ layer[0],
		        "type": "fill",
		        "source": "AllResults",
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
	    });  
	});


    //mousemove is too slow, need to create a new layer at street level for mouseover
	map.on('click', function (e) {
       var features = map.queryRenderedFeatures(e.point, {
       	layers:['2012results-vtd','2012results-cty', '2012results-cty-hover', '2012results-vtd-hover']
       }); //queryRenderedFeatures returns an array
       console.log(features[0])

       var feature = features[0];
       showResults(activeTab, feature.properties);

		switch (features[0].layer.id) {
		    case "2012results-cty": 
		        // sortResults(activeTab, feature) 
                map.setFilter("2012results-cty", ['all', ['==', 'UNIT', 'cty'], ["!=", "COUNTYNAME",features[0].properties.COUNTYNAME]]);
                map.setFilter("2012results-cty-hover", ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME",features[0].properties.COUNTYNAME]]);     
		        break;
		    case "2012results-cty-hover":
		        // sortResults(activeTab, feature)
		        break;
		    case "2012results-vtd":
		        // sortResults(activeTab, feature)
		        map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",features[0].properties.VTD]]);
                map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",features[0].properties.VTD]]);
		        break;
		    case "2012results-vtd-hover":
		        // sortResults(activeTab, feature)
		        break;

		    }

        // if (features[0].layer.id === '2012results-cty') {
        // 	// console.log('highlight: ', features[0].properties)
        // 	// map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]]);
        //     map.setFilter("2012results-cty", ['all', ['==', 'UNIT', 'cty'], ["!=", "COUNTYNAME",features[0].properties.COUNTYNAME]]);
        //     map.setFilter("2012results-cty-hover", ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME",features[0].properties.COUNTYNAME]]);
        // } 
        // else {
        //     // map.setFilter("2012results-vtd-hover", ["==", "VTD", ""]);
        //     // map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]]);
        //     map.setFilter('2012-results-cty-hover',  ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]]);
        // }

        // if(features[0].layer.id === '2012results-vtd'){
        // 	// map.setFilter('2012-results-cty-hover',  ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]]);
        //     map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",features[0].properties.VTD]]);
        //     map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",features[0].properties.VTD]]);
        // } else {
        //     // map.setFilter("2012results-vtd-hover", ["==", "VTD", ""]);
        //     map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]]);
        //     // map.setFilter('2012-results-cty-hover',  ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]]);
        // }
       
    });
}

function changeData(){
	console.log('switched tabs - change data');
}

function setBreaks(){

}

function showResults(activeTab, feature){
	// console.log(feature);
    
    // sortResults(activeTab, feature);
	switch (activeTab) {
    case "USPRS": 
        sortResults(activeTab, feature)      
        break;
    case "USSEN":
        sortResults(activeTab, feature)
        break;
    case "USREP":
        sortResults(activeTab, feature)
        break;
    case "MNSEN":
        sortResults(activeTab, feature)
        break;
    case "MNLEG":
        sortResults(activeTab, feature)
        break;
    }
    
}

function sortResults(activeTab, feature){
	var content = '';
    // content += "<tr><th>Precint: </th><td> " + feature.PCTNAME+ "</td></tr>";
    content += "<tr><th>Congressional District: </th><td> " + feature.CONGDIST+ "</td></tr>";
    content += "<tr><th>Legislative District: </th><td> " + feature.MNLEGDIST+ "</td></tr>";
    content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
    
    //add all "activetab" results into a tempory object (pres, senate, etc..)
    var tempObject = {};
	for (var prop in feature){
		var substring = prop.search(activeTab);
		if(substring !== -1){
            tempObject[prop] = feature[prop];
		}
	}
	// sort the results, which returns an array
	var tempArray = sortProperties(tempObject);

    //display the results in the results div
	for (var i=0; i < tempArray.length; i++){
		content += "<tr><th>"+tempArray[i][0]+": </th><td> " + tempArray[i][1]+ "</td></tr>";
		document.getElementById('features').innerHTML = content;		
	}
}

function sortProperties(obj){
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