require('./utils/mock')();

const chai = require('chai');
chai.should();

const solcVersion = require('solc-version');
const solcjsCore = require('../src');
const solcWrapper = require('../src/solc-wrapper/wrapper');

describe('test', () => {

  let compilersource;
  let version;
  let url;
    
  it('getCompilersource', async () => {
    version = await solcjsCore.getVersion();
    url = await solcVersion.version2url(version);
    compilersource = await solcjsCore.getCompilersource(url);
    compilersource.substring(0, 10).should.be.eq('var Module');
  });
  
  let solc;
  it('loadModule', async () => {
    solc = solcjsCore.loadModule(compilersource);
    solc.calledRun.should.be.a('boolean');
    solc.calledRun.should.eq(true);
  });

  let newCompile;
  it('pretest', async () => {
    let _compiler = solcWrapper(solc);
    _compiler.opts = { version, url };
    newCompile = solcjsCore.getCompile(_compiler);
    await solcjsCore.pretest(newCompile, version);
  });

  it('compile fail', async () => {
    let sourceCode = 'cc';
    try {
      await newCompile(sourceCode);
    } catch (error) {
      error.should.be.a('error');
      error.message.should.be.eq('compile fail');
    }
  });

  it('compiler error', async () => {
    let compilerV4_25 = await solcjsCore.solc('v0.4.25-stable-2018.09.13');
    const sourceCode = `
     contract Mortal {
      address publi owner;
      constructor() public { owner = msg.sender; }
      function kill() public { if (msg.sender == owner) selfdestruct(owner); }
    }
     contract Greeter is Mortal {
      string public greeting;
      constructor(string memory _greeting) public {
        greeting = _greeting;
      }
    }`;
    try {
      await compilerV4_25(sourceCode);
    } catch (error) {
      error.should.have.all.keys('component', 'formattedMessage', 'message', 'type', 'severity', 'sourceLocation');
      error.type.should.be.equal('ParserError');
    }
  });

});