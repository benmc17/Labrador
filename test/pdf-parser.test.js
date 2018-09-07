let assert = require('assert');
let path = require("path");
let proxyquire = require('proxyquire').noCallThru();

let pdfParser = require('../src/pdf-parser');

describe('testing pdf-parser.js', () => {

  describe('parse()', () => {

    it('Should return a Promise', () => {
      let response = pdfParser.parse(path.resolve(__dirname, './test-doc-1.pdf'));
      assert(response.toString() === '[object Promise]');
      return response;
    }).timeout(5000);

    it('Should return the text elements of the file', () => {
      return pdfParser.parse(path.resolve(__dirname, './test-doc-1.pdf'))
        .then( data => {
          assert(data === ' T est 1   T est 2   T est 3   \n\n');
        });
    }).timeout(5000);

    it('Should return null if the file does not exist', () => {
      let result = pdfParser.parse(path.resolve(__dirname, './test-doc-doesnt-exist.pdf'))
      assert(!result);
    });
  });
});
