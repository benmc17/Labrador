let assert = require('assert');
let mpanReader = require('../src/mpan-reader');

describe('testing mpan-reader.js', () => {

  describe('read()', () => {

    it('Should find the mpan number', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13   1234   5678   345   test testing');
      assert(mpan);
    });

    it('Should return null IF there is no mpan number in the text', () => {
      let mpan = mpanReader.read(' test test test test S 222 33 test testing');
      assert(!mpan);
    });

    it('Should return null IF there is an mpan number but no S in the text', () => {
      let mpan = mpanReader.read(' test test test test    00   111   222   13   1234   5678   345   test testing');
      assert(!mpan);
    });

    it('Should return null IF there is a letter in the mpan number text', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   22A   13   1234   5678   345   test testing');
      assert(!mpan);
    });

    it('Should return null IF the content is empty', () => {
      let mpan = mpanReader.read(' ');
      assert(!mpan);
    });

    it('Should return null IF the content is undefined', () => {
      let mpan = mpanReader.read();
      assert(!mpan);
    });

    it('Should return combined mpan number in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13   1234   5678 345   test testing');
      assert(mpan.fullNumber === '00 111 222 13 1234 5678 345');
    });

    it('Should return the profile type in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13 1234   5678   345   test testing');
      assert(mpan.profileType === '00');
    });

    it('Should return the mtc in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13   1234   5678   345   test testing');
      assert(mpan.mtc === '111');
    });

    it('Should return the llfc in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00  111   222   13   1234   5678   345   test testing');
      assert(mpan.llfc === '222');
    });

    it('Should return the distributor id in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00 111   222   13   1234   5678   345   test testing');
      assert(mpan.distributorId === '13');
    });

    it('Should return the unique id in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13   1234   5678   345   test testing');
      assert(mpan.uniqueId === '1234 5678');
    });

    it('Should return the check digit in an object', () => {
      let mpan = mpanReader.read(' test test test test S   00   111   222   13   1234   5678   345   test testing');
      assert(mpan.checkDigit === '345');
    });

    it('Should adjust based on an adjust function', () => {
      let mpan = mpanReader.read(' test test test test S   222 00   111   13   1234   5678   345   test testing', 'isupply');
      assert(mpan.fullNumber === '00 111 222 13 1234 5678 345');
    });
  });
});
