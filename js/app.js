

function initialize(){
	$("#map").height('800px');
	southWest = new mapboxgl.LngLat( -104.7140625, 41.86956);
    northEast = new mapboxgl.LngLat( -84.202832, 50.1487464);
    //bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    bounds = new mapboxgl.LngLatBounds(southWest,northEast);

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2NhbnRleSIsImEiOiJjaW01MGpwdDcwMWppdWZtNnoxc3pidjZhIn0.0D2UtVeOtsJFaHr8761_JQ';
	map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/ccantey/cimi2xon00022ypnhqkjob9k9',
		center: [-93.6678,46.50],
		maxBounds:bounds,		
		zoom: 6
	});

    map.addControl(new mapboxgl.Navigation({
    	position:'top-left'
    }));
    // geocoder = new google.maps.Geocoder;
}