$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
  // $.ajax("php/classify.php?active="+activeTab.geography, {
  //     success: function(results){      
  //     classifyData(results);
  //   }, 
  //   error: function(){
  //     console.log('error');
  //   }
  // });
    
   initialize();
   //mousemove is too slow, need to create a new layer at street level for mouseover
  map.on('click', function (e) {
       var features = map.queryRenderedFeatures(e.point); //queryRenderedFeatures returns an array
       // console.log(features[0])
       var feature = features[0];
       console.log(feature.properties)
       showResults(activeTab, feature.properties);
       mapResults(feature); 
       
  });
   $('#search').click(function(e){
      e.preventDefault();
      geoCodeAddress(geocoder);
    });

    // enter key event
    $("#address").bind("keypress", {},  keypressInBox);



  // var wasLoaded = false;
  // map.once('render', function(e) {
  //   //console.log('rendered',e.target);
  //   if (!map.loaded() || wasLoaded) return;
  //     console.log(map.loaded());
  //     console.log(data);
  //     data = getLayerProperties();
  //     console.log(data);
  //     wasLoaded = true;
  // });
// map.on("render", function() {
//   if(map.loaded()) {
//     classifyStops()
//   }
// })

    $('#home').on('click', function(){
    	window.open("http://www.gis.leg.mn")
    })

    $('.election-navigation-a').on('click', function(e){
    	e.preventDefault();
      //remove previous slections
      document.getElementById('features').innerHTML = "";
      map.removeLayer("2012results-"+ activeTab.geography);
      map.removeLayer("2012results-"+ activeTab.geography+"-hover");
      map.setLayoutProperty(activeTab.geography + '-symbols', 'visibility', 'none');
      map.setLayoutProperty(activeTab.geography + '-lines', 'visibility', 'none');
    	$('.election-navigation-a').removeClass('active');
      
      //add new selections
    	$(this).addClass('active');
    	activeTab.selection = $(this).data('district');
      activeTab.geography = $(this).data('geography');
      activeTab.name = $(this).data('name');
    	changeData(activeTab);
    })



 });