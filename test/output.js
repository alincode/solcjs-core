require('./utils/mock')();

const chai = require('chai');
chai.should();

let { v5, v4, v3, v2 } = require('./utils/standard');

describe('output', () => {

  it('0.5.1', async () => {
    await v5('v0.5.1-stable-2018.12.03');
  });

  it('0.4.25', async () => {
    await v4('v0.4.25-stable-2018.09.13');
  });

  it('0.3.6', async () => {
    await v3('v0.3.6-stable-2016.09.08');
  });

  it('0.2.2', async () => {
    await v2('v0.2.2-stable-2016.03.10');
  });

});