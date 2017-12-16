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
				"title": "div[itemprop=name]",
				"description": "#details span:first-child",
				"images": ["meta[itemprop=image]@content"],
				"bundleData": "script[data-hypernova-key=spaspabundlejs]"
			})
			.data(function(jsonText) {
				let bundleData = jsonText.bundleData.replace("<!--","").replace("-->", "");
				let jsonData = JSON.parse(bundleData);
				let location = "";
				if (!isEmptyObject(jsonData.bootstrapData.reduxData)) {
					let latitude = jsonData.bootstrapData.reduxData.marketplacePdp.listingInfo.listing.lat;
					let longitude = jsonData.bootstrapData.reduxData.marketplacePdp.listingInfo.listing.lng;
					location = new Location(latitude, longitude, false)
				}
				let description = strip_html_tags(jsonText.description);
				let item = new Item(url, jsonText.title, description, location, "accomodation", created, jsonText.images);
		    	resolve(item)
			})
		})
	}
}
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}

function strip_html_tags(str) {
	if(str == null) {
		return "";
	}
  	return str.replace(/<[^>]*>/g, '');
}

function testData(date) {
	return{
		webUrl: 'https://www.airbnb.de/rooms/10201545',
		name: 'Sonnige Wohnung in U-Bahn Nähe (Top 2)',
		descriptionText: 'Ich vermiete eine sonnige und helle Wohnung 7 Minuten von der U4 U-Bahn Station Ober-St. Veit entfernt. Die Wohnung besteht aus einem großen Wohnraum mit Küchenecke, einem Schlafzimmer und einem großen Badezimmer mit Badewanne. Terrasse im Sommer!',
		category: { id: "accomodation" },
		created: date,
		"location": {
	        "latitude": 48.19068913206624,
	        "longitude": 16.267037876014815,
	        "exactLocation": false
	    },
		"images": [
	        "https://a0.muscache.com/im/pictures/09fbbef3-7872-4747-a1b9-257eb07ad1d9.jpg?aki_policy=large"
	    ]
    }
}

module.exports = {
	supportedURLs: ["airbnb.com", "airbnb.de"],
	extractor: Extractor,
	testData: {
		url: "https://www.airbnb.de/rooms/10201545",
		expection: testData
	}
}
