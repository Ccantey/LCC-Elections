var activeTab = {
  selection:"USPRS",
  geography:"cty",
  name:"COUNTYNAME"
};
var zoomThreshold = 8;
// var data;
var layersArray = ['2012results-cty','2012results-vtd','2012results-sen','2012results-hse','2012results-cng','2012results-cty-hover','2012results-vtd-hover','2012results-sen-hover','2012results-hse-hover','2012results-cng-hover']
var geocoder = null;

var today = new Date();

var popLegendEl = document.getElementById('pop-legend');
var pctLegendEl = document.getElementById('pct-legend');


function initialize(){
    // console.log(winner);

	$("#map").height('800px');
	southWest = new mapboxgl.LngLat( -104.7140625, 41.86956);
    northEast = new mapboxgl.LngLat( -84.202832, 50.1487464);
    //bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    bounds = new mapboxgl.LngLatBounds(southWest,northEast);

    // mapboxgl.accessToken = 'Your Mapbox access token';
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaWVsdDNubmEwMGU3czNtNDRyNjRpdTVqIn0.yFaW4Ty6VE3GHkrDvdbW6g';

	map = new mapboxgl.Map({
		container: 'map', // container id
		// style: 'mapbox://styles/mapbox/dark-v9',
		style: 'mapbox://styles/ccantey/ciqxtkg700003bqnleojbxy8t',
		center: [-93.6678,46.50],
		maxBounds:bounds,		
		zoom: 6,
		minZoom: 6
	});

    map.addControl(new mapboxgl.Navigation({
    	position:'top-right'
    }));

    // geocoder = new google.maps.Geocoder; //ccantey.dgxr9hbq
    geocoder = new mapboxgl.Geocoder();
    map.on('load', function () {

    	// add vector source:
	    map.addSource('electionResults', {
	        type: 'vector',
	        url: 'mapbox://ccantey.2vclm9ik'
	    });     

        var layers = [
            //name, minzoom, maxzoom, filter, paint fill-color, stops, paint fill-opacity, stops
	        [
		        'cty',                                 //layers[0] = id
		        3,                                     //layers[1] = minzoom
		        zoomThreshold,                         //layers[2] = maxzoom
		        ['==', 'UNIT', 'cty'],                 //layers[3] = filter
		        activeTab.selection+'WIN',           //layers[4] = fill-color property -- geojson.winner (add this property to geojson)
		        [['DFL', '#6582ac'],['R', '#cc7575'],['TIE', '#333']],  //layers[5] = fill-color stops -- ['dfl':blue, 'r':red,'i':yellow]
		        activeTab.selection+'TOTAL',           //layers[6] = fill-opacity property
		        [                                      //layers[7] = fill-opacity stops (based on MN population)
		            [0, 0.25],
		            [16837, 0.45],
		            [53080, 0.6],
		            [142556, 0.7],
		            [280000, 0.8],
		            [700000, .99]
		        ],                                     
		        'hsl(55, 11%, 96%)'                                //layers[8] = outline color
	        ], 

   	        ['vtd', zoomThreshold, 20, ['==', 'UNIT', 'vtd'], activeTab.selection+'WIN', [['DFL', '#6582ac'],['R', '#cc7575'],['TIE', '#333']], activeTab.selection+'PCT', [[0, 0.25],[50, 0.45],[55, 0.6],[60, 0.7],[100, .99]], '#b8bbbf'],
   	        ['vtd-hover', zoomThreshold, 20, ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD", ""]], 'USPRSTOTAL', [[6000, 'orange']], activeTab.selection+'PCT', [[6000, .5]], 'white'],
            ['cty-hover', 3, zoomThreshold, ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME", ""]], 'USPRSTOTAL', [[6000, 'orange']], activeTab.selection+'TOTAL', [[6000, .5]], 'white']
	    ];      

        layers.forEach(addLayer)

	});//end map on load
} //end initialize

function changeData(activetab){
	console.log(activeTab.geography);
    // var visibility = map.getLayoutProperty(activetab+'-lines', 'visibility');
	switch (activeTab.geography) {
	    case "cty": 
	        var opacity = [ [0, 0.25],[16837, 0.45],[53080, 0.6],[142556, 0.7],[280000, 0.8],[700000, .99] ];
	        var opacityField = activeTab.selection+'TOTAL';
	        map.setLayoutProperty('cty-lines', 'visibility', 'visible');
	        map.setLayoutProperty('cty-symbols', 'visibility', 'visible');
	        break;
	    case "cng": 
	        var opacity = [[0, 0.25],[50, 0.45],[55, 0.6],[60, 0.7],[100, .99]];
	        var opacityField = activeTab.selection+'PCT';
	        map.setLayoutProperty('cng-lines', 'visibility', 'visible');
	        map.setLayoutProperty('cng-symbols', 'visibility', 'visible');
	        break;
	    case "sen": 
	        var opacity = [[0, 0.25],[50, 0.45],[55, 0.6],[60, 0.7],[100, .99]];
	        var opacityField = activeTab.selection+'PCT';
	        map.setLayoutProperty('sen-lines', 'visibility', 'visible');
	        map.setLayoutProperty('sen-symbols', 'visibility', 'visible');
	        break;
	    case "hse": 
	        var opacity = [[0, 0.25],[50, 0.45],[55, 0.6],[60, 0.7],[100, .99]];
	        var opacityField = activeTab.selection+'PCT';
	        map.setLayoutProperty('hse-lines', 'visibility', 'visible');
	        map.setLayoutProperty('hse-symbols', 'visibility', 'visible');
	        break;
	};

    map.setPaintProperty("2012results-vtd", 'fill-color', {"type":'categorical', 'property': activeTab.selection+'WIN', 'stops':[['DFL', '#6582ac'],['R', '#cc7575'],['TIE', '#333']]})    // selection = map.querySourceFeatures('2012results-cty-hover', {sourceLayer:'AllResults', filter: ['has','COUNTYNAME']})
	// showResults(activeTab, feature.properties);
	var layer = [
	    [activeTab.geography,          3, zoomThreshold, ['==', 'UNIT', activeTab.geography], activeTab.selection+'WIN', [['DFL', '#6582ac'],['R', '#cc7575'],['TIE', '#333']], opacityField, opacity, 'hsl(55, 11%, 96%)'],
        [activeTab.geography+'-hover', 3, zoomThreshold, ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, ""]], 'USPRSTOTAL', [[6000, 'orange']], opacityField, [[6000, .75]], 'white']
    ];

	layer.forEach(addLayer)
}

function addLayer(layer) {

	         map.addLayer({
		        "id": "2012results-"+ layer[0],
		        "type": "fill",
		        "source": "electionResults",
		        "source-layer": "FinalTable-4ggmdu", //layer name in studio
		        "minzoom":layer[1],
		        'maxzoom': layer[2],
		        'filter': layer[3],
		        "layout": {},
		        "paint": {		        	
		            "fill-color": {
		            	"type":'categorical',
		            	"property": layer[4], //layers[4] = fill-color property -- geojson.winner (add this property to geojson)
		            	"stops": layer[5],    //layers[5] = fill-color stops -- ['dfl':blue, 'r':red,'i':yellow]
		            },
		            "fill-opacity": {
		            	"type":'interval',
		            	property: layer[6],
		            	stops: layer[7]
		            },
		            "fill-outline-color": layer[8]
		            
		        }
	         }, 'waterway-label');
}; 

function showResults(activeTab, feature){
    // console.log(feature)
	var content = '';
	var header ='';
	var geography = '';
	var data = {
		activeTab:activeTab.selection,
		geography:activeTab.geography
	};
	
	var winner = (feature) ? feature[activeTab.selection+'WIN'] : '';

	var percentage = feature[activeTab.selection+winner]*100/feature[activeTab.selection+'TOTAL'];
	// console.log('winner '+feature[activeTab.selection+winner])
	// console.log('percentage '+percentage)

	if (feature.PCTNAME.length > 0){
		header += "<h5>Precinct Results</h5>";
		geography = "<th>Voting Precint: </th><td>"+feature.PCTNAME+"</td>";
	} else{
		if (feature.CONGDIST.length > 0){
		    
		    geography = "<th>Congressional District: </th><td>"+feature.CONGDIST+"</td>";
	}
	    if (feature.MNSENDIST.length > 0){
	    	
		    geography = "<th>MN Senate District: </th><td>"+feature.MNSENDIST+"</td>";
	}
	    if (feature.MNLEGDIST.length > 0){
	    	
		    geography = "<th>MN House District: </th><td>"+feature.MNLEGDIST+"</td>";
	}
	    if (feature.COUNTYNAME.length > 0){
	    	header += "<h5>County Results</h5>";
		   geography = "<th>County: </th><td>"+feature.COUNTYNAME+"</td>";
	}
	}

	switch (activeTab.selection) {
    case "USPRS":
        $('.td-image').show();
        $('#thirdwheel').show();
        content += "<tr>"+geography+"</tr>";
        content += "<tr><th>U.S. President: </th><td> At-large</td></tr>";
        content += "<tr><th>Winner: </th><td class='winner-"+winner+"'>"+winner+" </td></tr>";  
        content += "<tr><th>Percentage: </th><td class='winner-"+winner+"'>"+percentage.toFixed(1)+"% </td></tr>";    
        break;
    case "USSEN":
        $('.td-image').hide();
        $('#thirdwheel').hide();
        content += "<tr>"+geography+"</tr>";
        content += "<tr><th>U.S. Senate: </th><td> At-large</td></tr>";
        content += "<tr><th>Winner: </th><td class='winner-"+winner+"'>"+winner+" </td></tr>";
        content += "<tr><th>Percentage: </th><td class='winner-"+winner+"'>"+percentage.toFixed(1)+"% </td></tr>";

        break;
    case "USREP":
        $('.td-image').hide();
        $('#thirdwheel').hide();
        data['district'] = feature.CONGDIST;
        content += "<tr>"+geography+"</tr>";
        // content += "<tr><th>Congressional District: </th><td> " + feature.CONGDIST+ "</td></tr>";
        content += "<tr><th>Winner: </th><td class='winner-"+winner+"'>"+winner+" </td></tr>";
        content += "<tr><th>Percentage: </th><td class='winner-"+winner+"'>"+percentage.toFixed(1)+"% </td></tr>";

        break;
    case "MNSEN":
        $('.td-image').hide();
        $('#thirdwheel').hide();
        data['district'] = feature.MNSENDIST;
        content += "<tr>"+geography+"</tr>";
	    // content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
	    content += "<tr><th>Winner: </th><td class='winner-"+winner+"'>"+winner+" </td></tr>";
	    content += "<tr><th>Percentage: </th><td class='winner-"+winner+"'>"+percentage.toFixed(1)+"% </td></tr>";
        break;
    case "MNLEG":
        $('.td-image').hide();
        $('#thirdwheel').hide();
        data['district'] = feature.MNLEGDIST;
        content += "<tr>"+geography+"</tr>";
	    // content += "<tr><th>Legislative District: </th><td> " + feature.MNLEGDIST+ "</td></tr>";
	    content += "<tr><th>Winner: </th><td class='winner-"+winner+"'>"+winner+" </td></tr>";
	    content += "<tr><th>Percentage: </th><td class='winner-"+winner+"'>"+percentage.toFixed(1)+"% </td></tr>";
	    // content += "<tr><th>Senate District: </th><td> " + feature.MNSENDIST+ "</td></tr>";
        break;
    }

    // console.log(data);
    $.ajax("php/winners.php", {
		data: data,
		success: function(result){			
			showWinners(result.totals[0], feature);
		}, 
		error: function(){
			console.log('error');
		}
	});
	document.getElementById('precinct-header').innerHTML = header;

    //add all "activetab" results into a tempory object (pres, senate, etc..)
    var tempObject = {};
	for (var prop in feature){
		var substring = prop.search(activeTab.selection);
		if(substring !== -1 && typeof feature[prop] != 'string'){
            tempObject[prop] = feature[prop];
		}
	}
	console.log(tempObject)
	// sort the results, which returns an array
	var resultsArray = sortObjectProperties(tempObject);
    console.log(resultsArray)
    //display the results in the results div
	for (var i=0; i < resultsArray.length; i++){
		if (resultsArray[i][1] > 0){ 
		  content += "<tr><th>"+resultsArray[i][0]+": </th><td> " + resultsArray[i][1].toLocaleString()+ "</td></tr>";
		  document.getElementById('precinct-results').innerHTML = content;
		}
	}
}

function showWinners(totals, feature){
	// console.log(totals)
	var sortedWinners = sortObjectProperties(totals);
	// console.log(feature);
	// sortedWinners.forEach(logArrayElements);
    // var presidentMap={'dfl':'Hillary Clinton','republican':'Donald Trump', 'libertarian':'Gary Johnson', 'green':'Jill Stein'}
	for (var i = 0; i<sortedWinners.length; i++){
		var percent = sortedWinners[i][1]*100/sortedWinners[0][1]
		// console.log(percent.toFixed(1))
		if (i>0 && i<4){
			var party = sortedWinners[i][0].toUpperCase();
			var candidate = activeTab.selection + '' + party +'CN'; //ex: USPRSDFLCN
			// console.log(feature[candidate])
			if (activeTab.selection == 'USPRS'){
				// $('#candidate'+i).removeClass();
				// $('#candidate'+i).addClass('winner-'+party)
                $('#candidate'+i).html(feature[candidate]+' ('+party+')');
		        $('#candidate'+i+'votes').html(sortedWinners[i][1].toLocaleString());
		        $('#candidate'+i+'percent').html(percent.toFixed(1)+'% ');
			} else {
				// $('#candidate'+i).removeClass();
				// $('#candidate'+i).addClass('winner-'+party)
				$('#candidate'+i).html(feature[candidate]+' ('+party+')');
		        $('#candidate'+i+'votes').html(sortedWinners[i][1].toLocaleString());
		        $('#candidate'+i+'percent').html(percent.toFixed(1)+'% ');
			}
		    

	    } else{
	    	document.getElementById('totalvotes').innerHTML = sortedWinners[0][1].toLocaleString();
	    }
	}
}

// function logArrayElements(element, index, array) {
//   // console.log('a[' + index + '] = ' + element);
//   console.log(array);

// }

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
	// console.log(feature.layer.id)
    removeLayers('pushpin');
	// map.setFilter("2012results-"+activeTab.geography, ['all', ['==', 'UNIT', activeTab.geography], ["!=", activeTab.name, feature.properties[activeTab.name]]]);
 //    map.setFilter("2012results-"+activeTab.geography+"-hover", ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]);
        
       //not sure what this is doing here - doesn't do shit right now
       //  var relatedFeatures = map.querySourceFeatures(feature.layer.id, {
       //      sourceLayer: 'electionResults',
       //      filter: ['all', ['==', 'UNIT', activeTab.geography], ["==", activeTab.name, feature.properties[activeTab.name]]]
       //  });
       // console.log(relatedFeatures)

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
    var code = (e.keyCode ? e.keyCode : e.which); //ternary operator-> condition ? expr1 : expr2 -> If condition is true, then expression should be evaluated else evaluate expression 2
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

    //$.ajax vs mapbox.util.getJSON
    //mapboxgl.util.getJSON(geocoderURL, function(err, result) {/*do stuff with result*/ });

	$.ajax({
	  type: 'GET',
	  url: geocoderURL,
	  success: function(result) {
	        var topResult = result.features[0];
	        addMarker(topResult.geometry.coordinates);
		      map.flyTo({
		      	center:topResult.geometry.coordinates,
		      	zoom:12,
		      	speed:1.75
		      });
	  },
	  error: function() {
	       alert('geocode fail'); //maybe pass to google
	  }
	});

	    return false;
	}

function addMarker(e){
	// console.log([e.lngLat.lng, e.lngLat.lat])
    console.log(map.getLayer('pointclick'));

    removeLayers('pushpin');
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

function removeLayers(c){

	switch (c){
		case'all':
		//remove old pushpin and previous selected district layers 
		if (typeof map.getSource('pointclick') !== "undefined" ){ 
			console.log('remove previous marker');
			map.removeLayer('pointclick');		
			map.removeSource('pointclick');
		}
		// if (typeof map.getLayer('mapDistrictsLayer') !== "undefined" ){ 		
		// 	map.removeLayer('mapDistrictsLayer')
		// 	map.removeSource('district');	
		// }
		// if (typeof map.getLayer('minnesotaGeojson') !== "undefined" ){ 		
		// 	map.removeLayer('minnesotaGeojson')
		// 	map.removeSource('minnesotaGeojson');	
		// }
		
		break;

		
		case 'pushpin':
		//remove old pushpin and previous selected district layers 
		if (typeof map.getSource('pointclick') !== "undefined" ){ 
			console.log('remove previous marker');
			map.removeLayer('pointclick');		
			map.removeSource('pointclick');
		}
		break;

	}    
}
