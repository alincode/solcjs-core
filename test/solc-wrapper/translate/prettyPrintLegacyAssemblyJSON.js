const fs = require('fs');
const path = require('path');
const translate = require('../../../src/solc-wrapper/translate');
const chai = require('chai');
chai.should();

describe('prettyPrintLegacyAssemblyJSON', () => {

  it('Works properly', async () => {
    var fixtureAsmJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtureAsmJson.json')).toString());
    var fixtureAsmJsonSource = fs.readFileSync(path.resolve(__dirname, 'fixtureAsmJson.sol')).toString();
    var fixtureAsmJsonOutput = fs.readFileSync(path.resolve(__dirname, 'fixtureAsmJson.output')).toString();
    translate.prettyPrintLegacyAssemblyJSON(fixtureAsmJson, fixtureAsmJsonSource).should.be.eq(fixtureAsmJsonOutput);
  });
});