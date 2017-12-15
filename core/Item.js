class Item {
	constructor(webUrl, name, descriptionText, location, category, created, images) {
		this.webUrl = webUrl
		this.name = name
		this.descriptionText = descriptionText
		this.location = location
		this.category = { id: category }
		this.created = created
		this.images = images
	}
}

module.exports = Item