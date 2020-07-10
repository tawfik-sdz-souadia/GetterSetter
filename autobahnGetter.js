const autobahn = require('autobahn');
const autobahn_config = require('./autobahn_config_getter.json');

var principal = "getter_user";
var ticket = "secret@";

function onchallenge (session, method, extra) {

	console.log("onchallenge", method, extra);

	if (method === "ticket") {
	   return ticket;

	} else {
	   throw "don't know how to authenticate using '" + method + "'";
	}
}

var connection = new autobahn.Connection({
 	 url: autobahn_config.ws_url,
 	 realm: autobahn_config.realm,
 	 authmethods: ["ticket"],
     authid: principal,
     onchallenge: onchallenge
});

module.exports = {connection: connection};


