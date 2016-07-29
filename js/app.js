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

        var layers = [
            //name, minzoom, maxzoom, filter, paint fill-color, stops, paint fill-opacity, stops
	        ['county', 3, zoomThreshold, ['==', 'UNIT', 'cty'], 'USPRSTOTAL', [[7000000, 'steelblue']], 'USPRSTOTAL', [[0, 0.2],[16700, 0.3],[53000, 0.4],[142000, 0.5],[275000, 0.65],[700000, .75]], 'white'],
   	        ['vtd', zoomThreshold, 20, ['==', 'UNIT', 'vtd'], 'USPRSTOTAL', [[6000, 'steelblue']], 'USPRSTOTAL', [[0, 0.2],[385, 0.3],[940, 0.4],[1575, 0.5],[2350, 0.65],[6000, .75]], 'white'],
   	        ['vtd-hover', zoomThreshold, 20, ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]], 'USPRSTOTAL', [[6000, 'brown']], 'USPRSTOTAL', [[6000, .75]], 'white'],

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
       	layers:['2012results-vtd']
       }); //queryRenderedFeatures returns an array
       
        if (features.length) {
        	console.log('highlight: ', features[0].properties.VTD)
        	// "filter": ['and', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]
         //    map.setFilter("2012results-vtd-hover", ["==", "VTD", features[0].properties.VTD]);
            map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",features[0].properties.VTD]]);
        } else {
            // map.setFilter("2012results-vtd-hover", ["==", "VTD", ""]);
            map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]]);

        }

       //pass activeTab in somehow or another
       console.log(activeTab);

       var feature = features[0];
       console.log(feature.properties);
       var content = '';
       content += "<tr><th>Precint: </th><td> " + feature.properties.PCTNAME+ "</td></tr>";
       content += "<tr><th>Congressional District: </th><td> " + feature.properties.CONGDIST+ "</td></tr>";
       content += "<tr><th>Legislative District: </th><td> " + feature.properties.MNLEGDIST+ "</td></tr>";
       content += "<tr><th>Senate District: </th><td> " + feature.properties.MNSENDIST+ "</td></tr>";
       content += "<tr><th>Democratic (DFL): </th><td> " + feature.properties.USREPDFL+ "</td></tr>";
       content += "<tr><th>Republican (R): </th><td> " + feature.properties.USREPR+ "</td></tr>";
       content += "<tr><th>Independent (I): </th><td> " + feature.properties.USREPIP+ "</td></tr>";
       content += "<tr><th>Write-In: </th><td> " + feature.properties.USREPWI+ "</td></tr>";
       content += "<tr><th>TOTAL: </th><td> " + feature.properties.USREPTOTAL+ "</td></tr>";
       // popup = new mapboxgl.Popup()
       //  .setLngLat(e.lngLat)
       //  .setHTML(content)
       //  .addTo(map);
       document.getElementById('features').innerHTML = content;
    });

    // map.on("mouseout", function() {
    //     map.setFilter("2012results-hover", ["==", "VTD", ""]);
    // });
}

function changeData(){
	console.log('switched tabs - change data');
}