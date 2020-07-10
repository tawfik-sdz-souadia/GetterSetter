function uuid(){
	return 'xxxxxxx-xxxxxxx-xxxxxxx-xxxxxxx'.replace(/x/g,function(c){
		return Math.floor(Math.random()*16).toString(16);
	});
}

const {client} = require('./elasticsearch');
const {connection} = require('./autobahnSetter.js');
const elasticsearch_config = require('./elastic_config.json');

var CreatePushIndex = new Promise(function(resolve,reject){
	client.indices.create({
    index: elasticsearch_config.index,
    body: {
      mappings: elasticsearch_config.mappings
    }
  	}).then(function () {
  		console.log("index created...");
  		resolve();
  	}, function () {
  		resolve();
  	});
});

CreatePushIndex.then(function(){
	connection.open();
	connection.onopen = function(session){
		console.log("connection was opened....");	
		session.subscribe("setdata.elasticsearch", function ( data ) {
			var location_data = data[0];
			client.create({id: uuid(), index: elasticsearch_config.index, body: { location: {lat: location_data.latitude, lon: location_data.longitude}, time: new Date(), sensor_id: location_data.identity}})
			.then(function (){  
        		 console.log('Document inserted...');},
        	 function ( e ) {
				 console.error( JSON.stringify(e) );
			 });
		});
	 };
});

