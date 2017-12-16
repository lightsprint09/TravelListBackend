const osmosis = require('osmosis');
const Location = require("./../core/Location")
const Item = require("./../core/Item")
const { URL, URLSearchParams } = require('url');

class Extractor {

	extractFrom(url, created) {
		return new Promise(function(resolve, reject) {
			osmosis
			.get(url)
			.set({
				"title": "meta[property=og:title]@content",
				"description": "meta[property=og:description]@content",
				"lat": ".map@data-core4map-lat",
				"lng": ".map@data-core4map-lon",
				"images": ".originalImage@src"
			})
			.data(function(jsonText) {
				let location = new Location(jsonText.lat, jsonText.lng, true);
				let item = new Item(url, jsonText.title, jsonText.description, location, "accomodation", created, [jsonText.images]);
		    	resolve(item)
			})
		})

	}
}


function testData(date) {
	return{
	    "webUrl": "https://www.urlaubsarchitektur.de/de/hofgut-hafnerleiten/",
	    "name": "Hofgut Hafnerleiten",
	    "descriptionText": "Das Hofgut Hafnerleiten ist der wertvollste Rückzugsort  in der Thermen- und Golfregion Bad Birnbach in der Niederbayrischen Hügellandschaft. Für Paare, Nat",
	    "location": {
	        "latitude": "48.48773",
	        "longitude": "13.10405000000003",
	        "exactLocation": true
	    },
	    "category": {
	        "id": "accomodation"
	    },
	    "created": date,
	    "images": [
	        "https://d1s9qen57ml4xe.cloudfront.net/wp-content/uploads/2007/09/hofgut-hafnerleiten_a002.jpg"
	    ]
	}
}

module.exports = {
	supportedURLs: ["urlaubsarchitektur.de"],
	extractor: Extractor,
	testData: {
		url: "https://www.urlaubsarchitektur.de/de/hofgut-hafnerleiten/",
		expection: testData
	}
}
