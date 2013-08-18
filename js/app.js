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
    
});

App.SpotsFindRoute = Ember.Route.extend({
    model:function(params){
	return App.Spot.find();
    }
});

App.SpotsNewRoute = Ember.Route.extend({

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
	    SpotMap.clear();
	    SpotMap.geoLocate();

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
	spotMap.geoLocate();
	
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
	    //marker._init();
	    // Add the marker to the map
	    spotMap.addMarker(marker);

	    // When an item is clicked, focus on its marker	    
	    $(this).click(function(){
		spotMap.focusOnMarker($(this).find('[role="spot-id"]').text());
	    });
	});
    }
});


App.SpotController = Ember.ObjectController.extend({
    
});


App.SpotsFindController = Ember.ArrayController.extend({
    createSpot: function () {
    // Get the todo title set by the "New Todo" text field
    /*var title = this.get('newTitle');
    if (!title.trim()) { return; }

    // Create the new Todo model
    var todo = Todos.Todo.createRecord({
    title: title,
      isCompleted: false
      });

    // Clear the "New Todo" text field
    this.set('newTitle', '');

    // Save the new model
    todo.save();*/  
    },
    total: function() {
	//return this.get('length');
	return 'nein';
    }
});
