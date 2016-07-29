$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
    initialize();

    $('#home').on('click', function(){
    	window.open("http://www.gis.leg.mn")
    })

    $('.election-navigation-a').on('click', function(e){
    	e.preventDefault();
    	$('.election-navigation-a').removeClass('active');
    	$(this).addClass('active');
    	activeTab = $(this).data('district');
    	changeData();
    })



 });