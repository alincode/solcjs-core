require('solcjs-mock')();

const chai = require('chai');
chai.should();

const linker = require('../../src/solc-wrapper/linker');

describe('findLinkReferences', () => {

  it('Empty bytecode', async () => {
    linker.findLinkReferences('').should.be.deep.eq({});
  });

  it('No references', async () => {
    linker.findLinkReferences('6060604052341561000f57600080fd').should.be.deep.eq({});
  });

  it('One reference', async () => {
    var bytecode = '6060604052341561000f57600080fd5b60f48061001d6000396000f300606060405260043610603e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326121ff081146043575b600080fd5b3415604d57600080fd5b60536055565b005b73__lib2.sol:L____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160006040518083038186803b151560b357600080fd5b6102c65a03f4151560c357600080fd5b5050505600a165627a7a723058207979b30bd4a07c77b02774a511f2a1dd04d7e5d65b5c2735b5fc96ad61d43ae40029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:L': [{ start: 116, length: 20 }] });
  });

  it('Two references', async () => {
    const bytecode = '6060604052341561000f57600080fd5b61011a8061001e6000396000f30060606040526004361060255763ffffffff60e060020a60003504166326121ff08114602a575b600080fd5b3415603457600080fd5b603a603c565b005b73__lib2.sol:L____________________________6326121ff06040518163ffffffff1660e060020a02815260040160006040518083038186803b1515608157600080fd5b6102c65a03f41515609157600080fd5b50505073__linkref.sol:Lx________________________6326121ff06040518163ffffffff1660e060020a02815260040160006040518083038186803b151560d957600080fd5b6102c65a03f4151560e957600080fd5b5050505600a165627a7a72305820fdfb8eab411d7bc86d7dfbb0c985c30bebf1cc105dc5b807291551b3d5aa29d90029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:L': [{ start: 92, length: 20 }], 'linkref.sol:Lx': [{ start: 180, length: 20 }] });
  });

  it('Library name with leading underscore', async () => {
    const bytecode = '6060604052341561000f57600080fd5b60f48061001d6000396000f300606060405260043610603e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326121ff081146043575b600080fd5b3415604d57600080fd5b60536055565b005b73__lib2.sol:_L___________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160006040518083038186803b151560b357600080fd5b6102c65a03f4151560c357600080fd5b5050505600a165627a7a7230582089689827bbf0b7dc385ffcb4b1deb9f9e61741f61f89b4af65f806ff2b0d73470029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:_L': [{ start: 116, length: 20 }] });
  });

  it('Library name with leading underscore (without fqdn)', async () => {
    const bytecode = '6060604052341561000f57600080fd5b60f48061001d6000396000f300606060405260043610603e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326121ff081146043575b600080fd5b3415604d57600080fd5b60536055565b005b73___L____________________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160006040518083038186803b151560b357600080fd5b6102c65a03f4151560c357600080fd5b5050505600a165627a7a7230582089689827bbf0b7dc385ffcb4b1deb9f9e61741f61f89b4af65f806ff2b0d73470029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ '_L': [{ start: 116, length: 20 }] });
  });

  it('Library name with underscore in the name', async () => {
    const bytecode = '6060604052341561000f57600080fd5b60f48061001d6000396000f300606060405260043610603e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326121ff081146043575b600080fd5b3415604d57600080fd5b60536055565b005b73__lib2.sol:L_L__________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160006040518083038186803b151560b357600080fd5b6102c65a03f4151560c357600080fd5b5050505600a165627a7a723058205cb324a27452cc7f8894a57cb0e3ddce2dce0c423e4fc993a3dd51287abd49110029';

    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:L_L': [{ start: 116, length: 20 }] });
  });

  // Note: this is a case the reference finder cannot properly handle as there's no way to tell
  it('Library name with trailing underscore', async () => {
    const bytecode = '6060604052341561000f57600080fd5b60f48061001d6000396000f300606060405260043610603e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326121ff081146043575b600080fd5b3415604d57600080fd5b60536055565b005b73__lib2.sol:L____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160006040518083038186803b151560b357600080fd5b6102c65a03f4151560c357600080fd5b5050505600a165627a7a7230582058e61511a603707222cfa83fd3ae4269f94eb86513cb9042cf0b44877403d85c0029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:L': [{ start: 116, length: 20 }] });
  });

  it('Invalid input (too short)', async () => {
    const bytecode = '6060604052341561000____66606060606060';
    linker.findLinkReferences(bytecode).should.be.deep.eq({});
  });

  it('Invalid input (1 byte short)', async () => {
    const bytecode = '6060604052341561000__lib2.sol:L___________________________66606060606060';
    linker.findLinkReferences(bytecode).should.be.deep.eq({});
  });

  it('Two references with same library name', async () => {
    const bytecode = '6060604052341561000f57600080fd5b61011a8061001e6000396000f30060606040526004361060255763ffffffff60e060020a60003504166326121ff08114602a575b600080fd5b3415603457600080fd5b603a603c565b005b73__lib2.sol:L____________________________6326121ff06040518163ffffffff1660e060020a02815260040160006040518083038186803b1515608157600080fd5b6102c65a03f41515609157600080fd5b50505073__lib2.sol:L____________________________6326121ff06040518163ffffffff1660e060020a02815260040160006040518083038186803b151560d957600080fd5b6102c65a03f4151560e957600080fd5b5050505600a165627a7a72305820fdfb8eab411d7bc86d7dfbb0c985c30bebf1cc105dc5b807291551b3d5aa29d90029';
    linker.findLinkReferences(bytecode).should.be.deep.eq({ 'lib2.sol:L': [{ start: 92, length: 20 }, { start: 180, length: 20 }] });
  });
});

describe('linkBytecode', () => {

  it('link properly', async () => {
    /*
      'lib.sol': 'library L { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__lib.sol:L_____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a72305820ea2f6353179c181d7162544d637b7fe2d9e8da9803a0e2d9eafc2188d1d59ee30029';
    bytecode = linker.linkBytecode(bytecode, { 'lib.sol:L': '0x123456' });
    bytecode.indexOf('_').should.be.below(0);
  });

  it('link properly with two-level configuration (from standard JSON)', async () => {
    /*
      'lib.sol': 'library L { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__lib.sol:L_____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a72305820ea2f6353179c181d7162544d637b7fe2d9e8da9803a0e2d9eafc2188d1d59ee30029';
    bytecode = linker.linkBytecode(bytecode, { 'lib.sol': { 'L': '0x123456' } });
    bytecode.indexOf('_').should.be.below(0);
  });

  it('linker to fail with missing library', async () => {
    /*
      'lib.sol': 'library L { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__lib.sol:L_____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a72305820ea2f6353179c181d7162544d637b7fe2d9e8da9803a0e2d9eafc2188d1d59ee30029';
    bytecode = linker.linkBytecode(bytecode, {});
    bytecode.indexOf('_').should.be.above(0);
  });

  it('linker to fail with invalid address', async () => {
    /*
      'lib.sol': 'library L { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__lib.sol:L_____________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a72305820ea2f6353179c181d7162544d637b7fe2d9e8da9803a0e2d9eafc2188d1d59ee30029';

    try {
      linker.linkBytecode(bytecode, { 'lib.sol:L': '' });
    } catch (error) {
      error.should.be.a('error');
    }
  });

  it('linker properly with truncated library name', async () => {
    /*
      'lib.sol': 'library L1234567890123456789012345678901234567890 { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L1234567890123456789012345678901234567890.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__lib.sol:L123456789012345678901234567__6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a723058209f88ff686bd8ceb0fc08853dc1332d5ff81dbcf5af3a1e9aa366828091761f8c0029';
    bytecode = linker.linkBytecode(bytecode, { 'lib.sol:L1234567890123456789012345678901234567890': '0x123456' });
    bytecode.indexOf('_').should.be.below(0);
  });

  it.skip('hashed placeholder', async () => {
    let bytecode = '6060604052341561000__$cb901161e812ceb78cfe30ca65050c4337$__66606060606060';
    bytecode = linker.linkBytecode(bytecode, { 'lib2.sol:L': '0x123456' });
    bytecode.should.be.eq('6060604052341561000000000000000000000000000000000000012345666606060606060');
  });

  it('link properly when library doesn\'t have colon in name', async () => {
    /*
      'lib.sol': 'library L { function f() public returns (uint) { return 7; } }',
      'cont.sol': 'import "lib.sol"; contract x { function g() public { L.f(); } }'
    */
    let bytecode = '608060405234801561001057600080fd5b5061011f806100206000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e2179b8e146044575b600080fd5b348015604f57600080fd5b5060566058565b005b73__libName_______________________________6326121ff06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801560b757600080fd5b505af415801560ca573d6000803e3d6000fd5b505050506040513d602081101560df57600080fd5b8101908080519060200190929190505050505600a165627a7a72305820ea2f6353179c181d7162544d637b7fe2d9e8da9803a0e2d9eafc2188d1d59ee30029';
    bytecode = linker.linkBytecode(bytecode, { 'libName': '0x123456' });
    bytecode.indexOf('_').should.be.below(0);
  });
});