const solcjsCore = require('../src');

describe('getVersion', () => {

  it('latest version', async () => {
    let version = await solcjsCore.getVersion();
    version.indexOf('stable').should.be.above(-1);
  });

  it('assign version', async () => {
    let version = await solcjsCore.getVersion('v0.5.1-stable-2018.12.03');
    version.should.be.eq('v0.5.1-stable-2018.12.03');
  });
});