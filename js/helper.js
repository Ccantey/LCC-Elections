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
    	$('.election-navigation-a').removeClass('active');
      
      //add new selections
    	$(this).addClass('active');
    	activeTab.selection = $(this).data('district');
      activeTab.geography = $(this).data('geography');
      activeTab.name = $(this).data('name');
    	changeData(activeTab);
    })



 });