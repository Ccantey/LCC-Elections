$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
    initialize();

    //mousemove is too slow, need to create a new layer at street level for mouseover
	map.on('mousemove', function (e) {
       var features = map.queryRenderedFeatures(e.point, {
       	layers:['2012results-vtd','2012results-cty', '2012results-cty-hover', '2012results-vtd-hover']
       }); //queryRenderedFeatures returns an array
       // console.log(features[0])

       var feature = features[0];
       showResults(activeTab, feature.properties);

		switch (feature.layer.id) {
		    case "2012results-cty": 
                map.setFilter("2012results-cty", ['all', ['==', 'UNIT', 'cty'], ["!=", "COUNTYNAME",feature.properties.COUNTYNAME]]);
                map.setFilter("2012results-cty-hover", ['all', ['==', 'UNIT', 'cty'], ["==", "COUNTYNAME",feature.properties.COUNTYNAME]]);                
                // var query = map.querySourceFeatures('2012results-cty', {sourceLayer:'AllResults', filter: ['has','COUNTYNAME']})
                // console.log(query)     
		        break;
		    case "2012results-cty-hover":
		        break;
		    case "2012results-vtd":
		        map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",feature.properties.VTD]]);
                map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",feature.properties.VTD]]);
		        break;
		    case "2012results-vtd-hover":
		        break;
		    }
       
    });

    $('#home').on('click', function(){
    	window.open("http://www.gis.leg.mn")
    })

    $('.election-navigation-a').on('click', function(e){
    	e.preventDefault();
    	$('.election-navigation-a').removeClass('active');
    	$(this).addClass('active');
    	activeTab = $(this).data('district');
    	changeData(activeTab);
    })



 });