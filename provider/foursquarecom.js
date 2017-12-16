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
		webUrl: 'https://foursquare.com/v/upper-burger-grill/56f31647498e5e450e4383fa',
		name: 'Upper Burger Grill - Burger Joint in Charlottenburg',
		descriptionText: 'Carefully prepared with love for gourmet! Just try – you see, no lie! Meet our Meat – don’t stop Eat! We use Dry Aged Beef and US Prime beef only',
		category: { id: "food" },
		created: date,
		"location": {
	        "latitude": 52.503295976364534,
	        "longitude": 13.334470510821701,
	        "exactLocation": true
	    },
		images: [
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_83mVj9-KY5__pdEcmrg78go5FQfb_K3VR_cJWvySCR0.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_QXD9-FCHGhi-A4g69yQZEvl-7JF6VZYV6Ns-JPtPzsM.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_JiaQ5z-k_sSJELer0yUJIC02FFqy5Ik1rZwRNMGOWlg.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_UTDNFk0073SLEyVQ0Fh1gW4_w1f-WqzHqVC0oyYvwhs.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_9IdwcvQ_Rhsw8hoolulfQEQv-8OLjqsSesB5bRam8Zw.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_LAxbXUg-EQooITeXUFoZaqmi5OuIoQMCQgxd1oquho8.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_5dq8m9wT7Gc-Y0QIyh8jPN1hx5s52HQWFLiV3LNK6P0.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_gIKVPHjJkQE8hp1JW8HJPqu4yDo87cWCiNc1xFmsvVY.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_CuG7m9tNwBKEVhDaOA6QRa_wjcGn3a4DZrqK2fMAXp8.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_CMijtH7LIgGv760cE68nb7EZtd-pcBdplRmWfdu-WlM.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170678006_JRJfGai1TlYIFCC8h6uUTdsaYv6EhrdXqDceC1ZC4OA.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_rG5u7AADYNbp9sZbRH6ROS9T74ENHxcbHR7iEWvSsjE.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_gfmKJ3H7B5u_KhS6KSi0eRSh_ExA27vgzhUPySf91b8.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/93567__-tSgFDwddi2ifc-Adnn1Z2_t8Lbg75xaDSeHBzsolg.jpg",
	        "https://igx.4sqi.net/img/general/1000x1000/170675224_UfGJ_nJ3cpMbrSD7cIwyVN3HeuDhTNhSUU7p5EAklzA.jpg"
	    ]
    }
}

module.exports = {
	supportedURLs: ["foursquare.com"],
	extractor: Extractor,
	testData: {
		url: "https://foursquare.com/v/upper-burger-grill/56f31647498e5e450e4383fa",
		expection: testData
	}
}
