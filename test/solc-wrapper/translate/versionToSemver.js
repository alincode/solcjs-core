const chai = require('chai');
chai.should();

const translate = require('../../../src/solc-wrapper/translate');
const versionToSemver = translate.versionToSemver;

describe('Version string to Semver translator', () => {

  it('Only numbers', async () => {
    versionToSemver('0.1.0').should.be.eq('0.1.0');
  });

  it('New style release (semver)', async () => {
    versionToSemver('0.4.5+commit.b318366e.Emscripten.clang').should.be.eq('0.4.5+commit.b318366e.Emscripten.clang');
  });

  it('New style nightly (semver)', async () => {
    versionToSemver('0.4.20-nightly.2018.2.13+commit.27ef9794.Emscripten.clang').should.be.eq('0.4.20-nightly.2018.2.13+commit.27ef9794.Emscripten.clang');
  });

  it('Old style 0.1.1', async () => {
    versionToSemver('0.1.1-6ff4cd6b/RelWithDebInfo-Emscripten/clang/int').should.be.eq('0.1.1+commit.6ff4cd6b');
  });

  it('Old style 0.1.2', async () => {
    versionToSemver('0.1.2-5c3bfd4b*/.-/clang/int').should.be.eq('0.1.2+commit.5c3bfd4b');
  });

  it('Broken 0.1.3', async () => {
    versionToSemver('0.1.3-0/.-/clang/int linked to libethereum-0.9.92-0/.-/clang/int').should.be.eq('0.1.3');
  });

  it('Old style 0.2.0', async () => {
    versionToSemver('0.2.0-e7098958/.-Emscripten/clang/int linked to libethereum-1.1.1-bbb80ab0/.-Emscripten/clang/int').should.be.eq('0.2.0+commit.e7098958');
  });

  it('Old style 0.3.5', async () => {
    versionToSemver('0.3.5-371690f0/Release-Emscripten/clang/Interpreter').should.be.eq('0.3.5+commit.371690f0');
  });

  it('Old style 0.3.6', async () => {
    versionToSemver('0.3.6-3fc68da5/Release-Emscripten/clang').should.be.eq('0.3.6+commit.3fc68da5');
  });
});