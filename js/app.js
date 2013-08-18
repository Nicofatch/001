App = Ember.Application.create();

App.Router.map(function () {
    this.resource('index', { path: '/' });
    this.resource('spots', function() {
	this.route('new');
	this.route('find');
    });
    //this.resource('spot/new', { path: '/spot/:spot_id' });
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
});

App.SpotsRoute = Ember.Route.extend({
    /*setupController: function(controller, spot) {
	controller.set('model', spot);
    }*/
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
    longitude: DS.attr('integer'),
    latitude: DS.attr('integer')
});

App.Spot.FIXTURES = [
    {
	id:1,
	title:'paintball75',
	description:'Un super terrain de paintball',
	sports:'paintball',
	longitude:2.340841,
	latitude:48.8650429
    },
    {
	id:2,
	title:'cinema de suresnes',
	description:'Le meilleur cinema du grand Ouest',
	sports:'cinema',
	longitude:2.242201,
	latitude:48.8649466
    }
];

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

App.SpotView = Ember.View.extend({
    didInsertElement: function() {
	
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
	    // Fit the map on bounds
	    spotMap.fitOnBounds();
	}
	    
    },
    eventManager: Ember.Object.create({
	click: function(event) {
	    // When an item is clicked, focus on its marker	    
	    spotMap.focusOnMarker($(event.currentTarget).find('[role="spot-id"]').text());
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

	// TODO: Display the newly created spot

	// Remove the geo marker
	spotMap.removeGeoMarker();
	// Display all the spots
	this.transitionToRoute('spots.find');
    }
});

App.SpotController = Ember.ObjectController.extend({
    needs: ['spotsFind']
});


App.SpotsFindController = Ember.ArrayController.extend({
    
});
