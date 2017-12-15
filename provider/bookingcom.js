const osmosis = require('osmosis');
const Location = require("./../core/Location")
const Accommodation = require("./../core/Accommodation")
const { URL, URLSearchParams } = require('url');

class Extractor {
	
	extractFrom(url) {
		return new Promise(function(resolve, reject) {
			osmosis
			.get(url)
			.find('script[type="application/ld+json"]')
			.set("data")
			.data(function(jsonText) {
				let json = JSON.parse(jsonText.data)
				let location = parseLocationFrom(json.hasMap);
				let accommodation = new Accommodation(url, json.name, json.description, location);
				 
		    	resolve(accommodation)
			})
		})
		
	}
}

function parseLocationFrom(url) {
	const myURL = new URL(url);
	let coordinates = myURL.searchParams.get('center').split(",")
	return new Location(coordinates[0], coordinates[1], true);
}

module.exports = {
	supportedURLs: ["booking.com"],
	extractor: Extractor,
	testData: {
		url: "https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGg7iAEBmAEHuAEHyAEN2AEB6AEB-AELkgIBeagCAw;sid=8db6207db76b68c8d54dd87a6a20424e;dest_id=-117543;dest_type=city;dist=0;hapos=3;hpos=3;room1=A%2CA;sb_price_type=total;srepoch=1513323091;srfid=8f2625021e274652e3c3b7d98d7aa1e6c3fcc6acX3;srpvid=13b834e94f3600b5;type=total;ucfs=1&#hotelTmpl",
		expection: { url: 'https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGg7iAEBmAEHuAEHyAEN2AEB6AEB-AELkgIBeagCAw;sid=8db6207db76b68c8d54dd87a6a20424e;dest_id=-117543;dest_type=city;dist=0;hapos=3;hpos=3;room1=A%2CA;sb_price_type=total;srepoch=1513323091;srfid=8f2625021e274652e3c3b7d98d7aa1e6c3fcc6acX3;srpvid=13b834e94f3600b5;type=total;ucfs=1&#hotelTmpl',
  title: 'The Smallest Hostel of Florence',
  description: 'Das The Smallest Hostel of Florence begrüßt Sie in Florenz, nur 5 Gehminuten von der Basilika Santa Maria Novella entfernt.',
  location: 
   { latitude: '43.7753645',
     longitude: '11.2545613',
     exactLocation: true } }
	}
}