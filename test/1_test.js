const solcVersion = require('solc-version');
const solcjsCore = require('../src');
const solcWrapper = require('../src/solc-wrapper/wrapper');

describe('test', () => {

  let compilersource;
  let version;
  let url;
    
  it('getCompilersource', async () => {
    version = await solcjsCore.getVersion(versionList);
    url = await solcVersion.version2url(version, versionList);
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

  it('compile fail 1', async () => {
    let sourceCode = 'cc';
    try {
      await newCompile(sourceCode);
    } catch (errors) {
      console.log(errors);
      errors.should.be.a('array');
      errors[0].should.have.all.keys('component', 'formattedMessage', 'message', 'type');
      errors[0].type.should.be.equal('ParserError');
    }
  });

  it('compile fail 2', async () => {
    try {
      await newCompile(testContract.v5WithError);
    } catch (errors) {
      errors.should.be.a('array');
      errors[0].should.have.all.keys('component', 'formattedMessage', 'message', 'type');
      errors[0].type.should.be.equal('SyntaxError');
    }
  });

  it.skip('getImportContent missing error', async () => {
    try {
      await newCompile(testContract.v5WithImport);
    } catch (error) {
      error.message.should.be.eq('you should pass getImportContent function in the second pararmeter.');
    }
  });

});