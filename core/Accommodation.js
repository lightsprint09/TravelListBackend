class Accommodation {
	constructor(webUrl, name, descriptionText, location, category, created) {
		this.webUrl = webUrl
		this.name = name
		this.descriptionText = descriptionText
		this.location = location
		this.category = { id: category }
		this.created = created
	}
}

module.exports = Accommodation