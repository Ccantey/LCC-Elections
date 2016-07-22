var popup;
var zoomThreshold = 8;
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
	    map.addSource('2012generalelection', {
	        type: 'vector',
	        url: 'mapbox://ccantey.625svqgl'
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

	    map.addLayer({
	        "id": "2012results-county",
	        "type": "fill",
	        "source": "2012generalelection",
	        "source-layer": "2012generalresults", //layer name in studio
	        "min-zoom":zoomThreshold,
	        'filter': ['==', 'COUNTYFIPS', true],
	        "layout": {
	            // "line-join": "round",
	            // "line-cap": "round"
	        },
	        "paint": {
	            "fill-color": "steelblue",
	            "fill-opacity": 0.5,
	            "fill-outline-color": "white"
	        }
        });

        map.addLayer({
	        "id": "2012results-mcd",
	        "type": "fill",
	        "source": "2012generalelection",
	        "source-layer": "2012generalresults", //layer name in studio
	        "min-zoom":zoomThreshold,
	        'filter': ['==', 'COUNTYFIPS', true],
	        "layout": {
	            // "line-join": "round",
	            // "line-cap": "round"
	        },
	        "paint": {
	            "fill-color": "steelblue",
	            "fill-opacity": 0.5,
	            "fill-outline-color": "white"
	        }
        });

        map.addLayer({
	        "id": "2012results-hover",
	        "type": "fill",
	        "source": "2012generalelection",
	        "source-layer": "2012generalresults", //layer name in studio
	        "layout": {
	            // "line-join": "round",
	            // "line-cap": "round"
	        },
	        "paint": {
	            "fill-color": "steelblue",
	            "fill-opacity": 0.5,
	            "fill-outline-color": "yellow"
	        },
	        "filter": ["==", "VTD", ""]
        });

	    // map.addLayer({
     //    "id": "house-labels",
     //    "type": "symbol",
     //    "source": "house-labels",
     //    "source-layer": "Hse2012_vtd2015_symbols", //name of the vector layer in studio - notice capital 'H'
     //    "layout": {
     //                // "icon-image": symbol + "-15",
     //                "icon-allow-overlap": true,
     //                "text-field": '{district}',
     //                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
     //                "text-size": 11,
     //                "text-transform": "uppercase",
     //                "text-letter-spacing": 0.05,
     //                "text-offset": [0, 1.5]
     //            },
     //            "paint": {
     //                "text-color": "#202",
     //                "text-halo-color": "#fff",
     //                "text-halo-width": 2
     //            }
     //        });
    
	});

	map.on('mousemove', function (e) {
       var features = map.queryRenderedFeatures(e.point, {
       	layers:['2012results']
       }); //queryRenderedFeatures returns an array

       mousehighlight(features);
        

       var feature = features[0]

       // JUST GET RID OF POPUP - USE HTML CSS!! http://bl.ocks.org/hrecht/82b6440ed3b982a6f594
       // console.log(feature.properties)
       // var html = "County: " + feature.properties.COUNTYNAME + "<br> Congress: " + feature.properties.CONGDIST;
       // popup = new mapboxgl.Popup()
       //  .setLngLat(e.lngLat)
       //  .setHTML(html)
       //  .addTo(map);
       // document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
    });

    map.on("mouseout", function() {
        map.setFilter("2012results-hover", ["==", "VTD", ""]);
    });

    map.on('zoom', function() {
	    if (map.getZoom() > zoomThreshold) {
	        stateLegendEl.style.display = 'none';
	        countyLegendEl.style.display = 'block';
	    } else {
	        stateLegendEl.style.display = 'block';
	        countyLegendEl.style.display = 'none';
	    }
    });
}

function mousehighlight(features){
	console.log(features)
	if (features.length) {
            map.setFilter("2012results-hover", ["==", "VTD", features[0].properties.VTD]);
        } else {
            map.setFilter("2012results-hover", ["==", "VTD", ""]);
        }
}

//will color similar to https://www.mapbox.com/mapbox-gl-js/example/updating-choropleth/
//and query the underlying map using: https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/