let { v5, v4, v3, v2 } = require('./utils/standard');

describe('requireCompiler', () => {

  it('0.5.3', async () => {
    await v5('v0.5.3-stable-2019.01.22');
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