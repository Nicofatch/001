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
