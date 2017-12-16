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
				console.log(isEmptyObject(jsonData.bootstrapData.reduxData));
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
	supportedURLs: ["airbnb.com", "airbnb.de"],
	extractor: Extractor,
	testData: {
		url: "https://www.airbnb.de/rooms/10201545",
		expection: testData
	}
}
