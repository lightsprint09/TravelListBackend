/*
let dataStructure = {
	content: {
		accomodations: [],
		restaurants: [],
		events: [],
		culture: [],
		information: []
	}
}

{
	url: "URL",
	title: "Required",
	description: "optional",
	location: {
		latitude: 12.1,
		longitude: 2.12
	}
}
*/

let Extractor = require("./provider/bookingcom").extractor;

let extractor = new Extractor()

extractor.extractFrom("https://www.booking.com/hotel/it/the-smallest-hostel-of-florence.de.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGg7iAEBmAEHuAEHyAEN2AEB6AEB-AELkgIBeagCAw;sid=8db6207db76b68c8d54dd87a6a20424e;dest_id=-117543;dest_type=city;dist=0;hapos=3;hpos=3;room1=A%2CA;sb_price_type=total;srepoch=1513323091;srfid=8f2625021e274652e3c3b7d98d7aa1e6c3fcc6acX3;srpvid=13b834e94f3600b5;type=total;ucfs=1&#hotelTmpl").then(function(result) {
	console.log(JSON.parse(JSON.stringify(result)))
})

