const queryJson = require("query-json");

const WAE = require('web-auto-extractor').default
const fetch = require("node-fetch")
const access = require('safe-access');
const { URL, URLSearchParams } = require('url');

const Location = require("./../core/Location")
const Item = require("./../core/Item")

class Extractor {

	extractFrom(url, created) {
		return fetch(url).then(function(res) {
			return res.text()
		}).then(function(text) {
			const parsed      = WAE().parse(text)
			const title       = parsed.metatags["og:title"][0]
			const description = parsed.metatags["og:description"][0] || parsed.metatags.description
			const coordinates    = extractLocationFromMetaTags(parsed.metatags) || extractLocationFromHasMap(parsed.jsonld)
			const location = new Location(coordinates.latitude, coordinates.longitude, true)
			const images = parsed.metatags["og:image"] || []
			const type = "accomodation"
			const item = new Item(url, title, description, location, type, created, images);
			
			return item
		})
	}
}

function extractLocationFromMetaTags(metatags) {
	let longitude = extractLocation('LONGITUDE', metatags)
	let latitude = extractLocation('LATITUDE', metatags)
	if (longitude && longitude) {
		return { longitude, latitude }
	}
	return null
}

function extractLocation(key, parsed) {
	const regex = new RegExp(key, 'i');
	const result = queryJson.search(parsed, regex, {details: true });
	if (result.length == 0) {
		return null
	}
	var keyPathResult = getValueForKeyPath(result[0].path, parsed)
	if (keyPathResult[0]) {
		return keyPathResult[0]
	}
	return null
}

function getValueForKeyPath(keyPath, inObject) {
	var result = inObject
	keyPath.forEach(function(key) {
		result = result[key]
	})
	return result
}

function extractLocationFromHasMap(jsonld) {
	const regex = new RegExp("hasMap", 'i');
	const result = queryJson.search(jsonld, regex, { details: true });
	if (!result.length) {
		return null
	}
	var url = getValueForKeyPath(result[0].path, jsonld)
	const myURL = new URL(url);
	let coordinates = myURL.searchParams.get('center').split(",")
	
	if (coordinates.length == 2) {
		let longitude = coordinates[1] * 1
		let latitude = coordinates[0] * 1
		return { longitude, latitude }
	}
	return null
}


function testData(date) {
	return{
		"webUrl": "https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html",
	    "name": "The Smallest Hostel of Florence, Florenz, Italien",
	    "descriptionText": "Das The Smallest Hostel of Florence begrüßt Sie in Florenz, nur 5 Gehminuten von der Basilika Santa Maria Novella entfernt.",
		"location": {
	        "latitude": 43.7753645,
	        "longitude": 11.2545613,
	        "exactLocation": true
	    },
	    "category": {
	        "id": "accomodation"
	    },
	    "created": date,
	    "images": [
	        "https://t-ec.bstatic.com/images/hotel/max300/621/62172447.jpg"
	    ]
    }
}

module.exports = {
	supportedURLs: [],
	extractor: Extractor,
	testData: {
		url: "https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html",
		expection: testData
	}
}
