var SpotMap = (function _SpotMap() {
    var self = Object.create({});
    
    self.markers = new HashTable();
    self.geoPosition = {
	    coords:{
		latitude:0,
		longitude:0
	    }
    };
    self.map = {};

    self._init = function _init() {

	// Create the map
	self.map = L.map(this.map_id);

	// Set the legend
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
	osm.addTo(self.map);

	// Set the event receivers
	self.map.on('locationfound',self.onLocationFound);
	self.map.on('locationerror',self.onLocationError);
	self.map.setView([0,0],1);
	// Get geolocation and center the map
	//self.geoLocate();
    };

    self.geoLocate = function () {
	//TODO: cache the location
	self.map.locate({setView: true, maxZoom: 15});  
    };

    self.onLocationFound = function(e) {
	var radius = e.accuracy / 2;
	var message = "You are within " + radius + " meters from this point";
	
	// Create a new marker
	var marker = Object.create(Marker, {
	    id: { value: 'geoPosition' },
	    latitude: { value: e.latlng.lat },
	    longitude: { value: e.latlng.lng },
	    label: { value: message },
	    draggable: {value: true }
	});
	marker._init();
	
	// Add the marker to the map
	self.addMarker(marker);	 				   
    };

    self.onLocationError = function(e) {
	
    };


    self.focusOnMarker = function(id) {
	// Pan the map to the marker (smooth move)
	self.map.panTo(new L.LatLng(self.markers.getItem(id).latitude, self.markers.getItem(id).longitude));
    };

    self.displayMap = function(position) {
	if (typeof position === "undefined") {
	    //If no position is specified, load geoCoords
	    self.map.setView([self.geoPosition.coords.latitude, self.geoPosition.coords.longitude], 10);
	}    
	else {
	    self.map.setView([position.coords.latitude, position.coords.longitude], 10);
	}
    };

    self.addMarker = function(marker) {
	var oldMarker = self.markers.getItem(marker.id);
	if (typeof oldMarker === "undefined") {
	    
	    // if marker is draggable
	    if (marker.draggable) {
	    	marker.LMarker = L.marker([marker.latitude,marker.longitude],{ draggable: true });
	    } else {// Create Leaflet marker
		marker.LMarker = L.marker([marker.latitude,marker.longitude]);
	    }

	    // Display the marker
	    marker.LMarker.addTo(self.map);
	    
	    // if specified, display the label in a popup
	    if (typeof marker.label != "undefined") {
		marker.LMarker.bindPopup(marker.label);
	    }
	    // Update markers hashtable
	    self.markers.setItem(marker.id, marker);
	
	} else {
	    // Marker already exists
	    if ((oldMarker.longitude != marker.longitude) || (oldMarker.latitude != marker.latitude)) {
		console.log('existe deja');
		// Move the existing marker
		var lat = (marker.latitude);
		var lng = (marker.longitude);
		var newLatLng = new L.LatLng(lat, lng);
		oldMarker.LMarker.setLatLng(newLatLng); 

		// Store the new marker
		self.markers.setItem(_marker.id, marker);
	    }
	}
    };

    self.clear = function() {
        
	// Remove all markers from the map
	self.markers.each(function(k,marker) {
	    self.map.removeLayer(marker.LMarker);
	});
	// Remove all markers from the list
	self.markers.clear();
    };

    return self;    
}());


var Marker = (function _Marker() {

    var self = Object.create({});    

    self._init = function _init() {

	return self;
    };
    
    return self;
}());

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}
