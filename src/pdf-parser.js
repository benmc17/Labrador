'use strict';

const fs = require('fs');
const pdfParser = require('pdf-parse');

function parse( pdfFile ) {
  try {
    let buffer = fs.readFileSync(pdfFile);

    return pdfParser(buffer)
      .then(data => {
        return data.text;
      });
  }
  catch(error)
  {
    console.error(error);
    return null;
  }
}
module.exports = { parse }
