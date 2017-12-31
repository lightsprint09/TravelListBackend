const express = require('express');
var bodyParser = require('body-parser')
const allProviders = require("./AllProviderConfiguration");
const FallbackExtractor = require("./provider/fallbackParser.js").extractor;

var app = express()
app.use(bodyParser.json());


// respond with "hello world" when a GET request is made to the homepage
app.post('/extractTrip', function (req, res) {
	console.log(req.body)
	let url = req.body.url
 	const provider = allProviders.providerFor(url) || new FallbackExtractor();
	const result = provider.extractFrom(url, req.body.created);
	result.then(function(payload) {
	 	res.send(payload)
	})
})

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`now browse to localhost:${port}`));


