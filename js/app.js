App = Ember.Application.create();

App.Router.map(function () {
    this.resource('index', { path: '/' });
    this.resource('spots', function() {
	this.route('spot', {path: ':spot_id'});
	this.route('new');
	this.route('find');
    });
    //this.resource('spot/new', { path: '/spot/:spot_id' });
});

App.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.Adapter'
});

DS.RESTAdapter.reopen({
  url: 'api'
});


App.SpotsRoute = Ember.Route.extend({
    /*setupController: function(controller, spot) {
	controller.set('model', spot);
    }*/
});

App.SpotsSpotRoute = Ember.Route.extend({
    setupController: function(controller, spot) {
	controller.set('model', spot);
    }
});

App.SpotsFindRoute = Ember.Route.extend({
    /*model:function(params){
	return App.Spot.find();
    },*/
    setupController: function(controller) {
	controller.set('model', App.Spot.find());
    }
});

App.SpotsNewRoute = Ember.Route.extend({
    setupController: function(controller,spot) {
	controller.set('model',spot);
    }
});

App.IndexRoute = Ember.Route.extend({
    // Loading screen
});

/*App.SpotRoute = Ember.Route.extend({
    model:function(params){
	return App.Spot.find(params.spot_id);
    }
});*/

App.Spot = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    sports: DS.attr('string'),
    longitude: DS.attr('string'),
    latitude: DS.attr('string')
});

App.SpotsNewView = Ember.View.extend({
    templateName: 'spots/new',
    didInsertElement: function() {
	Ember.run.schedule('afterRender',function(){

	    // Remove all existing markers on the map
	    spotMap.clear();

	    // If the current position is not already displayed, launch a new geoLocation
	    if (typeof spotMap.geoPosition.marker === "undefined") {
		// The geoLocate function will calculate the position and then center the map on it
		spotMap.geoLocate();
	    }
	    else
	    {
		// Just center the map on the geoPosition
		spotMap.centerOnGeoPosition();
	    }

	    // Initialize the multi-select input "activity"
	    $("#inputActivity").select2({
		placeholder: "Activity"
	    }).on("change", function(e) { $('#s2id_inputActivity').css('width','100%'); });
	    $('#s2id_inputActivity').css('width','100%');
	    
	});
    }
});

App.SpotsView = Ember.View.extend({
    templateName: 'spots',
    didInsertElement: function() {
	// Initialize the map
	spotMap = Object.create(SpotMap, {
	    map_id: { value: 'map' }
	});
	spotMap._init();    
    }
});

App.SpotsFindView = Ember.View.extend({
    templateName: 'spots/find',
    didInsertElement: function() {
	spotMap.clear();
    }
});

App.SpotDetailView = Ember.View.extend({
    templateName:'spot-detail',
    didInsertElement: function() {
	// Clear the map
	spotMap.clear();
	this.$('[role="spot-item"]').each(function() {
	    // Create a marker
	    var marker = Object.create(Marker, {
		id: { value: $(this).find('[role=spot-id]').text() },
		latitude: { value: $(this).find('[role=spot-latitude]').text() },
		longitude: { value: $(this).find('[role=spot-longitude]').text() }
	    });
	    marker._init();
	    // Add the marker to the map
	    spotMap.addMarker(marker);
	    // Center the map on the marker
	    spotMap.centerOnMarker(marker.id);
	});
    }
});

App.SpotOverviewView = Ember.View.extend({
    templateName: 'spot-overview',
    didInsertElement: function() {
	//console.log(this.get('controller').get('controllers.spotsFind').get('length'));
	/* Display markers for each spot */
        this.$('[role="spot-item"]').each(function() {
	    // Create a marker
	    var marker = Object.create(Marker, {
		id: { value: $(this).find('[role=spot-id]').text() },
		latitude: { value: $(this).find('[role=spot-latitude]').text() },
		longitude: { value: $(this).find('[role=spot-longitude]').text() }
	    });
	    marker._init();
	    // Add the marker to the map
	    spotMap.addMarker(marker);
	});
	// Check if all the markers have been added
	if (spotMap.markers.length == this.get('controller').get('controllers.spotsFind').get('length')) {
	    //console.log(spotMap.markers.length);
	    //console.log(this.get('controller').get('controllers.spotsFind').get('length'));
	    //console.log(spotMap.bounds.length);
	    // Fit the map on bounds
	    spotMap.fitOnBounds();
	}
	    
    },
    eventManager: Ember.Object.create({
	click: function(event) {
	    // When an item is clicked, focus on its marker	    
	    spotMap.centerOnMarker($(event.currentTarget).find('[role="spot-id"]').text());
	}
    })
});

App.SpotsNewController = Ember.Controller.extend({

    addSpot: function() {
	// Get the "title" text field
	var title = this.get('newTitle');

	if (!title.trim()) { return; }

	// Get the "description" text field
	var description = this.get('newDescription');

	// Create the spot model
	var spot = App.Spot.createRecord({
	    title: title,
	    description: description,
	    longitude: spotMap.geoPosition.marker.LMarker._latlng.lng,
	    latitude: spotMap.geoPosition.marker.LMarker._latlng.lat
	});

	// Save the model
	spot.save();

	// Remove the geo marker
	spotMap.removeGeoMarker();

	// Display the newly created spot
	this.transitionToRoute('spots.spot',spot);
    }
});

App.SpotController = Ember.ObjectController.extend({
    needs: ['spotsFind']
});


App.SpotsFindController = Ember.ArrayController.extend({
    
});
