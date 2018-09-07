'use strict';

const mpanReader = require('./src/mpan-reader');
const pdfParser = require('./src/pdf-parser');
const Promise = require('bluebird');

function findMpan( billPDF, provider ) {
  return new Promise((resolve, reject) => {
    pdfParser.parse(billPDF)
      .then(billContent => {
        let mpan = mpanReader.read( billContent, provider );

        if(mpan == null) {
          resolve({ error: 'Could not find an MPAN in the given bill' })
        } else {
          resolve(mpan);
        }
      })
      .then(err => {
        reject(err);
      });
  });
}
module.exports = { findMpan }
