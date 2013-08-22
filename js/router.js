App.Router.map(function () {
    this.resource('index', { path: '/' });
    this.resource('spots', function() {
        this.route('spot', {path: ':spot_id'});
        this.route('new');
        this.route('find');
    });
    //this.resource('spot/new', { path: '/spot/:spot_id' });
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
