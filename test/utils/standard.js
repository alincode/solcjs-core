const solcjs = require('../../src/solc');

module.exports = {
  v5, v4, v3, v2
};

async function v5(version) {
  let compiler = await solcjs(version);

  const sourceCode = `
    pragma solidity >0.4.99 <0.6.0;

    library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
    }

    contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
    }`;

  let output = await compiler(sourceCode);
  let item = output[0];

  item.should.have.all.keys('name', 'abi', 'sources', 'compiler', 'assembly', 'binary', 'metadata');
  item.name.should.be.a('string');
  item.abi.should.be.a('array');
  item.sources.should.be.a('object');

  let sourcesOutput = item.sources;
  sourcesOutput.should.have.all.keys('compilationTarget', 'libraries', 'remappings', 'sourcecode', 'sourcelist');
  sourcesOutput.compilationTarget.should.be.a('string');
  sourcesOutput.libraries.should.be.a('object');
  sourcesOutput.remappings.should.be.a('array');
  sourcesOutput.sourcecode.should.be.a('object');
  sourcesOutput.sourcecode.should.have.all.keys('keccak256', 'urls');
  // DONT HAVE, BUT SHOULD
  // sourcesOutput.sourcelist.should.be.a('array');

  let compilerOutput = item.compiler;
  item.compiler.should.have.all.keys('evmVersion', 'language', 'optimizer', 'runs', 'url', 'version');
  compilerOutput.evmVersion.should.be.a('string');
  compilerOutput.language.should.be.a('string');
  compilerOutput.optimizer.should.be.a('boolean');
  compilerOutput.runs.should.be.a('number');
  // compilerOutput.url.should.be.a('string');
  compilerOutput.version.should.be.a('string');

  let assemblyOutput = item.assembly;
  assemblyOutput.should.have.all.keys('assembly', 'opcodes');
  assemblyOutput.assembly.should.be.a('object');
  assemblyOutput.assembly.should.have.all.keys('.code', '.data');
  assemblyOutput.opcodes.should.be.a('string');

  let binaryOutput = item.binary;
  binaryOutput.should.have.all.keys('bytecodes', 'sourcemap');

  let bytecodesOutput = binaryOutput.bytecodes;
  bytecodesOutput.should.have.all.keys('bytecode', 'runtimeBytecode');
  bytecodesOutput.should.be.a('object');
  bytecodesOutput.bytecode.should.be.a('string');
  // bytecodesOutput.runtimeBytecode.should.have.all.keys('linkReferences', 'object', 'opcodes', 'sourceMap');
  bytecodesOutput.runtimeBytecode.should.be.a('string');

  let sourcemapOutput = binaryOutput.sourcemap;
  sourcemapOutput.should.have.all.keys('srcmap', 'srcmapRuntime');
  sourcemapOutput.srcmap.should.be.a('string');
  sourcemapOutput.srcmapRuntime.should.be.a('string');

  let metadata = item.metadata;
  item.metadata.should.have.all.keys('analysis', 'ast', 'devdoc', 'functionHashes', 'gasEstimates', 'userdoc');

  metadata.analysis.should.be.a('object');
  let analysisOutput = metadata.analysis;
  analysisOutput.should.have.all.keys('warnings', 'others');
  analysisOutput.warnings.should.be.a('array');
  analysisOutput.others.should.be.a('array');

  metadata.ast.should.be.a('object');
  metadata.ast.should.have.all.keys('absolutePath', 'exportedSymbols', 'id', 'nodeType', 'nodes', 'src');

  metadata.devdoc.should.be.a('object');
  metadata.devdoc.should.have.all.keys('methods');

  // DONT HAVE
  // metadata.functionHashes.should.be.a('object');
  metadata.gasEstimates.should.be.a('object');
  metadata.userdoc.should.be.a('object');
}

async function v4(version) {
  let compiler = await solcjs(version);
  const sourceCode = `
     contract Mortal {
      address public owner;
      function Mortal() public { owner = msg.sender; }
      function kill() public { if (msg.sender == owner) selfdestruct(owner); }
    }
     contract Greeter is Mortal {
      string public greeting;
      function Greeter(string memory _greeting) public {
        greeting = _greeting;
      }
    }`;
  let output = await compiler(sourceCode);
  let item = output[0];
  item.should.have.all.keys('name', 'abi', 'sources', 'compiler', 'assembly', 'binary', 'metadata');
  item.name.should.be.a('string');
  item.abi.should.be.a('array');
  item.sources.should.be.a('object');
  let sourcesOutput = item.sources;
  sourcesOutput.should.have.all.keys('compilationTarget', 'libraries', 'remappings', 'sourcecode', 'sourcelist');
  sourcesOutput.compilationTarget.should.be.a('string');
  sourcesOutput.libraries.should.be.a('object');
  sourcesOutput.remappings.should.be.a('array');
  sourcesOutput.sourcecode.should.be.a('object');
  sourcesOutput.sourcecode.should.have.all.keys('keccak256', 'urls');
  // sourcesOutput.sourcelist.should.be.a('array');
  let compilerOutput = item.compiler;
  item.compiler.should.have.all.keys('evmVersion', 'language', 'optimizer', 'runs', 'url', 'version');
  compilerOutput.evmVersion.should.be.a('string');
  compilerOutput.language.should.be.a('string');
  compilerOutput.optimizer.should.be.a('boolean');
  compilerOutput.runs.should.be.a('number');
  // compilerOutput.url.should.be.a('string');
  compilerOutput.version.should.be.a('string');
  let assemblyOutput = item.assembly;
  assemblyOutput.should.have.all.keys('assembly', 'opcodes');
  assemblyOutput.assembly.should.be.a('object');
  assemblyOutput.assembly.should.have.all.keys('.code', '.data');
  // assemblyOutput.opcodes.should.be.a('string');
  let binaryOutput = item.binary;
  binaryOutput.should.have.all.keys('bytecodes', 'sourcemap');
  let bytecodesOutput = binaryOutput.bytecodes;
  bytecodesOutput.should.have.all.keys('bytecode', 'runtimeBytecode');
  bytecodesOutput.should.be.a('object');
  bytecodesOutput.bytecode.should.be.a('string');
  bytecodesOutput.runtimeBytecode.should.be.a('string');

  let sourcemapOutput = binaryOutput.sourcemap;
  sourcemapOutput.should.have.all.keys('srcmap', 'srcmapRuntime');
  // sourcemapOutput.srcmap.should.be.a('string');
  // sourcemapOutput.srcmapRuntime.should.be.a('string');
  let metadata = item.metadata;
  item.metadata.should.have.all.keys('analysis', 'ast', 'devdoc', 'functionHashes', 'gasEstimates', 'userdoc');
  metadata.analysis.should.be.a('object');
  let analysisOutput = metadata.analysis;
  analysisOutput.should.have.all.keys('warnings', 'others');
  analysisOutput.warnings.should.be.a('array');
  analysisOutput.others.should.be.a('array');
  metadata.ast.should.be.a('object');
  metadata.ast.should.have.all.keys('absolutePath', 'exportedSymbols', 'id', 'nodeType', 'nodes', 'src');
  metadata.devdoc.should.be.a('object');
  metadata.devdoc.should.have.all.keys('methods');
  // metadata.functionHashes.should.be.a('object');
  metadata.gasEstimates.should.be.a('object');
  metadata.userdoc.should.be.a('object');
}

async function v3(version) {
  let compiler = await solcjs(version);

  const sourceCode = `
    contract Mortal2 {
      function f(uint a) private returns (uint b) { return a + 1; }
      function setData(uint a) internal { data = a; }
      uint public data;
    }`;

  let output = await compiler(sourceCode);
  let item = output[0];

  item.should.have.all.keys('name', 'abi', 'sources', 'compiler', 'assembly', 'binary', 'metadata');

  item.name.should.be.a('string');
  item.abi.should.be.a('array');
  item.sources.should.be.a('object');

  let sourcesOutput = item.sources;
  sourcesOutput.should.have.all.keys('compilationTarget', 'libraries', 'remappings', 'sourcecode', 'sourcelist');
  // DONT HAVE
  // sourcesOutput.compilationTarget.should.be.a('string');
  // sourcesOutput.libraries.should.be.a('object');
  // sourcesOutput.remappings.should.be.a('array');
  // sourcesOutput.sourcecode.should.be.a('object');
  // sourcesOutput.sourcecode.should.have.all.keys('keccak256', 'urls');
  // TODO:
  if (version.indexOf('v0.3.6') != -1) {
    sourcesOutput.sourcelist.should.be.a('array');
  }

  // let compilerOutput = item.compiler;
  item.compiler.should.have.all.keys('evmVersion', 'language', 'optimizer', 'runs', 'url', 'version');
  // DONT HAVE
  // compilerOutput.evmVersion.should.be.a('string');
  // compilerOutput.language.should.be.a('string');
  // compilerOutput.optimizer.should.be.a('boolean');
  // compilerOutput.runs.should.be.a('number');
  // compilerOutput.url.should.be.a('string');
  // compilerOutput.version.should.be.a('string');

  let assemblyOutput = item.assembly;
  assemblyOutput.should.have.all.keys('assembly', 'opcodes');
  assemblyOutput.assembly.should.be.a('object');
  assemblyOutput.assembly.should.have.all.keys('.code', '.data');
  assemblyOutput.opcodes.should.be.a('string');

  let binaryOutput = item.binary;
  binaryOutput.should.have.all.keys('bytecodes', 'sourcemap');

  let bytecodesOutput = binaryOutput.bytecodes;
  bytecodesOutput.should.have.all.keys('bytecode', 'runtimeBytecode');
  bytecodesOutput.should.be.a('object');
  bytecodesOutput.bytecode.should.be.a('string');
  bytecodesOutput.runtimeBytecode.should.be.a('string');

  let sourcemapOutput = binaryOutput.sourcemap;
  sourcemapOutput.should.have.all.keys('srcmap', 'srcmapRuntime');

  if (version.indexOf('v0.3.6') != -1) {
    sourcemapOutput.srcmap.should.be.a('string');
    sourcemapOutput.srcmapRuntime.should.be.a('string');
  }

  let metadata = item.metadata;
  item.metadata.should.have.all.keys('analysis', 'ast', 'devdoc', 'functionHashes', 'gasEstimates', 'userdoc');

  metadata.analysis.should.be.a('object');
  let analysisOutput = metadata.analysis;
  analysisOutput.should.have.all.keys('warnings', 'others');
  analysisOutput.warnings.should.be.a('array');
  analysisOutput.others.should.be.a('array');

  metadata.ast.should.be.a('object');
  // different with 0.4.x
  // metadata.ast.should.have.all.keys('attributes', 'children', 'id', 'name', 'src');
  metadata.ast.should.have.all.keys('children', 'name');

  // DONT HAVE
  // metadata.devdoc.should.be.a('object');
  // metadata.devdoc.should.have.all.keys('methods');

  metadata.functionHashes.should.be.a('object');
  metadata.gasEstimates.should.be.a('object');
  // DONT HAVE
  // metadata.userdoc.should.be.a('object');
}

async function v2(version) {
  let compiler = await solcjs(version);

  const sourceCode = `
    contract owned {
      function owned() { owner = msg.sender; }
      address owner;

      // This contract only defines a modifier but does not use
      // it - it will be used in derived contracts.
      // The function body is inserted where the special symbol
      // "_" in the definition of a modifier appears.
      // This means that if the owner calls this function, the
      // function is executed and otherwise, an exception is
      // thrown.
      modifier onlyowner { if (msg.sender != owner) throw; _ }
    }
    contract mortal is owned {
        // This contract inherits the "onlyowner"-modifier from
        // "owned" and applies it to the "close"-function, which
        // causes that calls to "close" only have an effect if
        // they are made by the stored owner.
        function close() onlyowner {
            selfdestruct(owner);
        }
    }
    contract priced {
        // Modifiers can receive arguments:
        modifier costs(uint price) { if (msg.value >= price) _ }
    }
    contract Register is priced, owned {
        mapping (address => bool) registeredAddresses;
        uint price;
        function Register(uint initialPrice) { price = initialPrice; }
        function register() costs(price) {
            registeredAddresses[msg.sender] = true;
        }
        function changePrice(uint _price) onlyowner {
            price = _price;
        }
    }
    `;

  let output = await compiler(sourceCode);
  let item = output[0];

  item.should.have.all.keys('name', 'abi', 'sources', 'compiler', 'assembly', 'binary', 'metadata');
  item.name.should.be.a('string');
  item.abi.should.be.a('array');
  // item.sources.should.be.a('object');

  // let sourcesOutput = item.sources;
  // sourcesOutput.should.have.all.keys('compilationTarget', 'libraries', 'remappings', 'sourcecode', 'sourcelist');
  // sourcesOutput.compilationTarget.should.be.a('string');
  // sourcesOutput.libraries.should.be.a('object');
  // sourcesOutput.remappings.should.be.a('array');
  // sourcesOutput.sourcecode.should.be.a('object');
  // sourcesOutput.sourcecode.should.have.all.keys('keccak256', 'urls');
  // sourcesOutput.sourcelist.should.be.a('array');

  let compilerOutput = item.compiler;
  item.compiler.should.have.all.keys('evmVersion', 'language', 'optimizer', 'runs', 'url', 'version');
  // compilerOutput.evmVersion.should.be.a('string');
  compilerOutput.language.should.be.a('string');
  compilerOutput.optimizer.should.be.a('boolean');
  compilerOutput.runs.should.be.a('number');
  // compilerOutput.url.should.be.a('string');
  compilerOutput.version.should.be.a('string');

  let assemblyOutput = item.assembly;
  assemblyOutput.should.have.all.keys('assembly', 'opcodes');
  assemblyOutput.assembly.should.be.a('object');
  assemblyOutput.assembly.should.have.all.keys('.code', '.data');
  assemblyOutput.opcodes.should.be.a('string');

  let binaryOutput = item.binary;
  binaryOutput.should.have.all.keys('bytecodes', 'sourcemap');

  let bytecodesOutput = binaryOutput.bytecodes;
  bytecodesOutput.should.have.all.keys('bytecode', 'runtimeBytecode');
  bytecodesOutput.should.be.a('object');
  bytecodesOutput.bytecode.should.be.a('string');
  bytecodesOutput.runtimeBytecode.should.be.a('string');

  let sourcemapOutput = binaryOutput.sourcemap;
  sourcemapOutput.should.have.all.keys('srcmap', 'srcmapRuntime');
  // sourcemapOutput.srcmap.should.be.a('string');
  // sourcemapOutput.srcmapRuntime.should.be.a('string');

  let metadata = item.metadata;
  item.metadata.should.have.all.keys('analysis', 'ast', 'devdoc', 'functionHashes', 'gasEstimates', 'userdoc');

  metadata.analysis.should.be.a('object');
  let analysisOutput = metadata.analysis;
  analysisOutput.should.have.all.keys('warnings', 'others');
  analysisOutput.warnings.should.be.a('array');
  analysisOutput.others.should.be.a('array');

  metadata.ast.should.be.a('object');
  metadata.ast.should.have.all.keys('children', 'name');
  // metadata.ast.should.have.all.keys('attributes', 'children', 'id', 'name', 'src');

  // metadata.devdoc.should.be.a('object');
  // metadata.devdoc.should.have.all.keys('methods');

  metadata.functionHashes.should.be.a('object');
  metadata.gasEstimates.should.be.a('object');
  // metadata.userdoc.should.be.a('object');
}