/**
 * Created by Ziyang Jiang on 10/11/15.
 */

var current = new Date();
var currentDate = current.getDate()
var currentMonth = current.getMonth() + 1
if (currentDate.toString().length == 1) {
	currentDate = '0'+currentDate
}
if (currentMonth.toString().length == 1) {
	currentMonth = '0'+currentMonth
}
var currentYear = current.getFullYear()
var currentTime = currentYear.toString() + '-' + currentMonth.toString() + '-' + currentDate.toString()
var oneYearAgo = Back_date(currentTime, -365)

google.load('maps', '3', {
    other_params: 'sensor=false'
});

google.setOnLoadCallback(initialize);
var styles = [];
var markerClusterer = null;
var map = null;
var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';

// refreshMap
function refreshMap(result) {
    if (markerClusterer) {
        markerClusterer.clearMarkers();
    }
    var markers = [];

    var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));

    for (var i = 0; i < result.length; i++) {
        var latLng = new google.maps.LatLng(result[i].lat, result[i].lon)

        var marker = new google.maps.Marker({
            position: latLng,
            draggable: true,
            icon: markerImage});

        var contentString = '<div><img src=' + result[i].url + ' width="100" height="100"></div>' + '<div>' + result[i].createTime + '</div>'
        createInfoWindow(marker, contentString);
        markers.push(marker);
    }

    var infoWindow = new google.maps.InfoWindow();
    function createInfoWindow(marker, contentString) {
        google.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.setContent(contentString);
            infoWindow.open(map, this);
        });
    }

    var zoom = -1;
    var size = -1;
    var style = -1;
    zoom = zoom == -1 ? null : zoom;
    size = size == -1 ? null : size;
    style = style == -1 ? null: style;
    markerClusterer = new MarkerClusterer(map, markers, {
        maxZoom: zoom,
        gridSize: size,
        styles: styles[style]
    });
} //Done refresh


// initialize
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(39.91, 116.38),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var result = "{{image_info}}";
    refreshMap(result);
}

// clearClusters
function clearClusters(e) {
    e.preventDefault();
    e.stopPropagation();
    markerClusterer.clearMarkers();
}

$(function() {
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 365,
        step:1,
        values: [0, 365],

        slide: function( event, ui ) {
            var val0 = $("#slider-range").slider("values", 0);
            var val1 = $("#slider-range").slider("values", 1);

            var newDate0 = Back_date(oneYearAgo,val0);
            var newDate1 = Back_date(oneYearAgo,val1);

            $( "#time" ).val( newDate0 + " -> " + newDate1);

            var newResult = [];
            var result = "{{ image_info }}";

            for(var i = 0; i < result.length; i++) {
                var x = new Date(result[i].createTime.toString());
		        var newDate0TimeObj = new Date(newDate0);
		        var newDate1TimeObj = new Date(newDate1);

                if (x >= newDate0TimeObj && x <= newDate1TimeObj ) {
		      	    newResult.push(result[i]);
		      	}
	        }
            refreshMap(newResult);
        }
    });

    var val0 = $("#slider-range").slider("values", 0);
    var val1 = $("#slider-range").slider("values", 1);

    $( "#time" ).val(Back_date(oneYearAgo,val0) + " -> " + Back_date(oneYearAgo,val1));
});

function Back_date(current_date, dayOff) {
    var back_GTM = new Date(current_date);
    back_GTM.setDate(back_GTM.getDate() + dayOff + 1);
    var b_dd = back_GTM.getDate();
    var b_mm = back_GTM.getMonth()+1;
    var b_yyyy = back_GTM.getFullYear();
    if (b_dd < 10) {
        b_dd = '0' + b_dd
    }
    if (b_mm < 10) {
        b_mm = '0' +b_mm
    }
    var back_date=  b_yyyy + '-' + b_mm + '-' + b_dd;
    return back_date;
}