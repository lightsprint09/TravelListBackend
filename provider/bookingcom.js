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
				"data": 'script[type="application/ld+json"]',
				"images": [".bh-photo-grid-item img@src"]
			})
			.data(function(jsonText) {
				let json = JSON.parse(jsonText.data)
				let location = parseLocationFrom(json.hasMap);
				let images = jsonText.images.map(x => x.replace("max500","max1024x768"));
				let item = new Item(url, json.name, json.description, location, "accomodation", created, images);

		    	resolve(item)
			})
		})

	}
}

function parseLocationFrom(url) {
	const myURL = new URL(url);
	let coordinates = myURL.searchParams.get('center').split(",")
	return new Location(coordinates[0] * 1, coordinates[1] * 1, true);
}

function testData(date) {
	return{
		webUrl: 'https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html',
		name: 'The Smallest Hostel of Florence',
		descriptionText: 'Das The Smallest Hostel of Florence begrüßt Sie in Florenz, nur 5 Gehminuten von der Basilika Santa Maria Novella entfernt.',
		category: { id: "accomodation" },
		created: date,
		location:  {
			latitude: 43.7753645,
			longitude: 11.2545613,
			exactLocation: true
		}
    }
}

module.exports = {
	supportedURLs: ["booking.com"],
	extractor: Extractor,
	testData: {
		url: "https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html",
		expection: testData
	}
}
