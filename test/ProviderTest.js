const fs = require("fs");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

var normalizedPath = require("path").join(__dirname, "../provider");
let providersFiles = fs.readdirSync(normalizedPath).filter(function(file) { return file.indexOf("js") !== -1 })

describe('Test all providers', () => {
  it('should load all providers', () => {
	
	let tests = providersFiles.map(function(providerFile) {
		let providerModule = require("../provider/" + providerFile);
		let provider = new providerModule.extractor()
		let testData = providerModule.testData
		let date = new Date()
		let promise = provider.extractFrom(testData.url, date)
		
		return expect(promise).to.eventually.have.deep.equal(testData.expection(date)) 
	})
	
	return Promise.all(tests)
	
  }).timeout(500000);
});