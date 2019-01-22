require('./utils/mock')();

global.testContract = require('./utils/testContract');
global.versionList = JSON.stringify(require('./utils/list.json'));

const chai = require('chai');
chai.should();

console.log('=== test bootstrap ===');