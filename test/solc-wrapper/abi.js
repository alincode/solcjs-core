require('solcjs-mock')();

const chai = require('chai');
chai.should();

const abi = require('../../src/solc-wrapper/abi');

describe('ABI translator', () => {

  it('Empty ABI', async () => {
    abi.update('0.4.0', []).should.deep.be.a('array');
  });

  it('0.1.1 (no constructor)', async () => {
    let input = [{ inputs: [], type: 'constructor' }];
    let expected = [{ inputs: [], payable: true, stateMutability: 'payable', type: 'constructor' }, { payable: true, stateMutability: 'payable', type: 'fallback' }];
    abi.update('0.1.1', input).should.be.deep.eq(expected);
  });

  it('0.3.6 (constructor)', async () => {
    let input = [{ inputs: [], type: 'constructor' }];
    let expected = [{ inputs: [], payable: true, stateMutability: 'payable', type: 'constructor' }, { payable: true, stateMutability: 'payable', type: 'fallback' }];
    abi.update('0.3.6', input).should.be.deep.eq(expected);
  });

  it('0.3.6 (function)', async () => {
    let input = [{ inputs: [], type: 'function' }];
    let expected = [{ inputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { payable: true, stateMutability: 'payable', type: 'fallback' }];
    abi.update('0.3.6', input).should.be.deep.eq(expected);
  });

  it('0.3.6 (event)', async () => {
    let input = [{ inputs: [], type: 'event' }];
    let expected = [{ inputs: [], type: 'event' }, { payable: true, stateMutability: 'payable', type: 'fallback' }];
    abi.update('0.3.6', input).should.be.deep.eq(expected);
  });

  it('0.3.6 (has no fallback)', async () => {
    let input = [{ inputs: [], type: 'constructor' }];
    let expected = [{ inputs: [], type: 'constructor', payable: true, stateMutability: 'payable' }, { type: 'fallback', payable: true, stateMutability: 'payable' }];
    abi.update('0.3.6', input).should.be.deep.eq(expected);
  });

  it('0.4.0 (has fallback)', async () => {
    let input = [{ inputs: [], type: 'constructor' }, { type: 'fallback' }];
    let expected = [{ inputs: [], type: 'constructor', payable: true, stateMutability: 'payable' }, { type: 'fallback', stateMutability: 'nonpayable' }];
    abi.update('0.4.0', input).should.be.deep.eq(expected);
  });

  it('0.4.0 (constant function)', async () => {
    let input = [{ inputs: [], type: 'function', constant: true }];
    let expected = [{ inputs: [], constant: true, stateMutability: 'view', type: 'function' }];
    abi.update('0.4.0', input).should.be.deep.eq(expected);
  });

  it('0.4.1 (constructor not payable)', async () => {
    let input = [{ inputs: [], payable: false, type: 'constructor' }];
    let expected = [{ inputs: [], payable: true, stateMutability: 'payable', type: 'constructor' }];
    abi.update('0.4.1', input).should.be.deep.eq(expected);
  });

  it('0.4.5 (constructor payable)', async () => {
    let input = [{ inputs: [], payable: false, type: 'constructor' }];
    let expected = [{ inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' }];
    abi.update('0.4.5', input).should.be.deep.eq(expected);
  });

  it('0.4.16 (statemutability)', async () => {
    let input = [{ inputs: [], payable: false, stateMutability: 'pure', type: 'function' }];
    let expected = [{ inputs: [], payable: false, stateMutability: 'pure', type: 'function' }];
    abi.update('0.4.16', input).should.be.deep.eq(expected);
  });

});