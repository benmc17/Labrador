'use strict';

const mpanRegEx = /S\s+([0-9]{2,4}\s+[0-9]{2,4}\s+[0-9]{2,4}\s+[0-9]{2,4}\s+[0-9]{2,4}\s+[0-9]{2,4}\s+[0-9]{2,4})\s+/;

// Not all PDF formats parse in the correct order
// so need some modification
const adjusters = {
  'isupply': splitMpan => {
    let mpan = [];

    splitMpan.forEach((val, i) => {
      if(i == 3) {
        mpan.push(splitMpan[0]);
      }
      if(i > 0) {
        mpan.push(val);
      }
    })
    return mpan;
  }
};

function read( billContent, provider ) {
  if(!billContent) return null;

  let match = billContent.match(mpanRegEx);

  if(match === null || match.length == 0) return null;

  let mpan = match[1].replace(/\s{1,}/g, ' ');
  let splitMpan = match[1].split(/\s{1,}/g);
  let adjust = adjusters[provider];

  if(adjust) {
    splitMpan = adjust(splitMpan);
    mpan = `${splitMpan[0]} ${splitMpan[1]} ${splitMpan[2]} ${splitMpan[3]} ${splitMpan[4]} ${splitMpan[5]} ${splitMpan[6]}`
  }
  return {
    profileType: splitMpan[0],
    mtc: splitMpan[1],
    llfc: splitMpan[2],
    distributorId: splitMpan[3],
    uniqueId: `${splitMpan[4]} ${splitMpan[5]}`,
    checkDigit: splitMpan[6],
    fullNumber: mpan
  }
};
module.exports = { read }
