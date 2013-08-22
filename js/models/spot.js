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
    url: 'http://192.168.137.10:5001/api'
});


App.Spot = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    sports: DS.attr('string'),
    longitude: DS.attr('string'),
    latitude: DS.attr('string')
});
