class Item {
	constructor(webUrl, name, descriptionText, location, category, created, images, startDate) {
		this.webUrl = webUrl
		this.name = name
		this.descriptionText = descriptionText
		this.location = location
		this.category = { id: category }
		this.created = created
		this.images = images
		if(startDate != null) {
			this.startDate = startDate
		}
	}
}

class URL {
	constructor(original, canocinal, affilate) {
		this.original = original;
		this.canocinal = canocinal;
		this.affilate = affilate;
	}
}

module.exports = Item
