function getGeolocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(displayMap,handleLocationError,{timeout:50000});
    }
}

function displayMap(position)
{
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
    
    /* First Initialization */
    if (typeof map === "undefined")
	map = L.map('map').addLayer(osm);

    map.setView([position.coords.latitude, position.coords.longitude], 15);
}

function addMarker(coordinates)
{
    if (typeof map === "undefined")
    {
	displayMap({
	    coords:
	    {
		latitude:coordinates.latitude,
		longitude:coordinates.longitude
	    }
	});
	addMarker(coordinates);
    }
    L.marker([coordinates.latitude, coordinates.longitude])
	.addTo(map);
    // .bindPopup('A pretty CSS3 popup.<br />Easily customizable.')
    // .openPopup();
}

function handleLocationError(error)
{
    switch(error.code)
    {
    case 0:
	updateStatus("There was an error while retrieving your location: " + error.message);
	break;

    case 1:
	updateStatus("The user prevented this page from retrieving the location.");
	break;

    case 2:
	updateStatus("The browser was unable to determine your location: " + error.message);

	break;

    case 3:

	updateStatus("The browser timed out before retrieving the location.");

	break;
    }
}

function updateStatus(msg)
{
    document.getElementById("appStatus").innerHTML = msg;
}

