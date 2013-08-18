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
	longitude:2.240841,
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

App.SpotController = Ember.ObjectController.extend({
    
});

App.SpotsNewView = Ember.View.extend({
    templateName: 'spots/new',
    didInsertElement: function() {
	Ember.run.schedule('afterRender',function(){
	    $("#inputActivity").select2({
		placeholder: "Activity"
	    }).on("change", function(e) { $('#s2id_inputActivity').css('width','100%'); });
	    $('#s2id_inputActivity').css('width','100%');
	    getGeolocation();
	});
    }
});

App.SpotsView = Ember.View.extend({
    templateName: 'spots',
    didInsertElement: function() {
	Ember.run.schedule('afterRender',function(){
	    /* Display map */
	    //getGeolocation();
	});
    }
});

App.SpotView = Ember.View.extend({
    didInsertElement: function() {
	Ember.run.schedule('afterRender',function(){
            /* Display markers for each spot */
            this.$('[role="spot-item"]').each(function() {
		addMarker({
                    latitude:$(this).find('[role=spot-latitude]').text(),
                    longitude:$(this).find('[role=spot-longitude]').text()
                });
            });
	});
    }
});
