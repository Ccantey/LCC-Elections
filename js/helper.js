$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
    initialize();

    //mousemove is too slow, need to create a new layer at street level for mouseover
	map.on('click', function (e) {
       var features = map.queryRenderedFeatures(e.point, {
       	layers:['2012results-vtd','2012results-cty', '2012results-cng','2012results-cty-hover', '2012results-cng-hover','2012results-vtd-hover']
       }); //queryRenderedFeatures returns an array
       // console.log(features[0])

       var feature = features[0];

       showResults(activeTab, feature.properties);
       mapResults(feature);	
       
  });

    $('#home').on('click', function(){
    	window.open("http://www.gis.leg.mn")
    })

    $('.election-navigation-a').on('click', function(e){
    	e.preventDefault();
    	$('.election-navigation-a').removeClass('active');
    	$(this).addClass('active');
    	activeTab.selection = $(this).data('district');
      activeTab.geography = $(this).data('geography');
      activeTab.geography = $(this).data('nameField');
    	changeData(activeTab);
    })



 });