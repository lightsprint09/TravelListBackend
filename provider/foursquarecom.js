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
				"title": "title",
				"description": ".descriptionBlock",
				"googleMapLink": ".venueDirectionsLink a@href",
				"images": [".photoWithContent img@src"]
			})
			.data(function(jsonText) {
				console.log(jsonText);
				let images = jsonText.images.map(x => x.replace("200x200","1000x1000"));
				let location = parseLocationFrom(jsonText.googleMapLink);
				let description = strip_html_tags(jsonText.description);
				let item = new Item(url, jsonText.title, description, location, "food", created, images);
		    	resolve(item)
			})
		})

	}
}

function parseLocationFrom(url) {
	const myURL = new URL(url);
	let coordinates = myURL.searchParams.get('daddr').split(",")
	return new Location(coordinates[0] * 1, coordinates[1] * 1, true);
}

function strip_html_tags(str) {
	if(str == null) {
		return "";
	}
  	return str.replace(/<[^>]*>/g, '');
}

function testData(date) {
	return{
		webUrl: 'https://foursquare.com/v/bonanza-roastery/55eb124d498efde4131db55e',
		name: 'The Smallest Hostel of Florence',
		descriptionText: 'Das The Smallest Hostel of Florence begrüßt Sie in Florenz, nur 5 Gehminuten von der Basilika Santa Maria Novella entfernt.',
		category: { id: "food" },
		created: date,
		location:  {
			latitude: 43.7753645,
			longitude: 11.2545613,
			exactLocation: true
		}
    }
}

module.exports = {
	supportedURLs: ["foursquare.com"],
	extractor: Extractor,
	testData: {
		url: "https://foursquare.com/v/bonanza-roastery/55eb124d498efde4131db55e",
		expection: testData
	}
}
