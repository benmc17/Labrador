let assert = require('assert');
let proxyquire = require('proxyquire').noCallThru();
let Promise = require('bluebird');
let path = require('path');

let mpanResult = {
  profileType: '00',
  mtc: '111',
  llfc: '222',
  distributorId: '13',
  uniqueId: '1234 5678',
  checkDigit: '345',
  fullNumber: '00 111 222 13 1234 5678 345'
};
let mockMpanReader = null;
let mockPdfParser = null;
let pdfFile = null;
let pdfText = null;
let billReader = null;

describe('testing bill-reader.js', () => {

  beforeEach(() => {
    pdfFile = null, pdfText = null;
    mockMpanReader = {
      read : function( text ) {
        pdfText = text;
        return mpanResult;
      }
    };
    mockPdfParser = {
      parse : function( file ) {
        pdfFile = file;
        return new Promise((resolve, reject) => {
          resolve(' test test test test S   00   111   222   13   1234   5678   345   test testing');
        });
      }
    };
    billReader = proxyquire('../bill-reader', {
      './src/mpan-reader': mockMpanReader,
      './src/pdf-parser': mockPdfParser
    });
  });

  describe('findMpan()', () => {

    it('Should attempt to parse the given PDF File', () => {
      billReader.findMpan('./test.pdf');
      assert(pdfFile === './test.pdf');
    });

    it('Should attempt to find the MPAN in the bill content IF text content is NOT null', () => {
      return billReader.findMpan('./test.pdf')
        .then(text => {
          assert(pdfText === ' test test test test S   00   111   222   13   1234   5678   345   test testing');
        });
    });

    it('Should return the mpan IF it is not null', () => {
      return billReader.findMpan('./test.pdf')
        .then(mpan => {
          assert(mpanResult === mpan);
        });
    });

    it('Should return error IF the mpan in null', () => {
      mockMpanReader.read = text => null;
      return billReader.findMpan('./test.pdf')
        .then(result => {
          assert(result.error === 'Could not find an MPAN in the given bill');
        });
    });

    it('Should throw an error IF the pdf parser throws an error', () => {
      mockPdfParser.parse = file => { throw "test" };
      return billReader.findMpan('./test.pdf')
        .then(text => {
          assert(false);
        })
        .catch(err => {
          assert(err === 'test');
        })
    });
  });
});

describe('testing integration', () => {

  beforeEach(() => {
    billReader = require('../bill-reader');
  });

  describe('findMpan()', () => {

    it('Should read Avro MPAN', () => {
      return billReader.findMpan(path.resolve(__dirname, '../doc/avro.pdf'), 'avro')
        .then(mpan => {
          assert('01 801 001 11 6000 1208 212' === mpan.fullNumber);
        });
    });

    it('Should read ISupply MPAN', () => {
      return billReader.findMpan(path.resolve(__dirname, '../doc/isupply.pdf'), 'isupply')
        .then(mpan => {
          assert('01 801 902 12 0005 1808 366' === mpan.fullNumber);
        });
    });

    it('Should read Octopus MPAN', () => {
      return billReader.findMpan(path.resolve(__dirname, '../doc/octopus.pdf'), 'mpan')
        .then(mpan => {
          assert('01 801 902 12 0004 2354 898' === mpan.fullNumber);
        });
    });
  });
});
