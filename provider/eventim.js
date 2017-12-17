const osmosis = require('osmosis');
const Location = require("./../core/Location")
const Item = require("./../core/Item")
const { URL, URLSearchParams } = require('url');
var NodeGeocoder = require('node-geocoder');

class Extractor {

	extractFrom(url, created) {
		return new Promise(function(resolve, reject) {
			osmosis
			.get(url)
			.set({
				"data": 'script[type="application/ld+json"]',
				"description": ".dirRtl",
				"image": "meta[property=og:image]@content"
			})
			.data(function(jsonText) {
				let json = JSON.parse(jsonText.data);
				let image = jsonText.image;
				let startDate = json.startDate;
				let fullAddress = "";
				if(json.location) {
					fullAddress = [json.location.address.streetAddress, json.location.address.addressLocality, json.location.address.postalCode].join(",");
				}
				let item = new Item(json.url, json.name, jsonText.description, null, "event", created, [image], startDate);
		    	geocodeFrom(fullAddress, function(location) {
					if(location) {
						item.location = location;
					}
					resolve(item)
				})
			})
		})

	}
}

function geocodeFrom(address, complete) {
	var options = {
	  provider: 'google',
	  httpAdapter: 'https', // Default
	  apiKey: 'AIzaSyBR2PST2qpWs0QEeyvplQXNUuVSu5d8ZV8', // for Mapquest, OpenCage, Google Premier
	  formatter: null         // 'gpx', 'string', ...
	};
	var geocoder = NodeGeocoder(options);

	// Using callback
	geocoder.geocode(address)
	  .then(function(res) {
		let location = new Location(res[0].latitude, res[0].longitude, true);
		complete(location);
	  })
	  .catch(function(err) {
		complete(null);
	  });
}

function strip_html_tags(str) {
	if(str == null) {
		return "";
	}
  	return str.replace(/<[^>]*>/g, '');
}

function testData(date) {
	return {
		webUrl: 'http://www.eventim.de/luke-mockridge-lucky-man-offenburg-Tickets.html?affiliate=GMD&doc=artistPages%2Ftickets&fun=artist&action=tickets&key=1427190%249500686&jumpIn=yTix&kuid=472131',
		"name": "Luke Mockridge: Lucky Man",
	    "descriptionText": "Lukes Generation hat ein Problem. Die Welt steht ihr offen. Offen, wie ein prall gefüllter Supermarkt. Aber wie soll man sich entscheiden, in diesem Dschungel der Möglichkeiten? Was passiert nach der Schule? Praktikum, Ausbildung, Studium, Backpacking in Australien oder Surfen in Indonesien? Das Ganze muss ja schließlich auch bei Facebook, Instagram, Snapchat und Co festgehalten werden. Wer soll das denn alles schaffen? Und bleibt die Liebe dabei nicht auf der Strecke? In seinem brandneuen Live-Programm „Lucky Man“ nimmt uns Entertainer Luke Mockridge mit in die Welt der Selbstfindung. Charmant, reflektiert, scharf beobachtet, aber gewohnt optimistisch, erfasst er aktuelle Themen mit großer Neugier. Vom Einzug in die erste eigene Bude, über WG-Partys, bis hin zum großen Liebeskummer und der Selbstdarstellung im Netz – Luke nimmt sie alle mit und spricht seiner Generation dabei wie immer aus der Seele.",
	    "category": {
	        "id": "event"
	    },
	    "created": date,
	    "images": [
	        "http://www.eventim.de/obj/media/DE-eventim/teaser/222x222/2016/luke-mockridge-tickets-092016.jpg"
	    ],
	    "startDate": "2018-01-18T20:00:00.000+01:00",
	    "location": {
	        "latitude": 48.4621088,
	        "longitude": 7.9349789,
	        "exactLocation": true
	    }
    }
}

module.exports = {
	supportedURLs: ["eventim.de"],
	extractor: Extractor,
	testData: {
		url: "http://www.eventim.de/luke-mockridge-lucky-man-offenburg-Tickets.html?affiliate=GMD&doc=artistPages%2Ftickets&fun=artist&action=tickets&key=1427190%249500686&jumpIn=yTix&kuid=472131",
		expection: testData
	}
}
