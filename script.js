window.onload = function() {
    var x = document.getElementById("latlng"),
        lat,
        long,
        theUrl,
        xmlHttp,
        parser,
        xmlDoc,
        nodeName,
        state;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                    lat = position.coords.latitude, //32.9605 GA Lat
                    long = position.coords.longitude, // -83.1132 Long
                    theUrl = 'http://nominatim.openstreetmap.org/reverse?format=xml&lat=' + lat + '&lon=' + long;
                    console.log(theUrl);
            });
        } else {
            x.value = "Geolocation is not supported by this browser.";
        }
    }

    function httpGet() {

        console.log(theUrl);

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlHttp.responseText,"text/xml"),
        locArr = xmlDoc.documentElement.childNodes[2].childNodes;

        var i = 0;
        while (nodeName !== 'state' && i < locArr.length) {
            nodeName = locArr[i].nodeName;
            state = locArr[i].textContent;
            i += 1;
        }

    }

    getLocation();

    function setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {

           callback();

           if (++x === repetitions) {
               window.clearInterval(intervalID);
           }
        }, delay);
    }

    setIntervalX(httpGet, 2000, 1);

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

};

var showOnly = function() {
    console.log(filterValue);
    sheet = viz.getWorkbook().getActiveSheet();
    if(sheet.getSheetType() === 'worksheet') {
        sheet.applyFilterAsync(fieldName, filterValue, 'REPLACE');
    } else {
        worksheetArray = sheet.getWorksheets();
        for(var i = 0; i < worksheetArray.length; i++) {
            worksheetArray[i].applyFilterAsync(fieldName, filterValue, 'REPLACE');
        }
    }
};