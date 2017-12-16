const fs = require("fs");
const { URL, URLSearchParams } = require('url');
const normalizedPath = require("path").join(__dirname, "/provider");
const providersFiles = fs.readdirSync(normalizedPath).filter(function(file) { return file.indexOf("js") !== -1 })


function allSupportedWebsites() {
	let supportedWebsites = {}
	
	providersFiles.forEach(function(providerFile) { 
		let provider = require("./provider/" + providerFile);
		provider.supportedURLs.forEach(function(url) { 
			supportedWebsites[url] = normalizedPath + "/" + providerFile
		})
		
	}) 
	return supportedWebsites
}

function providerFor(urlString) {
	const url = new URL(urlString);
	let file = allSupportedWebsites()[url.host.replace("www.", "")];
	const module = require(file)
	if (!module) {
		return
	}
	const Extractor = module.extractor
	return new Extractor()
}


module.exports = {
	allProviders: providersFiles,
	allSupportedWebsites: allSupportedWebsites,
	providerFor: providerFor
}