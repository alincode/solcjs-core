const solcjsCore = require('../src');

describe('getReadCallback', () => {

  it('local import', async () => {
    const sourceCode = `
    pragma solidity >0.4.99 <0.6.0;

    import "lib.sol";

    library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
    }

    contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
    }`;

    const contents = 'library L { function f() internal returns (uint) { return 7; } }';
    let myDB = new Map();
    myDB.set('lib.sol', contents);

    const getImportContent = async function (path) {
      return myDB.get(path);
    };

    let readCallback = await solcjsCore.getReadCallback(
      sourceCode,
      getImportContent
    );
    readCallback('lib.sol').contents.should.be.eq(contents);
  });

});