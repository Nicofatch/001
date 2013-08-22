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

// This is the parent view for 
// Spot / find : list all the spots
// Spot / new : create a new spot
// Spot / :spot_id : display a specific spot
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
    templateName:'spot',
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

App.SpotListItemView = Ember.View.extend({
    templateName: 'spot-listItem',
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
            spotMap.centerOnMarker($(event.currentTarget).find('[role="spot-id"]').text());
	}
    })
});
