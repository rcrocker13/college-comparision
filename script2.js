$(document).ready(function(){
    var lat, long, theUrl, state;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude; //32.9605 GA Lat
            long = position.coords.longitude; // -83.1132 Long
            theUrl = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long + '&zoom=18&addressdetails=1';
        });
    } else {
        x.value = "Geolocation is not supported by this browser.";
    }

    var request = $.getJSON(theUrl);

    request.done(function(locationData){
        state = locationData.address.state;
        console.log(state);
    });

    var placeholderDiv = document.getElementById("tableauViz"),
        url = "http://public.tableau.com/views/GeorgiaSchoolComparison2013-2014_0/SchoolComparison?:showVizHome=no";

    var options = {
        width: "100%",
        height: "750px",
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function() {
            sheet = viz.getWorkbook().getActiveSheet();
            if(sheet.getSheetType() === 'worksheet') {
            sheet.applyFilterAsync('State', state, 'REPLACE');
            } else {
            worksheetArray = sheet.getWorksheets();
                for(var i = 0; i < worksheetArray.length; i++) {
                worksheetArray[i].applyFilterAsync('State', state, 'REPLACE');
                }
            }
        }
    };

    viz = new tableau.Viz(placeholderDiv, url, options);

});