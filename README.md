# MPAN FINDER

## Use

Use the function (using Promises) in code as follows:

```
let billReader = require('bill-reader');

billReader.findMpan('./MyBill.pdf', 'my energy provider')
  .then(mpan => {
    console.log(JSON.stringify(mpan));
  })
  .catch(err => {
    console.err('Ahhhhhh theres been an error: ' + err);
  });
```

## Design

The MPAN reader function has been written as a library function that returns a Promise, to used within a Node application. The function has been written using TDD and enforcing single responsibility.

The two main steps are to parse the pdf and then to find the MPAN:
- pdf-parser.js - Parses the PDF
- mpan-reader.js - Reads the MPAN from the data
- bill-reader.js - Orchestrates the process.

## Testing

The function has been written using TDD and therefore unit tests were written prior to their implementation and should cover the smallest unit of functionality (with the exception of integration tests)

## Compatibility
The function uses regular expressions to obtain the MPAN number and output it in the generic format as explained on the Wikipedia page. However the pdf values may not parse in the correct order
occasionally which could cause issues. This issue is mitigated as a custom 'adjust' function can be added to change the digits based on the bill supplier type.

The main issue is the 3 sets of 3 digits where two of them have no distinguishing characteristics as they could be 000-999 so its impossible to determine which sections they should be (if they are parsed in the wrong order). The third digit could be calculated as it is the check digit and this could be a further enhancement.

## Limitations

Several limitations are present
- Only 3 bills to test from presents the possibility of it not being compatible with some bill formats
- The provider name is required in the case of bills that do not parse correctly
- Incorrectly parsing bills need to have their MPAN values manually 'adjusted' this could pose issues as not all providers bills may be the same.

## Next steps

- Add in functionality to check the check digit is correct
- Create a library for bespoke PDF reading that specifically focuses on the MPAN and could therefore read it in as a table.
- Adjust functions could be split out and created using a factory in order to maintain separation of concerns.
- Implement more intelligent parsing in the case of the ISupply bill (or others) which require a hard coded 'workaround'
- For a larger more scalable application implement the function in a Lambda function which could be triggered by an upload to Dynamo or S3.
- For testing/low traffic it could be incorporated into the server side of an Express application.
- The adjustment parameters could even be added to a database table which are loaded on demand and therefore makes the application far more maintainable.
- For full coverage automated tests could be setup to test all 70 providers bill formats.
