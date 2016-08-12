$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
  $.ajax("php/classify.php", {
    success: function(result){      
      initialize(result);
    }, 
    error: function(){
      console.log('error');
    }
  });
    //initialize();

    //mousemove is too slow, need to create a new layer at street level for mouseover
	map.on('click', function (e) {
       var features = map.queryRenderedFeatures(e.point); //queryRenderedFeatures returns an array
       // console.log(features[0])
       var feature = features[0];
       console.log(feature)
       showResults(activeTab, feature.properties);
       mapResults(feature);	
       
  });

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